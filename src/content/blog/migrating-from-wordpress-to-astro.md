---
title: 'Migrating from WordPress to Astro'
description: 'Notes and technical learnings from moving monzool.net off WordPress and onto Astro'
pubDate: '2026-09-24'
heroImage: '../../assets/migrating-from-wordpress-to-astro/thumb.png'
categories:
  - "software"
---

**MIGRATING TO ASTRO** was actually from a desire to begin writing blogs in [Carve](https://markup-carve.github.io/carve/). In the end that didn't pan out, but I am glad I finally took the time to go back to static page generation for this website. I jumped the Wordpress bandwagon in [2007](https://monzool.net/blog/2007/05/13/entering-wordpress/). Before that I was using [tex4ht](https://tug.org/tex4ht/) to generate html from LaTeX. Its not because I have been dissatisfied with Wordpress. It works very well for what it does, and when plugins started making it possible to write posts in markdown, my biggest gripe disappeared. In the end, Wordpress was more complicated/advanced than needed be for my limited purpose, with too much clicking around to make a post, and worst of all no version control for posts. [Astro](https://astro.build/) solves all this. Plain markdown files in git and a build framework to output a beautiful webpage.


## Out of Wordpress

Wordpress store its content in a database. I followed their [guide](https://wordpress.com/support/export/) to extract everything to local storage. I then used Will Boyd's ([*lonekorean*](https://github.com/lonekorean)) tool [wordpress-export-to-markdown](https://github.com/lonekorean/wordpress-export-to-markdown) to convert to markdown files

The first many years I had used a method of uploaded images out-of-band to Wordpress, so exporting images generally did not go so well in the output. An easy fix though. Worse was that all code-blocks was without language specification. It would have taken me many hours to go though my entire portfolio of blog posts and fix this. So instead I burnt some tokens (and [CO2](https://github.com/monzool/copilot-co2-trees)) and had Claude do it

The tool also added a front matter to the markdown files, which fitted quite nicely into Astro expectations

## In to Astro

I generated a project according to the [guide](https://docs.astro.build/en/install-and-setup/#install-from-the-cli-wizard)

```bash
〉 npm create astro@latest
```

A bit confusing first, was how to arrange these markdown files in Astro. Astro has both [static routing](https://docs.astro.build/en/guides/routing/#static-routes) and [dynamic routing](https://docs.astro.build/en/guides/routing/#dynamic-routes). My wordpress urls were prefixed with date (e.g. https://monzool.net/blog/2007/05/13/entering-wordpress/) which seemed to fit well with the static routing approach. It is important that Astro is configured to use same routing as used in Wordpress, otherwise site indexers would have to scan my site from scratch, and the pathetic few links from the interweb to my site would break.

Initially I thought the static routing was the way to solve this

```text
src/pages/index.astro -> monzool.net/
src/pages/about.astro -> monzool.net/about
src/pages/blog/2007/05/13/entering-wordpress.md -> monzool.net/blog/2007/05/13/entering-wordpress
```

However Astro has better solutions for this, albeit this was not that trivial to figure out.

### Blog post routing

First the markdown blog posts are placed in a *content collection*:

```bash
src/content/blog/
├── a-search-for-bash-scripting-alternatives.md
├── a-second-search-for-bash-scripting-alternatives.md
.
├── entering-wordpress.md
├── error-banner-in-shell.md
.
└── wp-syntax-and-geshi-color-tweaking.md
```

Next an astro file is added to `pages`, which path define the routing template

```bash
src/pages/blog/[year]/[month]/[day]/[slug].astro
```

The astro file then picks up the collection of blog posts and generates them with proper url

```astro
import { type CollectionEntry, getCollection, render } from 'astro:content';
import BlogPost from '../../../../../layouts/BlogPost.astro';
import { getPostDateParts } from '../../../../../utils/blog';

export async function getStaticPaths() {
    const posts = await getCollection('blog');

    return posts.map((post) => ({
        params: getPostDateParts(post),
        props: post,
    }));
}
type Props = CollectionEntry<'blog'>;

const post = Astro.props;
const { Content } = await render(post);
---

<BlogPost {...post.data}>
    <Content />
</BlogPost>
```

That astro file imports a layout file that defines how each loaded blog post file should be presented

```astro
    <body>
        <Header />
        <main>
            <article>
                <div class="hero-image">
                    {heroImage && <Image width={1020} height={510} src={heroImage} alt="" />}
                </div>
                <div class="prose">
                    <div class="title">
                        <div class="date">
                            <FormattedDate date={pubDate} />
                            {
                                updatedDate && (
                                    <div class="last-updated-on">
                                        Last updated on <FormattedDate date={updatedDate} />
                                    </div>
                                )
                            }
                        </div>
                        <h1>{title}</h1>
                        <hr />
                    </div>
                    <slot />
                </div>
            </article>
        </main>
        <Footer />
    </body>
```

That in turn utilizes the front-matter in each individual markdown file to add details

```bash
〉head src/content/blog/error-banner-in-shell.md
---
title: "Error banner in shell"
description: 'A shell trick to make git errors more prominent'
pubDate: '2026-04-10'
heroImage: '../../assets/error-banner-in-shell/guru-1.png'
categories:
  - "programming"
  - "shell-scripting"
---
```

And Bobs you uncle... well not quite


### Urls with trialing slashes

Urls from Wordpress ends with a `/` (e.g. https://monzool.net/blog/2026/04/10/error-banner-in-shell/) while Astro do not append the slash at the end by default.

```diff
export default defineConfig({
    site: 'https://monzool.net',
+   trailingSlash: 'always',
    integrations: [mdx(), carve(), sitemap()],
```


### Date format

I am a big fan to the unambiguous iso8601 date format, so I had to make a date component to change presentation from "Sep 24 2026" to "2026-09-24"

```bash
src/components/FormattedDate.astro
```

```astro
---
interface Props {
    date: Date;
}

const { date } = Astro.props;
---

<time datetime={date.toISOString()}>{date.toISOString().slice(0, 10)}</time>
```

### Minor stuff

A few additional stuff had to be updated and changed after the Astro project was created.

- Things like name of website, user name, links to so-me etc. The README.md also generated in project root had a nice overview of where to change.

- I created a second content collection for normal pages, like "About" and eventually more to come. The project generator applied the blog layout to those also, which I though not very fitting.

- The front matter in the markdown and the typescript (`src/content.config.ts`) that loads it, must be updated to match

- Rewrote the front page in MDX from Astro. The Astro format basically means writing in plain html, which I not no desire to do

- Found and fixed a styling "bug" where the project generator had a hardcoded `background: white` in the `Header.astro` file

- The project template made some Twitter icons and links, which I changed to X (also added Bluesky)

- Increased default page width from `720px` to `960px`

- Finally I had to adapt the `.htaccess` to the Astro structure


## Carve

I wanted to find something that provided more features than simple markdown without bringing the "visual typographic noise" that [asciidoc](https://asciidoc.org/) or [typst](https://typst.app/) sometimes require. Originally I was planning to find something that supported the [Djot](https://djot.net/) markup language. There are a few things I don't like about Djot, like the required newlines at places, but the main problem is the general lack of tooling. It's a new project, but tooling is important for adoption. Then in the Djot issue tracker, there was a [proposal to improve tables syntax](https://github.com/jgm/djot/issues/354). The suggestion went nowhere but the proposer, Mark Scherer ([*dereuromark*](https://github.com/dereuromark)), mentioned his markup language [Carve](https://github.com/markup-carve).

Carve seems to hit a good middle ground between adding more features/capabilities to markdown while still keeping the markup simple. There are of course many alternatives, but there seem to be invested a huge effort in making a great [ecosystem](https://markup-carve.github.io/carve/ecosystem) for Carve.

Of particular interest was the [astro-carve](https://github.com/markup-carve/astro-carve) plugin that adds Carve support to Astro. As I would later find out the plugin unfortunately uses [`set:html`](https://docs.astro.build/en/reference/directives-reference/#sethtml) and thus does not integrate seamlessly into the default build system of Astro.

Carve is for sure something I will keep an eye on in the feature


## Conclusion

I am really happy about the migration. It was a fun experience and a rewarding result.

Some benefits:

- Local writing is much improved. Having `npm run dev` running in the background makes all changes instantly preview'able
- The entire site is tracked in git and published to github, with build and check workflows verifying integrity
- No more flood of endless Wordpress and plugin updates and security fixes!
- I can use my favorite local tools to write, lint and spell check my markdown writings
- No longer bound to Wordpress, I expect to move off one.com hosting to a cheaper alternative
