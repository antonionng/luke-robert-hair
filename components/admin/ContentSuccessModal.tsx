'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Eye, X } from 'lucide-react';

interface ContentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewContent: () => void;
  contentTitle?: string;
}

export default function ContentSuccessModal({
  isOpen,
  onClose,
  onViewContent,
  contentTitle,
}: ContentSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4"
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-white mb-2">
                  Content Created Successfully!
                </h2>
                <p className="text-green-50">
                  Your content has been generated and is ready for review
                </p>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                {contentTitle && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 mb-1">Content Title:</p>
                    <p className="font-semibold text-gray-900">{contentTitle}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={onViewContent}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Eye className="w-5 h-5" />
                    View & Edit Content
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  You can find this content in your content queue anytime
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

