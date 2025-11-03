/**
 * EMAIL SYSTEM - Resend Integration (FOUNDATION TIER)
 * 
 * Handles TRANSACTIONAL emails only for Foundation package (£4,000)
 * - Booking confirmations
 * - Booking reminders
 * - Contact form acknowledgments
 * - CPD/Education enquiry acknowledgments
 * 
 * NOT included in Foundation (Growth tier):
 * - Nurturing emails (AI-generated sequences)
 * - Marketing emails (newsletters, campaigns)
 * - Automated follow-ups
 * 
 * Features:
 * - Automatic logging to database
 * - Webhook handling for delivery tracking
 * - Simple transactional templates
 */

import { Resend } from 'resend';
import { db } from './supabase';
import { Database } from './supabase';

// Lazy initialization to avoid build-time API key requirement
let resend: Resend | null = null;
function getResendClient() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

// From email configuration
const FROM_EMAIL = process.env.FROM_EMAIL || 'Luke Robert Hair <onboarding@resend.dev>';
const REPLY_TO = process.env.REPLY_TO_EMAIL || 'onboarding@resend.dev';

type EmailType = Database['public']['Tables']['email_logs']['Row']['email_type'];

interface SendEmailParams {
  to: string;
  toName?: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  emailType: EmailType;
  leadId?: string;
  templateName?: string;
  aiGenerated?: boolean;
  personalizationData?: Record<string, any>;
}

/**
 * Send an email via Resend and log to database
 */
