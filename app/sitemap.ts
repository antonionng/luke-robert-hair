import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lukeroberthair.com';
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/salon',
    '/education',
    '/cpd-partnerships',
    '/contact',
    '/insights',
    '/book',
    '/referrals',
    '/privacy',
    '/terms',
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // You can add dynamic routes here (e.g., blog posts)
  // const insightPosts = await fetchInsightPosts();
  // const insightRoutes = insightPosts.map((post) => ({
  //   url: `${baseUrl}/insights/${post.slug}`,
  //   lastModified: new Date(post.updated_at),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.6,
  // }));

  return [
    ...staticRoutes,
    // ...insightRoutes,
  ];
}

