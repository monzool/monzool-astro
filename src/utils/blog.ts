import type { CollectionEntry } from 'astro:content';

export function getPostDateParts(post: CollectionEntry<'blog'>) {
    const { pubDate, slug } = post.data;

    return {
        year: pubDate.getFullYear().toString(),
        month: (pubDate.getMonth() + 1).toString().padStart(2, '0'),
        day: pubDate.getDate().toString().padStart(2, '0'),
        slug: slug ?? post.id,
    };
}

export function getPostUrl(post: CollectionEntry<'blog'>): string {
    const { year, month, day, slug } = getPostDateParts(post);

    return `/blog/${year}/${month}/${day}/${slug}/`;
}
