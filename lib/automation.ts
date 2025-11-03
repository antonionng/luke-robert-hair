/**
 * FOUNDATION TIER AUTOMATION
 * 
 * Simple, focused automation for Foundation package (£4,000)
 * - Calculate lead scores on creation
 * - Send transactional acknowledgment emails
 * - NO nurturing sequences (Growth tier)
 * - NO automation queues (Growth tier)
 * - NO SMS (Scale tier)
 * 
 * Growth tier adds: Automated nurturing, queues, sequences
 * Scale tier adds: SMS, multi-channel workflows
 */

import { db } from './supabase';
import { calculateLeadScore } from './leadScoring';
import { sendTransactionalEmail } from './email';

/**
 * Handle new lead creation
 * Foundation tier: Just score + send acknowledgment
 */
export async function onLeadCreated(leadId: string): Promise<void> {
  try {
    // Get lead data
    const { data: lead } = await db.getLead(leadId);
    if (!lead) {
      console.error(`Lead ${leadId} not found`);
      return;
    }

    console.log(`Processing new lead: ${lead.first_name} ${lead.last_name} (${lead.email})`);

    // 1. Calculate initial score
    const scores = await calculateLeadScore(leadId);
    await db.updateLeadScore(leadId, scores.total);

    // Log score
    await db.createScoreHistory({
      lead_id: leadId,
      previous_score: 0,
      new_score: scores.total,
      score_change: scores.total,
      reason: 'Initial lead creation',
      behavioral_score: scores.behavioral,
      engagement_score: scores.engagement,
      profile_score: scores.profile,
    });

    console.log(`Lead scored: ${scores.total}/100 (Profile: ${scores.profile}, Behavioral: ${scores.behavioral}, Engagement: ${scores.engagement})`);

    // 2. Send ONE transactional acknowledgment email
    const customFields = (lead.custom_fields as any) || {};
    const isCPDLead = customFields.leadType === 'cpd_partnership' || lead.source?.includes('cpd');
    const isEducationLead = lead.source?.includes('education') || lead.course_interest;
    
    let emailTemplate = 'contact_acknowledgment';
    if (isCPDLead) {
      emailTemplate = 'cpd_enquiry_received';
    } else if (isEducationLead) {
      emailTemplate = 'education_enquiry_received';
    }

    await sendTransactionalEmail({
      leadId,
      templateName: emailTemplate,
      to: lead.email,
      toName: `${lead.first_name} ${lead.last_name}`,
    });

    console.log(`Acknowledgment email sent: ${emailTemplate}`);

    // 3. Update lead stage to 'contacted'
    await db.updateLead(leadId, {
      lifecycle_stage: 'contacted',
      last_contact_date: new Date().toISOString(),
    });

    console.log(`✅ Lead ${leadId} processed successfully`);
  } catch (error) {
    console.error(`Error processing lead ${leadId}:`, error);
    // Don't throw - we want lead creation to succeed even if automation fails
  }
}

/**
 * Update lead score when activities happen
 * Foundation tier: Just recalculate score, no triggers
 */
export async function onLeadActivity(leadId: string, activityType: string, scoreImpact: number = 0): Promise<void> {
  try {
    // Recalculate score
    const scores = await calculateLeadScore(leadId);
    const { data: lead } = await db.getLead(leadId);
    
    if (!lead) return;

    const previousScore = lead.lead_score || 0;
    const scoreChange = scores.total - previousScore;

    // Update lead score
    await db.updateLeadScore(leadId, scores.total);

    // Log the change
    if (scoreChange !== 0) {
      await db.createScoreHistory({
        lead_id: leadId,
        previous_score: previousScore,
        new_score: scores.total,
        score_change: scoreChange,
        reason: `Activity: ${activityType}`,
        behavioral_score: scores.behavioral,
        engagement_score: scores.engagement,
        profile_score: scores.profile,
      });

      console.log(`Lead ${leadId} score updated: ${previousScore} → ${scores.total} (${scoreChange > 0 ? '+' : ''}${scoreChange})`);
    }

    // Update last activity date
    await db.updateLead(leadId, {
      last_activity_date: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error updating lead activity ${leadId}:`, error);
  }
}

/**
 * Pause lead workflows when they convert (book appointment)
 * Foundation tier: Just update stage - no sequences to pause
 */
export async function onLeadConverted(leadId: string): Promise<void> {
  try {
    const { data: lead } = await db.getLead(leadId);
    if (!lead) return;

    // Update stage to converted
    await db.updateLead(leadId, {
      lifecycle_stage: 'converted',
      last_activity_date: new Date().toISOString(),
    });

    // Log activity
    await db.createActivity({
      lead_id: leadId,
      activity_type: 'booking_completed',
      activity_data: { converted_at: new Date().toISOString() },
      automated: true,
    });

    console.log(`✅ Lead ${leadId} marked as converted`);
  } catch (error) {
    console.error(`Error converting lead ${leadId}:`, error);
  }
}

// ============================================================================
// GROWTH TIER FEATURES (Not included in Foundation)
// ============================================================================
// 
// The following features are available in Growth tier (£6,500 + £500/month):
// 
// - scheduleNurturingSequence(): Multi-step email sequences
// - scheduleCPDSequence(): B2B nurturing workflows
// - processAutomationQueue(): Task queue processing
// - queueTask(): Task scheduling system
// - processLeadFollowUps(): Automated follow-ups
// - autoProgressLeadStages(): Stage automation
// - pauseLeadSequences(): Sequence management
// 
// Interested in upgrading? Contact your account manager!
// ============================================================================
