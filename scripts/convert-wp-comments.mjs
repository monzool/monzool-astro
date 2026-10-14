// One-off conversion of WordPress comments (SQL dumps) to Astro content files.
//
// Usage: node scripts/convert-wp-comments.mjs [dumpDir] [--dry-run]
//   dumpDir   directory with wp_comments.sql and wp_posts.sql (default /tmp/wordpress)
//
// Output: src/content/comments/<post-slug>.json, one file per post that has comments.
// Emails, IP addresses and user agents are never written.

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const dumpDir = args.find((arg) => !arg.startsWith('--')) ?? '/tmp/wordpress';
const blogDir = 'src/content/blog';
const outDir = 'src/content/comments';

// Comment IDs to leave out. Reviewed by hand: link spam that slipped through moderation, and duplicate posts.
const EXCLUDED_COMMENT_IDS = new Set([
    // Spam
    20, 338, 339, 340, 909, 923, 1064, 1101, 2113, 5015,
    // Duplicates
    80292, 80360, 80361,
]);

// --- SQL dump parsing -------------------------------------------------------

const UNESCAPE = { n: '\n', r: '\r', t: '\t', 0: '\0', b: '\b', Z: '\x1a' };

function parseInserts(sql, table) {
    const rows = [];
    const header = new RegExp(`INSERT INTO \`${table}\` \\(([^)]*)\\) VALUES\\s*`, 'g');
    let match;

    while ((match = header.exec(sql)) !== null) {
        const columns = match[1].split(',').map((column) => column.trim().replace(/`/g, ''));
        let pos = header.lastIndex;

        for (;;) {
            while (/\s/.test(sql[pos])) pos++;
            if (sql[pos] !== '(') throw new Error(`Expected '(' at offset ${pos} in ${table}`);
            pos++;

            const values = [];
            for (;;) {
                while (/\s/.test(sql[pos])) pos++;
                if (sql[pos] === "'") {
                    let text = '';
                    pos++;
                    for (;;) {
                        const ch = sql[pos++];
                        if (ch === '\\') {
                            const next = sql[pos++];
                            text += UNESCAPE[next] ?? next;
                        } else if (ch === "'") {
                            if (sql[pos] === "'") {
                                text += "'";
                                pos++;
                            } else {
                                break;
                            }
                        } else if (ch === undefined) {
                            throw new Error(`Unterminated string in ${table}`);
                        } else {
                            text += ch;
                        }
                    }
                    values.push(text);
                } else {
                    const start = pos;
                    while (sql[pos] !== ',' && sql[pos] !== ')') pos++;
                    const token = sql.slice(start, pos).trim();
                    values.push(token === 'NULL' ? null : Number(token));
                }
                while (/\s/.test(sql[pos])) pos++;
                if (sql[pos] === ',') {
                    pos++;
                    continue;
                }
                if (sql[pos] === ')') {
                    pos++;
                    break;
                }
                throw new Error(`Unexpected '${sql[pos]}' at offset ${pos} in ${table}`);
            }

            if (values.length !== columns.length) {
                throw new Error(`Row has ${values.length} values, expected ${columns.length} (${table})`);
            }
            rows.push(Object.fromEntries(columns.map((column, i) => [column, values[i]])));

            while (/\s/.test(sql[pos])) pos++;
            if (sql[pos] === ',') {
                pos++;
                continue;
            }
            if (sql[pos] === ';') break;
            throw new Error(`Unexpected '${sql[pos]}' after row at offset ${pos} in ${table}`);
        }
    }

    return rows;
}

// --- Comment text cleanup ---------------------------------------------------

const NAMED_ENTITIES = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    raquo: '\u00bb',
    laquo: '\u00ab',
    hellip: '\u2026',
    ndash: '\u2013',
    mdash: '\u2014',
    lsquo: '\u2018',
    rsquo: '\u2019',
    ldquo: '\u201c',
    rdquo: '\u201d',
};

function decodeEntities(text) {
    return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, entity) => {
        if (entity[0] === '#') {
            const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
            return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
        }
        return NAMED_ENTITIES[entity.toLowerCase()] ?? whole;
    });
}

// Plain text only: the markup is stripped, so nothing from the old comments is ever rendered as HTML.
function toPlainText(html) {
    const text = html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|blockquote|li)>/gi, '\n\n')
        .replace(/<[^>]*>/g, '');
    return decodeEntities(text)
        .replace(/\r\n?/g, '\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function cleanUrl(raw) {
    if (!raw) return undefined;
    try {
        const url = new URL(decodeEntities(raw).trim());
        return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined;
    } catch {
        return undefined;
    }
}

// --- Blog posts on the new site ---------------------------------------------

function loadBlogPosts() {
    const posts = new Map();
    for (const file of readdirSync(blogDir)) {
        if (!/\.mdx?$/.test(file)) continue;
        const source = readFileSync(join(blogDir, file), 'utf8');
        const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
        const slug = frontmatter.match(/^slug:\s*['"]?([^'"\n]+?)['"]?\s*$/m)?.[1];
        const pubDate = frontmatter.match(/^pubDate:\s*['"]?([^'"\n]+?)['"]?\s*$/m)?.[1];
        const id = file.replace(/\.mdx?$/, '');
        posts.set(slug ?? id, { file, pubDate: pubDate?.slice(0, 10) });
    }
    return posts;
}

// --- Main -------------------------------------------------------------------

const wpPosts = parseInserts(readFileSync(join(dumpDir, 'wp_posts.sql'), 'utf8'), 'wp_posts');
const wpComments = parseInserts(readFileSync(join(dumpDir, 'wp_comments.sql'), 'utf8'), 'wp_comments');
const blogPosts = loadBlogPosts();

const wpPostById = new Map(wpPosts.map((post) => [post.ID, post]));
const stats = { total: wpComments.length, notApproved: 0, notComment: 0, excluded: 0, noPost: 0, notPublishedPost: 0, noBlogFile: 0, empty: 0, kept: 0 };
const skippedNoBlogFile = new Map();
const dateMismatches = [];
const byslug = new Map();

for (const comment of wpComments) {
    if (comment.comment_approved !== '1') {
        stats.notApproved++;
        continue;
    }
    if (comment.comment_type !== 'comment' && comment.comment_type !== '') {
        stats.notComment++;
        continue;
    }
    if (EXCLUDED_COMMENT_IDS.has(comment.comment_ID)) {
        stats.excluded++;
        continue;
    }

    const wpPost = wpPostById.get(comment.comment_post_ID);
    if (!wpPost) {
        stats.noPost++;
        continue;
    }
    if (wpPost.post_type !== 'post' || wpPost.post_status !== 'publish') {
        stats.notPublishedPost++;
        skippedNoBlogFile.set(`${wpPost.post_type}/${wpPost.post_status}: ${wpPost.post_name}`, true);
        continue;
    }

    const slug = decodeURIComponent(wpPost.post_name);
    const blogPost = blogPosts.get(slug);
    if (!blogPost) {
        stats.noBlogFile++;
        skippedNoBlogFile.set(`post without Markdown file: ${slug}`, true);
        continue;
    }
    if (blogPost.pubDate && blogPost.pubDate !== wpPost.post_date.slice(0, 10)) {
        dateMismatches.push(`${slug}: pubDate ${blogPost.pubDate} vs WordPress ${wpPost.post_date.slice(0, 10)}`);
    }

    const content = toPlainText(comment.comment_content);
    if (!content) {
        stats.empty++;
        continue;
    }

    const entry = {
        id: comment.comment_ID,
        parent: comment.comment_parent,
        author: decodeEntities(comment.comment_author).trim() || 'Anonymous',
        ...(cleanUrl(comment.comment_author_url) && { url: cleanUrl(comment.comment_author_url) }),
        date: `${comment.comment_date_gmt.replace(' ', 'T')}Z`,
        content,
    };
    if (!byslug.has(slug)) byslug.set(slug, []);
    byslug.get(slug).push(entry);
    stats.kept++;
}

// Replies to a comment that was filtered out become top-level comments.
for (const entries of byslug.values()) {
    const ids = new Set(entries.map((entry) => entry.id));
    for (const entry of entries) {
        if (entry.parent !== 0 && !ids.has(entry.parent)) entry.parent = 0;
    }
    entries.sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);
}

if (!dryRun) {
    rmSync(outDir, { recursive: true, force: true });
    mkdirSync(outDir, { recursive: true });
    for (const [slug, comments] of byslug) {
        writeFileSync(join(outDir, `${slug}.json`), `${JSON.stringify({ comments }, null, 4)}\n`);
    }
}

console.log(dryRun ? 'Dry run, nothing written.' : `Wrote ${byslug.size} files to ${outDir}/`);
console.log(stats);
if (skippedNoBlogFile.size > 0) {
    console.log('\nComments skipped because the post is not a published blog post on the new site:');
    for (const key of skippedNoBlogFile.keys()) console.log(`  ${key}`);
}
if (dateMismatches.length > 0) {
    console.log('\nPosts whose date differs from WordPress:');
    for (const line of dateMismatches) console.log(`  ${line}`);
}