export async function sendEmail(params: SendEmailParams): Promise<{
  success: boolean;
  emailLogId?: string;
  resendId?: string;
  error?: string;
}> {
  try {
    // Create email log first
    const { data: emailLog, error: logError } = await db.createEmailLog({
      lead_id: params.leadId || null,
      to_email: params.to,
      to_name: params.toName || null,
      subject: params.subject,
      body_html: params.bodyHtml,
      body_text: params.bodyText,
      email_type: params.emailType,
      template_name: params.templateName || null,
      ai_generated: params.aiGenerated || false,
      personalization_data: params.personalizationData || {},
      status: 'pending',
    });

    if (logError || !emailLog) {
      console.error('Failed to create email log:', logError);
      return { success: false, error: 'Failed to log email' };
    }

    // Add unsubscribe link to HTML
    const htmlWithUnsubscribe = params.bodyHtml.replace(
      '{{unsubscribe_url}}',
      `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(params.to)}`
    );

    // Send via Resend
    const resendClient = getResendClient();
    if (!resendClient) {
      throw new Error('Resend API key not configured');
    }

    const { data, error } = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: htmlWithUnsubscribe,
      text: params.bodyText,
      reply_to: REPLY_TO,
      tags: [
        {
          name: 'type',
          value: params.emailType,
        },
        params.leadId
          ? {
              name: 'lead_id',
              value: params.leadId,
            }
          : undefined,
      ].filter(Boolean) as any,
    });

    if (error) {
      console.error('Resend error:', error);
      
      // Update log with error
      await db.updateEmailStatus(emailLog.id, {
        status: 'failed',
        error_message: error.message || 'Unknown error',
      });

      return {
        success: false,
        emailLogId: emailLog.id,
        error: error.message || 'Failed to send email',
      };
    }

    // Update log with success
    await db.updateEmailStatus(emailLog.id, {
      status: 'sent',
      sent_at: new Date().toISOString(),
      resend_id: data?.id || null,
    });

    return {
      success: true,
      emailLogId: emailLog.id,
      resendId: data?.id,
    };
  } catch (error: any) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(params: {
  clientEmail: string;
  clientName: string;
  serviceName: string;
  locationName: string;
  locationAddress: string;
  dateTime: Date;
  duration: number;
  price: number;
  depositRequired: boolean;
  depositAmount?: number;
  bookingId: string;
}): Promise<{ success: boolean; error?: string }> {
  const dateStr = params.dateTime.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = params.dateTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const subject = `Booking confirmed: ${params.serviceName} on ${dateStr}`;

  const bodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAF8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAF8;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 24px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; color: #2C2C2C; font-weight: 400;">Your booking is confirmed</h1>
              
              <p style="margin: 0 0 24px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                Hi ${params.clientName},
              </p>

              <p style="margin: 0 0 32px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                Looking forward to seeing you. Here are your booking details:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5F3; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #616F64; font-weight: 600;">Service</td>
                        <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #2C2C2C; text-align: right;">${params.serviceName}</td>
                      </tr>
                      <tr>
                        <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #616F64; font-weight: 600;">Date</td>
                        <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #2C2C2C; text-align: right;">${dateStr}</td>
                      </tr>
                      <tr>
                        <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #616F64; font-weight: 600;">Time</td>
                        <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #2C2C2C; text-align: right;">${timeStr}</td>
                      </tr>
                      <tr>
                        <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #616F64; font-weight: 600;">Duration</td>
                        <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #2C2C2C; text-align: right;">${params.duration} minutes</td>
                      </tr>
                      <tr>
                        <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #616F64; font-weight: 600;">Location</td>
                        <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #2C2C2C; text-align: right;">${params.locationName}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="font-family: system-ui, -apple-system, sans-serif; font-size: 12px; color: #999; padding-top: 8px;">${params.locationAddress}</td>
                      </tr>
                      <tr>
                        <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #616F64; font-weight: 600; padding-top: 16px; border-top: 1px solid #E9E9E7;">Price</td>
                        <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 16px; color: #2C2C2C; text-align: right; font-weight: 600; padding-top: 16px; border-top: 1px solid #E9E9E7;">£${params.price.toFixed(2)}</td>
                      </tr>
                      ${
                        params.depositRequired && params.depositAmount
                          ? `
                      <tr>
                        <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #616F64; font-weight: 600;">Deposit due</td>
                        <td style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #616F64; text-align: right; font-weight: 600;">£${params.depositAmount.toFixed(2)}</td>
                      </tr>
                      `
                          : ''
                      }
                    </table>
                  </td>
                </tr>
              </table>

              ${
                params.depositRequired && params.depositAmount
                  ? `
              <div style="background-color: #FFF9E6; border-left: 4px solid #FFB800; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #8B6914; line-height: 1.5;">
                  <strong>Deposit required:</strong> A deposit of £${params.depositAmount.toFixed(2)} secures your booking. Payment instructions will be sent separately.
                </p>
              </div>
              `
                  : ''
              }

              <p style="margin: 0 0 16px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                You'll receive a reminder 24 hours before your appointment.
              </p>

              <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                If you need to reschedule or have any questions, just reply to this email.
              </p>

              <p style="margin: 32px 0 0 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                Luke
              </p>

              <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #E9E9E7;">
                <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #616F64; line-height: 1.5;">
                  <strong>Luke Robert Hair</strong><br>
                  Precision hairdressing<br>
                  ${params.locationName}
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const bodyText = `
Booking Confirmed

Hi ${params.clientName},

Looking forward to seeing you. Here are your booking details:

Service: ${params.serviceName}
Date: ${dateStr}
Time: ${timeStr}
Duration: ${params.duration} minutes
Location: ${params.locationName}
${params.locationAddress}
Price: £${params.price.toFixed(2)}
${params.depositRequired && params.depositAmount ? `Deposit due: £${params.depositAmount.toFixed(2)}` : ''}

${
  params.depositRequired && params.depositAmount
    ? `A deposit of £${params.depositAmount.toFixed(2)} secures your booking. Payment instructions will be sent separately.\n\n`
    : ''
}

You'll receive a reminder 24 hours before your appointment.

If you need to reschedule or have any questions, just reply to this email.

Luke

---
Luke Robert Hair
Precision hairdressing
${params.locationName}
  `.trim();

  return sendEmail({
    to: params.clientEmail,
    toName: params.clientName,
    subject,
    bodyHtml,
    bodyText,
    emailType: 'transactional',
    templateName: 'booking_confirmation',
  });
}

/**
 * Send booking reminder (24 hours before)
 */
