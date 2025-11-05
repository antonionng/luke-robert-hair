import { motion } from 'framer-motion';
import { MessageSquare, Clock, CheckCircle, HelpCircle, XCircle, Eye } from 'lucide-react';

interface ChatSession {
  id: string;
  timestamp: string;
  duration: string;
  messages: number;
  outcome: 'booking' | 'enquiry' | 'info' | 'abandoned';
  page: string;
}

interface ChatSessionsTableProps {
  sessions: ChatSession[];
}

export default function ChatSessionsTable({ sessions }: ChatSessionsTableProps) {
  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'booking':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'enquiry':
        return <MessageSquare size={18} className="text-blue-500" />;
      case 'info':
        return <HelpCircle size={18} className="text-purple-500" />;
      case 'abandoned':
        return <XCircle size={18} className="text-red-500" />;
      default:
        return <MessageSquare size={18} className="text-gray-500" />;
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    const styles = {
      booking: 'bg-green-100 text-green-700',
      enquiry: 'bg-blue-100 text-blue-700',
      info: 'bg-purple-100 text-purple-700',
      abandoned: 'bg-red-100 text-red-700',
    };
    return styles[outcome as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-sage/5 border-b border-mist">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Session ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Timestamp</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Duration</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Messages</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Page</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Outcome</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {sessions.map((session, index) => (
              <motion.tr
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-sage/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-graphite/70">{session.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-graphite">{session.timestamp}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-graphite/60" />
                    <span className="text-sm text-graphite">{session.duration}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-graphite/60" />
                    <span className="text-sm text-graphite">{session.messages}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-graphite/70 font-mono">{session.page}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getOutcomeIcon(session.outcome)}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOutcomeBadge(session.outcome)}`}>
                      {session.outcome ? session.outcome.charAt(0).toUpperCase() + session.outcome.slice(1) : 'Unknown'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-sage/10 rounded-lg transition-colors" title="View Transcript">
                    <Eye size={16} className="text-graphite/60" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {sessions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-graphite/60">No chat sessions found</p>
        </div>
      )}
    </div>
  );
}
