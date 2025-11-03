'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, GraduationCap, Building, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  detectContextFromPage, 
  extractInstitutionalInfo,
  shouldOfferLeadCapture,
  generateConversationSummary,
  ChatContext,
  ExtractedInfo,
} from '@/lib/aiChatContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface LeadForm {
  name: string;
  email: string;
  phone: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<ChatContext>({ type: 'general', userType: 'individual' });
  const [messages, setMessages] = useState<Message[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowLeadCapture, setShouldShowLeadCapture] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo>({});
  const [leadForm, setLeadForm] = useState<LeadForm>({ name: '', email: '', phone: '' });
  const [leadCaptured, setLeadCaptured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detect context on mount and set initial state
  useEffect(() => {
    const detectedContext = detectContextFromPage();
    setContext(detectedContext);
    
    // Set initial message based on context
    const initialMessage = getInitialMessage(detectedContext);
    setMessages([{ role: 'assistant', content: initialMessage }]);
    
    // Set quick replies based on context
    setQuickReplies(getQuickActionsForContext(detectedContext).map(action => action.label));
  }, []);

  // Listen for custom open events with context
  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setIsOpen(true);
      
      if (e.detail?.context === 'cpd') {
        const cpdContext: ChatContext = { type: 'cpd', userType: 'institution' };
        setContext(cpdContext);
        
        const initialMessage = getInitialMessage(cpdContext);
        setMessages([{ role: 'assistant', content: initialMessage }]);
        setQuickReplies(getQuickActionsForContext(cpdContext).map(action => action.label));
        
        if (e.detail?.initialMessage) {
          // Auto-send initial message after a short delay
          setTimeout(() => {
            handleSendMessage(e.detail.initialMessage);
          }, 500);
        }
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('openAIChat', handleOpenChat);
      
      // Legacy support
      (window as any).openChatWithMessage = (message: string) => {
        setIsOpen(true);
        setTimeout(() => {
          handleSendMessage(message);
        }, 500);
      };
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('openAIChat', handleOpenChat);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper functions
  const getInitialMessage = (ctx: ChatContext): string => {
    if (ctx.type === 'cpd') {
      return "Hello! I'm Luke's CPD Partnership Assistant. I'm here to help you find the perfect professional development programme for your students.\n\nI can help you explore our CPD-certified courses in:\n\n• Communication & Influence\n• Coaching for Success\n• Emotional Intelligence & Leadership\n• Mindset & Motivation\n\nTell me a bit about your institution and what you're looking for?";
    }
    
    return "Hello! I'm Luke's AI assistant. I'm here to help you with:\n\n• Booking salon appointments\n• Learning about our services\n• Professional education courses\n• General questions about hair care\n\nWhat can I help you with today?";
  };

  const getQuickActionsForContext = (ctx: ChatContext) => {
    if (ctx.type === 'cpd') {
      return [
        { label: "View CPD programmes", message: "What CPD training programmes do you offer?" },
        { label: "Partnership process", message: "How does the partnership process work?" },
        { label: "Pricing & availability", message: "What are your pricing options and availability?" },
        { label: "Student outcomes", message: "What outcomes can we expect for our students?" },
      ];
    }
    
    return [
      { label: "Book appointment", message: "I'd like to book a salon appointment" },
      { label: "View services", message: "What services do you offer?" },
      { label: "Education courses", message: "Tell me about your education courses" },
      { label: "Hair care advice", message: "I need advice about hair care" },
    ];
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setQuickReplies([]); // Clear quick replies after first message

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.message || data.content || 'No response received' }]);
      
      // Check if we should offer lead capture
      if (data.offerLeadCapture || shouldOfferLeadCapture(data.extractedInfo || extractInstitutionalInfo(newMessages), newMessages, context)) {
        setExtractedInfo(data.extractedInfo || extractInstitutionalInfo(newMessages));
        setShouldShowLeadCapture(true);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I'm having trouble connecting right now. Please try again or contact us directly at luke@lukeroberthair.com",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptureLeadInChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const conversationSummary = generateConversationSummary(messages, extractedInfo);
      
      const response = await fetch('/api/chat/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone,
          context,
          extractedInfo,
          conversationSummary,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to capture lead');
      }

      setShouldShowLeadCapture(false);
      setLeadCaptured(true);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: data.message || "Perfect! I've passed your details to Luke. You'll hear from us within 24 hours to arrange your discovery call."
      }]);
    } catch (error: any) {
      console.error('Lead capture error:', error);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "I'm sorry, there was an error saving your information. Please try filling out the form on the website instead.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSendMessage(input);
  };

  // Get context-aware header information
  const headerTitle = context.type === 'cpd' 
    ? "Luke Robert Hair"
    : "Luke Robert Hair";
    
  const headerSubtitle = context.type === 'cpd'
    ? "CPD Partnership Assistant"
    : "AI Assistant";

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-sage text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat assistant"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className={`${context.type === 'cpd' ? 'bg-indigo-600' : 'bg-sage'} text-white p-6`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  context.type === 'cpd' ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {context.type === 'cpd' ? (
                    <GraduationCap className="w-6 h-6 text-white" />
                  ) : (
                    <Image
                      src="/logo-white.svg"
                      alt="Luke Robert Hair"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{headerTitle}</h3>
                  <p className="text-xs opacity-90">{headerSubtitle}</p>
                </div>
              </div>
              {context.type === 'cpd' && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
                  <Building className="w-4 h-4" />
                  <span className="text-xs font-medium">
                    College & Institutional Enquiries
                  </span>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-offwhite">
              {messages.length === 1 && quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInput(reply);
                        setQuickReplies([]);
                      }}
                      className="px-3 py-2 bg-white text-sage text-sm rounded-full border border-sage/20 hover:bg-sage hover:text-white transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-sage text-white rounded-br-sm'
                        : 'bg-white text-graphite rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-line space-y-2">
                      {message.content.split('\n').map((line, i) => {
                        // Check if line starts with bullet point or dash
                        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                          return (
                            <div key={i} className="flex gap-2 items-start">
                              <span className="text-sage mt-0.5">•</span>
                              <span className="flex-1">{line.replace(/^[•\-]\s*/, '')}</span>
                            </div>
                          );
                        }
                        // Check if line looks like a heading (ends with :)
                        if (line.trim().endsWith(':') && line.length < 60) {
                          return <div key={i} className="font-semibold text-graphite mt-2">{line}</div>;
                        }
                        // Regular line
                        return line.trim() ? <div key={i}>{line}</div> : <div key={i} className="h-2" />;
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Lead Capture Form */}
              {shouldShowLeadCapture && !leadCaptured && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-sage/10 border-2 border-sage rounded-xl p-6"
                >
                  <h3 className="font-semibold text-graphite mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-sage" />
                    Ready to Connect?
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    I have the information I need. Would you like me to arrange a discovery 
                    call with Luke to discuss your CPD needs?
                  </p>
                  
                  <form onSubmit={handleCaptureLeadInChat} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number (optional)"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
                    />
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-sage text-white rounded-lg font-semibold hover:bg-graphite transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Submitting...' : 'Yes, Arrange a Discovery Call'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShouldShowLeadCapture(false)}
                      className="w-full py-2 text-gray-600 hover:text-graphite transition-colors"
                    >
                      Not right now
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Success Message */}
              {leadCaptured && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center"
                >
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-graphite mb-2">
                    Discovery Call Requested!
                  </h3>
                  <p className="text-sm text-gray-700">
                    Luke will personally reach out within 24 hours to discuss your 
                    CPD training needs. Check your email for confirmation.
                  </p>
                </motion.div>
              )}

              {isLoading && context.type === 'cpd' ? (
                <div className="flex items-center gap-2 text-sm text-gray-500 px-4 py-2">
                  <GraduationCap className="w-4 h-4 animate-pulse" />
                  <span>Analyzing your institutional needs...</span>
                </div>
              ) : isLoading ? (
                <div className="flex justify-start">
                  <div className="bg-white text-graphite p-3 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-sage rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-sage rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 bg-sage rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} data-chat-form className="p-4 bg-white border-t border-mist">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-mist rounded-full focus:outline-none focus:ring-2 focus:ring-sage/20"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-sage text-white rounded-full hover:bg-sage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

