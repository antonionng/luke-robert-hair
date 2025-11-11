'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="pt-20">
      <section className="section-padding bg-sage-pale/30">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-5xl font-playfair">Privacy Policy</h1>
            <p className="text-xl text-graphite/70">
              Last updated: November 11, 2025
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl prose prose-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8 text-graphite/80"
          >
            <div>
              <h2 className="text-2xl font-playfair text-graphite">1. Introduction</h2>
              <p>
                Luke Robert Hair ("we," "our," or "us") is committed to protecting your privacy and personal data. 
                This Privacy Policy explains how we collect, use, store, and protect your personal information when you 
                use our website, salon services, educational courses, AI assistant, and booking systems.
              </p>
              <p>
                We are based in the United Kingdom and comply with the UK General Data Protection Regulation (UK GDPR) 
                and the Data Protection Act 2018.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-graphite mt-6">2.1 Information You Provide to Us</h3>
              <ul>
                <li><strong>Contact Information:</strong> Name, email address, phone number, postal address</li>
                <li><strong>Booking Details:</strong> Appointment preferences, service selections, location choices (Altrincham, Knutsford, or Caversham)</li>
                <li><strong>Payment Information:</strong> Billing details (processed securely through third-party payment providers)</li>
                <li><strong>Education Course Details:</strong> Professional qualifications, experience level, course preferences, CPD requirements</li>
                <li><strong>Referral Program Data:</strong> Referral codes, friend contact details (when provided), referral history</li>
                <li><strong>AI Assistant Conversations:</strong> Chat messages, questions, preferences, and feedback</li>
                <li><strong>Communication Preferences:</strong> Marketing opt-ins, appointment reminder preferences, newsletter subscriptions</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">2.2 Information We Collect Automatically</h3>
              <ul>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, operating system</li>
                <li><strong>Usage Data:</strong> Pages viewed, time spent on site, navigation paths, click patterns</li>
                <li><strong>Cookies and Similar Technologies:</strong> Session identifiers, preference settings (see our Cookie Policy below)</li>
                <li><strong>Location Data:</strong> General location based on IP address (not precise GPS location)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">3. How We Use Your Information</h2>
              
              <h3 className="text-xl font-medium text-graphite mt-6">3.1 To Provide Our Services</h3>
              <ul>
                <li>Process and manage salon bookings and appointments</li>
                <li>Deliver education courses and CPD programs</li>
                <li>Manage the referral program and process rewards (£10 off vouchers)</li>
                <li>Send appointment confirmations, reminders, and follow-ups</li>
                <li>Process payments and refunds</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Power our AI assistant to answer questions and provide personalized recommendations</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">3.2 To Improve Our Services</h3>
              <ul>
                <li>Analyze usage patterns and customer preferences</li>
                <li>Train and improve our AI systems and chatbot</li>
                <li>Conduct customer satisfaction surveys</li>
                <li>Develop new features and services</li>
                <li>Optimize website performance and user experience</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">3.3 For Marketing and Communications</h3>
              <ul>
                <li>Send promotional offers and special deals (only with your consent)</li>
                <li>Share educational content, styling tips, and industry insights</li>
                <li>Notify you about new courses, services, and locations</li>
                <li>Send birthday and anniversary greetings</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">3.4 For Legal and Security Purposes</h3>
              <ul>
                <li>Comply with legal obligations and regulations</li>
                <li>Prevent fraud, abuse, and unauthorized access</li>
                <li>Protect our rights, property, and safety</li>
                <li>Resolve disputes and enforce our terms</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">4. Legal Basis for Processing (UK GDPR)</h2>
              <p>We process your personal data under the following legal bases:</p>
              <ul>
                <li><strong>Contract:</strong> To fulfill our contract with you (bookings, services, courses)</li>
                <li><strong>Consent:</strong> For marketing communications and AI assistant interactions (you can withdraw consent anytime)</li>
                <li><strong>Legitimate Interests:</strong> To improve our services, prevent fraud, and ensure security</li>
                <li><strong>Legal Obligation:</strong> To comply with tax, accounting, and other legal requirements</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">5. How We Share Your Information</h2>
              
              <p>We do not sell your personal data. We may share your information with:</p>
              
              <h3 className="text-xl font-medium text-graphite mt-6">5.1 Service Providers</h3>
              <ul>
                <li><strong>Booking System:</strong> Salon management and scheduling software</li>
                <li><strong>Payment Processors:</strong> Secure payment gateways for transactions</li>
                <li><strong>Email Service:</strong> Transactional and marketing email providers (Resend)</li>
                <li><strong>AI Services:</strong> OpenAI for AI assistant functionality</li>
                <li><strong>Analytics:</strong> Website analytics and performance monitoring</li>
                <li><strong>Cloud Hosting:</strong> Secure data storage (Supabase, Vercel)</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">5.2 Salon Partners</h3>
              <p>
                When you book at one of our partner locations (Fixx Salon in Altrincham, Urban Sanctuary in Knutsford, 
                or Alternate Salon in Caversham), we share necessary booking information with the salon.
              </p>

              <h3 className="text-xl font-medium text-graphite mt-6">5.3 Legal Requirements</h3>
              <p>
                We may disclose your information if required by law, court order, or government request, or to protect 
                our rights and safety.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">6. Data Security</h2>
              <p>We implement industry-standard security measures to protect your personal information:</p>
              <ul>
                <li>Encryption of data in transit (SSL/TLS) and at rest</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Staff training on data protection and security</li>
                <li>Secure backup and disaster recovery procedures</li>
              </ul>
              <p>
                While we take reasonable precautions, no system is 100% secure. We cannot guarantee absolute security 
                but are committed to protecting your data to the best of our ability.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">7. Data Retention</h2>
              <p>We retain your personal data for as long as necessary to provide our services and comply with legal obligations:</p>
              <ul>
                <li><strong>Active Customers:</strong> While you use our services and for 3 years after your last interaction</li>
                <li><strong>Booking Records:</strong> 7 years for tax and accounting purposes</li>
                <li><strong>Marketing Data:</strong> Until you unsubscribe or request deletion</li>
                <li><strong>AI Chat Logs:</strong> 12 months for service improvement, then anonymized or deleted</li>
                <li><strong>Legal Purposes:</strong> As required by law or regulation</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">8. Your Rights (UK GDPR)</h2>
              <p>Under UK data protection law, you have the following rights:</p>
              
              <ul>
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or for marketing</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time (doesn't affect prior processing)</li>
                <li><strong>Right to Lodge a Complaint:</strong> Contact the Information Commissioner's Office (ICO) if you have concerns</li>
              </ul>

              <p className="mt-4">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:luke@lukeroberthair.com" className="text-sage hover:underline font-medium">
                  luke@lukeroberthair.com
                </a>
                {' '}or call <strong>07862 054292</strong>. We will respond within 30 days.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">9. Cookies and Tracking</h2>
              
              <h3 className="text-xl font-medium text-graphite mt-6">9.1 What Are Cookies?</h3>
              <p>
                Cookies are small text files stored on your device that help us improve your experience, remember your 
                preferences, and analyze website usage.
              </p>

              <h3 className="text-xl font-medium text-graphite mt-6">9.2 Types of Cookies We Use</h3>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for the website to function (e.g., session management, security)</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Marketing Cookies:</strong> Track conversions and ad performance (only with consent)</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">9.3 Managing Cookies</h3>
              <p>
                You can control cookies through your browser settings. Note that disabling cookies may affect website 
                functionality. Most browsers accept cookies by default, but you can modify settings to decline cookies 
                or notify you when cookies are being sent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">10. AI Assistant and Chatbot</h2>
              <p>Our AI assistant uses OpenAI technology to provide personalized recommendations and answer questions:</p>
              <ul>
                <li>Conversations are stored temporarily to improve service quality</li>
                <li>Chat data is anonymized and used to train and improve our AI systems</li>
                <li>We do not share identifiable chat data with third parties (except OpenAI for processing)</li>
                <li>You can request deletion of your chat history at any time</li>
                <li>The AI assistant does not store payment information or highly sensitive personal data</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">11. Children's Privacy</h2>
              <p>
                Our services are not directed to children under 16. We do not knowingly collect personal information from 
                children. If you believe we have collected information from a child, please contact us immediately, and 
                we will delete it.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">12. International Data Transfers</h2>
              <p>
                Your data is primarily stored in the UK/EU. Some service providers (e.g., OpenAI) may process data outside 
                the UK. We ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) or 
                adequacy decisions, to protect your data during international transfers.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">13. Marketing Communications</h2>
              <p>You can opt out of marketing emails at any time by:</p>
              <ul>
                <li>Clicking the "unsubscribe" link in any marketing email</li>
                <li>Contacting us at <a href="mailto:luke@lukeroberthair.com" className="text-sage hover:underline font-medium">luke@lukeroberthair.com</a></li>
                <li>Updating your preferences in your account settings</li>
              </ul>
              <p>
                Note: Even if you opt out of marketing, we will still send transactional emails (appointment confirmations, 
                booking updates, course information).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">14. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal 
                requirements, or business operations. We will notify you of significant changes by:
              </p>
              <ul>
                <li>Posting the updated policy on our website with a new "Last updated" date</li>
                <li>Sending an email notification (for material changes)</li>
                <li>Displaying a prominent notice on our website</li>
              </ul>
              <p>
                Your continued use of our services after changes become effective constitutes acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">15. Contact Us</h2>
              <p>If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:</p>
              
              <div className="bg-sage-pale/30 p-6 rounded-lg mt-4 not-prose">
                <p className="font-medium text-graphite mb-2">Luke Robert Hair</p>
                <p className="text-graphite/80 mb-1">Email: <a href="mailto:luke@lukeroberthair.com" className="text-sage hover:underline font-medium">luke@lukeroberthair.com</a></p>
                <p className="text-graphite/80 mb-1">Phone: <strong>07862 054292</strong></p>
                <p className="text-graphite/80 mb-1">Locations:</p>
                <ul className="text-sm text-graphite/70 ml-4 space-y-1">
                  <li>Fixx Salon, 1b Lloyd St, Altrincham, WA14 2DD</li>
                  <li>Urban Sanctuary, 29 King St, Knutsford, WA16 6DW</li>
                  <li>Alternate Salon, 19 Church Street, Caversham, RG4 8BA</li>
                </ul>
              </div>

              <p className="mt-6">
                <strong>Data Protection Authority:</strong> If you are not satisfied with our response, you can lodge a 
                complaint with the UK Information Commissioner's Office (ICO):
              </p>
              <ul className="text-sm text-graphite/70">
                <li>Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-sage hover:underline">ico.org.uk</a></li>
                <li>Phone: 0303 123 1113</li>
                <li>Address: Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</li>
              </ul>
            </div>

            <div className="mt-12 pt-8 border-t border-sage/20">
              <p className="text-center">
                <Link href="/terms" className="text-sage hover:underline font-medium">
                  View our Terms of Service
                </Link>
                {' | '}
                <Link href="/" className="text-sage hover:underline font-medium">
                  Return to Home
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
