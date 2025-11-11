'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="pt-20">
      <section className="section-padding bg-sage-pale/30">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-5xl font-playfair">Terms of Service</h1>
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
              <h2 className="text-2xl font-playfair text-graphite">1. Agreement to Terms</h2>
              <p>
                Welcome to Luke Robert Hair. By accessing or using our website (lukeroberthair.com), booking services, 
                enrolling in education courses, or using our AI assistant, you agree to be bound by these Terms of Service 
                ("Terms"). If you do not agree to these Terms, please do not use our services.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you and Luke Robert Hair (trading as Luke Robert, 
                "we," "our," or "us").
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">2. Services Provided</h2>
              <p>Luke Robert Hair offers the following services:</p>
              <ul>
                <li><strong>Salon Services:</strong> Precision hairdressing, cutting, styling, coloring, and consultations at partner locations</li>
                <li><strong>Education Courses:</strong> Professional hairdressing education, CPD courses, barbering training, and educator training</li>
                <li><strong>CPD Partnerships:</strong> Continuing Professional Development programs for salons and educators</li>
                <li><strong>Online Booking:</strong> Digital appointment scheduling system across multiple locations</li>
                <li><strong>Referral Program:</strong> Customer referral rewards program offering £10 off vouchers</li>
                <li><strong>AI Assistant:</strong> Intelligent chatbot for questions, recommendations, and support</li>
                <li><strong>Content & Insights:</strong> Blog articles, educational content, and industry insights</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">3. Salon Services - Bookings & Appointments</h2>
              
              <h3 className="text-xl font-medium text-graphite mt-6">3.1 Booking Process</h3>
              <ul>
                <li>All bookings are subject to availability and confirmation</li>
                <li>You must provide accurate contact information when booking</li>
                <li>You will receive confirmation via email and/or SMS</li>
                <li>Bookings can be made at our partner locations: Fixx Salon (Altrincham), Urban Sanctuary (Knutsford), or Alternate Salon (Caversham)</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">3.2 Cancellation Policy</h3>
              <ul>
                <li><strong>24 Hours Notice Required:</strong> We require at least 24 hours' notice for cancellations or rescheduling</li>
                <li><strong>Late Cancellations:</strong> Cancellations with less than 24 hours' notice may incur a cancellation fee of up to 50% of the service cost</li>
                <li><strong>No-Shows:</strong> Failure to attend without notice may result in a 100% charge and may affect future booking privileges</li>
                <li><strong>Emergency Exceptions:</strong> We understand emergencies happen; contact us as soon as possible</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">3.3 Service Delivery</h3>
              <ul>
                <li>We will make every effort to provide services as described</li>
                <li>Service duration may vary based on hair type, condition, and complexity</li>
                <li>Additional services discovered during consultation may incur extra charges (with your consent)</li>
                <li>We reserve the right to refuse service if we determine the requested service may damage your hair or is not in your best interest</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">3.4 Pricing & Payment</h3>
              <ul>
                <li>All prices are displayed in GBP (£) and include VAT where applicable</li>
                <li>Payment is due at the time of service unless otherwise agreed</li>
                <li>We accept card payments, cash, and other payment methods as available</li>
                <li>Prices are subject to change; current prices apply at the time of booking</li>
                <li>Deposits may be required for certain services or new clients</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">3.5 Satisfaction & Corrections</h3>
              <ul>
                <li>If you are not satisfied with your service, please contact us within 7 days</li>
                <li>We offer complimentary correction appointments for genuine concerns</li>
                <li>Corrections must be performed by Luke Robert Hair; we cannot be responsible for corrections by other stylists</li>
                <li>Color corrections require consultation and may incur additional charges for products</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">4. Education Courses & CPD Programs</h2>
              
              <h3 className="text-xl font-medium text-graphite mt-6">4.1 Course Enrollment</h3>
              <ul>
                <li>Enrollment is subject to availability and eligibility requirements</li>
                <li>You must provide accurate professional information (qualifications, experience)</li>
                <li>Some courses have prerequisites; ensure you meet requirements before enrolling</li>
                <li>Minimum and maximum participant numbers may apply</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">4.2 Payment Terms</h3>
              <ul>
                <li><strong>Full Payment Required:</strong> Course fees must be paid in full before the course start date unless payment plans are agreed in writing</li>
                <li><strong>Payment Plans:</strong> Available for certain courses; contact us for details</li>
                <li><strong>Deposits:</strong> Non-refundable deposits may be required to secure your place</li>
                <li><strong>Group Discounts:</strong> Available for salon teams; inquire for rates</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">4.3 Cancellation & Refund Policy</h3>
              <ul>
                <li><strong>14+ Days Before Course:</strong> Full refund minus £50 administrative fee</li>
                <li><strong>7-13 Days Before Course:</strong> 50% refund</li>
                <li><strong>Less Than 7 Days:</strong> No refund, but you may transfer to another course date (one time only, subject to availability)</li>
                <li><strong>Course Cancelled by Us:</strong> Full refund or transfer to alternative date</li>
                <li><strong>No-Shows:</strong> No refund or transfer</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">4.4 Course Delivery</h3>
              <ul>
                <li>Courses may be in-person, online, or hybrid format</li>
                <li>Course content, dates, and locations are subject to change with reasonable notice</li>
                <li>You must arrive on time; late arrivals may miss content without refund</li>
                <li>Models for practical sessions may be required; we will advise in advance</li>
                <li>CPD certificates are issued upon successful completion</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">4.5 Course Materials & Intellectual Property</h3>
              <ul>
                <li>Course materials are provided for personal, non-commercial use only</li>
                <li>You may not reproduce, distribute, or sell course materials without written permission</li>
                <li>Recording (audio/video) of courses is prohibited unless explicitly authorized</li>
                <li>All teaching methods, techniques, and materials are proprietary to Luke Robert Hair</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">4.6 Professional Conduct</h3>
              <ul>
                <li>Students must conduct themselves professionally at all times</li>
                <li>Disruptive behavior may result in removal from the course without refund</li>
                <li>Respectful treatment of instructors, staff, models, and fellow students is required</li>
                <li>Health and safety guidelines must be followed at all times</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">5. Referral Program</h2>
              
              <h3 className="text-xl font-medium text-graphite mt-6">5.1 How It Works</h3>
              <ul>
                <li>Existing customers can refer friends using their unique referral code</li>
                <li>When a referred friend completes their first booking, both parties receive £10 off their next service</li>
                <li>Vouchers are issued automatically and emailed within 24 hours</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">5.2 Terms & Conditions</h3>
              <ul>
                <li>Referred person must be a new customer (never booked before)</li>
                <li>Minimum spend requirements may apply to use vouchers</li>
                <li>Vouchers are valid for 6 months from issue date</li>
                <li>Vouchers cannot be combined with other offers unless stated</li>
                <li>Vouchers have no cash value and cannot be exchanged for cash</li>
                <li>We reserve the right to invalidate vouchers obtained through fraud or abuse</li>
                <li>There is no limit to the number of friends you can refer</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">6. AI Assistant & Chatbot</h2>
              
              <h3 className="text-xl font-medium text-graphite mt-6">6.1 Service Description</h3>
              <ul>
                <li>Our AI assistant provides information, recommendations, and support</li>
                <li>Powered by advanced AI technology (OpenAI GPT)</li>
                <li>Available 24/7 for instant assistance</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">6.2 Limitations & Disclaimers</h3>
              <ul>
                <li><strong>Not a Substitute:</strong> AI assistance does not replace professional consultation</li>
                <li><strong>Accuracy:</strong> While we strive for accuracy, AI responses may occasionally be incorrect or incomplete</li>
                <li><strong>No Guarantees:</strong> We do not guarantee specific results from following AI recommendations</li>
                <li><strong>Human Verification:</strong> Important decisions (bookings, courses, payments) are verified by human staff</li>
                <li><strong>Privacy:</strong> Conversations are stored and may be reviewed to improve service quality (see Privacy Policy)</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">6.3 Acceptable Use</h3>
              <ul>
                <li>Use the AI assistant for legitimate purposes related to our services</li>
                <li>Do not attempt to manipulate, hack, or abuse the AI system</li>
                <li>Do not use offensive, abusive, or inappropriate language</li>
                <li>We reserve the right to terminate AI access for policy violations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">7. Website Use & Conduct</h2>
              
              <h3 className="text-xl font-medium text-graphite mt-6">7.1 Acceptable Use</h3>
              <p>You agree not to:</p>
              <ul>
                <li>Use the website for any unlawful purpose or in violation of these Terms</li>
                <li>Attempt to gain unauthorized access to our systems, networks, or user accounts</li>
                <li>Upload or transmit viruses, malware, or other malicious code</li>
                <li>Scrape, harvest, or collect data from the website using automated means</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Interfere with or disrupt the website or servers</li>
                <li>Use the website to send spam, phishing, or unsolicited communications</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">7.2 Account Security</h3>
              <ul>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access or security breach</li>
                <li>We are not liable for losses resulting from unauthorized account access</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">8. Intellectual Property Rights</h2>
              
              <h3 className="text-xl font-medium text-graphite mt-6">8.1 Our Content</h3>
              <p>
                All content on this website, including but not limited to text, images, graphics, logos, videos, audio, 
                software, designs, course materials, and AI-generated content, is the property of Luke Robert Hair and 
                protected by UK and international copyright, trademark, and intellectual property laws.
              </p>

              <h3 className="text-xl font-medium text-graphite mt-6">8.2 Limited License</h3>
              <p>
                We grant you a limited, non-exclusive, non-transferable license to access and use the website for personal, 
                non-commercial purposes. This license does not include:
              </p>
              <ul>
                <li>Reproducing, copying, or distributing content</li>
                <li>Modifying, creating derivative works, or reverse engineering</li>
                <li>Commercial use without written permission</li>
                <li>Removing copyright or proprietary notices</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">8.3 Trademarks</h3>
              <p>
                "Luke Robert Hair," our logo, and related marks are trademarks of Luke Robert Hair. You may not use these 
                marks without our prior written consent.
              </p>

              <h3 className="text-xl font-medium text-graphite mt-6">8.4 User-Generated Content</h3>
              <p>
                By submitting content to us (reviews, testimonials, photos, comments), you grant us a worldwide, royalty-free, 
                perpetual license to use, display, and distribute such content for marketing and promotional purposes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">9. Third-Party Services & Links</h2>
              <ul>
                <li>Our website may contain links to third-party websites (salon partners, payment processors, social media)</li>
                <li>We are not responsible for the content, privacy practices, or terms of third-party sites</li>
                <li>Links do not imply endorsement or affiliation</li>
                <li>Your use of third-party services is governed by their respective terms and policies</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">10. Disclaimer of Warranties</h2>
              <p>
                To the fullest extent permitted by law, Luke Robert Hair provides services "AS IS" and "AS AVAILABLE" 
                without warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul>
                <li>Implied warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                <li>Warranties regarding accuracy, reliability, or availability of the website or services</li>
                <li>Warranties that the website will be error-free, secure, or uninterrupted</li>
                <li>Warranties regarding results obtained from hair services or education courses</li>
              </ul>
              <p>
                While we strive for excellence, hair and beauty services involve inherent risks, and individual results may vary. 
                We cannot guarantee specific outcomes from our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">11. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by UK law, Luke Robert Hair, its directors, employees, partners, and affiliates 
                shall not be liable for:
              </p>
              <ul>
                <li>Indirect, incidental, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Personal injury or property damage (except where caused by our negligence)</li>
                <li>Allergic reactions or adverse effects (subject to proper disclosure and consultation)</li>
                <li>Delays, cancellations, or interruptions beyond our reasonable control</li>
              </ul>
              <p>
                Our total liability for any claim arising from our services shall not exceed the amount you paid for the 
                specific service or course in question, or £500, whichever is lower.
              </p>
              <p>
                <strong>Important:</strong> Nothing in these Terms excludes or limits our liability for death or personal injury 
                caused by our negligence, fraud, or any other liability that cannot be excluded by UK law.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">12. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Luke Robert Hair, its directors, employees, partners, and 
                affiliates from any claims, losses, damages, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul>
                <li>Your violation of these Terms</li>
                <li>Your use of our services or website</li>
                <li>Your violation of any rights of another person or entity</li>
                <li>Provision of false or misleading information (e.g., allergies, medical conditions)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">13. Health & Safety</h2>
              
              <h3 className="text-xl font-medium text-graphite mt-6">13.1 Client Responsibility</h3>
              <ul>
                <li>You must disclose all relevant allergies, sensitivities, medical conditions, and medications</li>
                <li>You must inform us of any previous adverse reactions to hair products or services</li>
                <li>Patch tests may be required for certain color services</li>
                <li>Failure to disclose relevant information may result in adverse reactions for which we are not liable</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">13.2 Our Commitment</h3>
              <ul>
                <li>We use professional-grade products and follow industry best practices</li>
                <li>We maintain clean, hygienic, and safe salon environments (at partner locations)</li>
                <li>Our staff are trained in health and safety protocols</li>
                <li>We comply with all relevant health and safety regulations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">14. Force Majeure</h2>
              <p>
                We shall not be liable for any failure or delay in performing our obligations due to circumstances beyond our 
                reasonable control, including but not limited to:
              </p>
              <ul>
                <li>Acts of God, natural disasters, pandemics, or severe weather</li>
                <li>War, terrorism, civil unrest, or government action</li>
                <li>Strikes, labor disputes, or supply chain disruptions</li>
                <li>Power outages, internet failures, or technical failures</li>
              </ul>
              <p>
                In such events, we will make reasonable efforts to reschedule or provide alternatives.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">15. Termination</h2>
              
              <h3 className="text-xl font-medium text-graphite mt-6">15.1 By You</h3>
              <p>You may stop using our services at any time, subject to any outstanding obligations (bookings, course fees).</p>

              <h3 className="text-xl font-medium text-graphite mt-6">15.2 By Us</h3>
              <p>We reserve the right to suspend or terminate your access to our services if you:</p>
              <ul>
                <li>Violate these Terms</li>
                <li>Provide false or misleading information</li>
                <li>Engage in fraudulent, abusive, or illegal activity</li>
                <li>Repeatedly miss appointments or fail to pay</li>
                <li>Behave inappropriately toward staff or other customers</li>
              </ul>

              <h3 className="text-xl font-medium text-graphite mt-6">15.3 Effect of Termination</h3>
              <ul>
                <li>Termination does not affect obligations that arose before termination</li>
                <li>Refunds (if any) are subject to our refund policies</li>
                <li>We may retain your data as required by law or our retention policy</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">16. Dispute Resolution</h2>
              
              <h3 className="text-xl font-medium text-graphite mt-6">16.1 Informal Resolution</h3>
              <p>
                If you have a complaint or dispute, please contact us first at{' '}
                <a href="mailto:luke@lukeroberthair.com" className="text-sage hover:underline font-medium">
                  luke@lukeroberthair.com
                </a>
                {' '}or <strong>07862 054292</strong>. We will make every effort to resolve the issue amicably.
              </p>

              <h3 className="text-xl font-medium text-graphite mt-6">16.2 Mediation</h3>
              <p>
                If informal resolution fails, both parties agree to attempt mediation before pursuing legal action.
              </p>

              <h3 className="text-xl font-medium text-graphite mt-6">16.3 Governing Law & Jurisdiction</h3>
              <ul>
                <li>These Terms are governed by the laws of England and Wales</li>
                <li>Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales</li>
                <li>If you are a consumer, you may also have rights under consumer protection laws in your jurisdiction</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">17. Changes to These Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of material changes by:
              </p>
              <ul>
                <li>Posting the updated Terms on our website with a new "Last updated" date</li>
                <li>Sending email notification to registered users</li>
                <li>Displaying a prominent notice on the website</li>
              </ul>
              <p>
                Your continued use of our services after changes become effective constitutes acceptance of the updated Terms. 
                If you do not agree to the changes, you must stop using our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">18. Severability</h2>
              <p>
                If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions 
                shall continue in full force and effect.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">19. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy and any other policies referenced herein, constitute the entire 
                agreement between you and Luke Robert Hair regarding the use of our services and supersede all prior agreements 
                and understandings.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-graphite">20. Contact Information</h2>
              <p>
                If you have questions, concerns, or feedback regarding these Terms of Service, please contact us:
              </p>
              
              <div className="bg-sage-pale/30 p-6 rounded-lg mt-4 not-prose">
                <p className="font-medium text-graphite mb-2">Luke Robert Hair</p>
                <p className="text-graphite/80 mb-1">Email: <a href="mailto:luke@lukeroberthair.com" className="text-sage hover:underline font-medium">luke@lukeroberthair.com</a></p>
                <p className="text-graphite/80 mb-1">Phone: <strong>07862 054292</strong></p>
                <p className="text-graphite/80 mb-1">Website: <a href="https://lukeroberthair.com" className="text-sage hover:underline">lukeroberthair.com</a></p>
                <p className="text-graphite/80 mb-2 mt-3">Service Locations:</p>
                <ul className="text-sm text-graphite/70 ml-4 space-y-1">
                  <li><strong>Altrincham:</strong> Fixx Salon, 1b Lloyd St, Altrincham, WA14 2DD</li>
                  <li><strong>Knutsford:</strong> Urban Sanctuary, 29 King St, Knutsford, WA16 6DW</li>
                  <li><strong>Caversham:</strong> Alternate Salon, 19 Church Street, Caversham, RG4 8BA</li>
                </ul>
              </div>

              <p className="mt-6 text-sm text-graphite/60">
                <strong>Trading Information:</strong> Luke Robert Hair is a sole trader operating in England and Wales. 
                We are registered for VAT and comply with all applicable UK business regulations.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-sage/20">
              <p className="text-center">
                <Link href="/privacy" className="text-sage hover:underline font-medium">
                  View our Privacy Policy
                </Link>
                {' | '}
                <Link href="/" className="text-sage hover:underline font-medium">
                  Return to Home
                </Link>
              </p>
            </div>

            <div className="mt-8 p-6 bg-sage-pale/20 rounded-lg">
              <p className="text-sm text-graphite/70 text-center">
                By using Luke Robert Hair's services, you acknowledge that you have read, understood, and agree to be bound 
                by these Terms of Service and our Privacy Policy. Thank you for choosing Luke Robert Hair for your hairdressing 
                and education needs.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
