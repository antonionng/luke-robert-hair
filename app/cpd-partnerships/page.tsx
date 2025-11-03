'use client';

import { Users, Award, Zap, HeartHandshake, MessageSquare } from 'lucide-react';
import CPDCourseCard from '@/components/CPDCourseCard';
import HowItWorksTimeline from '@/components/HowItWorksTimeline';
import CPDEnquiryForm from '@/components/CPDEnquiryForm';
import { cpdCourses } from '@/lib/data/cpdCourses';

export default function CPDPartnershipsPage() {
  return (
    <main className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sage/10 via-off-white to-pale-sage/20 pt-32 pb-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sage/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pale-sage/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-sage/10 text-sage text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              CPD Certified Training Programmes
            </div>

            {/* Headline */}
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl text-graphite mb-6 leading-tight">
              Empowering Hair & Beauty Students Through{' '}
              <span className="text-sage">Accredited CPD Training</span>
            </h1>

            {/* Subtext */}
            <p className="text-xl text-gray-700 leading-relaxed mb-10">
              Partner with us to deliver inspiring, accredited CPD courses in communication, coaching, and leadership for your hair and beauty college students and staff.
            </p>

            {/* CTAs */}
            <div className="flex justify-center">
              <a
                href="#enquiry-form"
                className="px-8 py-4 bg-sage text-white rounded-xl font-semibold text-lg hover:bg-graphite transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Book a Discovery Call
              </a>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-sage" />
                <span>300+ Hair & Beauty Students Trained</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-sage" />
                <span>CPD Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-sage" />
                <span>95% Satisfaction Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-4xl md:text-5xl text-graphite mb-6">
                Why Partner With Us?
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Specializing in hair and beauty education, I bring engaging, evidence-based programmes that equip your students with essential communication, coaching, and leadership skills—enhancing their employability and preparing them for successful careers in the industry.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[
                {
                  icon: Award,
                  title: 'Accredited CPD Certificates',
                  description: 'Students receive official CPD certification for their professional development portfolio',
                },
                {
                  icon: Zap,
                  title: 'Engaging Workshops',
                  description: 'Interactive, experiential learning that keeps students motivated and inspired',
                },
                {
                  icon: Users,
                  title: 'Flexible Delivery',
                  description: 'On-site, online, or hybrid formats to suit your institution\'s needs',
                },
                {
                  icon: HeartHandshake,
                  title: 'Full Support Included',
                  description: 'Complete resources, materials, and follow-up support throughout',
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="bg-off-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-sage/10 flex items-center justify-center mb-6">
                    <benefit.icon className="w-7 h-7 text-sage" />
                  </div>
                  <h3 className="font-semibold text-xl text-graphite mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CPD Courses Section */}
      <section className="py-24 bg-off-white">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-4xl md:text-5xl text-graphite mb-6">
                Our CPD Training Programmes
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Choose from our range of accredited courses, or work with us to create a bespoke programme 
                tailored to your institution's specific needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {cpdCourses.map((course) => (
                <CPDCourseCard key={course.id} course={course} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                Need something different? We can create custom programmes to meet your specific requirements.
              </p>
              <a
                href="#enquiry-form"
                className="inline-flex items-center text-sage font-semibold hover:text-graphite transition-colors"
              >
                Discuss a Custom Programme →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* AI Course Recommendation Section */}
      <section className="py-24 bg-gradient-to-br from-sage/5 via-off-white to-pale-sage/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-playfair text-4xl md:text-5xl text-graphite mb-6">
              Not Sure Which Programme is Right?
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-10">
              Let me help you choose. I've built an AI assistant that understands 
              your hair and beauty college's needs. Tell it about your student demographics and 
              goals, and it will recommend the perfect CPD programme.
            </p>
            <button
              onClick={() => {
                // Open AI chat with CPD context
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('openAIChat', { 
                    detail: { context: 'cpd', initialMessage: 'Which CPD programme suits my college?' }
                  }));
                }
              }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-graphite text-white rounded-xl font-semibold text-lg hover:bg-sage transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <MessageSquare className="w-6 h-6" />
              Ask Luke's AI: "Which programme is right for my students?"
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-playfair text-4xl md:text-5xl text-graphite mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                From initial conversation to certification, we make the partnership process simple and seamless.
              </p>
            </div>

            <HowItWorksTimeline />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-sage/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-12 md:p-16 shadow-xl relative">
              {/* Quote Mark */}
              <div className="absolute -top-6 left-12 w-16 h-16 bg-sage rounded-full flex items-center justify-center">
                <span className="text-4xl text-white font-serif">"</span>
              </div>

              <blockquote className="text-2xl md:text-3xl font-playfair text-graphite leading-relaxed mb-8 text-center">
                Our hairdressing students left feeling inspired and equipped with skills they'll use throughout their careers. The workshop exceeded our expectations in every way.
              </blockquote>

              <div className="text-center">
                <p className="font-semibold text-lg text-graphite">Sarah Mitchell</p>
                <p className="text-gray-600">Head of Personal Development, Cheshire College of Hair & Beauty</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Form Section */}
      <section id="enquiry-form" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-4xl md:text-5xl text-graphite mb-6">
                Start Your Partnership Journey
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                Let's discuss how we can bring transformational CPD training to your hair and beauty students. 
                Fill in the form below and we'll be in touch within 24 hours.
              </p>
            </div>

            <div className="bg-off-white rounded-3xl p-8 md:p-12 shadow-lg">
              <CPDEnquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-graphite text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl mb-6">
            Ready to Empower Your Students?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the hair and beauty colleges already partnering with us to deliver outstanding CPD training.
          </p>
          <a
            href="#enquiry-form"
            className="inline-block px-8 py-4 bg-sage text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-sage transition-all duration-300"
          >
            Get Started Today
          </a>
        </div>
      </section>
    </main>
  );
}

