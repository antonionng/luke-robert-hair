'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Mail, CheckCircle } from 'lucide-react';
import { Course } from '@/lib/types';

interface CourseEnquiryModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseEnquiryModal({ course, isOpen, onClose }: CourseEnquiryModalProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'chat'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const handleChatClick = () => {
    if (typeof window !== 'undefined' && (window as any).openChatWithMessage) {
      (window as any).openChatWithMessage(`I'm interested in the ${course.title} course. Can you tell me more about it?`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-graphite/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-sage text-white p-8 relative">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
                <h2 className="text-3xl font-playfair font-light text-white mb-2">{course.title}</h2>
                <div className="flex items-center gap-4 text-sage-light">
                  <span>{course.duration}</span>
                  <span>•</span>
                  <span className="text-2xl font-semibold text-white">{course.price}</span>
                </div>
              </div>

              {/* Success State */}
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-12 text-center"
                >
                  <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-sage" size={40} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Enquiry Sent!</h3>
                  <p className="text-graphite/70 text-lg">
                    Thanks for your interest in {course.title}. I will get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Tab Navigation */}
                  <div className="flex border-b border-mist">
                    <button
                      onClick={() => setActiveTab('form')}
                      className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                        activeTab === 'form' ? 'text-sage' : 'text-graphite/60 hover:text-graphite'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Mail size={20} />
                        <span>Send Enquiry</span>
                      </div>
                      {activeTab === 'form' && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage"
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('chat')}
                      className={`flex-1 px-6 py-4 font-medium transition-colors relative ${
                        activeTab === 'chat' ? 'text-sage' : 'text-graphite/60 hover:text-graphite'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <MessageCircle size={20} />
                        <span>Chat with AI</span>
                      </div>
                      {activeTab === 'chat' && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage"
                        />
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {activeTab === 'form' ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-graphite mb-2">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                            placeholder="John Smith"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-graphite mb-2">
                              Email *
                            </label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                              placeholder="john@example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-graphite mb-2">
                              Phone
                            </label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                              placeholder="+44 7XXX XXXXXX"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-graphite mb-2">
                            Message (Optional)
                          </label>
                          <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 resize-none"
                            placeholder="Tell me about your experience level and what you hope to achieve..."
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full px-8 py-4 bg-sage text-white rounded-full font-medium hover:bg-sage-dark transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send size={20} />
                              <span>Send Enquiry</span>
                            </>
                          )}
                        </button>
                      </form>
                    ) : (
                      <div className="text-center space-y-6 py-8">
                        <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto">
                          <MessageCircle className="text-sage" size={40} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold mb-3">Chat with Luke's AI</h3>
                          <p className="text-graphite/70 text-lg leading-relaxed">
                            Get instant answers about the {course.title} course. The AI assistant knows all the details 
                            and can help you decide if this is the right course for you.
                          </p>
                        </div>
                        <button
                          onClick={handleChatClick}
                          className="inline-flex items-center gap-3 px-8 py-4 bg-sage text-white rounded-full font-medium hover:bg-sage-dark transition-all hover:scale-105"
                        >
                          <MessageCircle size={20} />
                          <span>Start Chat</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
