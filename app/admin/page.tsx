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
import ContentCreationModal from '@/components/admin/ContentCreationModal';
import ContentQueueTable from '@/components/admin/ContentQueueTable';
import ContentPreviewModal from '@/components/admin/ContentPreviewModal';
import ContentSuccessModal from '@/components/admin/ContentSuccessModal';
import ContentTopicSuggestions from '@/components/admin/ContentTopicSuggestions';
import ContentAnalyticsDashboard from '@/components/admin/ContentAnalyticsDashboard';
import ReferralsTable from '@/components/admin/ReferralsTable';
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
  
  // Check for existing auth session on mount
  useEffect(() => {
    const authSession = sessionStorage.getItem('admin_authenticated');
    if (authSession === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'leads' | 'cpd' | 'chat' | 'services' | 'content' | 'referrals'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingView, setBookingView] = useState<'table' | 'calendar'>('table');
  
  // Modals
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isCreateLeadModalOpen, setIsCreateLeadModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCreateBookingModalOpen, setIsCreateBookingModalOpen] = useState(false);
  const [isContentCreationModalOpen, setIsContentCreationModalOpen] = useState(false);
  const [isContentPreviewModalOpen, setIsContentPreviewModalOpen] = useState(false);
  const [isContentSuccessModalOpen, setIsContentSuccessModalOpen] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [createdContentId, setCreatedContentId] = useState<string | null>(null);
  const [createdContentTitle, setCreatedContentTitle] = useState<string>('');
  const [contentQueue, setContentQueue] = useState<any[]>([]);
  const [contentView, setContentView] = useState<'queue' | 'suggestions' | 'analytics'>('queue');
  
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
  const [referralData, setReferralData] = useState<any>(null);
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

        // Fetch content queue
        const contentRes = await fetch('/api/admin/content/queue');
        if (contentRes.ok) {
          const contentData = await contentRes.json();
          setContentQueue(contentData.content || []);
        }

        // Fetch all leads
        const leadsRes = await fetch('/api/admin/leads');
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          console.log('📥 [ADMIN] All leads fetched:', leadsData);
          console.log(`📊 [ADMIN] Total leads count: ${leadsData.length}`);
          
          // Separate into categories with detailed logging
          const salonReferrals = leadsData.filter((l: any) => {
            const isSalon = 
              l.leadType === 'salon_referral' || 
              l.source?.includes('salon_referral') ||
              l.source === 'contact_form_salon' ||
              l.source === 'external_booking_intent';
            if (isSalon) {
              console.log('🏪 [ADMIN] Salon Referral detected:', {
                email: l.email,
                leadType: l.leadType,
                source: l.source,
                referralSalon: l.referralSalon
              });
            }
            return isSalon;
          });
          
          const contactEnquiries = leadsData.filter((l: any) => {
            const isContact = (
              l.leadType === 'contact' || 
              l.source === 'contact_form_general'
            );
            if (isContact) {
              console.log('💬 [ADMIN] Contact Enquiry detected:', {
                email: l.email,
                leadType: l.leadType,
                source: l.source
              });
            }
            return isContact;
          });
          
          const educationLeads = leadsData.filter((l: any) => {
            const isEducation = (
              l.leadType === 'education' || 
              (l.source === 'contact_form_education')
            );
            if (isEducation) {
              console.log('🎓 [ADMIN] Education Lead detected:', {
                email: l.email,
                leadType: l.leadType,
                course: l.course
              });
            }
            return isEducation;
          });
          
          const cpdLeads = leadsData.filter((l: any) => {
            const isCPD = ['cpd', 'cpd_partnership'].includes(l.leadType || '') || l.institution;
            if (isCPD) {
              console.log('🏫 [ADMIN] CPD Lead detected:', {
                email: l.email,
                leadType: l.leadType,
                institution: l.institution,
                source: l.source
              });
            }
            return isCPD;
          });
          
          console.log('📊 [ADMIN] Categorization Complete:', {
            total: leadsData.length,
            contactEnquiries: contactEnquiries.length,
            salonReferrals: salonReferrals.length,
            educationLeads: educationLeads.length,
            cpdLeads: cpdLeads.length,
            uncategorized: leadsData.length - (contactEnquiries.length + salonReferrals.length + educationLeads.length + cpdLeads.length)
          });
          
          // Combine contact enquiries and education leads for the "leads" tab
          setLeads([...contactEnquiries, ...educationLeads]);
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
          
          // Merge with existing bookings using functional update to prevent race conditions
          setBookings((prevBookings: any) => {
            // Get existing non-referral bookings to avoid duplicates
            const nonReferralBookings = prevBookings.filter((b: any) => !b.isReferral);
            return [...nonReferralBookings, ...referralBookings];
          });
        }

        // Fetch referral data
        const referralsRes = await fetch('/api/admin/referrals');
        if (referralsRes.ok) {
          const referralsData = await referralsRes.json();
          setReferralData(referralsData);
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
          
          // Filter out salon referrals from education leads
          const salonReferrals = leadsData.filter((l: any) => 
            l.leadType === 'salon_referral' || 
            l.source?.includes('salon_referral') ||
            l.source === 'contact_form_salon' ||
            l.source === 'external_booking_intent'
          );
          
          const educationLeads = leadsData.filter((l: any) => 
            (l.leadType === 'education' || l.source === 'contact_form_education') && 
            !salonReferrals.find((s: any) => s.id === l.id) &&
            !l.institution
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
      sessionStorage.setItem('admin_authenticated', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    alert('Export functionality coming soon!');
  };

  // Content Handlers
  const handleCreateContentRequest = async (request: any) => {
    try {
      const response = await fetch('/api/admin/content/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error('Failed to create content request');

      const data = await response.json();
      const createdContent = data.request;

      // Generate content immediately (manual requests also auto-generate)
      let generatedContentId = null;
      if (createdContent?.id) {
        const genResult = await handleGenerateContent(createdContent.id);
        generatedContentId = genResult?.contentId;
      }

      // Refresh content queue
      await fetchContentQueue();
      setIsContentCreationModalOpen(false);

      // Show success modal with content details - use the generated content ID!
      setCreatedContentId(generatedContentId || createdContent.id);
      setCreatedContentTitle(createdContent.title || createdContent.topic);
      setIsContentSuccessModalOpen(true);
    } catch (error) {
      console.error('Failed to create content request:', error);
      alert('Failed to create content request');
    }
  };

  const handleViewCreatedContent = () => {
    if (createdContentId) {
      setSelectedContentId(createdContentId);
      setIsContentSuccessModalOpen(false);
      setIsContentPreviewModalOpen(true);
    }
  };

  const handleCreateFromSuggestion = async (suggestion: any) => {
    try {
      console.log('🎯 Creating content from suggestion:', suggestion.title);
      
      const response = await fetch('/api/admin/content/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: suggestion.title,
          category: suggestion.category,
          summary: suggestion.rationale,
          audience: suggestion.targetAudience,
          targetKeywords: suggestion.potentialKeywords,
          requestedBy: 'Luke Roberts',
          metadata: { fromSuggestion: true },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create content request');
      }

      const data = await response.json();
      const createdContent = data.request;
      console.log('✅ Content request created:', createdContent.id);

      let generatedContentId = null;

      // Generate immediately
      if (createdContent?.id) {
        console.log('🚀 Starting content generation...');
        const genResult = await handleGenerateContent(createdContent.id);
        generatedContentId = genResult?.contentId;
        console.log('✅ Content generation complete! Content ID:', generatedContentId);
      }
      
      // Refresh the content queue
      await fetchContentQueue();

      // Show success modal with content details - use the generated content ID, not the request ID!
      setCreatedContentId(generatedContentId || createdContent.id);
      setCreatedContentTitle(createdContent.title || createdContent.topic);
      setIsContentSuccessModalOpen(true);
    } catch (error: any) {
      console.error('❌ Failed to create from suggestion:', error);
      alert(`Failed: ${error.message || 'Unknown error'}`);
      throw error; // Re-throw so loading state clears properly
    }
  };

  const handleGenerateContent = async (requestId?: string) => {
    try {
      const response = await fetch('/api/admin/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          reviewedBy: 'Luke Roberts',
        }),
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const result = await response.json();

      // Refresh content queue
      await fetchContentQueue();
      
      return result; // Return the result which contains contentId
    } catch (error) {
      console.error('Failed to generate content:', error);
      alert('Failed to generate content');
      return null;
    }
  };

  const handlePreviewContent = (item: any) => {
    setSelectedContentId(item.id);
    setIsContentPreviewModalOpen(true);
  };

  const handleEditContent = (item: any) => {
    setSelectedContentId(item.id);
    setIsContentPreviewModalOpen(true);
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to archive this content?')) return;

    try {
      const response = await fetch(`/api/admin/content/queue/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete content');

      await fetchContentQueue();
    } catch (error) {
      console.error('Failed to delete content:', error);
      alert('Failed to delete content');
    }
  };

  const handleContentStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/content/queue/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      await fetchContentQueue();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const handleSaveContent = async (updates: any) => {
    if (!selectedContentId) return;

    try {
      const response = await fetch(`/api/admin/content/queue/${selectedContentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to save content');

      await fetchContentQueue();
    } catch (error) {
      console.error('Failed to save content:', error);
      throw error;
    }
  };

  const fetchContentQueue = async () => {
    try {
      const response = await fetch('/api/admin/content/queue');
      if (response.ok) {
        const data = await response.json();
        setContentQueue(data.content || []);
      }
    } catch (error) {
      console.error('Failed to fetch content queue:', error);
    }
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
        onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
        onLogout={handleLogout}
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
                  {activeTab === 'content' && 'Content Engine'}
                  {activeTab === 'referrals' && 'Referral Program'}
                </h1>
                <p className="text-lg text-zinc-400">
                  {activeTab === 'overview' && 'Monitor your business performance'}
                  {activeTab === 'bookings' && 'Hair styling appointments and services'}
                  {activeTab === 'leads' && 'Professional education for stylists and salons'}
                  {activeTab === 'cpd' && 'Educational programs for colleges and institutions'}
                  {activeTab === 'chat' && 'AI chat interactions'}
                  {activeTab === 'services' && 'Manage services and pricing'}
                  {activeTab === 'content' && 'AI-powered content creation and management'}
                  {activeTab === 'referrals' && 'Client-to-client referral tracking and analytics'}
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
                {activeTab === 'content' && (
                  <button 
                    onClick={() => setIsContentCreationModalOpen(true)}
                    className="admin-btn-primary flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Create Content
                  </button>
                )}
                <a 
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn-secondary flex items-center gap-2 no-underline"
                  title="View Main Site"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  View Site
                </a>
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

          {/* Debug Panel - Only visible when there are leads */}
          {(leads.length > 0 || cpdPartnerships.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 admin-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Debug Info</h3>
                <span className="text-xs text-zinc-500">Real-time lead categorization</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-700/50 rounded-lg p-4">
                  <div className="text-sm text-zinc-400 mb-1">Stylist Training</div>
                  <div className="text-2xl font-bold text-white">{leads.length}</div>
                  <div className="text-xs text-zinc-500 mt-2">
                    {leads.slice(0, 2).map(l => l.email).join(', ')}
                    {leads.length > 2 && ` +${leads.length - 2} more`}
                  </div>
                </div>
                <div className="bg-indigo-500/20 rounded-lg p-4 border border-indigo-500/30">
                  <div className="text-sm text-indigo-300 mb-1">College Partnerships</div>
                  <div className="text-2xl font-bold text-white">{cpdPartnerships.length}</div>
                  <div className="text-xs text-indigo-300 mt-2">
                    {cpdPartnerships.slice(0, 2).map(l => l.institution || l.email).join(', ')}
                    {cpdPartnerships.length > 2 && ` +${cpdPartnerships.length - 2} more`}
                  </div>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-300 mb-1">Salon Bookings</div>
                  <div className="text-2xl font-bold text-white">{bookings.filter(b => b.isReferral).length}</div>
                  <div className="text-xs text-purple-300 mt-2">
                    Partner salon referrals
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-zinc-500">
                💡 Check browser console (F12) for detailed categorization logs
              </div>
            </motion.div>
          )}

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
                  <BookingsTable 
                    bookings={bookings} 
                    searchTerm={searchTerm}
                    onViewBooking={handleViewBooking}
                  />
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

            {activeTab === 'content' && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Content View Tabs */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setContentView('queue')}
                    className={contentView === 'queue' ? 'admin-btn-primary' : 'admin-btn-secondary'}
                  >
                    Content Queue
                  </button>
                  <button
                    onClick={() => setContentView('suggestions')}
                    className={contentView === 'suggestions' ? 'admin-btn-primary' : 'admin-btn-secondary'}
                  >
                    AI Suggestions
                  </button>
                  <button
                    onClick={() => setContentView('analytics')}
                    className={contentView === 'analytics' ? 'admin-btn-primary' : 'admin-btn-secondary'}
                  >
                    Analytics
                  </button>
                </div>

                {contentView === 'queue' && (
                  <ContentQueueTable
                    content={contentQueue}
                    onPreview={handlePreviewContent}
                    onEdit={handleEditContent}
                    onDelete={handleDeleteContent}
                    onStatusChange={handleContentStatusChange}
                  />
                )}

                {contentView === 'suggestions' && (
                  <ContentTopicSuggestions onCreateRequest={handleCreateFromSuggestion} />
                )}

                {contentView === 'analytics' && <ContentAnalyticsDashboard />}
              </motion.div>
            )}

            {activeTab === 'referrals' && (
              <motion.div
                key="referrals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {referralData ? (
                  <ReferralsTable
                    leaderboard={referralData.leaderboard || []}
                    aggregateStats={referralData.aggregateStats || {
                      totalCodes: 0,
                      activeCodes: 0,
                      totalRedemptions: 0,
                      totalCompletedBookings: 0,
                      totalDiscountsGiven: 0,
                      overallConversionRate: 0,
                    }}
                  />
                ) : (
                  <div className="text-center py-12 text-zinc-500">
                    Loading referral data...
                  </div>
                )}
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

      <ContentCreationModal
        isOpen={isContentCreationModalOpen}
        onClose={() => setIsContentCreationModalOpen(false)}
        onSubmit={handleCreateContentRequest}
      />

      <ContentSuccessModal
        isOpen={isContentSuccessModalOpen}
        onClose={() => {
          setIsContentSuccessModalOpen(false);
          setCreatedContentId(null);
          setCreatedContentTitle('');
        }}
        onViewContent={handleViewCreatedContent}
        contentTitle={createdContentTitle}
      />

      {selectedContentId && (
        <ContentPreviewModal
          isOpen={isContentPreviewModalOpen}
          onClose={() => {
            setIsContentPreviewModalOpen(false);
            setSelectedContentId(null);
          }}
          contentId={selectedContentId}
          onSave={handleSaveContent}
          onPublish={fetchContentQueue}
        />
      )}
    </div>
  );
}
