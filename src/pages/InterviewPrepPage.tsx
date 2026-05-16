import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import { generateInterviewQuestions } from '../utils/ai';
import { InterviewQuestion } from '../types';
import Navbar from '../components/Navbar';

const categoryColors: Record<string, string> = {
  behavioral: 'bg-[--blue-subtle] text-brand-blue border-brand-blue/20',
  technical: 'bg-[--green-subtle] text-brand-green border-brand-green/20',
  situational: 'bg-[--amber-subtle] text-brand-amber border-brand-amber/20',
  culture: 'bg-[--purple-subtle] text-brand-purple border-brand-purple/20',
  closing: 'bg-[--pink-glow] text-brand-pink border-brand-pink/20',
};

const difficultyColors: Record<string, string> = {
  easy: 'bg-[--green-subtle] text-brand-green',
  medium: 'bg-[--amber-subtle] text-brand-amber',
  hard: 'bg-[--red-subtle] text-brand-red',
};

export default function InterviewPrepPage() {
  const { resumeText } = useAppContext();
  const { showSuccess, showError } = useNotification();
  const [localResume, setLocalResume] = useState(resumeText || '');
  const [jobDesc, setJobDesc] = useState('');
  const [questions, setQuestions] = useState<InterviewQuestion[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => { document.title = 'Interview Prep — RoastMyResume'; }, []);

  const handleGenerate = async () => {
    if (!localResume.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateInterviewQuestions(localResume, jobDesc);
      setQuestions(result);
      showSuccess('Questions Ready!', '10 interview questions generated based on your profile.');
    } catch (err: unknown) {
      showError('Generation Failed', err instanceof Error ? err.message : 'Could not generate questions.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <Mic className="w-7 h-7 text-brand-purple" />
            <h1 className="font-display text-3xl sm:text-4xl font-bold">Interview Prep</h1>
          </div>
          <p className="text-text-muted mb-8">AI generates likely interview questions with ideal answers based on your experience.</p>
        </motion.div>

        {!questions && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4 max-w-2xl">
            <div>
              <label className="text-sm font-medium text-text-muted block mb-2">Your Resume</label>
              <textarea
                value={localResume}
                onChange={(e) => setLocalResume(e.target.value)}
                placeholder="Paste your resume text here..."
                rows={5}
                className="w-full p-4 rounded-xl bg-surface-2 border border-[--border-1] text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:border-brand-purple/40 resize-none transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text-muted block mb-2">Job Description (optional)</label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste a job description for more targeted questions..."
                rows={4}
                className="w-full p-4 rounded-xl bg-surface-2 border border-[--border-1] text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:border-brand-purple/40 resize-none transition-colors"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !localResume.trim()}
              className={`w-full sm:w-auto px-8 py-3.5 text-sm font-semibold rounded-full transition-all duration-200 active:scale-[0.97] ${
                !isGenerating && localResume.trim()
                  ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)]'
                  : 'bg-surface-3 text-text-tertiary cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Generating Questions...</span>
              ) : 'Generate Interview Questions'}
            </button>
          </motion.div>
        )}

        {questions && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-text-muted">{questions.length} questions generated</p>
              <button
                onClick={() => { setQuestions(null); setExpandedIndex(null); }}
                className="text-xs text-brand-purple hover:underline transition-colors"
              >
                Generate New Questions
              </button>
            </div>

            {questions.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-[--border-1] bg-surface-2 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex gap-2">
                      <span className={`px-2.5 py-0.5 text-xs rounded-full border ${categoryColors[q.category]}`}>
                        {q.category}
                      </span>
                      <span className={`px-2.5 py-0.5 text-xs rounded-full ${difficultyColors[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <span className="text-xs text-text-tertiary">#{i + 1}</span>
                  </div>
                  <p className="text-text-primary font-medium leading-relaxed">{q.question}</p>
                </div>

                <button
                  onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                  className="w-full px-5 py-3 flex items-center justify-between border-t border-[--border-1] hover:bg-surface-3 transition-colors"
                >
                  <span className="text-xs font-medium text-brand-purple">
                    {expandedIndex === i ? 'Hide Ideal Answer' : 'Show Ideal Answer'}
                  </span>
                  {expandedIndex === i ? <ChevronUp className="w-4 h-4 text-brand-purple" /> : <ChevronDown className="w-4 h-4 text-brand-purple" />}
                </button>

                <AnimatePresence>
                  {expandedIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-2">
                        <div className="p-4 rounded-xl bg-[--purple-subtle] border border-brand-purple/10">
                          <p className="text-xs text-text-tertiary mb-2 uppercase tracking-wider">Ideal Answer</p>
                          <p className="text-sm text-text-muted leading-relaxed">{q.idealAnswer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
