import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { RewrittenBullet } from '../types';

interface BulletComparisonProps {
  bullets: RewrittenBullet[];
}

export default function BulletComparison({ bullets }: BulletComparisonProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">Bullet Rewrites</h3>
      {bullets.map((bullet, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.15 }}
          className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-center p-4 rounded-xl bg-dark-card border border-white/[0.06]"
        >
          <div className="p-3 rounded-lg bg-red-500/[0.06] border border-red-500/20">
            <p className="text-xs uppercase tracking-wider text-red-400 mb-1 font-medium">Before</p>
            <p className="text-sm text-text-muted">{bullet.before}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-text-muted hidden md:block" />
          <div className="p-3 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20">
            <p className="text-xs uppercase tracking-wider text-emerald-400 mb-1 font-medium">After</p>
            <p className="text-sm text-text-primary">{bullet.after}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
