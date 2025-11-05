'use client';

import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Calendar, Users, GraduationCap, Building2, 
  MessageSquare, Settings, LogOut, ChevronLeft, ChevronRight,
  TrendingUp, FileText, Sparkles
} from 'lucide-react';
import { useState } from 'react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  stats?: {
    activeLeads: number;
    pendingBookings: number;
    cpdPartnerships: number;
    chatSessions: number;
  };
}

export default function AdminSidebar({ activeTab, onTabChange, onLogout, stats }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, count: null },
    { id: 'bookings', label: 'Salon Bookings', icon: Calendar, count: stats?.pendingBookings },
    { id: 'leads', label: 'Stylist Training', icon: GraduationCap, count: stats?.activeLeads },
    { id: 'cpd', label: 'College Partnerships', icon: Building2, count: stats?.cpdPartnerships },
    { id: 'chat', label: 'Chat Sessions', icon: MessageSquare, count: stats?.chatSessions },
    { id: 'content', label: 'Content Engine', icon: Sparkles, count: null },
    { id: 'services', label: 'Services', icon: Settings, count: null },
  ];

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0, width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col z-50"
    >
      {/* Logo Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="text-lg font-semibold text-white">LR CRM</span>
          </motion.div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight size={18} className="text-zinc-400" />
          ) : (
            <ChevronLeft size={18} className="text-zinc-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={
                isActive
                  ? 'admin-sidebar-item-active w-full'
                  : 'admin-sidebar-item w-full'
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count !== null && item.count !== undefined && item.count > 0 && (
                    <span className={`admin-badge ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-zinc-800">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">LR</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Luke Robert</p>
              <p className="text-xs text-zinc-400 truncate">Administrator</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">LR</span>
            </div>
          </div>
        )}
        
        <button
          onClick={onLogout || (() => window.location.href = '/')}
          className={`admin-sidebar-item w-full ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}

