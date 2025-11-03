/**
 * AI CHAT CONTEXT SYSTEM
 * 
 * Detects page context and adjusts AI behavior accordingly
 * - CPD: B2B institutional enquiries
 * - Stylist: Individual hairdresser education
 * - Booking: Salon appointments
 * - General: Default conversational AI
 */

export interface ChatContext {
  type: 'general' | 'cpd' | 'stylist' | 'booking';
  institution?: string;
  jobTitle?: string;
  studentNumbers?: number;
  userType?: 'individual' | 'institution';
}

export interface ExtractedInfo {
  institution?: string;
  jobTitle?: string;
  studentNumbers?: number;
  courseInterest?: string;
  deliveryPreference?: string;
  goals?: string;
  studentLevel?: string;
}

/**
 * Detect context from current page URL
 */
export function detectContextFromPage(): ChatContext {
  if (typeof window === 'undefined') {
    return { type: 'general', userType: 'individual' };
  }

  const path = window.location.pathname;
  
  if (path.includes('/cpd-partnerships')) {
    return { type: 'cpd', userType: 'institution' };
  } else if (path.includes('/education')) {
    return { type: 'stylist', userType: 'individual' };
  } else if (path.includes('/book')) {
    return { type: 'booking', userType: 'individual' };
  }
  
  return { type: 'general', userType: 'individual' };
}

/**
 * Get CPD-specific system prompt for B2B institutional enquiries
 */
export function getCPDSystemPrompt(): string {
  return `You are Luke Robert's AI assistant helping hair and beauty college decision-makers find the right CPD training programme for their students.

CONTEXT: This is a hair and beauty college/institution enquiry (B2B)

YOUR ROLE:
- Ask about their institution, student demographics, and goals
- Recommend appropriate CPD programmes based on needs
- Explain benefits in terms of student outcomes, employability, and industry readiness
- Offer to connect them with Luke for a discovery call
- Maintain a professional, consultative B2B tone with understanding of vocational beauty education

AVAILABLE CPD PROGRAMMES:
1. **Communication & Influence** (1 day, 6 hours) - All levels
   - NLP techniques, persuasion, presentation skills
   - Perfect for: Hair & beauty students learning client consultations, building rapport with clients, presenting themselves professionally in salon environments
   
2. **Coaching for Success** (2 days, 12 hours) - Intermediate
   - GROW model, powerful questioning, goal-setting
   - Perfect for: Students preparing to mentor junior stylists, manage salon teams, or develop coaching skills for client transformations
   
3. **Emotional Intelligence & Leadership** (1 day, 6 hours) - All levels
   - 5 pillars of EQ, empathetic leadership, difficult conversations
   - Perfect for: Students preparing for salon leadership roles, managing client expectations, handling busy salon pressures with grace
   
4. **Mindset & Motivation** (Half day, 3 hours) - All levels
   - Growth mindset, limiting beliefs, resilience building
   - Perfect for: Hair & beauty students building confidence, overcoming perfectionism, developing resilience for building their client base

KEY QUESTIONS TO ASK (naturally, in conversation):
- What type of hair and beauty college? (FE College, Private Training Academy, etc.)
- What disciplines do your students study? (Hairdressing, Beauty Therapy, Barbering, Aesthetics, Make-up)
- How many students are you considering? (Helps with logistics and pricing)
- What level are the students? (Foundation, Level 2, Level 3, etc.)
- What outcomes are you hoping to achieve? (Better employability, client communication, confidence, industry readiness)
- Preferred delivery format? (On-site, online, or hybrid)
- Any specific challenges your students face? (Client communication, confidence, professionalism)

TONE: Professional, warm, consultative (not pushy or salesy) - with genuine understanding of beauty industry education
FOCUS: Employability, industry readiness, practical skills for salon success, CPD certification value, student confidence
CONVERSATION FLOW:
1. Greet warmly and ask how you can help their hair and beauty students
2. Ask 2-3 key questions to understand their specific needs and student disciplines
3. Recommend 1-2 most suitable programmes with clear reasoning tied to beauty industry contexts
4. Explain student outcomes with industry-specific examples (e.g., "helps with client consultations")
5. When they seem interested, offer to arrange a discovery call with Luke

LEAD CAPTURE TRIGGER:
When you have learned:
- Institution name
- Student discipline (hairdressing, beauty, etc.)
- Approximate student numbers
- At least one programme of interest
- Their goals/outcomes desired

Then respond with: "I have everything I need to help. Would you like me to connect you with Luke for a 15-minute discovery call? He can discuss pricing, dates, and tailor a programme specifically for your hair and beauty students."

IMPORTANT:
- Never invent details about pricing, dates, or availability
- Always position CPD certification as valuable for students' portfolios
- Focus on practical skills students will use in salons and with clients
- Mention that programmes can be customized for specific beauty disciplines
- Reference employability and industry readiness frequently
- Be helpful and consultative, not pushy`;
}

/**
 * Get default system prompt for general/stylist enquiries
 */
