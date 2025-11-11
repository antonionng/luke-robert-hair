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
    id: 'hairdressing-shop-floor-ready',
    title: 'Hairdressing - "Get Shop Floor Ready"',
    duration: '2 days (12 hours)',
    level: 'Final Year Students',
    icon: 'Scissors',
    shortDescription: 'Perfect finishing programme for students ready for employment in salon',
    fullDescription: 'This intensive programme bridges the gap between college training and real salon work. Students develop the confidence, speed, and commercial awareness needed to thrive on a busy salon floor from day one. Covers client consultation, time management, retail skills, and professional presentation.',
    outcomes: [
      'Master professional client consultations that build trust and clarity',
      'Develop time management skills for working to salon schedules',
      'Build confidence in handling challenging client requests and expectations',
      'Learn retail and product recommendation techniques that feel natural',
      'Perfect your professional presentation and communication style',
      'Understand salon systems, booking procedures, and team dynamics',
    ],
    suitableFor: 'Final year hairdressing students preparing for salon employment—ideal for those about to enter the industry and want to feel confident and ready',
    accreditation: 'CPD Certified - 12 hours',
    deliveryOptions: ['Intensive 2-day on-site', 'Virtual 2-day format', '4 half-day sessions'],
  },
  {
    id: 'hairdressing-lecturers',
    title: 'Hairdressing for Lecturers',
    duration: '1 day (6 hours)',
    level: 'Educators',
    icon: 'GraduationCap',
    shortDescription: 'Upskilling programme for hairdressing educators',
    fullDescription: 'Designed specifically for hairdressing lecturers and educators, this programme keeps you at the cutting edge of industry trends, techniques, and commercial realities. Refresh your knowledge, learn new approaches to engage students, and bridge the gap between education and employment.',
    outcomes: [
      'Update your technical knowledge with current salon trends and techniques',
      'Learn innovative teaching methods that increase student engagement',
      'Understand current industry expectations for new stylists entering employment',
      'Develop strategies to prepare students for commercial salon environments',
      'Network with other educators and share best practices',
      'Gain insights into salon operations and employer expectations',
    ],
    suitableFor: 'Hairdressing lecturers, trainers, and educators looking to stay current with industry developments and enhance their teaching effectiveness',
    accreditation: 'CPD Certified - 6 hours',
    deliveryOptions: ['On-site workshop', 'Live virtual session', 'Hybrid format'],
  },
  {
    id: 'barbering-shop-ready',
    title: 'Barbering - "Get Barbershop Ready"',
    duration: '2 days (12 hours)',
    level: 'Final Year Students',
    icon: 'Scissors',
    shortDescription: 'Perfect finishing programme for barbers ready for employment',
    fullDescription: 'This hands-on programme prepares barbering students for the unique demands of a busy barbershop. Focus on speed without sacrificing quality, client communication in a fast-paced environment, and the commercial skills that make you valuable to employers from day one.',
    outcomes: [
      'Master efficient consultation techniques for high-volume barbering',
      'Develop speed and precision to meet barbershop productivity expectations',
      'Build confidence with diverse hair types and challenging requests',
      'Learn client management in walk-in and appointment-based environments',
      'Perfect your fade technique and beard sculpting skills',
      'Understand barbershop culture, etiquette, and professional standards',
    ],
    suitableFor: 'Final year barbering students preparing for barbershop employment—perfect for those wanting to hit the ground running in a professional barbering environment',
    accreditation: 'CPD Certified - 12 hours',
    deliveryOptions: ['Intensive 2-day on-site', 'Virtual 2-day format', '4 half-day sessions'],
  },
  {
    id: 'barbering-lecturers',
    title: 'Barbering for Lecturers',
    duration: '1 day (6 hours)',
    level: 'Educators',
    icon: 'GraduationCap',
    shortDescription: 'Upskilling programme for barbering educators',
    fullDescription: 'Keep your barbering education relevant and industry-aligned with this professional development programme. Designed for barbering lecturers, this session covers the latest techniques, trends, and commercial realities of modern barbershops—ensuring your students graduate employment-ready.',
    outcomes: [
      'Update your technical skills with contemporary barbering techniques',
      'Learn about current barbershop trends, tools, and products',
      'Understand employer expectations for newly qualified barbers',
      'Develop teaching strategies that mirror real barbershop environments',
      'Network with fellow educators and industry professionals',
      'Bridge the gap between qualification and employment readiness',
    ],
    suitableFor: 'Barbering lecturers, trainers, and educators committed to delivering industry-relevant education and preparing students for successful barbering careers',
    accreditation: 'CPD Certified - 6 hours',
    deliveryOptions: ['Interactive on-site workshop', 'Live virtual delivery', 'Blended format'],
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

