import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScoreRingProps {
  score: number;
  label: string;
  size?: number;
  delay?: number;
}

export default function ScoreRing({ score, label, size = 120, delay = 0 }: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

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
      }, 18);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [score, delay]);

  const getColor = (s: number) => {
    if (s < 50) return { stroke: '#ef4444', glow: 'rgba(239,68,68,0.3)' };
    if (s < 75) return { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.3)' };
    if (s < 90) return { stroke: '#3b82f6', glow: 'rgba(59,130,246,0.3)' };
    return { stroke: '#22c55e', glow: 'rgba(34,197,94,0.3)' };
  };

  const colors = getColor(score);
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ delay: delay / 1000 + 0.2, duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-2xl font-medium" style={{ color: colors.stroke }}>
            {displayScore}
          </span>
        </div>
      </div>
      <span className="mt-2 text-xs text-text-muted font-medium tracking-wide uppercase">
        {label}
      </span>
    </motion.div>
  );
}
