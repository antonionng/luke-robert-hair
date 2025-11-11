'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Mail, MessageCircle } from 'lucide-react';

interface ReferralCodeDisplayProps {
  code: string;
  shareUrl: string;
  shareText: string;
}

export default function ReferralCodeDisplay({ code, shareUrl, shareText }: ReferralCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaEmail = () => {
    const emailSubject = 'Get £10 off your first haircut with Luke Robert';
    const emailBody = shareText;
    window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="referral-card p-8 space-y-6"
    >
      {/* Success Message */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4"
        >
          <Check size={32} className="text-white" />
        </motion.div>
        <h3 className="text-2xl font-medium text-graphite mb-2">
          Your Referral Code is Ready!
        </h3>
        <p className="text-graphite/70">
          Share it with friends to give them £10 off and earn £10 off yourself
        </p>
      </div>

      {/* Code Display */}
      <div className="relative">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl p-6">
          <p className="text-sm text-purple-700 font-semibold uppercase tracking-wide text-center mb-2">
            Your Referral Code
          </p>
          <p className="text-4xl font-bold text-center text-purple-600 tracking-wider font-mono mb-4">
            {code}
          </p>
          <button
            onClick={copyCode}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check size={20} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={20} />
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Share Link */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-graphite">Share Link:</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-4 py-3 bg-white border border-purple-200 rounded-lg text-sm text-graphite/70"
          />
          <button
            onClick={copyLink}
            className="px-6 py-3 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-all flex items-center gap-2"
          >
            {copiedLink ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-graphite">Share via:</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={shareViaWhatsApp}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            WhatsApp
          </button>
          <button
            onClick={shareViaEmail}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
          >
            <Mail size={20} />
            Email
          </button>
        </div>
      </div>

      {/* Pre-written Message */}
      <div className="bg-white/50 border-l-4 border-pink-400 rounded-lg p-4">
        <p className="text-xs text-graphite/60 uppercase font-semibold mb-2">
          Suggested Message
        </p>
        <p className="text-sm text-graphite italic">
          "{shareText}"
        </p>
      </div>
    </motion.div>
  );
}

