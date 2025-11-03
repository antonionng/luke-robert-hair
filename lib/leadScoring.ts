/**
 * LEAD SCORING ENGINE
 * 
 * Intelligent lead qualification system that scores leads based on:
 * - Behavioral signals (page visits, engagement)
 * - Engagement signals (email opens, replies)
 * - Profile quality (complete info, professional indicators)
 * 
 * Score range: 0-100
 * - 70-100: Hot leads (immediate action)
 * - 40-69: Warm leads (automated nurturing)
 * - 0-39: Cold leads (long-term nurturing)
 */

import { db } from './supabase';
import { Database } from './supabase';

type Lead = Database['public']['Tables']['leads']['Row'];
type LeadActivity = Database['public']['Tables']['lead_activities']['Row'];

// Scoring weights (total = 100)
const SCORING_WEIGHTS = {
  BEHAVIORAL: 40, // Page visits, time on site, content engagement
  ENGAGEMENT: 40, // Email opens, clicks, replies, SMS responses
  PROFILE: 20, // Complete information, professional email, etc.
};

// Activity score values
const ACTIVITY_SCORES = {
  // Page visits
  page_visited_education: 5,
  page_visited_course_detail: 8,
  page_visited_pricing: 10,
  page_visited_booking: 12,
  
  // Forms
  form_submitted: 15,
  booking_attempted: 20,
  booking_completed: 30,
  
  // Chat
  chat_initiated: 5,
  chat_message: 2, // Per message
  
  // Email engagement
  email_opened: 3,
  email_clicked: 8,
  email_replied: 15,
  
  // SMS engagement
  sms_replied: 20,
  
  // Content
  content_viewed: 3,
  content_engaged: 5, // Spent 60+ seconds
  
  // Return behavior
  return_visit: 5, // Each return visit within 30 days
};

// Profile quality indicators
const PROFILE_SCORES = {
  complete_name: 3,
  has_phone: 3,
  has_company_email: 5, // Professional domain
  has_linkedin: 5,
  has_salon_affiliation: 4,
  // CPD-specific scores
  cpd_has_institution: 5,
  cpd_decision_maker: 10, // Job title indicates decision-making authority
  cpd_large_cohort: 10, // 100+ students
  cpd_medium_cohort: 5, // 50-99 students
  cpd_educational_domain: 5, // .ac.uk, .edu domain
  cpd_specific_course: 8, // Selected specific course vs "All Courses"
};

/**
 * Calculate a lead's score based on all available data
 */
export async function calculateLeadScore(leadId: string): Promise<{
  total: number;
  behavioral: number;
  engagement: number;
  profile: number;
}> {
  // Get lead data
  const { data: lead, error: leadError } = await db.getLead(leadId);
  if (leadError || !lead) {
    throw new Error(`Lead not found: ${leadId}`);
  }

  // Get lead activities
  const { data: activities, error: activitiesError } = await db.getLeadActivities(leadId);
  if (activitiesError) {
    throw new Error(`Failed to fetch activities for lead: ${leadId}`);
  }

  // Calculate component scores
  const behavioral = calculateBehavioralScore(activities || [], lead);
  const engagement = calculateEngagementScore(activities || [], lead);
  const profile = calculateProfileScore(lead);

  // Calculate weighted total
  const total = Math.min(100, Math.round(
    (behavioral * SCORING_WEIGHTS.BEHAVIORAL / 40) +
    (engagement * SCORING_WEIGHTS.ENGAGEMENT / 40) +
    (profile * SCORING_WEIGHTS.PROFILE / 20)
  ));

  return {
    total,
    behavioral,
    engagement,
    profile,
  };
}

/**
 * Calculate behavioral score (0-40)
 */