export async function sendBookingReminder(params: {
  clientEmail: string;
  clientName: string;
  serviceName: string;
  locationName: string;
  dateTime: Date;
}): Promise<{ success: boolean; error?: string }> {
  const dateStr = params.dateTime.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const timeStr = params.dateTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const subject = `Reminder: ${params.serviceName} tomorrow at ${timeStr}`;

  const bodyHtml = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: system-ui, -apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px;">
          <tr>
            <td>
              <h2 style="margin: 0 0 24px 0; font-size: 24px; color: #2C2C2C;">See you tomorrow</h2>
              
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #2C2C2C; line-height: 1.6;">
                Hi ${params.clientName},
              </p>

              <p style="margin: 0 0 24px 0; font-size: 16px; color: #2C2C2C; line-height: 1.6;">
                Quick reminder about your appointment tomorrow:
              </p>

              <div style="background-color: #F5F5F3; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 18px; color: #2C2C2C; font-weight: 600;">${params.serviceName}</p>
                <p style="margin: 0 0 4px 0; font-size: 16px; color: #616F64;">${dateStr}</p>
                <p style="margin: 0; font-size: 16px; color: #616F64;">${timeStr} at ${params.locationName}</p>
              </div>

              <p style="margin: 0 0 16px 0; font-size: 16px; color: #2C2C2C; line-height: 1.6;">
                If you need to reschedule, please let me know as soon as possible.
              </p>

              <p style="margin: 0; font-size: 16px; color: #2C2C2C;">
                Luke
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const bodyText = `
See you tomorrow

Hi ${params.clientName},

Quick reminder about your appointment tomorrow:

${params.serviceName}
${dateStr}
${timeStr} at ${params.locationName}

If you need to reschedule, please let me know as soon as possible.

Luke
  `.trim();

  return sendEmail({
    to: params.clientEmail,
    toName: params.clientName,
    subject,
    bodyHtml,
    bodyText,
    emailType: 'transactional',
    templateName: 'booking_reminder',
  });
}

/**
 * Send simple transactional acknowledgment email (Foundation tier)
 */
