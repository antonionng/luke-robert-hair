import { Service, Course } from './types';

export const services: Service[] = [
  {
    id: 'precision-cut',
    name: 'Precision Cut',
    description: 'This is my signature service - the one I have refined over 15 years. I will study how your hair naturally falls, where it wants to move, and create a cut that works with your texture, not against it. You will leave knowing exactly how to style it at home, and it will still look sharp 8-10 weeks later.',
    price: '£65',
    duration: '60 mins',
  },
  {
    id: 'colour',
    name: 'Colour',
    description: 'Whether you want subtle dimension or a complete transformation, I will work with you to create colour that enhances your natural beauty. I take the time to understand your lifestyle - how often you can maintain it, what products you use - so your colour works for you, not the other way around.',
    price: 'From £85',
    duration: '90-180 mins',
  },
  {
    id: 'restyle',
    name: 'Restyle',
    description: 'Ready for a change? This is where we start fresh. I will spend time understanding what you love (and do not love) about your current style, then craft something that reflects where you are now. It is not just about cutting hair - it is about giving you confidence every time you look in the mirror.',
    price: '£85',
    duration: '90 mins',
  },
  {
    id: 'blow-dry',
    name: 'Blow Dry',
    description: 'Perfect for special occasions or when you just want to feel polished. I will create smooth, voluminous styling that lasts. And if you want to recreate the look at home, I will show you exactly how I did it - no secrets, just techniques that actually work.',
    price: '£35',
    duration: '45 mins',
  },
];

export const courses: Course[] = [
  {
    id: 'foundation-cutting',
    title: 'Foundation Cutting',
    description: 'I will help you transform from good to great. Master the cutting fundamentals that separate professionals from experts. Build unshakeable confidence in every cut.',
    duration: '2 Days',
    level: 'Foundation',
    price: '£450',
    highlights: [
      'Core cutting principles and geometry',
      'Sectioning and tension control',
      'Classic shapes and graduation',
      'Hands-on practice with models',
    ],
  },
  {
    id: 'advanced-cutting',
    title: 'Advanced Cutting',
    description: 'I will push you beyond your limits. Master advanced techniques that let you create anything you envision. Become the stylist others look up to.',
    duration: '3 Days',
    level: 'Advanced',
    price: '£650',
    highlights: [
      'Advanced layering and texturising',
      'Freehand cutting techniques',
      'Personalised consultation methods',
      'Portfolio development',
    ],
  },
  {
    id: 'one-to-one',
    title: '1-to-1 Mentorship',
    description: 'Accelerate your mastery with personalized coaching directly from me. I will help you refine your technique, strengthen your brand, and unlock your full potential.',
    duration: 'Flexible',
    level: 'Mentorship',
    price: 'From £350/day',
    highlights: [
      'Customised curriculum',
      'Direct feedback and coaching',
      'Technique refinement',
      'Business and brand development',
    ],
  },
  {
    id: 'salon-leaders',
    title: 'Salon Leaders Programme',
    description: 'I will help you lead with excellence and transform your salon into a powerhouse. Build systems that scale, develop teams that thrive, and create lasting success.',
    duration: '6 Months',
    level: 'Leadership',
    price: 'POA',
    highlights: [
      'Team training and development',
      'Systems and processes',
      'Business growth strategies',
      'Ongoing support and mentorship',
    ],
  },
];

export const testimonials = [
  {
    id: '1',
    name: 'Wendy M',
    text: 'Great experience - my first time at the Salon. Luke was first class - listened and delivered a perfect, precision bob. I would highly recommend!',
    location: 'Cheshire',
    rating: 5,
  },
  {
    id: '2',
    name: 'Karen H',
    text: 'Hairdressers are like Dentists to me not keen on going, because of a few disasters! But when you experience a hairdresser like Luke who listened with interest and delivered exactly what you want, it restores your faith. Thank you Luke...until next time!',
    location: 'Cheshire',
    rating: 5,
  },
  {
    id: '3',
    name: 'Helen G',
    text: 'Luke did a fabulous job on my hair. The consultation was thorough and realistic where he asked me how I wear my hair, what products I use, discussed my hair issues etc in order to give me the best cut for me and my hair type. He reassured me throughout the cut and gave me tips on styling as well. Overall, I had a lovely time and would highly recommend!',
    location: 'Cheshire',
    rating: 5,
  },
];

export const featuredInsights = [
  {
    id: '1',
    title: 'The Foundation of Precision Cutting',
    excerpt: 'Understanding the geometry behind every great haircut. I break down the fundamentals that create lasting, wearable styles.',
    category: 'Technique',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Building Confidence in Your Craft',
    excerpt: 'How to develop the confidence that separates good stylists from great ones. My approach to mastering technique through practice.',
    category: 'Education',
    readTime: '7 min read',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Consultation: The Key to Client Satisfaction',
    excerpt: 'Why every exceptional haircut starts with listening. Learn my consultation process that ensures perfect results every time.',
    category: 'Client Care',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1974&auto=format&fit=crop',
  },
];
