# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and Open Graph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## robots.txt

`public/robots.txt` uses a deny-by-default allowlist (`Disallow: /` plus explicit `Allow:` rules), not the usual deny-specific-paths approach:

- `Allow: /$` — exact match for the homepage only. The `$` end-anchor is required here; a bare `Allow: /` would tie in specificity with `Disallow: /` and create ambiguous behavior across crawlers.
- `Allow: /about/` and `Allow: /blog/` — prefix matches, so `/blog/` also covers every post (e.g. `/blog/2026/04/10/error-banner-in-shell/`) without listing them individually.
- `Allow: /blog/wp-content/uploads/` — kept from the old WordPress-era robots.txt, in case any content still references images at those legacy URLs.
- `Allow: /rss.xml` and `Allow: /sitemap*.xml` — the Astro-generated feed and sitemap files.
- `Allow: /_astro/` — Astro's hashed build assets (CSS/JS/images). Blocking these is discouraged by Google since it can interfere with properly rendering pages for indexing.

Everything else is denied by default. **Adding a genuinely new top-level route (e.g. a future Projects page) requires adding its own `Allow` line here, or it silently won't get indexed.**

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
