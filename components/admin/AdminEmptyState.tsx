'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function AdminEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: AdminEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-zinc-400" />
      </div>
      <h3 className="text-xl font-semibold text-zinc-200 mb-2">{title}</h3>
      <p className="text-zinc-400 text-center max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="admin-btn-primary">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}



