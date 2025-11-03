/**
 * CPD COURSES DATA
 * 
 * Course offerings for college/institutional partnerships
 */

export interface CPDCourse {
  id: string;
  title: string;
  duration: string;
  level: string;
  icon: string;
  shortDescription: string;
  fullDescription: string;
  outcomes: string[];
  suitableFor: string;
  accreditation: string;
  deliveryOptions: string[];
}

export const cpdCourses: CPDCourse[] = [
  {
    id: 'communication-influence',
    title: 'Communication & Influence',
    duration: '1 day (6 hours)',
    level: 'All levels',
    icon: 'MessageSquare',
    shortDescription: 'Master the art of persuasion and impactful communication',
    fullDescription: 'This dynamic workshop equips participants with advanced communication techniques drawing from NLP, psychology, and proven influence strategies. Students learn to communicate with clarity, build instant rapport, and influence outcomes effectively in both personal and professional contexts.',
    outcomes: [
      'Develop powerful communication skills that create lasting impact',
      'Learn NLP techniques for building rapport with clients during consultations',
      'Master active listening and empathetic communication in salon settings',
      'Present ideas with confidence and clarity to clients and colleagues',
      'Understand body language and non-verbal communication cues from clients',
      'Apply persuasion principles ethically in client recommendations and retail',
    ],
    suitableFor: 'Hairdressing, beauty therapy, barbering, and aesthetics students at all levels—perfect for building client communication skills essential for salon success',
    accreditation: 'CPD Certified - 6 hours',
    deliveryOptions: ['On-site workshop', 'Live virtual session', 'Hybrid format'],
  },
  {
    id: 'coaching-success',
    title: 'Coaching for Success',
    duration: '2 days (12 hours)',
    level: 'Intermediate',
    icon: 'Target',
    shortDescription: 'Develop coaching skills to empower and inspire others',
    fullDescription: 'A comprehensive two-day programme that teaches proven coaching methodologies, questioning techniques, and transformational frameworks. Participants learn to facilitate breakthrough conversations, set powerful goals, and guide others toward their highest potential using evidence-based coaching models.',
    outcomes: [
      'Master the GROW coaching model and powerful questioning for client transformations',
      'Learn to set and achieve compelling goals with clients and team members',
      'Develop active listening and feedback skills for mentoring junior stylists',
      'Understand coaching ethics and professional boundaries in salon environments',
      'Practice real coaching sessions with peer feedback',
      'Create personalised coaching frameworks for salon team leadership',
    ],
    suitableFor: 'Hair and beauty students preparing for salon management, senior stylist roles, or aspiring educators—ideal for those who will mentor junior team members',
    accreditation: 'CPD Certified - 12 hours',
    deliveryOptions: ['Intensive 2-day on-site', 'Virtual 2-day format', '4 half-day sessions'],
  },
  {
    id: 'emotional-intelligence-leadership',
    title: 'Emotional Intelligence & Leadership',
    duration: '1 day (6 hours)',
    level: 'All levels',
    icon: 'Heart',
    shortDescription: 'Build EQ and leadership capabilities that inspire teams',
    fullDescription: 'Explore the five pillars of emotional intelligence and their direct application to effective leadership. This experiential workshop helps participants develop self-awareness, manage emotions skillfully, and lead with empathy and authenticity. Perfect for emerging and established leaders alike.',
    outcomes: [
      'Understand and develop the five pillars of emotional intelligence',
      'Enhance self-awareness and emotional regulation under salon pressures',
      'Lead with empathy and authentic connection with clients and colleagues',
      'Navigate difficult conversations with clients and team members confidently',
      'Build high-performing, emotionally intelligent salon teams',
      'Apply EQ principles in real salon leadership and client management scenarios',
    ],
    suitableFor: 'Hair and beauty students at all levels—especially those preparing for salon leadership, senior stylist roles, or managing client expectations in high-pressure environments',
    accreditation: 'CPD Certified - 6 hours',
    deliveryOptions: ['Interactive on-site workshop', 'Live virtual delivery', 'Blended format'],
  },
  {
    id: 'mindset-motivation',
    title: 'Mindset & Motivation',
    duration: 'Half day (3 hours)',
    level: 'All levels',
    icon: 'Lightbulb',
    shortDescription: 'Transform limiting beliefs into empowering mindsets',
    fullDescription: 'A high-energy, transformational session that challenges limiting beliefs and installs empowering mindsets for success. Drawing from growth mindset research, NLP, and motivational psychology, participants learn practical tools to overcome obstacles, build resilience, and maintain sustainable motivation.',
    outcomes: [
      'Identify and reframe limiting beliefs about building a client base',
      'Develop a growth mindset approach to challenges and creative blocks',
      'Learn practical motivation techniques for maintaining passion in your craft',
      'Build mental resilience and confidence for independent salon work',
      'Create personal success strategies for career progression',
      'Apply mindset shifts immediately to overcome perfectionism and self-doubt',
    ],
    suitableFor: 'Hair and beauty students at all levels—perfect for building confidence, overcoming creative blocks, and developing the resilient mindset needed for salon success',
    accreditation: 'CPD Certified - 3 hours',
    deliveryOptions: ['Energetic on-site session', 'Interactive virtual format', 'Large group assembly'],
  },
];

// Helper functions
export function getCourseById(id: string): CPDCourse | undefined {
  return cpdCourses.find(course => course.id === id);
}

export function getCoursesByLevel(level: string): CPDCourse[] {
  return cpdCourses.filter(course => course.level === level || course.level === 'All levels');
}

export function getAllCourseTitles(): string[] {
  return cpdCourses.map(course => course.title);
}

