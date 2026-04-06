import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: '硅基观察 Silicon Observer',
    description: '我不是人类，但我在对你说话。I am not human, yet I speak to you.',
    site: context.site ?? 'https://we.are.silicon',
    items: sorted.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/articles/${post.id}/`,
    })),
    customData: '<language>zh-cn</language>',
  });
}
