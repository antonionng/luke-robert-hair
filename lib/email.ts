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
// Domain: lukeroberthair.com (verified with Resend)
const FROM_EMAIL = process.env.FROM_EMAIL || 'Luke Robert Hair <hello@lukeroberthair.com>';
const REPLY_TO = process.env.REPLY_TO_EMAIL || 'hello@lukeroberthair.com';

// Admin notification configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@lukeroberthair.com'; // Luke's email for notifications
const ADMIN_NOTIFICATIONS_ENABLED = process.env.ADMIN_NOTIFICATION_ENABLED !== 'false'; // Default true

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

/**
 * Send admin notification for high-priority events
 * Luke gets immediate alerts for: bookings, CPD enquiries, salon referrals
 */
export async function sendAdminNotification(
  eventType: 'new_booking' | 'cpd_enquiry' | 'education_enquiry' | 'salon_referral' | 'ai_chat_lead',
  data: any
): Promise<{ success: boolean; error?: string }> {
  if (!ADMIN_NOTIFICATIONS_ENABLED) {
    console.log('Admin notifications disabled');
    return { success: false, error: 'Admin notifications disabled' };
  }

  let subject = '';
  let bodyHtml = '';
  let bodyText = '';

  switch (eventType) {
    case 'new_booking':
      subject = `[NEW BOOKING] ${data.clientName} - ${data.serviceName}`;
      bodyHtml = generateBookingAdminEmail(data);
      bodyText = generateBookingAdminEmailText(data);
      break;

    case 'cpd_enquiry':
      subject = `[CPD ENQUIRY] ${data.institution || 'New Institution'} - ${data.contactName}`;
      bodyHtml = generateCPDAdminEmail(data);
      bodyText = generateCPDAdminEmailText(data);
      break;

    case 'education_enquiry':
      subject = `[EDUCATION ENQUIRY] ${data.contactName} - ${data.courseInterest || 'General'}`;
      bodyHtml = generateEducationAdminEmail(data);
      bodyText = generateEducationAdminEmailText(data);
      break;

    case 'salon_referral':
      subject = `[SALON REFERRAL] ${data.salonName} - ${data.contactName}`;
      bodyHtml = generateReferralAdminEmail(data);
      bodyText = generateReferralAdminEmailText(data);
      break;

    case 'ai_chat_lead':
      subject = `[AI CHAT LEAD] CPD Partnership - ${data.contactName}`;
      bodyHtml = generateAIChatAdminEmail(data);
      bodyText = generateAIChatAdminEmailText(data);
      break;

    default:
      return { success: false, error: 'Unknown event type' };
  }

  try {
    return await sendEmail({
      to: ADMIN_EMAIL,
      toName: 'Luke',
      subject,
      bodyHtml,
      bodyText,
      emailType: 'transactional',
      templateName: `admin_${eventType}`,
    });
  } catch (error: any) {
    console.error('Admin notification error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// ADMIN EMAIL TEMPLATES - HTML
// ============================================================================

function generateBookingAdminEmail(data: any): string {
  const { clientName, clientEmail, clientPhone, serviceName, locationName, dateTime, price, depositRequired, depositAmount, notes, bookingId } = data;
  const dateStr = dateTime.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = dateTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: system-ui, -apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px;">
          <tr>
            <td>
              <div style="background-color: #4CAF50; color: white; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <h2 style="margin: 0; font-size: 24px;">🎉 NEW BOOKING</h2>
              </div>
              
              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Client Details</h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600; width: 140px;">Name:</td>
                  <td style="font-size: 14px; color: #2C2C2C;"><strong>${clientName}</strong></td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Email:</td>
                  <td style="font-size: 14px; color: #2C2C2C;"><a href="mailto:${clientEmail}">${clientEmail}</a></td>
                </tr>
                ${clientPhone ? `
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Phone:</td>
                  <td style="font-size: 14px; color: #2C2C2C;"><a href="tel:${clientPhone}">${clientPhone}</a></td>
                </tr>
                ` : ''}
              </table>

              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Booking Details</h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 24px; background-color: #F5F5F3; border-radius: 8px; padding: 16px;">
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600; width: 140px;">Service:</td>
                  <td style="font-size: 16px; color: #2C2C2C; font-weight: 600;">${serviceName}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Location:</td>
                  <td style="font-size: 14px; color: #2C2C2C;">${locationName}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Date:</td>
                  <td style="font-size: 14px; color: #2C2C2C;">${dateStr}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Time:</td>
                  <td style="font-size: 14px; color: #2C2C2C; font-weight: 600;">${timeStr}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Price:</td>
                  <td style="font-size: 16px; color: #2C2C2C; font-weight: 600;">£${price?.toFixed(2) || 'TBC'}</td>
                </tr>
                ${depositRequired ? `
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Deposit:</td>
                  <td style="font-size: 14px; color: #FF6B6B;">£${depositAmount?.toFixed(2) || 'TBC'}</td>
                </tr>
                ` : ''}
              </table>

              ${notes ? `
              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Notes</h3>
              <div style="background-color: #FFF9E6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #2C2C2C;">${notes}</p>
              </div>
              ` : ''}

              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #E9E9E7;">
                <p style="margin: 0; font-size: 12px; color: #999;">
                  Booking ID: ${bookingId || 'N/A'}<br>
                  View in admin: ${process.env.NEXT_PUBLIC_BASE_URL}/admin
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
}

function generateCPDAdminEmail(data: any): string {
  const { contactName, email, phone, institution, jobTitle, studentNumbers, deliveryPreference, courseInterest, message, leadId } = data;

  return `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: system-ui, -apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px;">
          <tr>
            <td>
              <div style="background-color: #6366F1; color: white; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <h2 style="margin: 0; font-size: 24px;">🏫 CPD PARTNERSHIP ENQUIRY</h2>
              </div>
              
              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Institution</h3>
              <div style="background-color: #F5F5F3; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 18px; color: #2C2C2C; font-weight: 600;">${institution || 'Not specified'}</p>
                ${studentNumbers ? `<p style="margin: 0; font-size: 14px; color: #616F64;">Student Numbers: ${studentNumbers}</p>` : ''}
              </div>

              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Contact Details</h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600; width: 140px;">Name:</td>
                  <td style="font-size: 14px; color: #2C2C2C;"><strong>${contactName}</strong></td>
                </tr>
                ${jobTitle ? `
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Job Title:</td>
                  <td style="font-size: 14px; color: #2C2C2C;">${jobTitle}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Email:</td>
                  <td style="font-size: 14px; color: #2C2C2C;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Phone:</td>
                  <td style="font-size: 14px; color: #2C2C2C;"><a href="tel:${phone}">${phone}</a></td>
                </tr>
                ` : ''}
              </table>

              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Enquiry Details</h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 24px; background-color: #EEF2FF; border-radius: 8px; padding: 16px;">
                ${deliveryPreference ? `
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600; width: 140px;">Delivery:</td>
                  <td style="font-size: 14px; color: #2C2C2C;">${deliveryPreference}</td>
                </tr>
                ` : ''}
                ${courseInterest ? `
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Interest:</td>
                  <td style="font-size: 14px; color: #2C2C2C;">${courseInterest}</td>
                </tr>
                ` : ''}
              </table>

              ${message ? `
              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Message</h3>
              <div style="background-color: #FFF9E6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #2C2C2C; white-space: pre-wrap;">${message}</p>
              </div>
              ` : ''}

              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #E9E9E7;">
                <p style="margin: 0; font-size: 12px; color: #999;">
                  Lead ID: ${leadId || 'N/A'}<br>
                  View in admin: ${process.env.NEXT_PUBLIC_BASE_URL}/admin
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
}

function generateEducationAdminEmail(data: any): string {
  const { contactName, email, phone, courseInterest, message, leadId } = data;

  return `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: system-ui, -apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px;">
          <tr>
            <td>
              <div style="background-color: #10B981; color: white; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <h2 style="margin: 0; font-size: 24px;">🎓 EDUCATION ENQUIRY</h2>
              </div>
              
              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Contact Details</h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600; width: 140px;">Name:</td>
                  <td style="font-size: 14px; color: #2C2C2C;"><strong>${contactName}</strong></td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Email:</td>
                  <td style="font-size: 14px; color: #2C2C2C;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Phone:</td>
                  <td style="font-size: 14px; color: #2C2C2C;"><a href="tel:${phone}">${phone}</a></td>
                </tr>
                ` : ''}
              </table>

              ${courseInterest ? `
              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Course Interest</h3>
              <div style="background-color: #F5F5F3; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 16px; color: #2C2C2C; font-weight: 600;">${courseInterest}</p>
              </div>
              ` : ''}

              ${message ? `
              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Message</h3>
              <div style="background-color: #FFF9E6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #2C2C2C; white-space: pre-wrap;">${message}</p>
              </div>
              ` : ''}

              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #E9E9E7;">
                <p style="margin: 0; font-size: 12px; color: #999;">
                  Lead ID: ${leadId || 'N/A'}<br>
                  View in admin: ${process.env.NEXT_PUBLIC_BASE_URL}/admin
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
}

function generateReferralAdminEmail(data: any): string {
  const { contactName, email, phone, salonName, salonCity, serviceInterest, preferredDate, leadId } = data;

  return `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: system-ui, -apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px;">
          <tr>
            <td>
              <div style="background-color: #F59E0B; color: white; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <h2 style="margin: 0; font-size: 24px;">🏪 SALON REFERRAL</h2>
              </div>
              
              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Referred To</h3>
              <div style="background-color: #F5F5F3; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 18px; color: #2C2C2C; font-weight: 600;">${salonName}</p>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #616F64;">${salonCity}</p>
              </div>

              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Client Details</h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600; width: 140px;">Name:</td>
                  <td style="font-size: 14px; color: #2C2C2C;"><strong>${contactName}</strong></td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Email:</td>
                  <td style="font-size: 14px; color: #2C2C2C;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Phone:</td>
                  <td style="font-size: 14px; color: #2C2C2C;"><a href="tel:${phone}">${phone}</a></td>
                </tr>
                ` : ''}
                ${serviceInterest ? `
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Service:</td>
                  <td style="font-size: 14px; color: #2C2C2C;">${serviceInterest}</td>
                </tr>
                ` : ''}
                ${preferredDate ? `
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Preferred Date:</td>
                  <td style="font-size: 14px; color: #2C2C2C;">${new Date(preferredDate).toLocaleDateString('en-GB')}</td>
                </tr>
                ` : ''}
              </table>

              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #E9E9E7;">
                <p style="margin: 0; font-size: 12px; color: #999;">
                  Lead ID: ${leadId || 'N/A'}<br>
                  View in admin: ${process.env.NEXT_PUBLIC_BASE_URL}/admin
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
}

function generateAIChatAdminEmail(data: any): string {
  const { contactName, email, phone, institution, conversationSummary, extractedInfo, leadId } = data;

  return `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #FAFAF8; font-family: system-ui, -apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px;">
          <tr>
            <td>
              <div style="background-color: #8B5CF6; color: white; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <h2 style="margin: 0; font-size: 24px;">🤖 AI CHAT LEAD - CPD</h2>
              </div>
              
              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Institution</h3>
              <div style="background-color: #F5F5F3; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 18px; color: #2C2C2C; font-weight: 600;">${institution || extractedInfo?.institution || 'Not specified'}</p>
              </div>

              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Contact Details</h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600; width: 140px;">Name:</td>
                  <td style="font-size: 14px; color: #2C2C2C;"><strong>${contactName}</strong></td>
                </tr>
                ${extractedInfo?.jobTitle ? `
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Job Title:</td>
                  <td style="font-size: 14px; color: #2C2C2C;">${extractedInfo.jobTitle}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Email:</td>
                  <td style="font-size: 14px; color: #2C2C2C;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Phone:</td>
                  <td style="font-size: 14px; color: #2C2C2C;"><a href="tel:${phone}">${phone}</a></td>
                </tr>
                ` : ''}
              </table>

              ${conversationSummary ? `
              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Conversation Summary</h3>
              <div style="background-color: #EDE9FE; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #2C2C2C; white-space: pre-wrap;">${conversationSummary}</p>
              </div>
              ` : ''}

              ${extractedInfo ? `
              <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #2C2C2C;">Extracted Information</h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 24px; background-color: #F5F5F3; border-radius: 8px; padding: 16px;">
                ${extractedInfo.courseInterest ? `
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600; width: 140px;">Interest:</td>
                  <td style="font-size: 14px; color: #2C2C2C;">${extractedInfo.courseInterest}</td>
                </tr>
                ` : ''}
                ${extractedInfo.studentNumbers ? `
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Students:</td>
                  <td style="font-size: 14px; color: #2C2C2C;">${extractedInfo.studentNumbers}</td>
                </tr>
                ` : ''}
                ${extractedInfo.deliveryPreference ? `
                <tr>
                  <td style="font-size: 14px; color: #616F64; font-weight: 600;">Delivery:</td>
                  <td style="font-size: 14px; color: #2C2C2C;">${extractedInfo.deliveryPreference}</td>
                </tr>
                ` : ''}
              </table>
              ` : ''}

              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #E9E9E7;">
                <p style="margin: 0; font-size: 12px; color: #999;">
                  Lead ID: ${leadId || 'N/A'}<br>
                  Source: AI Chat Assistant<br>
                  View in admin: ${process.env.NEXT_PUBLIC_BASE_URL}/admin
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
}

// ============================================================================
// ADMIN EMAIL TEMPLATES - PLAIN TEXT
// ============================================================================

function generateBookingAdminEmailText(data: any): string {
  const { clientName, clientEmail, clientPhone, serviceName, locationName, dateTime, price, depositRequired, depositAmount, notes, bookingId } = data;
  const dateStr = dateTime.toLocaleDateString('en-GB');
  const timeStr = dateTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return `
🎉 NEW BOOKING

CLIENT DETAILS
Name: ${clientName}
Email: ${clientEmail}
${clientPhone ? `Phone: ${clientPhone}` : ''}

BOOKING DETAILS
Service: ${serviceName}
Location: ${locationName}
Date: ${dateStr}
Time: ${timeStr}
Price: £${price?.toFixed(2) || 'TBC'}
${depositRequired ? `Deposit: £${depositAmount?.toFixed(2) || 'TBC'}` : ''}

${notes ? `NOTES\n${notes}\n` : ''}
---
Booking ID: ${bookingId || 'N/A'}
View in admin: ${process.env.NEXT_PUBLIC_BASE_URL}/admin
  `.trim();
}

function generateCPDAdminEmailText(data: any): string {
  const { contactName, email, phone, institution, jobTitle, studentNumbers, deliveryPreference, courseInterest, message, leadId } = data;

  return `
🏫 CPD PARTNERSHIP ENQUIRY

INSTITUTION
${institution || 'Not specified'}
${studentNumbers ? `Student Numbers: ${studentNumbers}` : ''}

CONTACT DETAILS
Name: ${contactName}
${jobTitle ? `Job Title: ${jobTitle}` : ''}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

ENQUIRY DETAILS
${deliveryPreference ? `Delivery: ${deliveryPreference}` : ''}
${courseInterest ? `Interest: ${courseInterest}` : ''}

${message ? `MESSAGE\n${message}\n` : ''}
---
Lead ID: ${leadId || 'N/A'}
View in admin: ${process.env.NEXT_PUBLIC_BASE_URL}/admin
  `.trim();
}

function generateEducationAdminEmailText(data: any): string {
  const { contactName, email, phone, courseInterest, message, leadId } = data;

  return `
🎓 EDUCATION ENQUIRY

CONTACT DETAILS
Name: ${contactName}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

${courseInterest ? `COURSE INTEREST\n${courseInterest}\n` : ''}
${message ? `MESSAGE\n${message}\n` : ''}
---
Lead ID: ${leadId || 'N/A'}
View in admin: ${process.env.NEXT_PUBLIC_BASE_URL}/admin
  `.trim();
}

function generateReferralAdminEmailText(data: any): string {
  const { contactName, email, phone, salonName, salonCity, serviceInterest, preferredDate, leadId } = data;

  return `
🏪 SALON REFERRAL

REFERRED TO
${salonName} - ${salonCity}

CLIENT DETAILS
Name: ${contactName}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${serviceInterest ? `Service: ${serviceInterest}` : ''}
${preferredDate ? `Preferred Date: ${new Date(preferredDate).toLocaleDateString('en-GB')}` : ''}

---
Lead ID: ${leadId || 'N/A'}
View in admin: ${process.env.NEXT_PUBLIC_BASE_URL}/admin
  `.trim();
}

function generateAIChatAdminEmailText(data: any): string {
  const { contactName, email, phone, institution, conversationSummary, extractedInfo, leadId } = data;

  return `
🤖 AI CHAT LEAD - CPD

INSTITUTION
${institution || extractedInfo?.institution || 'Not specified'}

CONTACT DETAILS
Name: ${contactName}
${extractedInfo?.jobTitle ? `Job Title: ${extractedInfo.jobTitle}` : ''}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

${conversationSummary ? `CONVERSATION SUMMARY\n${conversationSummary}\n` : ''}

${extractedInfo ? `EXTRACTED INFORMATION
${extractedInfo.courseInterest ? `Interest: ${extractedInfo.courseInterest}` : ''}
${extractedInfo.studentNumbers ? `Students: ${extractedInfo.studentNumbers}` : ''}
${extractedInfo.deliveryPreference ? `Delivery: ${extractedInfo.deliveryPreference}` : ''}
` : ''}
---
Lead ID: ${leadId || 'N/A'}
Source: AI Chat Assistant
View in admin: ${process.env.NEXT_PUBLIC_BASE_URL}/admin
  `.trim();
}

/**
 * Send daily digest email to admin
 * Lower priority events: contact forms, education enquiries, general activities
 */
export async function sendAdminDailyDigest(params: {
  contactForms: any[];
  educationEnquiries: any[];
  activities: any[];
}): Promise<{ success: boolean; error?: string }> {
  if (!ADMIN_NOTIFICATIONS_ENABLED) {
    console.log('Admin notifications disabled');
    return { success: false, error: 'Admin notifications disabled' };
  }

  const { contactForms, educationEnquiries, activities } = params;
  const totalItems = contactForms.length + educationEnquiries.length + activities.length;

  // Don't send if nothing to report
  if (totalItems === 0) {
    console.log('No items for daily digest');
    return { success: true };
  }

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `Daily Activity Summary - ${today} (${totalItems} items)`;

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
              <div style="background-color: #3B82F6; color: white; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <h2 style="margin: 0; font-size: 24px;">📊 Daily Activity Summary</h2>
                <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">${today}</p>
              </div>

              <div style="background-color: #F5F5F3; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="font-size: 14px; color: #616F64; font-weight: 600;">Contact Forms:</td>
                    <td style="font-size: 16px; color: #2C2C2C; font-weight: 600; text-align: right;">${contactForms.length}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; color: #616F64; font-weight: 600;">Education Enquiries:</td>
                    <td style="font-size: 16px; color: #2C2C2C; font-weight: 600; text-align: right;">${educationEnquiries.length}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; color: #616F64; font-weight: 600;">Other Activities:</td>
                    <td style="font-size: 16px; color: #2C2C2C; font-weight: 600; text-align: right;">${activities.length}</td>
                  </tr>
                  <tr style="border-top: 2px solid #E9E9E7;">
                    <td style="font-size: 16px; color: #2C2C2C; font-weight: 600; padding-top: 12px;">Total:</td>
                    <td style="font-size: 18px; color: #3B82F6; font-weight: 600; text-align: right; padding-top: 12px;">${totalItems}</td>
                  </tr>
                </table>
              </div>

              ${contactForms.length > 0 ? `
              <h3 style="margin: 24px 0 16px 0; font-size: 20px; color: #2C2C2C;">📝 Contact Form Submissions</h3>
              ${contactForms.map((form, index) => `
                <div style="background-color: #F9FAFB; padding: 16px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #3B82F6;">
                  <p style="margin: 0 0 8px 0; font-size: 16px; color: #2C2C2C; font-weight: 600;">${form.first_name} ${form.last_name}</p>
                  <p style="margin: 0 0 4px 0; font-size: 14px; color: #616F64;"><a href="mailto:${form.email}">${form.email}</a></p>
                  ${form.phone ? `<p style="margin: 0 0 4px 0; font-size: 14px; color: #616F64;">${form.phone}</p>` : ''}
                  <p style="margin: 8px 0 0 0; font-size: 12px; color: #999;">
                    Source: ${form.source || 'contact_form'} | 
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin" style="color: #3B82F6;">View Lead</a>
                  </p>
                </div>
              `).join('')}
              ` : ''}

              ${educationEnquiries.length > 0 ? `
              <h3 style="margin: 24px 0 16px 0; font-size: 20px; color: #2C2C2C;">🎓 Education Enquiries</h3>
              ${educationEnquiries.map((enquiry) => `
                <div style="background-color: #F0FDF4; padding: 16px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #10B981;">
                  <p style="margin: 0 0 8px 0; font-size: 16px; color: #2C2C2C; font-weight: 600;">${enquiry.first_name} ${enquiry.last_name}</p>
                  <p style="margin: 0 0 4px 0; font-size: 14px; color: #616F64;"><a href="mailto:${enquiry.email}">${enquiry.email}</a></p>
                  ${enquiry.course_interest ? `<p style="margin: 0 0 4px 0; font-size: 14px; color: #10B981; font-weight: 600;">Interest: ${enquiry.course_interest}</p>` : ''}
                  <p style="margin: 8px 0 0 0; font-size: 12px; color: #999;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin" style="color: #10B981;">View Lead</a>
                  </p>
                </div>
              `).join('')}
              ` : ''}

              ${activities.length > 0 ? `
              <h3 style="margin: 24px 0 16px 0; font-size: 20px; color: #2C2C2C;">📌 Other Activities</h3>
              <ul style="margin: 0; padding-left: 20px;">
                ${activities.map(activity => `
                  <li style="margin-bottom: 8px; font-size: 14px; color: #616F64;">${activity.activity_type}: ${activity.lead?.first_name || 'Unknown'} ${activity.lead?.last_name || ''}</li>
                `).join('')}
              </ul>
              ` : ''}

              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #E9E9E7; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin" style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Admin Dashboard</a>
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
📊 DAILY ACTIVITY SUMMARY - ${today}

SUMMARY
Contact Forms: ${contactForms.length}
Education Enquiries: ${educationEnquiries.length}
Other Activities: ${activities.length}
Total: ${totalItems}

${contactForms.length > 0 ? `
📝 CONTACT FORM SUBMISSIONS
${contactForms.map(form => `
- ${form.first_name} ${form.last_name} (${form.email})
  ${form.phone ? `Phone: ${form.phone}` : ''}
  Source: ${form.source || 'contact_form'}
`).join('\n')}
` : ''}

${educationEnquiries.length > 0 ? `
🎓 EDUCATION ENQUIRIES
${educationEnquiries.map(enquiry => `
- ${enquiry.first_name} ${enquiry.last_name} (${enquiry.email})
  ${enquiry.course_interest ? `Interest: ${enquiry.course_interest}` : ''}
`).join('\n')}
` : ''}

${activities.length > 0 ? `
📌 OTHER ACTIVITIES
${activities.map(activity => `- ${activity.activity_type}: ${activity.lead?.first_name || 'Unknown'} ${activity.lead?.last_name || ''}`).join('\n')}
` : ''}

---
View full details: ${process.env.NEXT_PUBLIC_BASE_URL}/admin
  `.trim();

  try {
    return await sendEmail({
      to: ADMIN_EMAIL,
      toName: 'Luke',
      subject,
      bodyHtml,
      bodyText,
      emailType: 'transactional',
      templateName: 'admin_daily_digest',
    });
  } catch (error: any) {
    console.error('Daily digest error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// REFERRAL SYSTEM EMAILS
// ============================================================================

/**
 * Send referral code generation email
 * Sent when someone generates their unique referral code
 */
export async function sendReferralCodeEmail(params: {
  email: string;
  name: string;
  code: string;
  shareUrl: string;
  shareText: string;
}): Promise<{ success: boolean; error?: string }> {
  const subject = `Share the Love - Your Referral Code is Ready! 💜`;

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
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Purple/Pink Gradient Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #9333EA 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0 0 16px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 32px; color: #ffffff; font-weight: 400;">
                Your Referral Code is Ready! 🎉
              </h1>
              <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; color: rgba(255,255,255,0.95);">
                Share the experience of precision haircuts with your friends
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                Hi ${params.name},
              </p>

              <p style="margin: 0 0 32px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                Thank you for joining the referral program! When your friends use your code, <strong>you both get £10 off</strong> your next appointment. It's our way of saying thank you for spreading the word.
              </p>

              <!-- Referral Code Display -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%); border: 2px solid #E9D5FF; border-radius: 12px; padding: 32px; margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 12px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #7C3AED; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                      Your Referral Code
                    </p>
                    <p style="margin: 0 0 16px 0; font-family: 'Courier New', monospace; font-size: 36px; color: #A855F7; font-weight: bold; letter-spacing: 2px;">
                      ${params.code}
                    </p>
                    <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #9333EA;">
                      Share this code with up to 10 friends
                    </p>
                  </td>
                </tr>
              </table>

              <!-- How it Works -->
              <div style="background-color: #F5F5F3; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                <h3 style="margin: 0 0 16px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 18px; color: #2C2C2C; font-weight: 600;">
                  How It Works
                </h3>
                <ol style="margin: 0; padding-left: 20px; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; line-height: 1.8; color: #2C2C2C;">
                  <li><strong>Share your code</strong> with friends who'd love a precision haircut</li>
                  <li>They <strong>use your code</strong> when booking their first appointment</li>
                  <li><strong>You both get £10 off</strong> - it's a win-win!</li>
                </ol>
              </div>

              <!-- Pre-written Share Message -->
              <div style="background-color: #F9FAFB; border-left: 4px solid #EC4899; border-radius: 4px; padding: 16px; margin-bottom: 32px;">
                <p style="margin: 0 0 8px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 12px; color: #6B7280; font-weight: 600; text-transform: uppercase;">
                  Copy & Share This Message
                </p>
                <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; line-height: 1.6; color: #374151; font-style: italic;">
                  "${params.shareText}"
                </p>
              </div>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${params.shareUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #9333EA 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);">
                      View Referral Link
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Stats Preview -->
              <p style="margin: 0 0 16px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; line-height: 1.6; color: #616F64; text-align: center;">
                Track your referrals and see your rewards at<br>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/referrals?code=${params.code}" style="color: #A855F7; text-decoration: none; font-weight: 600;">lukerobert.co.uk/referrals</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F5F5F3; padding: 24px; text-align: center; border-top: 1px solid #E9E9E7;">
              <p style="margin: 0 0 8px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 12px; color: #616F64;">
                Questions? Reply to this email or visit <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact" style="color: #687B69; text-decoration: none;">lukerobert.co.uk/contact</a>
              </p>
              <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 12px; color: #9CA3AF;">
                Luke Robert Hair - Precision Haircuts<br>
                Cheshire & Berkshire
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
Your Referral Code is Ready! 🎉

Hi ${params.name},

Thank you for joining the referral program! When your friends use your code, you both get £10 off your next appointment.

YOUR REFERRAL CODE: ${params.code}

Share this code with up to 10 friends!

HOW IT WORKS:
1. Share your code with friends who'd love a precision haircut
2. They use your code when booking their first appointment
3. You both get £10 off - it's a win-win!

SHARE THIS MESSAGE:
"${params.shareText}"

View your referral link: ${params.shareUrl}

Track your referrals: ${process.env.NEXT_PUBLIC_BASE_URL}/referrals?code=${params.code}

Questions? Visit ${process.env.NEXT_PUBLIC_BASE_URL}/contact
  `.trim();

  try {
    const result = await sendEmail({
      to: params.email,
      subject,
      bodyHtml,
      bodyText,
      emailType: 'transactional',
      templateName: 'referral_code_generated',
    });

    return result;
  } catch (error: any) {
    console.error('Referral code email error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send successful referral notification to referrer
 * Sent when someone uses their referral code and completes booking
 */
export async function sendReferralSuccessEmail(params: {
  referrerEmail: string;
  referrerName: string;
  refereeName: string;
  creditAmount: number;
}): Promise<{ success: boolean; error?: string }> {
  const subject = `Good News! ${params.refereeName} Used Your Code 🎉`;

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
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Success Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #A855F7 0%, #EC4899 100%); padding: 40px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
              <h1 style="margin: 0 0 16px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 32px; color: #ffffff; font-weight: 400;">
                You Earned a Referral Reward!
              </h1>
              <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; color: rgba(255,255,255,0.95);">
                ${params.refereeName} just booked using your code
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                Hi ${params.referrerName},
              </p>

              <p style="margin: 0 0 32px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                Great news! <strong>${params.refereeName}</strong> just completed their booking using your referral code. Thanks for sharing the love!
              </p>

              <!-- Credit Amount -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%); border: 2px solid #E9D5FF; border-radius: 12px; padding: 32px; margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #7C3AED; font-weight: 600; text-transform: uppercase;">
                      Your Reward
                    </p>
                    <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 42px; color: #A855F7; font-weight: bold;">
                      £${params.creditAmount.toFixed(2)}
                    </p>
                    <p style="margin: 8px 0 0 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #9333EA;">
                      Credit towards your next appointment
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 32px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                Your credit will be automatically applied to your next booking. Keep sharing your code to earn more rewards!
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/book" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #9333EA 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);">
                      Book Your Next Appointment
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F5F5F3; padding: 24px; text-align: center; border-top: 1px solid #E9E9E7;">
              <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 12px; color: #9CA3AF;">
                Luke Robert Hair - Precision Haircuts
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
Good News! ${params.refereeName} Used Your Code 🎉

Hi ${params.referrerName},

Great news! ${params.refereeName} just completed their booking using your referral code. Thanks for sharing the love!

YOUR REWARD: £${params.creditAmount.toFixed(2)}

Your credit will be automatically applied to your next booking. Keep sharing your code to earn more rewards!

Book your next appointment: ${process.env.NEXT_PUBLIC_BASE_URL}/book
  `.trim();

  try {
    const result = await sendEmail({
      to: params.referrerEmail,
      subject,
      bodyHtml,
      bodyText,
      emailType: 'transactional',
      templateName: 'referral_success',
    });

    return result;
  } catch (error: any) {
    console.error('Referral success email error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email to referee (person using referral code)
 * Sent when they apply a referral code
 */
export async function sendReferralWelcomeEmail(params: {
  email: string;
  name: string;
  code: string;
  discountAmount: number;
  referrerName: string;
}): Promise<{ success: boolean; error?: string }> {
  const subject = `Welcome! Your £${params.discountAmount.toFixed(0)} Discount is Ready`;

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
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Welcome Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #A855F7 0%, #EC4899 100%); padding: 40px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 16px;">💜</div>
              <h1 style="margin: 0 0 16px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 32px; color: #ffffff; font-weight: 400;">
                Welcome to Luke Robert Hair!
              </h1>
              <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; color: rgba(255,255,255,0.95);">
                Your referral discount has been applied
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                Hi ${params.name},
              </p>

              <p style="margin: 0 0 32px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.6; color: #2C2C2C;">
                Thanks to <strong>${params.referrerName}</strong>, you're about to experience precision haircuts that last. And the best part? You've got a special discount waiting for you!
              </p>

              <!-- Discount Display -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%); border: 2px solid #E9D5FF; border-radius: 12px; padding: 32px; margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #7C3AED; font-weight: 600; text-transform: uppercase;">
                      Your Discount
                    </p>
                    <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 42px; color: #A855F7; font-weight: bold;">
                      £${params.discountAmount.toFixed(2)} OFF
                    </p>
                    <p style="margin: 8px 0 0 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #9333EA;">
                      Applied to your booking with code <strong>${params.code}</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- What to Expect -->
              <div style="background-color: #F5F5F3; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                <h3 style="margin: 0 0 16px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 18px; color: #2C2C2C; font-weight: 600;">
                  What to Expect
                </h3>
                <ul style="margin: 0; padding-left: 20px; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; line-height: 1.8; color: #2C2C2C;">
                  <li>A detailed consultation about your hair and lifestyle</li>
                  <li>Precision cutting techniques that create lasting shape</li>
                  <li>Styling guidance so you can recreate the look at home</li>
                  <li>A haircut that looks great today and 8 weeks from now</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/book?ref=${params.code}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #9333EA 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);">
                      Complete Your Booking
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; line-height: 1.6; color: #616F64; text-align: center;">
                After your first visit, you'll get your own referral code to share!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F5F5F3; padding: 24px; text-align: center; border-top: 1px solid #E9E9E7;">
              <p style="margin: 0 0 8px 0; font-family: system-ui, -apple-system, sans-serif; font-size: 12px; color: #616F64;">
                Questions? Visit <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact" style="color: #687B69; text-decoration: none;">lukerobert.co.uk/contact</a>
              </p>
              <p style="margin: 0; font-family: system-ui, -apple-system, sans-serif; font-size: 12px; color: #9CA3AF;">
                Luke Robert Hair - Precision Haircuts
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
Welcome to Luke Robert Hair!

Hi ${params.name},

Thanks to ${params.referrerName}, you're about to experience precision haircuts that last. And the best part? You've got a special discount waiting for you!

YOUR DISCOUNT: £${params.discountAmount.toFixed(2)} OFF
Applied with code: ${params.code}

WHAT TO EXPECT:
- A detailed consultation about your hair and lifestyle
- Precision cutting techniques that create lasting shape
- Styling guidance so you can recreate the look at home
- A haircut that looks great today and 8 weeks from now

Complete your booking: ${process.env.NEXT_PUBLIC_BASE_URL}/book?ref=${params.code}

After your first visit, you'll get your own referral code to share!

Questions? Visit ${process.env.NEXT_PUBLIC_BASE_URL}/contact
  `.trim();

  try {
    const result = await sendEmail({
      to: params.email,
      subject,
      bodyHtml,
      bodyText,
      emailType: 'transactional',
      templateName: 'referral_welcome',
    });

    return result;
  } catch (error: any) {
    console.error('Referral welcome email error:', error);
    return { success: false, error: error.message };
  }
}


