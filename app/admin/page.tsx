'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Download, Plus, Grid, List, CalendarDays
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatsGrid from '@/components/admin/StatsGrid';
import BookingsTable from '@/components/admin/BookingsTable';
import LeadsTable from '@/components/admin/LeadsTable';
import CPDPartnershipsTable from '@/components/admin/CPDPartnershipsTable';
import ChatSessionsTable from '@/components/admin/ChatSessionsTable';
import ServicesManager from '@/components/admin/ServicesManager';
import LeadDetailModal from '@/components/admin/LeadDetailModal';
import CreateLeadModal from '@/components/admin/CreateLeadModal';
import CreateBookingModal from '@/components/admin/CreateBookingModal';
import BookingDetailModal from '@/components/admin/BookingDetailModal';
import CalendarView from '@/components/admin/CalendarView';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { getAllBookings } from '@/lib/bookingStore';
import { Booking as BookingType } from '@/lib/bookingTypes';

interface Stats {
  totalContacts: number;
  pendingBookings: number;
  activeLeads: number;
  cpdPartnerships: number;
  publishedPosts: number;
  monthlyRevenue: number;
  conversionRate: number;
  avgBookingValue: number;
  chatSessions: number;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'leads' | 'cpd' | 'chat' | 'services'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingView, setBookingView] = useState<'table' | 'calendar'>('table');
  
  // Modals
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isCreateLeadModalOpen, setIsCreateLeadModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCreateBookingModalOpen, setIsCreateBookingModalOpen] = useState(false);
  
  // Data
  const [stats, setStats] = useState<Stats>({
    totalContacts: 0,
    pendingBookings: 0,
    activeLeads: 0,
    cpdPartnerships: 0,
    publishedPosts: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    avgBookingValue: 0,
    chatSessions: 0,
  });
  
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [cpdPartnerships, setCpdPartnerships] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [hotLeads, setHotLeads] = useState<any[]>([]);
  const [chatActivity, setChatActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        // Fetch stats
        const statsRes = await fetch('/api/admin/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch bookings
        const allBookings = getAllBookings();
        setBookings(allBookings);

        // Fetch upcoming bookings
        const upcomingRes = await fetch('/api/admin/upcoming-bookings?limit=5');
        if (upcomingRes.ok) {
          const upcomingData = await upcomingRes.json();
          setUpcomingBookings(upcomingData);
        }

        // Fetch hot leads
        const hotLeadsRes = await fetch('/api/admin/hot-leads?limit=5');
        if (hotLeadsRes.ok) {
          const hotLeadsData = await hotLeadsRes.json();
          setHotLeads(hotLeadsData);
        }

        // Fetch chat activity
        const chatRes = await fetch('/api/admin/chat-activity?limit=5');
        if (chatRes.ok) {
          const chatData = await chatRes.json();
          setChatActivity(chatData);
        }

        // Fetch all leads
        const leadsRes = await fetch('/api/admin/leads');
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          
          // Separate into categories
          const salonReferrals = leadsData.filter((l: any) => 
            l.leadType === 'salon_referral' || l.source?.includes('salon_referral')
          );
          const educationLeads = leadsData.filter((l: any) => 
            l.leadType === 'education' || (!l.leadType && !l.institution && !l.referralSalon)
          );
          const cpdLeads = leadsData.filter((l: any) => 
            ['cpd', 'cpd_partnership'].includes(l.leadType || '') || l.institution
          );
          
          setLeads(educationLeads);
          setCpdPartnerships(cpdLeads);
          
          // Update stats with CPD count and salon referrals
          setStats(prev => ({
            ...prev,
            cpdPartnerships: cpdLeads.length,
            pendingBookings: prev.pendingBookings + salonReferrals.length // Include referrals in pending
          }));
          
          // Store salon referrals with bookings
          // Convert referral leads to booking format for display
          const referralBookings = salonReferrals.map((ref: any) => ({
            id: ref.id,
            clientName: ref.name,
            client: {
              firstName: ref.firstName,
              lastName: ref.lastName,
              email: ref.email,
              phone: ref.phone || '',
              notes: ref.notes || ''
            },
            email: ref.email,
            phone: ref.phone || '',
            service: { name: ref.serviceInterest || ref.course || 'Service TBD', price: 0, duration: 0 },
            location: ref.referralSalon || 'Partner Salon',
            date: ref.preferredDate || ref.enquiryDate,
            time: 'TBD',
            status: 'pending' as const,
            price: 0,
            isReferral: true,
            referralSalon: ref.referralSalon,
            createdAt: ref.enquiryDate,
          }));
          
          // Merge with existing bookings
          setBookings((prev: any) => [...prev, ...referralBookings]);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [isAuthenticated]);

  const handleViewLead = (lead: any) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking);
    setIsBookingModalOpen(true);
  };

  const handleUpdateLead = async (leadId: string, updates: any) => {
    try {
      const res = await fetch('/api/admin/update-lead', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, updates }),
      });

      if (res.ok) {
        // Refresh leads
        const leadsRes = await fetch('/api/admin/leads');
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          const educationLeads = leadsData.filter((l: any) => 
            l.leadType === 'education' || (!l.leadType && !l.institution)
          );
          const cpdLeads = leadsData.filter((l: any) => 
            ['cpd', 'cpd_partnership'].includes(l.leadType || '') || l.institution
          );
          setLeads(educationLeads);
          setCpdPartnerships(cpdLeads);
          
          // Update selectedLead
          const updatedLead = leadsData.find((l: any) => l.id === leadId);
          if (updatedLead) {
            setSelectedLead(updatedLead);
          }
        }
      } else {
        throw new Error('Failed to update lead');
      }
    } catch (error) {
      console.error('Update lead error:', error);
      throw error;
    }
  };

  const handleUpdateBooking = async (bookingId: string, updates: any) => {
    try {
      // Implementation would go here
      console.log('Update booking:', bookingId, updates);
      // Refresh bookings after update
      const allBookings = getAllBookings();
      setBookings(allBookings);
    } catch (error) {
      console.error('Update booking error:', error);
      throw error;
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    alert('Export functionality coming soon!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center admin-dark">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-card p-8 max-w-md w-full mx-4"
        >
          <h1 className="text-3xl font-semibold mb-6 text-center text-white">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block font-medium mb-2 text-zinc-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input w-full px-4 py-3"
                placeholder="Enter admin password"
              />
            </div>
            <button type="submit" className="admin-btn-primary w-full">
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen admin-dark">
      {/* Sidebar */}
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        stats={{
          activeLeads: leads.length,
          pendingBookings: stats.pendingBookings,
          cpdPartnerships: cpdPartnerships.length,
          chatSessions: stats.chatSessions,
        }}
      />

      {/* Main Content */}
      <div className="flex-1 ml-[280px]">
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-semibold text-white mb-2">
                  {activeTab === 'overview' && 'Dashboard Overview'}
                  {activeTab === 'bookings' && 'Salon Bookings'}
                  {activeTab === 'leads' && 'Stylist Training'}
                  {activeTab === 'cpd' && 'College Partnerships'}
                  {activeTab === 'chat' && 'Chat Sessions'}
                  {activeTab === 'services' && 'Services'}
                </h1>
                <p className="text-lg text-zinc-400">
                  {activeTab === 'overview' && 'Monitor your business performance'}
                  {activeTab === 'bookings' && 'Hair styling appointments and services'}
                  {activeTab === 'leads' && 'Professional education for stylists and salons'}
                  {activeTab === 'cpd' && 'Educational programs for colleges and institutions'}
                  {activeTab === 'chat' && 'AI chat interactions'}
                  {activeTab === 'services' && 'Manage services and pricing'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {(activeTab === 'leads' || activeTab === 'cpd') && (
                  <button 
                    onClick={() => setIsCreateLeadModalOpen(true)}
                    className="admin-btn-primary flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add Lead
                  </button>
                )}
                {activeTab === 'bookings' && (
                  <button 
                    onClick={() => setIsCreateBookingModalOpen(true)}
                    className="admin-btn-success flex items-center gap-2"
                  >
                    <Plus size={18} />
                    New Booking
                  </button>
                )}
                <button 
                  onClick={handleRefresh}
                  className="admin-btn-secondary flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Search size={18} className={isLoading ? 'animate-spin' : ''} />
                  {isLoading ? 'Loading...' : 'Refresh'}
                </button>
                <button 
                  onClick={handleExport}
                  className="admin-btn-secondary flex items-center gap-2"
                >
                  <Download size={18} />
                  Export
                </button>
              </div>
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
                  {/* Upcoming Bookings */}
                  <div className="admin-card p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Upcoming Bookings</h3>
                    {isLoading ? (
                      <div className="text-center py-4 text-zinc-500">Loading...</div>
                    ) : upcomingBookings.length === 0 ? (
                      <div className="text-center py-4 text-zinc-500">No upcoming bookings</div>
                    ) : (
                      <div className="space-y-3">
                        {upcomingBookings.slice(0, 3).map(booking => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-zinc-700/50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm text-white">{booking.clientName}</p>
                              <p className="text-xs text-zinc-400">{booking.service}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-white">{booking.time}</p>
                              <p className="text-xs text-zinc-400">{booking.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hot Leads */}
                  <div className="admin-card p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Hot Leads</h3>
                    {isLoading ? (
                      <div className="text-center py-4 text-zinc-500">Loading...</div>
                    ) : hotLeads.length === 0 ? (
                      <div className="text-center py-4 text-zinc-500">No hot leads yet</div>
                    ) : (
                      <div className="space-y-3">
                        {hotLeads.slice(0, 3).map(lead => (
                          <div key={lead.id} className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                            <div>
                              <p className="font-medium text-sm text-white">{lead.name}</p>
                              <p className="text-xs text-zinc-400">{lead.course}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-green-400">£{lead.estimatedValue}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Chat Activity */}
                  <div className="admin-card p-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Recent Chat Activity</h3>
                    {isLoading ? (
                      <div className="text-center py-4 text-zinc-500">Loading...</div>
                    ) : chatActivity.length === 0 ? (
                      <div className="text-center py-4 text-zinc-500">No chat activity yet</div>
                    ) : (
                      <div className="space-y-3">
                        {chatActivity.slice(0, 3).map(activity => (
                          <div key={activity.id} className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <div>
                              <p className="font-medium text-sm text-white">{activity.outcome.charAt(0).toUpperCase() + activity.outcome.slice(1)}</p>
                              <p className="text-xs text-zinc-400">{activity.page}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-zinc-400">{activity.timestamp.split(',')[1]?.trim() || activity.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                {/* Search and View Toggle */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="admin-input w-full pl-12 pr-4 py-3"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBookingView('table')}
                      className={bookingView === 'table' ? 'admin-btn-primary' : 'admin-btn-secondary'}
                    >
                      <List size={18} />
                    </button>
                    <button
                      onClick={() => setBookingView('calendar')}
                      className={bookingView === 'calendar' ? 'admin-btn-primary' : 'admin-btn-secondary'}
                    >
                      <CalendarDays size={18} />
                    </button>
                  </div>
                </div>
                
                {bookingView === 'table' ? (
                  <BookingsTable bookings={bookings} searchTerm={searchTerm} />
                ) : (
                  <CalendarView 
                    bookings={bookings as any}
                    onBookingClick={handleViewBooking}
                    onDateClick={(date) => {
                      // Open create booking modal with pre-filled date
                      setIsCreateBookingModalOpen(true);
                    }}
                  />
                )}
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
                <div className="mb-6 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search stylist training leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-input w-full pl-12 pr-4 py-3"
                  />
                </div>
                <LeadsTable 
                  leads={leads} 
                  searchTerm={searchTerm}
                  onViewLead={handleViewLead}
                />
              </motion.div>
            )}

            {activeTab === 'cpd' && (
              <motion.div
                key="cpd"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search college partnerships..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-input w-full pl-12 pr-4 py-3"
                  />
                </div>
                <CPDPartnershipsTable 
                  partnerships={cpdPartnerships} 
                  searchTerm={searchTerm}
                  onViewPartnership={handleViewLead}
                />
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
                {isLoading ? (
                  <div className="text-center py-12 text-zinc-500">Loading chat activity...</div>
                ) : (
                  <ChatSessionsTable sessions={chatActivity} />
                )}
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

      {/* Modals */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onUpdate={handleUpdateLead}
      />
      
      <CreateLeadModal
        isOpen={isCreateLeadModalOpen}
        onClose={() => setIsCreateLeadModalOpen(false)}
        onSuccess={() => {
          handleRefresh();
        }}
      />
      
      <CreateBookingModal
        isOpen={isCreateBookingModalOpen}
        onClose={() => setIsCreateBookingModalOpen(false)}
        onSuccess={() => {
          handleRefresh();
        }}
      />
      
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onUpdate={handleUpdateBooking}
      />
    </div>
  );
}
