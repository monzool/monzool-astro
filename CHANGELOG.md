# Changelog

Notable changes to monzool.net. Newest first.

## Giscus

- Blog comments and reactions using [giscus](https://giscus.app/), backed by GitHub Discussions in `monzool/monzool-astro` (category "Announcements").
  - Implemented as a plain Astro component, `src/components/Comments.astro`, rendered at the bottom of each post by `src/layouts/BlogPost.astro`. The About page has no comments.
  - Uses the plain giscus `client.js` script (`is:inline`); the React wrapper is not needed.
  - `data-mapping="pathname"`: each post maps to a discussion named after its path (`/blog/YYYY/MM/DD/slug/`). Changing a post URL creates a new, empty discussion.
  - Theme is fixed to `light`, as the site has no dark mode. The widget loads lazily.
  - Comments also load in `astro dev` and `localhost` shares discussions with production, so delete test comments on GitHub afterwards.


## Old WordPress comments

- Approved comments from the WordPress site are shown read-only as "Comments from the old site", above the giscus widget.
  - Generated once by `scripts/convert-wp-comments.mjs` from the `wp_comments` and `wp_posts` SQL dumps (`node scripts/convert-wp-comments.mjs [dumpDir]`, default `/tmp/wordpress`). Comments are mapped to posts by WordPress post ID, via `post_name`, to the Markdown filename.
  - Output is one `src/content/comments/<slug>.json` file per post (a `comments` content collection), rendered by `src/components/LegacyComments.astro`, which finds the file from the page URL.
  - Only the author, optional website, date and text are kept; emails, IP addresses and user agents are dropped, and the text is stripped to plain text.
  - Pingbacks and spam were left out. Spam and duplicate comment IDs are listed in `EXCLUDED_COMMENT_IDS` in the script.
  - Author links use `rel="nofollow ugc noopener"`.


## Webrings

- Footer links for the Geekring and Fediring webrings.
- Contact email link in the footer, assembled in JavaScript at page load so the address is not present in the served HTML (spam-scraper protection). Without JS the link does nothing.


## Setup

- Serve posts in descending order.
- Blog post: migrating-from-wordpress-to-astro.
- SFTP upload action (`wangyucode/sftp-upload-action`) for deployment.
- Enabled [carve](https://markup-carve.github.io/carve/) markup plugin.
- CI check and build workflow, running on Node 24.
- `robots.txt` (and a later fix) and a root `.htaccess` file.
- Bluesky profile link.
- CV added to the About page.
- Page width increased from 720px to 960px.
- Minor tweaks to the front page.


## Initial migration from WordPress to Astro

- Project created from the Astro blog template.
- Blog posts imported from WordPress, with code-block language specifiers restored.
- Thumbnails on latest posts.
- Pages content collection for generic pages; About page converted.
- Banner and default blog fallback image matching the old monzool.net.
- Post URLs use the `YYYY/MM/DD` format.
