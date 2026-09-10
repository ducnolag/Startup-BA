import type { MetadataRoute } from 'next';

const SITE_URL = 'https://toolify.vn';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/idea-to-tool`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools/gemini-translate`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools/price-smart`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/agent`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/signup`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];
}