function calculateBehavioralScore(activities: LeadActivity[], lead: Lead): number {
  let score = 0;
  const activityTypes = new Set<string>();

  // Count activities
  for (const activity of activities) {
    activityTypes.add(activity.activity_type);

    switch (activity.activity_type) {
      case 'page_visited':
        const page = (activity.activity_data as any)?.page || '';
        if (page.includes('/education')) score += ACTIVITY_SCORES.page_visited_education;
        else if (page.includes('/course')) score += ACTIVITY_SCORES.page_visited_course_detail;
        else if (page.includes('/pricing')) score += ACTIVITY_SCORES.page_visited_pricing;
        else if (page.includes('/book')) score += ACTIVITY_SCORES.page_visited_booking;
        break;

      case 'form_submitted':
        score += ACTIVITY_SCORES.form_submitted;
        break;

      case 'booking_attempted':
        score += ACTIVITY_SCORES.booking_attempted;
        break;

      case 'booking_completed':
        score += ACTIVITY_SCORES.booking_completed;
        break;

      case 'chat_initiated':
        score += ACTIVITY_SCORES.chat_initiated;
        break;

      case 'chat_message':
        score += ACTIVITY_SCORES.chat_message;
        break;

      case 'content_viewed':
        score += ACTIVITY_SCORES.content_viewed;
        const timeSpent = (activity.activity_data as any)?.time_spent || 0;
        if (timeSpent > 60) {
          score += ACTIVITY_SCORES.content_engaged;
        }
        break;
    }
  }

  // Bonus for return visits
  const uniqueDays = new Set(
    activities.map(a => new Date(a.created_at).toDateString())
  );
  const returnVisits = Math.max(0, uniqueDays.size - 1);
  score += returnVisits * ACTIVITY_SCORES.return_visit;

  // Bonus for recent activity (last 7 days)
  const recentActivities = activities.filter(a => {
    const daysSince = (Date.now() - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 7;
  });
  if (recentActivities.length > 0) {
    score += 5; // Recency bonus
  }

  return Math.min(40, score);
}

/**
 * Calculate engagement score (0-40)
 */
function calculateEngagementScore(activities: LeadActivity[], lead: Lead): number {
  let score = 0;

  for (const activity of activities) {
    switch (activity.activity_type) {
      case 'email_opened':
        score += ACTIVITY_SCORES.email_opened;
        break;

      case 'email_clicked':
        score += ACTIVITY_SCORES.email_clicked;
        break;

      case 'email_replied':
        score += ACTIVITY_SCORES.email_replied;
        break;

      case 'sms_replied':
        score += ACTIVITY_SCORES.sms_replied;
        break;
    }
  }

  // Bonus for high engagement rate
  const emailActivities = activities.filter(a => a.activity_type.startsWith('email_'));
  const emailSent = emailActivities.filter(a => a.activity_type === 'email_sent').length;
  const emailOpened = emailActivities.filter(a => a.activity_type === 'email_opened').length;
  
  if (emailSent > 0) {
    const openRate = emailOpened / emailSent;
    if (openRate > 0.5) score += 5; // 50%+ open rate bonus
    if (openRate > 0.7) score += 5; // 70%+ open rate bonus
  }

  return Math.min(40, score);
}

/**
 * Calculate profile score (0-20)
 */
function calculateProfileScore(lead: Lead): number {
  let score = 0;

  // Complete name
  if (lead.first_name && lead.last_name) {
    score += PROFILE_SCORES.complete_name;
  }

  // Has phone
  if (lead.phone) {
    score += PROFILE_SCORES.has_phone;
  }

  // Professional email domain
  if (lead.email && !isFreeEmailDomain(lead.email)) {
    score += PROFILE_SCORES.has_company_email;
  }

  // Custom fields (e.g., LinkedIn, salon affiliation)
  const customFields = lead.custom_fields as any || {};
  if (customFields.linkedin_url) {
    score += PROFILE_SCORES.has_linkedin;
  }
  if (customFields.salon_name || customFields.current_salon) {
    score += PROFILE_SCORES.has_salon_affiliation;
  }

  // CPD-specific scoring
  if (customFields.leadType === 'cpd_partnership') {
    // Has institution name
    if (customFields.institution) {
      score += PROFILE_SCORES.cpd_has_institution;
    }

    // Decision-maker job title
    if (customFields.jobTitle && isDecisionMaker(customFields.jobTitle)) {
      score += PROFILE_SCORES.cpd_decision_maker;
    }

    // Student numbers (cohort size)
    if (customFields.studentNumbers) {
      const students = parseInt(customFields.studentNumbers);
      if (students >= 100) {
        score += PROFILE_SCORES.cpd_large_cohort;
      } else if (students >= 50) {
        score += PROFILE_SCORES.cpd_medium_cohort;
      }
    }

    // Educational email domain
    if (lead.email && isEducationalDomain(lead.email)) {
      score += PROFILE_SCORES.cpd_educational_domain;
    }

    // Specific course interest
    if (lead.course_interest && 
        lead.course_interest !== 'All Courses' && 
        lead.course_interest !== 'All Courses - Need Advice') {
      score += PROFILE_SCORES.cpd_specific_course;
    }
  }

  return Math.min(20, score);
}

/**
 * Check if job title indicates decision-making authority
 */
function isDecisionMaker(jobTitle: string): boolean {
  const decisionMakerKeywords = [
    'director', 'head of', 'dean', 'principal', 'vice principal',
    'coordinator', 'manager', 'lead', 'chief', 'senior'
  ];
  const titleLower = jobTitle.toLowerCase();
  return decisionMakerKeywords.some(keyword => titleLower.includes(keyword));
}

/**
 * Check if email is from educational institution
 */
function isEducationalDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  return domain.endsWith('.ac.uk') || 
         domain.endsWith('.edu') || 
         domain.endsWith('.edu.au') ||
         domain.includes('college') ||
         domain.includes('university');
}

