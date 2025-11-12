import { Metadata } from 'next';

// Base SEO Configuration
export const siteConfig = {
  name: 'Luke Robert Hair',
  title: 'Luke Robert Hair | Precision Hairdressing & Professional Education',
  description: 'Expert precision hairdressing and professional education in Cheshire & Berkshire. Master cutter, L\'Oréal educator, and educator training 500+ stylists across the UK.',
  url: 'https://lukeroberthair.com',
  ogImage: '/images/og-image.jpg', // Social share image
  twitterHandle: '@lukeroberthair',
  locale: 'en_GB',
  author: 'Luke Robert',
  keywords: [
    'hairdressing',
    'precision cutting',
    'hair salon',
    'professional education',
    'hairdressing courses',
    'Luke Robert Hair',
    'Cheshire hairdresser',
    'Berkshire hairdresser',
    'Reading hair salon',
    'Altrincham hair salon',
    'Knutsford hair salon',
    'barbering education',
    'hairdressing training',
    'L\'Oréal educator',
    'CPD courses',
    'hair education UK',
  ],
  locations: [
    {
      name: 'Altrincham',
      address: 'Fixx Salon, 1b Lloyd St, Altrincham, WA14 2DD',
      phone: '07862054292',
    },
    {
      name: 'Knutsford',
      address: 'Urban Sanctuary, 29 King St, Knutsford, WA16 6DW',
      phone: '07862054292',
    },
    {
      name: 'Caversham',
      address: 'Alternate Salon, 19 Church Street, Caversham, RG4 8BA',
      phone: '07862054292',
    },
  ],
};

// Page-specific SEO configurations
export const pageMetadata = {
  home: {
    title: 'Luke Robert Hair | Precision Hairdressing & Professional Education',
    description: 'Transform your look with precision haircuts or master your craft with professional education. 15+ years experience, 500+ stylists trained. Cheshire & Berkshire.',
    keywords: [
      'precision haircuts',
      'hairdressing Cheshire',
      'hairdressing Berkshire',
      'hair salon Altrincham',
      'hair education',
      'professional hairdressing training',
    ],
  },
  about: {
    title: 'About Luke Robert | Master Cutter & L\'Oréal Educator',
    description: '15 years of precision cutting. 500+ stylists trained. L\'Oréal UKI Artist and master educator sharing expertise across the UK and Ireland.',
    keywords: [
      'Luke Robert',
      'master cutter',
      'L\'Oréal educator',
      'hairdressing educator',
      'professional hairdresser',
      'UK hair artist',
    ],
  },
  salon: {
    title: 'Salon Services | Precision Haircuts & Styling | Luke Robert Hair',
    description: 'Experience precision haircuts that last. Expert cutting, colouring, and styling across 3 locations in Cheshire & Berkshire. Book your transformation today.',
    keywords: [
      'precision haircut',
      'hair cutting service',
      'hair colouring',
      'hair styling',
      'salon Altrincham',
      'salon Knutsford',
      'salon Caversham',
      'haircut Cheshire',
    ],
  },
  education: {
    title: 'Professional Hairdressing Education | Courses & Training | Luke Robert',
    description: 'Master precision cutting with proven techniques. Foundation to advanced courses, 1-to-1 mentorship, and salon leadership training. 500+ stylists trained nationwide.',
    keywords: [
      'hairdressing courses',
      'cutting courses',
      'hairdressing education',
      'professional training',
      'barbering courses',
      'hair education UK',
      'CPD hairdressing',
      'salon training',
    ],
  },
  cpd: {
    title: 'CPD Partnerships | Accredited Hairdressing Training for Colleges',
    description: 'CPD-certified training programs for hairdressing and barbering colleges. Communication, coaching, and leadership courses for students and lecturers.',
    keywords: [
      'CPD training',
      'hairdressing college',
      'barbering college',
      'accredited training',
      'CPD courses',
      'college partnerships',
      'student training',
      'professional development',
    ],
  },
  contact: {
    title: 'Contact Luke Robert Hair | Get in Touch',
    description: 'Book an appointment, enquire about courses, or get in touch. Available across Cheshire & Berkshire. We respond within 24 hours.',
    keywords: [
      'contact hairdresser',
      'book appointment',
      'hair salon contact',
      'enquiry',
      'Cheshire hairdresser contact',
    ],
  },
  insights: {
    title: 'Insights & Articles | Hairdressing Tips & Techniques',
    description: 'Expert insights on hairdressing, cutting techniques, and industry trends. Updated weekly with practical advice and professional tips.',
    keywords: [
      'hairdressing tips',
      'cutting techniques',
      'hair styling tips',
      'hairdressing blog',
      'professional advice',
      'hair industry',
    ],
  },
  book: {
    title: 'Book Appointment | Luke Robert Hair | Cheshire & Berkshire',
    description: 'Book your precision haircut appointment online. Choose from 3 convenient locations in Altrincham, Knutsford, and Caversham.',
    keywords: [
      'book haircut',
      'online booking',
      'hair appointment',
      'book salon',
      'Altrincham booking',
      'Knutsford booking',
      'Caversham booking',
    ],
  },
  referrals: {
    title: 'Referral Program | Share & Earn Rewards | Luke Robert Hair',
    description: 'Refer friends and both save £10! Share your love for precision haircuts and earn rewards. Simple referral program with instant benefits.',
    keywords: [
      'referral program',
      'hair salon referral',
      'refer a friend',
      'salon discount',
      'rewards program',
    ],
  },
};

