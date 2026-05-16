import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, ChevronDown, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RoastHistoryEntry } from '../types';
import { useNotification } from '../context/NotificationContext';
import Navbar from '../components/Navbar';

const STORAGE_KEY = 'roast_history';

export default function HistoryPage() {
  const { showSuccess } = useNotification();
  const [history, setHistory] = useState<RoastHistoryEntry[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Score History \u2014 RoastMyResume';
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as RoastHistoryEntry[];
    setHistory(data);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
    showSuccess('History Cleared', 'All past roasts have been removed.');
  };

  const chartData = history.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    ats: entry.atsScore,
    readability: entry.readabilityScore,
    technical: entry.technicalClarity,
  }));

  const improvement = history.length >= 2
    ? history[history.length - 1].atsScore - history[0].atsScore
    : null;

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Clock className="w-7 h-7 text-brand-purple" />
              <h1 className="text-3xl font-display font-bold text-text-primary">Score History</h1>
            </div>
            <p className="text-text-muted text-sm">Track your resume improvement over time.</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full text-brand-red border border-brand-red/20 hover:bg-brand-red/10 transition-all active:scale-[0.97]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          )}
        </motion.div>

        {history.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <Clock className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <p className="text-text-muted">No roast history yet. Get your first roast to see progress here.</p>
          </motion.div>
        ) : (
          <>
            {/* Improvement Badge */}
            {improvement !== null && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
                  improvement > 0
                    ? 'bg-brand-green/10 border-brand-green/20 text-brand-green'
                    : improvement < 0
                    ? 'bg-brand-red/10 border-brand-red/20 text-brand-red'
                    : 'bg-surface-2 border-[--border-1] text-text-muted'
                }`}>
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {improvement > 0
                      ? `You improved ${improvement} points since your first roast!`
                      : improvement < 0
                      ? `Your ATS score dropped ${Math.abs(improvement)} points since your first roast.`
                      : 'No change in ATS score since your first roast.'
                    }
                  </span>
                </div>
              </motion.div>
            )}

            {/* Chart */}
            {chartData.length >= 2 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 p-6 rounded-2xl bg-surface-2 border border-[--border-1]">
                <h3 className="text-sm font-medium text-text-muted mb-4">Score Progression</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }}
                        labelStyle={{ color: '#f1f0ff' }}
                      />
                      <Line type="monotone" dataKey="ats" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} name="ATS" />
                      <Line type="monotone" dataKey="readability" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Readability" />
                      <Line type="monotone" dataKey="technical" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Technical" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-6 mt-3 justify-center">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand-purple" /><span className="text-xs text-text-muted">ATS</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand-blue" /><span className="text-xs text-text-muted">Readability</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand-green" /><span className="text-xs text-text-muted">Technical</span></div>
                </div>
              </motion.div>
            )}

            {/* Timeline */}
            <div className="space-y-3">
              {[...history].reverse().map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.03 }}
                  className="rounded-xl border border-[--border-1] bg-surface-2 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-3 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-text-muted">
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <div className="flex gap-3">
                        <span className="text-sm font-medium text-brand-purple">{entry.atsScore}</span>
                        <span className="text-sm font-medium text-brand-blue">{entry.readabilityScore}</span>
                        <span className="text-sm font-medium text-brand-green">{entry.technicalClarity}</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${expandedIndex === i ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {expandedIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 space-y-3">
                          <div className="p-3 rounded-lg bg-surface-3 border border-[--border-1]">
                            <p className="text-xs text-text-tertiary mb-1">Roast</p>
                            <p className="text-sm text-text-muted italic leading-relaxed">{entry.roast}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-brand-purple/[0.04] border border-brand-purple/10">
                            <p className="text-xs text-text-tertiary mb-1">Verdict</p>
                            <p className="text-sm text-text-primary font-medium">{entry.finalVerdict}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
