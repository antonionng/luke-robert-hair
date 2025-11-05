import { Service, Course } from './types';

export const services: Service[] = [
  {
    id: 'haircut',
    name: 'Haircut',
    description: 'This is my signature service - the one I have refined over 15 years. I will study how your hair naturally falls, where it wants to move, and create a cut that works with your texture, not against it. You will leave knowing exactly how to style it at home, and it will still look sharp 8-10 weeks later.',
    price: '£79',
    duration: '60 mins',
  },
  {
    id: 'restyle',
    name: 'Restyle',
    description: 'Ready for a change? This is where we start fresh. I will spend time understanding what you love (and do not love) about your current style, then craft something that reflects where you are now. It is not just about cutting hair - it is about giving you confidence every time you look in the mirror.',
    price: '£89',
    duration: '75 mins',
  },
  {
    id: 'gents-hairstyles',
    name: 'Gents Hairstyles',
    description: 'A complete grooming experience tailored for men. From classic cuts to modern styles, I will create a look that suits your lifestyle and is easy to maintain. Includes consultation, precision cutting, and styling guidance.',
    price: '£49',
    duration: '45 mins',
  },
];

export const courses: Course[] = [
  {
    id: 'foundation-cutting',
    title: 'Foundation Cutting',
    description: 'I will help you transform from good to great. Master the cutting fundamentals that separate professionals from experts. Build unshakeable confidence in every cut.',
    duration: '1 Day',
    level: 'Foundation',
    price: '£500',
    highlights: [
      'Core cutting principles and geometry',
      'Sectioning and tension control',
      'Classic shapes and graduation',
      'Hands-on practice with models',
    ],
  },
  {
    id: 'salon-creative',
    title: 'Salon Creative',
    description: 'I will push you beyond your limits. Master advanced techniques that let you create anything you envision. Become the stylist others look up to.',
    duration: '1 Day',
    level: 'Advanced',
    price: '£550',
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
    title: 'Why Your Haircut Should Last 8-10 Weeks',
    excerpt: 'Discover the precision cutting principles I use to create cuts that grow out beautifully. Learn what makes a truly sustainable haircut and why it matters for your style and budget.',
    category: 'Technique',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'From Salon Chair to Education: My Journey',
    excerpt: 'After 15 years of mastering precision cutting, I am now teaching the techniques that transformed my career. Find out why I decided to share my knowledge and what you can learn.',
    category: 'Education',
    readTime: '7 min read',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'The Consultation That Changes Everything',
    excerpt: 'Before I pick up scissors, we talk. This 15-minute conversation is where transformation begins. See how my consultation process ensures you get exactly what you want.',
    category: 'Client Care',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1974&auto=format&fit=crop',
  },
];
