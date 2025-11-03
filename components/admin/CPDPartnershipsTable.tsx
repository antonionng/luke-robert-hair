'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, Eye, Building2, Users, TrendingUp, CheckCircle } from 'lucide-react';

interface CPDPartnership {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  institution: string;
  jobTitle?: string;
  studentNumbers?: number;
  course: string;
  deliveryPreference?: string;
  lifecycle_stage: string;
  score: number;
  estimatedValue: number;
  enquiryDate: string;
}

interface CPDPartnershipsTableProps {
  partnerships: CPDPartnership[];
  searchTerm: string;
  onViewPartnership: (partnership: CPDPartnership) => void;
}

export default function CPDPartnershipsTable({ partnerships, searchTerm, onViewPartnership }: CPDPartnershipsTableProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      contacted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      qualified: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      converted: 'bg-green-500/20 text-green-400 border-green-500/30',
      lost: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return styles[status as keyof typeof styles] || 'bg-zinc-700 text-zinc-400 border-zinc-600';
  };

  const getDeliveryBadge = (preference?: string) => {
    if (!preference) return null;
    const styles = {
      'on-site': 'bg-indigo-500/20 text-indigo-400',
      'online': 'bg-cyan-500/20 text-cyan-400',
      'hybrid': 'bg-purple-500/20 text-purple-400',
    };
    return styles[preference as keyof typeof styles] || 'bg-zinc-700 text-zinc-400';
  };

  const filteredPartnerships = partnerships.filter(partnership => {
    const searchLower = searchTerm.toLowerCase();
    return (
      partnership.name.toLowerCase().includes(searchLower) ||
      partnership.email.toLowerCase().includes(searchLower) ||
      (partnership.institution && partnership.institution.toLowerCase().includes(searchLower)) ||
      (partnership.jobTitle && partnership.jobTitle.toLowerCase().includes(searchLower)) ||
      partnership.course.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="admin-table-header">Institution & Contact</th>
              <th className="admin-table-header">Programme Interest</th>
              <th className="admin-table-header">Details</th>
              <th className="admin-table-header">Status</th>
              <th className="admin-table-header">Est. Value</th>
              <th className="admin-table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartnerships.map((partnership, index) => (
              <motion.tr
                key={partnership.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="admin-table-row border-b border-zinc-800"
              >
                <td className="admin-table-cell">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 size={16} className="text-indigo-400" />
                      <p className="font-semibold text-white">{partnership.institution || 'N/A'}</p>
                    </div>
                    <p className="text-zinc-200 font-medium">{partnership.name}</p>
                    {partnership.jobTitle && (
                      <p className="text-xs text-zinc-400 mt-1">{partnership.jobTitle}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <a 
                        href={`mailto:${partnership.email}`} 
                        className="text-xs text-zinc-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail size={12} />
                        {partnership.email}
                      </a>
                    </div>
                    {partnership.phone && (
                      <a 
                        href={`tel:${partnership.phone}`} 
                        className="text-xs text-zinc-400 hover:text-blue-400 flex items-center gap-1 mt-1 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone size={12} />
                        {partnership.phone}
                      </a>
                    )}
                  </div>
                </td>
                <td className="admin-table-cell">
                  <p className="text-white font-medium">{partnership.course}</p>
                  {partnership.deliveryPreference && (
                    <span className={`admin-badge ${getDeliveryBadge(partnership.deliveryPreference)} mt-2 inline-block`}>
                      {partnership.deliveryPreference}
                    </span>
                  )}
                </td>
                <td className="admin-table-cell">
                  <div className="space-y-2">
                    {partnership.studentNumbers && (
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-zinc-400" />
                        <span className="text-white font-medium">{partnership.studentNumbers}</span>
                        <span className="text-zinc-400 text-sm">students</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className={
                        partnership.score >= 70 ? 'text-green-400' : 
                        partnership.score >= 40 ? 'text-yellow-400' : 
                        'text-red-400'
                      } />
                      <span className={`text-sm font-medium ${
                        partnership.score >= 70 ? 'text-green-400' : 
                        partnership.score >= 40 ? 'text-yellow-400' : 
                        'text-red-400'
                      }`}>
                        Score: {partnership.score}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="admin-table-cell">
                  <span className={`admin-badge border ${getStatusBadge(partnership.lifecycle_stage)}`}>
                    {partnership.lifecycle_stage.charAt(0).toUpperCase() + partnership.lifecycle_stage.slice(1)}
                  </span>
                  <p className="text-xs text-zinc-500 mt-2">
                    {new Date(partnership.enquiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </td>
                <td className="admin-table-cell">
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} className="text-green-400" />
                    <span className="text-lg font-bold text-green-400">£{partnership.estimatedValue}</span>
                  </div>
                </td>
                <td className="admin-table-cell">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewPartnership(partnership);
                      }}
                      className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors group" 
                      title="View Details"
                    >
                      <Eye size={16} className="text-zinc-400 group-hover:text-blue-400" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredPartnerships.length === 0 && (
        <div className="text-center py-12">
          <Building2 size={48} className="text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400">No CPD partnerships found</p>
        </div>
      )}
    </div>
  );
}