/**
 * Check if email is from a free provider
 */
function isFreeEmailDomain(email: string): boolean {
  const freeProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'aol.com', 'icloud.com', 'protonmail.com', 'mail.com',
  ];
  const domain = email.split('@')[1]?.toLowerCase();
  return freeProviders.includes(domain || '');
}

/**
 * Update lead score and record history
 */
export async function updateLeadScore(leadId: string, reason: string): Promise<number> {
  // Calculate new score
  const scores = await calculateLeadScore(leadId);

  // Get current score
  const { data: lead } = await db.getLead(leadId);
  const previousScore = lead?.lead_score || 0;

  // Update lead
  await db.updateLeadScore(leadId, scores.total);

  // Record score history
  if (previousScore !== scores.total) {
    await db.createScoreHistory({
      lead_id: leadId,
      previous_score: previousScore,
      new_score: scores.total,
      score_change: scores.total - previousScore,
      reason,
      behavioral_score: scores.behavioral,
      engagement_score: scores.engagement,
      profile_score: scores.profile,
    });
  }

  return scores.total;
}

/**
 * Log an activity and update the lead score
 */
export async function logActivityAndScore(
  leadId: string,
  activityType: string,
  activityData: Record<string, any> = {},
  automated: boolean = false
): Promise<void> {
  // Create activity
  const scoreImpact = ACTIVITY_SCORES[activityType as keyof typeof ACTIVITY_SCORES] || 0;
  
  await db.createActivity({
    lead_id: leadId,
    activity_type: activityType,
    activity_data: activityData,
    automated,
    score_impact: scoreImpact,
  });

  // Update score
  await updateLeadScore(leadId, `Activity: ${activityType}`);
}

/**
 * Determine lead temperature based on score
 */
export function getLeadTemperature(score: number): 'hot' | 'warm' | 'cold' {
  if (score >= 70) return 'hot';
  if (score >= 40) return 'warm';
  return 'cold';
}

/**
 * Get recommended next action based on score and stage
 */
export function getRecommendedAction(lead: Lead): string {
  const temp = getLeadTemperature(lead.lead_score);
  const stage = lead.lifecycle_stage;

  if (temp === 'hot' && stage === 'new') {
    return 'Immediate personal outreach - high conversion probability';
  } else if (temp === 'hot' && stage === 'contacted') {
    return 'Follow up within 24 hours - lead is engaged';
  } else if (temp === 'warm') {
    return 'Continue automated nurturing sequence';
  } else if (temp === 'cold' && stage === 'new') {
    return 'Add to long-term nurturing campaign';
  } else if (stage === 'nurturing' && !lead.last_contact_date) {
    return 'Re-engage with personalized content';
  } else if (stage === 'nurturing') {
    const daysSinceContact = lead.last_contact_date 
      ? Math.floor((Date.now() - new Date(lead.last_contact_date).getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    
    if (daysSinceContact > 30) {
      return 'Re-engagement campaign needed';
    } else {
      return 'Continue current sequence';
    }
  }

  return 'Review lead manually';
}

/**
 * Identify leads that should be moved to different stages
 */
export async function identifyStageTransitions(): Promise<{
  toContact: Lead[];
  toQualify: Lead[];
  toNurture: Lead[];
  toLost: Lead[];
}> {
  const { data: allLeads } = await db.getAllLeads();
  const leads = allLeads || [];

  const toContact: Lead[] = [];
  const toQualify: Lead[] = [];
  const toNurture: Lead[] = [];
  const toLost: Lead[] = [];

  for (const lead of leads) {
    const daysSinceCreated = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceContact = lead.last_contact_date
      ? Math.floor((Date.now() - new Date(lead.last_contact_date).getTime()) / (1000 * 60 * 60 * 24))
      : daysSinceCreated;

    // New → Contacted (after first outreach or high score)
    if (lead.lifecycle_stage === 'new' && (lead.lead_score >= 70 || daysSinceCreated >= 1)) {
      toContact.push(lead);
    }

    // Contacted → Qualified (score > 40 or engagement detected)
    if (lead.lifecycle_stage === 'contacted' && lead.lead_score >= 40) {
      toQualify.push(lead);
    }

    // Qualified → Nurturing (ready for sequence)
    if (lead.lifecycle_stage === 'qualified') {
      toNurture.push(lead);
    }

    // Any stage → Lost (no engagement for 90 days)
    if (daysSinceContact > 90 && lead.lifecycle_stage !== 'converted' && lead.lifecycle_stage !== 'lost') {
      toLost.push(lead);
    }
  }

  return {
    toContact,
    toQualify,
    toNurture,
    toLost,
  };
}