export async function sendTransactionalEmail(params: {
  leadId: string;
  templateName: string;
  to: string;
  toName: string;
}): Promise<{ success: boolean; error?: string }> {
  // Get lead data for personalization
  const { data: lead } = await db.getLead(params.leadId);
  if (!lead) {
    return { success: false, error: 'Lead not found' };
  }

  const firstName = lead.first_name;
  const customFields = (lead.custom_fields as any) || {};

  // Template selection
  let subject = '';
  let bodyHtml = '';
  let bodyText = '';

  switch (params.templateName) {
    case 'contact_acknowledgment':
      subject = "Thanks for getting in touch!";
      bodyHtml = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: system-ui, -apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px;">
          <tr>
            <td>
              <h2 style="margin: 0 0 24px 0; font-size: 24px; color: #2C2C2C;">Thanks for reaching out</h2>
              
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #2C2C2C; line-height: 1.6;">
                Hi ${firstName},
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; color: #2C2C2C; line-height: 1.6;">
                I've received your message and I'll get back to you within 24 hours.
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; color: #2C2C2C; line-height: 1.6;">
                In the meantime, feel free to explore <a href="${process.env.NEXT_PUBLIC_BASE_URL}/insights" style="color: #616F64;">my insights</a> or <a href="${process.env.NEXT_PUBLIC_BASE_URL}/book" style="color: #616F64;">book an appointment</a>.
              </p>

              <p style="margin: 0; font-size: 16px; color: #2C2C2C;">
                Luke
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;
      bodyText = `
Thanks for reaching out

Hi ${firstName},

I've received your message and I'll get back to you within 24 hours.

In the meantime, feel free to explore my insights or book an appointment at ${process.env.NEXT_PUBLIC_BASE_URL}

Luke
      `.trim();
      break;

    case 'cpd_enquiry_received':
      subject = "Your CPD Partnership Enquiry - Luke Robert Hair";
      bodyHtml = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: system-ui, -apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px;">
          <tr>
            <td>
              <h2 style="margin: 0 0 24px 0; font-size: 24px; color: #2C2C2C;">Thank you for your CPD enquiry</h2>
              
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #2C2C2C; line-height: 1.6;">
                Hi ${firstName},
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; color: #2C2C2C; line-height: 1.6;">
                Thank you for your interest in partnering with Luke Robert Hair for CPD training${customFields.institution ? ` at ${customFields.institution}` : ''}.
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; color: #2C2C2C; line-height: 1.6;">
                I'll personally review your enquiry and get back to you within 24 hours to discuss how we can create the perfect programme for your students.
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; color: #2C2C2C; line-height: 1.6;">
                We're excited about the possibility of working together!
              </p>

              <p style="margin: 0; font-size: 16px; color: #2C2C2C;">
                Best regards,<br>
                Luke
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;
      bodyText = `
Thank you for your CPD enquiry

Hi ${firstName},

Thank you for your interest in partnering with Luke Robert Hair for CPD training${customFields.institution ? ` at ${customFields.institution}` : ''}.

I'll personally review your enquiry and get back to you within 24 hours to discuss how we can create the perfect programme for your students.

We're excited about the possibility of working together!

Best regards,
Luke
      `.trim();
      break;

    case 'education_enquiry_received':
      subject = "Your Education Course Enquiry - Luke Robert Hair";
      bodyHtml = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: system-ui, -apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px;">
          <tr>
            <td>
              <h2 style="margin: 0 0 24px 0; font-size: 24px; color: #2C2C2C;">Thanks for your course enquiry</h2>
              
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #2C2C2C; line-height: 1.6;">
                Hi ${firstName},
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; color: #2C2C2C; line-height: 1.6;">
                Thank you for your interest in my professional education courses${lead.course_interest ? ` - specifically ${lead.course_interest}` : ''}.
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; color: #2C2C2C; line-height: 1.6;">
                I'll be in touch within 24 hours to discuss the course details, dates, and how we can help you achieve your goals.
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; color: #2C2C2C; line-height: 1.6;">
                Looking forward to working with you!
              </p>

              <p style="margin: 0; font-size: 16px; color: #2C2C2C;">
                Luke
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;
      bodyText = `
Thanks for your course enquiry

Hi ${firstName},

Thank you for your interest in my professional education courses${lead.course_interest ? ` - specifically ${lead.course_interest}` : ''}.

I'll be in touch within 24 hours to discuss the course details, dates, and how we can help you achieve your goals.

Looking forward to working with you!

Luke
      `.trim();
      break;

    default:
      return { success: false, error: 'Unknown template' };
  }

  // Send the email
  return sendEmail({
    to: params.to,
    toName: params.toName,
    subject,
    bodyHtml,
    bodyText,
    emailType: 'transactional',
    templateName: params.templateName,
    leadId: params.leadId,
  });
}

/**
 * Handle Resend webhook events
 */
export async function handleResendWebhook(event: any): Promise<void> {
  const { type, data } = event;

  // Find email log by Resend ID
  const resendId = data.email_id;
  if (!resendId) return;

  const { data: emailLogs } = await db.getRecentEmails(1000);
  const emailLog = emailLogs?.find(e => e.resend_id === resendId);
  
  if (!emailLog) {
    console.warn(`Email log not found for Resend ID: ${resendId}`);
    return;
  }

  // Update based on event type
  switch (type) {
    case 'email.sent':
      await db.updateEmailStatus(emailLog.id, {
        status: 'sent',
        sent_at: new Date(data.created_at).toISOString(),
      });
      break;

    case 'email.delivered':
      await db.updateEmailStatus(emailLog.id, {
        status: 'delivered',
        delivered_at: new Date(data.created_at).toISOString(),
      });
      break;

    case 'email.opened':
      await db.updateEmailStatus(emailLog.id, {
        opened_at: emailLog.opened_at || new Date(data.created_at).toISOString(),
        open_count: emailLog.open_count + 1,
      });
      
      // Log activity for lead
      if (emailLog.lead_id) {
        const { logActivityAndScore } = await import('./leadScoring');
        await logActivityAndScore(emailLog.lead_id, 'email_opened', { email_log_id: emailLog.id }, true);
      }
      break;

    case 'email.clicked':
      await db.updateEmailStatus(emailLog.id, {
        clicked_at: emailLog.clicked_at || new Date(data.created_at).toISOString(),
        click_count: emailLog.click_count + 1,
      });
      
      // Log activity for lead
      if (emailLog.lead_id) {
        const { logActivityAndScore } = await import('./leadScoring');
        await logActivityAndScore(emailLog.lead_id, 'email_clicked', { 
          email_log_id: emailLog.id,
          link: data.link 
        }, true);
      }
      break;

    case 'email.bounced':
      await db.updateEmailStatus(emailLog.id, {
        status: 'bounced',
        bounced_at: new Date(data.created_at).toISOString(),
        error_message: data.bounce_type || 'Email bounced',
      });
      break;

    case 'email.delivery_delayed':
    case 'email.failed':
      await db.updateEmailStatus(emailLog.id, {
        status: 'failed',
        error_message: data.error || 'Email failed to send',
      });
      break;
  }
}

