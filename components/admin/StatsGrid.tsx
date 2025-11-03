import { motion } from 'framer-motion';
import { Users, Calendar, GraduationCap, DollarSign, TrendingUp, MessageSquare, Target, Clock } from 'lucide-react';

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

interface StatsGridProps {
  stats: Stats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statCards = [
    {
      icon: DollarSign,
      label: 'Monthly Revenue',
      value: `£${stats.monthlyRevenue.toLocaleString()}`,
      change: '+12%',
      color: 'bg-green-500'
    },
    {
      icon: Calendar,
      label: 'Pending Bookings',
      value: stats.pendingBookings,
      change: '+3',
      color: 'bg-blue-500'
    },
    {
      icon: GraduationCap,
      label: 'Active Leads',
      value: stats.activeLeads,
      change: '+2',
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      label: 'Total Contacts',
      value: stats.totalContacts,
      change: '+24',
      color: 'bg-sage'
    },
    {
      icon: Target,
      label: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      change: '+5%',
      color: 'bg-orange-500'
    },
    {
      icon: Clock,
      label: 'Avg Booking Value',
      value: `£${stats.avgBookingValue}`,
      change: '+£8',
      color: 'bg-pink-500'
    },
    {
      icon: MessageSquare,
      label: 'Chat Sessions',
      value: stats.chatSessions,
      change: '+12',
      color: 'bg-indigo-500'
    },
    {
      icon: TrendingUp,
      label: 'Published Posts',
      value: stats.publishedPosts,
      change: 'Active',
      color: 'bg-teal-500'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="admin-card-hover p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <stat.icon className="text-white" size={24} />
            </div>
            <span className="text-sm text-green-400 font-medium">{stat.change}</span>
          </div>
          <p className="text-3xl font-bold mb-1 text-white">{stat.value}</p>
          <p className="text-zinc-400 text-sm">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
