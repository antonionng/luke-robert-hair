import { motion } from 'framer-motion';
import { Mail, Phone, Eye, Edit, TrendingUp } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  experienceLevel?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  enquiryDate: string;
  value: number;
  notes?: string;
  // CPD-specific fields
  leadType?: 'stylist' | 'cpd_partnership' | 'cpd' | 'education';
  institution?: string;
  jobTitle?: string;
  studentNumbers?: number;
}

interface LeadsTableProps {
  leads: Lead[];
  searchTerm: string;
  leadTypeFilter?: 'all' | 'stylist' | 'cpd_partnership' | 'cpd' | 'education';
  onViewLead?: (lead: Lead) => void;
}

export default function LeadsTable({ leads, searchTerm, leadTypeFilter = 'all', onViewLead }: LeadsTableProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      contacted: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      qualified: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      converted: 'bg-green-500/20 text-green-400 border border-green-500/30',
      lost: 'bg-red-500/20 text-red-400 border border-red-500/30',
    };
    return styles[status as keyof typeof styles] || 'bg-zinc-700 text-zinc-400 border border-zinc-600';
  };

  const getLeadTypeBadge = (leadType?: string) => {
    if (leadType === 'cpd_partnership') {
      return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
    }
    return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
  };

  const filteredLeads = leads.filter(lead => {
    // Filter by lead type
    if (leadTypeFilter !== 'all') {
      if (leadTypeFilter === 'cpd' || leadTypeFilter === 'cpd_partnership') {
        // Match both 'cpd' and 'cpd_partnership' when CPD filter is active
        if (!['cpd', 'cpd_partnership'].includes(lead.leadType || '')) {
          return false;
        }
      } else if (lead.leadType !== leadTypeFilter) {
        return false;
      }
    }

    // Filter by search term
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.course.toLowerCase().includes(searchLower) ||
      (lead.institution && lead.institution.toLowerCase().includes(searchLower)) ||
      (lead.jobTitle && lead.jobTitle.toLowerCase().includes(searchLower))
    );
  });

  const isCPDView = leadTypeFilter === 'cpd_partnership' || leadTypeFilter === 'cpd';

  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="admin-table-header">Lead</th>
              <th className="admin-table-header">Course</th>
              <th className="admin-table-header">Experience</th>
              <th className="admin-table-header">Status</th>
              <th className="admin-table-header">Source</th>
              <th className="admin-table-header">Value</th>
              <th className="admin-table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead, index) => (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="admin-table-row border-b border-zinc-800"
              >
                <td className="admin-table-cell">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{lead.name}</p>
                      {lead.leadType === 'cpd_partnership' && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getLeadTypeBadge(lead.leadType)}`}>
                          CPD
                        </span>
                      )}
                    </div>
                    {lead.jobTitle && (
                      <p className="text-xs text-zinc-400 mt-1">{lead.jobTitle}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <a href={`mailto:${lead.email}`} className="text-xs text-zinc-400 hover:text-blue-400 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Mail size={12} />
                        {lead.email}
                      </a>
                    </div>
                    <a href={`tel:${lead.phone}`} className="text-xs text-zinc-400 hover:text-blue-400 flex items-center gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
                      <Phone size={12} />
                      {lead.phone}
                    </a>
                  </div>
                </td>
                <td className="admin-table-cell">
                  {lead.leadType === 'cpd_partnership' && lead.institution ? (
                    <>
                      <span className="text-sm text-white font-medium">{lead.institution}</span>
                      <p className="text-xs text-zinc-400 mt-1">{lead.course}</p>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-white font-medium">{lead.course}</span>
                      <p className="text-xs text-zinc-400 mt-1">
                        Enquired: {new Date(lead.enquiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </>
                  )}
                </td>
                <td className="admin-table-cell">
                  {lead.leadType === 'cpd_partnership' && lead.studentNumbers ? (
                    <span className="text-sm text-zinc-200">
                      {lead.studentNumbers} students
                    </span>
                  ) : (
                    <span className="text-sm text-zinc-200">{lead.experienceLevel || 'N/A'}</span>
                  )}
                </td>
                <td className="admin-table-cell">
                  <span className={`admin-badge ${getStatusBadge(lead.status || 'new')}`}>
                    {lead.status ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1) : 'New'}
                  </span>
                </td>
                <td className="admin-table-cell">
                  <span className="text-sm text-zinc-400">{lead.source}</span>
                </td>
                <td className="admin-table-cell">
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} className="text-green-400" />
                    <span className="text-sm font-semibold text-green-400">£{lead.value}</span>
                  </div>
                </td>
                <td className="admin-table-cell">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewLead && onViewLead(lead);
                      }}
                      className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors group" 
                      title="View Details"
                    >
                      <Eye size={16} className="text-zinc-400 group-hover:text-blue-400" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewLead && onViewLead(lead);
                      }}
                      className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors group" 
                      title="Edit Lead"
                    >
                      <Edit size={16} className="text-zinc-400 group-hover:text-blue-400" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-400">No leads found</p>
        </div>
      )}
    </div>
  );
}
