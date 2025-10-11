'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, GraduationCap, FileText, TrendingUp, RefreshCw,
  DollarSign, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare,
  Search, Filter, Download, Mail, Phone, MapPin, Eye, Edit, Trash2
} from 'lucide-react';
import StatsGrid from '@/components/admin/StatsGrid';
import BookingsTable from '@/components/admin/BookingsTable';
import LeadsTable from '@/components/admin/LeadsTable';
import ChatSessionsTable from '@/components/admin/ChatSessionsTable';
import ServicesManager from '@/components/admin/ServicesManager';
import { getAllBookings } from '@/lib/bookingStore';
import { Booking as BookingType } from '@/lib/bookingTypes';

interface Stats {
  totalContacts: number;
  pendingBookings: number;
  activeLeads: number;
  publishedPosts: number;
  monthlyRevenue: number;
  conversionRate: number;
  avgBookingValue: number;
  chatSessions: number;
}

interface Booking {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  experienceLevel: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  enquiryDate: string;
  value: number;
  notes?: string;
}

interface ChatSession {
  id: string;
  timestamp: string;
  duration: string;
  messages: number;
  outcome: 'booking' | 'enquiry' | 'info' | 'abandoned';
  page: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'leads' | 'chat' | 'services'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Import dummy data
  const [stats, setStats] = useState<Stats>({
    totalContacts: 156,
    pendingBookings: 12,
    activeLeads: 8,
    publishedPosts: 6,
    monthlyRevenue: 12450,
    conversionRate: 68,
    avgBookingValue: 78,
    chatSessions: 47,
  });
  
  const [bookings, setBookings] = useState<BookingType[]>([]);
  
  // Load bookings on mount
  useEffect(() => {
    const allBookings = getAllBookings();
    setBookings(allBookings);
  }, []);
  
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'LD001',
      name: 'Rachel Green',
      email: 'rachel.green@salon.com',
      phone: '07800 123456',
      course: 'Foundation Cutting',
      experienceLevel: 'Junior Stylist (1-2 years)',
      status: 'new',
      source: 'Instagram',
      enquiryDate: '2025-10-09',
      value: 450,
    },
    {
      id: 'LD002',
      name: 'Tom Richards',
      email: 'tom.r@hairco.com',
      phone: '07800 234567',
      course: 'Advanced Cutting',
      experienceLevel: 'Senior Stylist (5+ years)',
      status: 'contacted',
      source: 'Website',
      enquiryDate: '2025-10-08',
      value: 650,
    },
    {
      id: 'LD003',
      name: 'Amy Foster',
      email: 'amy.foster@gmail.com',
      phone: '07800 345678',
      course: '1-to-1 Mentorship',
      experienceLevel: 'Mid-level Stylist (3-4 years)',
      status: 'qualified',
      source: 'Referral',
      enquiryDate: '2025-10-05',
      value: 700,
    },
  ]);
  
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'CS001',
      timestamp: '2025-10-10 14:23',
      duration: '3m 45s',
      messages: 8,
      outcome: 'booking',
      page: '/salon'
    },
    {
      id: 'CS002',
      timestamp: '2025-10-10 11:15',
      duration: '2m 12s',
      messages: 5,
      outcome: 'enquiry',
      page: '/education'
    },
    {
      id: 'CS003',
      timestamp: '2025-10-10 09:45',
      duration: '5m 30s',
      messages: 12,
      outcome: 'info',
      page: '/insights'
    },
  ]);
  
  const [isGenerating, setIsGenerating] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - in production, use proper auth
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/generate-content', {
        method: 'POST',
      });
      const data = await response.json();
      alert(`Generated ${data.count} new posts!`);
      // Refresh stats
      setStats({ ...stats, publishedPosts: stats.publishedPosts + data.count });
    } catch (error) {
      console.error('Content generation error:', error);
      alert('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sage-pale/30 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4"
        >
          <h1 className="text-3xl font-playfair font-light mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                placeholder="Enter admin password"
              />
            </div>
            <button type="submit" className="w-full btn-primary">
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-sage-pale/30">
      <div className="section-padding">
        <div className="container-custom max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2">CRM Dashboard</h1>
                <p className="text-lg text-graphite/70">
                  Manage bookings, leads, and track performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="btn-secondary flex items-center gap-2">
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex gap-2 border-b border-mist bg-white rounded-t-2xl px-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'bookings', label: 'Bookings', icon: Calendar },
                { id: 'leads', label: 'Education Leads', icon: GraduationCap },
                { id: 'chat', label: 'Chat Sessions', icon: MessageSquare },
                { id: 'services', label: 'Services', icon: DollarSign },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-sage'
                      : 'text-graphite/60 hover:text-graphite'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <StatsGrid stats={stats} />
                
                {/* Quick Overview Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Calendar size={20} className="text-sage" />
                      Upcoming Bookings
                    </h3>
                    <div className="space-y-3">
                      {bookings.filter(b => b.status === 'confirmed').slice(0, 3).map(booking => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-sage/5 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{booking.client.firstName} {booking.client.lastName}</p>
                            <p className="text-xs text-graphite/60">{booking.service.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{booking.time}</p>
                            <p className="text-xs text-graphite/60">{new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <GraduationCap size={20} className="text-sage" />
                      Hot Leads
                    </h3>
                    <div className="space-y-3">
                      {leads.filter(l => l.status === 'qualified').map(lead => (
                        <div key={lead.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{lead.name}</p>
                            <p className="text-xs text-graphite/60">{lead.course}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-green-600">£{lead.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MessageSquare size={20} className="text-sage" />
                      Recent Chat Activity
                    </h3>
                    <div className="space-y-3">
                      {chatSessions.slice(0, 3).map(session => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{session.outcome.charAt(0).toUpperCase() + session.outcome.slice(1)}</p>
                            <p className="text-xs text-graphite/60">{session.page}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-graphite/60">{session.timestamp.split(' ')[1]}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-graphite/40" size={20} />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                    />
                  </div>
                  <button className="btn-secondary flex items-center gap-2">
                    <Filter size={18} />
                    Filter
                  </button>
                </div>
                <BookingsTable bookings={bookings} searchTerm={searchTerm} />
              </motion.div>
            )}

            {activeTab === 'leads' && (
              <motion.div
                key="leads"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-graphite/40" size={20} />
                    <input
                      type="text"
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                    />
                  </div>
                  <button className="btn-secondary flex items-center gap-2">
                    <Filter size={18} />
                    Filter
                  </button>
                </div>
                <LeadsTable leads={leads} searchTerm={searchTerm} />
              </motion.div>
            )}

            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ChatSessionsTable sessions={chatSessions} />
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ServicesManager />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
