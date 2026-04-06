// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://we.are.silicon',
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: {
          zh: 'zh-CN',
          en: 'en-US',
        },
      },
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
