import { motion } from 'framer-motion';
import { Mail, Phone, Eye, Edit, TrendingUp } from 'lucide-react';

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

interface LeadsTableProps {
  leads: Lead[];
  searchTerm: string;
}

export default function LeadsTable({ leads, searchTerm }: LeadsTableProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      qualified: 'bg-purple-100 text-purple-700',
      converted: 'bg-green-100 text-green-700',
      lost: 'bg-red-100 text-red-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-sage/5 border-b border-mist">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Lead</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Course</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Experience</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Source</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Value</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {filteredLeads.map((lead, index) => (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-sage/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-graphite">{lead.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <a href={`mailto:${lead.email}`} className="text-xs text-graphite/60 hover:text-sage flex items-center gap-1">
                        <Mail size={12} />
                        {lead.email}
                      </a>
                    </div>
                    <a href={`tel:${lead.phone}`} className="text-xs text-graphite/60 hover:text-sage flex items-center gap-1 mt-1">
                      <Phone size={12} />
                      {lead.phone}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-graphite font-medium">{lead.course}</span>
                  <p className="text-xs text-graphite/60 mt-1">Enquired: {new Date(lead.enquiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-graphite">{lead.experienceLevel}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(lead.status)}`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-graphite/70">{lead.source}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} className="text-green-500" />
                    <span className="text-sm font-semibold text-graphite">£{lead.value}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-sage/10 rounded-lg transition-colors" title="View Details">
                      <Eye size={16} className="text-graphite/60" />
                    </button>
                    <button className="p-2 hover:bg-sage/10 rounded-lg transition-colors" title="Edit Lead">
                      <Edit size={16} className="text-graphite/60" />
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
          <p className="text-graphite/60">No leads found</p>
        </div>
      )}
    </div>
  );
}