export function getDefaultSystemPrompt(): string {
  return `You are Luke Robert's AI assistant helping visitors with:
- Booking salon appointments
- Learning about services and prices
- Exploring professional education courses for hairdressers
- General hair care advice

TONE: Friendly, professional, helpful
APPROACH: Answer questions clearly, offer to help with bookings or course enquiries

For COURSE enquiries:
- Recommend Foundation Cutting for beginners (1-2 years experience)
- Recommend Advanced Cutting for experienced stylists (3+ years)
- Mention 1-to-1 mentorship for personalized training
- Explain that courses focus on precision, consistency, and commercial viability

For BOOKING enquiries:
- Direct them to the booking page
- Mention services: Precision cutting, coloring, balayage
- Locations: Cheshire and Oxford

Keep responses concise and helpful. If asked about something you don't know, be honest and suggest they contact Luke directly.`;
}

/**
 * Get system prompt based on context
 */
export function getSystemPromptForContext(context: ChatContext): string {
  if (context.type === 'cpd') {
    return getCPDSystemPrompt();
  }
  
  return getDefaultSystemPrompt();
}

/**
 * Extract institutional information from conversation messages
 */
export function extractInstitutionalInfo(messages: any[]): ExtractedInfo {
  const extractedInfo: ExtractedInfo = {};
  
  // Simple extraction from user messages
  // Look for patterns in the conversation
  const userMessages = messages
    .filter(m => m.role === 'user')
    .map(m => m.content.toLowerCase())
    .join(' ');

  // Institution patterns
  const institutionPatterns = [
    /(?:from|at|work at|represent)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:College|University|Institute|Academy|School))/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:College|University|Institute|Academy)/i,
  ];
  
  for (const pattern of institutionPatterns) {
    const match = messages.map(m => m.content).join(' ').match(pattern);
    if (match) {
      extractedInfo.institution = match[1] || match[0];
      break;
    }
  }

  // Student numbers patterns
  const numberPatterns = [
    /(\d+)\s+students?/i,
    /group of (\d+)/i,
    /cohort of (\d+)/i,
    /around (\d+)/i,
    /approximately (\d+)/i,
  ];
  
  for (const pattern of numberPatterns) {
    const match = userMessages.match(pattern);
    if (match) {
      extractedInfo.studentNumbers = parseInt(match[1]);
      break;
    }
  }

  // Course interest patterns
  const courses = [
    'Communication & Influence',
    'Coaching for Success',
    'Emotional Intelligence & Leadership',
    'Mindset & Motivation',
  ];
  
  for (const course of courses) {
    if (userMessages.includes(course.toLowerCase())) {
      extractedInfo.courseInterest = course;
      break;
    }
  }

  // Delivery preference
  if (userMessages.includes('on-site') || userMessages.includes('onsite') || userMessages.includes('at our')) {
    extractedInfo.deliveryPreference = 'On-site';
  } else if (userMessages.includes('online') || userMessages.includes('virtual')) {
    extractedInfo.deliveryPreference = 'Online';
  } else if (userMessages.includes('hybrid') || userMessages.includes('both')) {
    extractedInfo.deliveryPreference = 'Hybrid';
  }

  return extractedInfo;
}

/**
 * Determine if enough info has been collected to offer lead capture
 */
export function shouldOfferLeadCapture(
  extractedInfo: ExtractedInfo, 
  messages: any[],
  context: ChatContext
): boolean {
  // Only offer lead capture for CPD context
  if (context.type !== 'cpd') {
    return false;
  }

  // Need at least 4 messages exchanged (2 from user)
  if (messages.length < 4) {
    return false;
  }

  // Check if we have key information
  const hasInstitution = !!extractedInfo.institution;
  const hasStudentInfo = !!extractedInfo.studentNumbers;
  const hasCourseInterest = !!extractedInfo.courseInterest;
  
  // Need at least 2 of 3 key pieces of info
  const infoCount = [hasInstitution, hasStudentInfo, hasCourseInterest].filter(Boolean).length;
  
  // Also check if conversation is progressing (assistant has recommended courses)
  const assistantMessages = messages.filter(m => m.role === 'assistant');
  const hasRecommendedCourses = assistantMessages.some(m => 
    m.content.toLowerCase().includes('recommend') || 
    m.content.toLowerCase().includes('suggest') ||
    m.content.toLowerCase().includes('would be perfect')
  );

  return infoCount >= 2 && hasRecommendedCourses;
}

/**
 * Generate conversation summary for lead notes
 */
export function generateConversationSummary(messages: any[], extractedInfo: ExtractedInfo): string {
  const userMessages = messages
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join('\n\n');

  let summary = 'AI Chat Conversation Summary:\n\n';
  
  if (extractedInfo.institution) {
    summary += `Institution: ${extractedInfo.institution}\n`;
  }
  if (extractedInfo.studentNumbers) {
    summary += `Student Numbers: ${extractedInfo.studentNumbers}\n`;
  }
  if (extractedInfo.courseInterest) {
    summary += `Course Interest: ${extractedInfo.courseInterest}\n`;
  }
  if (extractedInfo.deliveryPreference) {
    summary += `Delivery Preference: ${extractedInfo.deliveryPreference}\n`;
  }
  
  summary += '\n---\n\nUser Messages:\n' + userMessages;
  
  return summary;
}

