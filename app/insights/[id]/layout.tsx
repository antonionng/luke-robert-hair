import { Metadata } from 'next';
import { siteConfig } from '@/lib/seo';

// This will generate dynamic metadata for each blog post
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const slug = params.id;
  
  try {
    // Fetch the post data server-side for metadata
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
    const response = await fetch(`${baseUrl}/api/posts?slug=${slug}`, {
      cache: 'no-store', // Ensure we get fresh data
    });

    if (!response.ok) {
      // Fallback to default metadata if post not found
      return {
        title: 'Insight Not Found',
        description: 'This insight could not be found.',
      };
    }

    const data = await response.json();
    const post = data.post;

    if (!post) {
      return {
        title: 'Insight Not Found',
        description: 'This insight could not be found.',
      };
    }

    const pageUrl = `${siteConfig.url}/insights/${slug}`;
    const imageUrl = post.image_url || siteConfig.ogImage;

    // Return dynamic metadata for this specific post
    return {
      title: post.title,
      description: post.excerpt || post.description || siteConfig.description,
      keywords: [
        ...(post.insight_tags || []),
        post.category,
        'hairdressing',
        'hair tips',
        'Luke Robert Hair',
      ],
      authors: [{ name: 'Luke Robert' }],
      creator: 'Luke Robert',
      publisher: siteConfig.name,

      // OpenGraph for social sharing
      openGraph: {
        type: 'article',
        locale: siteConfig.locale,
        url: pageUrl,
        siteName: siteConfig.name,
        title: post.title,
        description: post.excerpt || post.description || siteConfig.description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.hero_alt || post.title,
          },
        ],
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
        authors: ['Luke Robert'],
        section: post.category,
        tags: post.insight_tags || [],
      },

      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        site: siteConfig.twitterHandle,
        creator: siteConfig.twitterHandle,
        title: post.title,
        description: post.excerpt || post.description || siteConfig.description,
        images: [imageUrl],
      },

      // Additional metadata
      alternates: {
        canonical: pageUrl,
      },

      robots: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for blog post:', error);
    
    // Fallback metadata
    return {
      title: 'Insights',
      description: 'Read the latest insights from Luke Robert Hair',
    };
  }
}

export default function InsightLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

