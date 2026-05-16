import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScoreCardProps {
  label: string;
  score: number;
  delay?: number;
}

export default function ScoreCard({ label, score, delay = 0 }: ScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(current);
        }
      }, 20);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [score, delay]);

  const getColor = (s: number) => {
    if (s < 50) return { text: 'text-red-400', border: 'border-red-500/30', glow: 'shadow-red-500/20' };
    if (s < 75) return { text: 'text-yellow-400', border: 'border-yellow-500/30', glow: 'shadow-yellow-500/20' };
    return { text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' };
  };

  const colors = getColor(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      className={`relative p-6 rounded-2xl bg-dark-card border ${colors.border} shadow-lg ${colors.glow}`}
    >
      <p className="text-sm text-text-muted mb-2">{label}</p>
      <p className={`text-5xl font-bold ${colors.text}`}>{displayScore}</p>
      <div className="mt-3 h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: delay / 1000 + 0.3, duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${score < 50 ? 'bg-red-500' : score < 75 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
        />
      </div>
    </motion.div>
  );
}