// Generate complete metadata for a page
export function generateMetadata(
  page: keyof typeof pageMetadata,
  customOptions?: Partial<Metadata>
): Metadata {
  const pageData = pageMetadata[page];
  const keywords = [...siteConfig.keywords, ...(pageData.keywords || [])];

  return {
    title: pageData.title,
    description: pageData.description,
    keywords: keywords.join(', '),
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.name,
    
    // OpenGraph
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: pageData.title,
      description: pageData.description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - ${pageData.title}`,
        },
      ],
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: pageData.title,
      description: pageData.description,
      images: [siteConfig.ogImage],
    },

    // Additional metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Merge with custom options
    ...customOptions,
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbs(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

// Generate organization structured data
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo-white.png`,
    description: siteConfig.description,
    telephone: '+447862054292',
    email: 'luke@lukeroberthair.com',
    priceRange: '££',
    address: siteConfig.locations.map((loc) => ({
      '@type': 'PostalAddress',
      streetAddress: loc.address.split(',')[0],
      addressLocality: loc.name,
      addressCountry: 'GB',
    })),
    geo: [
      {
        '@type': 'GeoCoordinates',
        latitude: '53.3881',
        longitude: '-2.3523',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Altrincham',
        },
      },
      {
        '@type': 'GeoCoordinates',
        latitude: '53.3030',
        longitude: '-2.3710',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Knutsford',
        },
      },
      {
        '@type': 'GeoCoordinates',
        latitude: '51.4710',
        longitude: '-0.9740',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Caversham',
        },
      },
    ],
    sameAs: [
      'https://www.instagram.com/lukeroberthair',
      'https://www.facebook.com/lukeroberthair',
      'https://twitter.com/lukeroberthair',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Hairdressing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Precision Haircut',
            description: 'Expert precision cutting tailored to your lifestyle',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Colour Services',
            description: 'Professional hair colouring and highlights',
          },
        },
      ],
    },
  };
}

// Generate person (Luke Robert) structured data
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteConfig.url}/#person`,
    name: 'Luke Robert',
    jobTitle: 'Master Hairdresser & Educator',
    description: '15+ years experience, L\'Oréal UKI Artist, trained 500+ stylists',
    url: siteConfig.url,
    image: `${siteConfig.url}/images/luke-portrait.png`,
    sameAs: [
      'https://www.instagram.com/lukeroberthair',
      'https://www.facebook.com/lukeroberthair',
    ],
    worksFor: {
      '@id': `${siteConfig.url}/#organization`,
    },
    alumniOf: 'L\'Oréal Professional',
    award: [
      'L\'Oréal UKI Artist',
      'Goldwell Guest Artist',
    ],
  };
}

// Generate course structured data
export function generateCourseSchema(course: {
  name: string;
  description: string;
  provider: string;
  duration?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider,
      sameAs: siteConfig.url,
    },
    ...(course.duration && { timeRequired: course.duration }),
  };
}

// Generate local business structured data for specific location
export function generateLocalBusinessSchema(location: typeof siteConfig.locations[0]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: `${siteConfig.name} - ${location.name}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.address.split(',').slice(0, -1).join(','),
      addressLocality: location.name,
      addressCountry: 'GB',
    },
    telephone: location.phone,
    url: siteConfig.url,
  };
}


