import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Flame } from 'lucide-react';

interface RoastCardProps {
  roast: string;
}

export default function RoastCard({ roast }: RoastCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roast);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 sm:p-8 rounded-2xl bg-dark-card border border-white/[0.06] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-brand-pink/5" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-brand-purple" />
            <h3 className="text-lg font-semibold text-text-primary">Your Resume Roast</h3>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted bg-white/[0.04] border border-white/[0.08] rounded-lg hover:bg-white/[0.08] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Roast'}
          </button>
        </div>
        <p className="text-lg italic text-text-primary/90 leading-relaxed">
          "{roast}"
        </p>
      </div>
    </motion.div>
  );
}
