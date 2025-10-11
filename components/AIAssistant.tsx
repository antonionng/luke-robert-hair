'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Luke's AI assistant. I'm here to help you with:\n\n• Booking salon appointments\n• Learning about our services\n• Professional education courses\n• General questions about hair care\n\nWhat can I help you with today?",
    },
  ]);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    'Book an appointment',
    'View services & prices',
    'Education courses',
    'Hair care advice',
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Expose methods globally for external triggers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).openChatWithMessage = (message: string) => {
        setIsOpen(true);
        setInput(message);
        // Auto-submit after a short delay
        setTimeout(() => {
          const form = document.querySelector('form[data-chat-form]') as HTMLFormElement;
          if (form) {
            const event = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(event);
          }
        }, 500);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          page: window.location.pathname,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I'm having trouble connecting right now. Please try again or contact us directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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
            <div className="bg-sage text-white p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo-white.svg"
                    alt="Luke Robert Hair"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Luke Robert Hair</h3>
                  <p className="text-xs text-sage-light">AI Assistant</p>
                </div>
              </div>
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
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-graphite p-3 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-sage rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-sage rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 bg-sage rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
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