/**
 * Send referral salon confirmation email
 */
export async function sendReferralConfirmation(params: {
  clientEmail: string;
  clientName: string;
  salonName: string;
  salonCity: string;
  salonAddress: string;
  salonPhone: string;
  serviceInterest?: string;
  preferredDate?: string;
  leadId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const subject = `Connecting you to ${params.salonName}!`;

  const bodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAF8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAFAF8;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 24px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; color: #2C2C2C; font-weight: 400;">You're all set!</h1>
              
              <p style="margin: 0 0 24px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                Hi ${params.clientName},
              </p>

              <p style="margin: 0 0 24px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                Thank you for choosing to book with Luke at <strong>${params.salonName}</strong>!
              </p>

              <p style="margin: 0 0 32px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                We've saved your details and you should have been redirected to complete your booking on their system. If you weren't automatically redirected, you can visit them directly.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5F3; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 16px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 20px; color: #2C2C2C; font-weight: 600;">${params.salonName}</h2>
                    <p style="margin: 0 0 8px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #616F64;">
                      📍 ${params.salonAddress}
                    </p>
                    <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #616F64;">
                      ☎️ ${params.salonPhone}
                    </p>
                    ${
                      params.serviceInterest
                        ? `
                    <p style="margin: 16px 0 0 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #2C2C2C;">
                      <strong>Service:</strong> ${params.serviceInterest}
                    </p>
                    `
                        : ''
                    }
                    ${
                      params.preferredDate
                        ? `
                    <p style="margin: 8px 0 0 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #2C2C2C;">
                      <strong>Preferred Date:</strong> ${new Date(params.preferredDate).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    `
                        : ''
                    }
                  </td>
                </tr>
              </table>

              <div style="background-color: #EEF2FF; border-left: 4px solid: #6366F1; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #4338CA; line-height: 1.5;">
                  <strong>Next step:</strong> Complete your booking on ${params.salonName}'s system. If you need any help, call them directly or reply to this email.
                </p>
              </div>

              <p style="margin: 0 0 16px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                We hope you have a great appointment at ${params.salonName}!
              </p>

              <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                If you have any questions, feel free to reply to this email.
              </p>

              <p style="margin: 32px 0 0 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                Best,<br>
                Luke
              </p>

              <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #E9E9E7;">
                <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #616F64; line-height: 1.5;">
                  <strong>Luke Robert Hair</strong><br>
                  Precision hairdressing & professional education
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const bodyText = `
You're all set!

Hi ${params.clientName},

Thank you for choosing to book with Luke at ${params.salonName}!

We've saved your details and you should have been redirected to complete your booking on their system.

${params.salonName}
${params.salonAddress}
☎️ ${params.salonPhone}

${params.serviceInterest ? `Service: ${params.serviceInterest}` : ''}
${params.preferredDate ? `Preferred Date: ${new Date(params.preferredDate).toLocaleDateString('en-GB')}` : ''}

Next step: Complete your booking on ${params.salonName}'s system. If you need any help, call them directly or reply to this email.

We hope you have a great appointment at ${params.salonName}!

If you have any questions, feel free to reply to this email.

Best,
Luke

---
Luke Robert Hair
Precision hairdressing & professional education
  `.trim();

  return sendEmail({
    to: params.clientEmail,
    toName: params.clientName,
    subject,
    bodyHtml,
    bodyText,
    emailType: 'transactional',
    templateName: 'salon_referral_confirmation',
    leadId: params.leadId,
  });
}


