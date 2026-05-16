import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, Copy, Download, RefreshCw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import { generateCoverLetter } from '../utils/ai';
import Navbar from '../components/Navbar';

const tones = [
  { id: 'professional', label: 'Professional', icon: '🎯' },
  { id: 'startup', label: 'Startup Energy', icon: '🚀' },
  { id: 'creative', label: 'Creative', icon: '🎨' },
  { id: 'corporate', label: 'Corporate', icon: '💼' },
  { id: 'friendly', label: 'Friendly', icon: '🤝' },
];

export default function CoverLetterPage() {
  const { resumeText } = useAppContext();
  const { showSuccess, showError } = useNotification();
  const [localResume, setLocalResume] = useState(resumeText || '');
  const [jobDesc, setJobDesc] = useState('');
  const [tone, setTone] = useState('professional');
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    document.title = 'Cover Letter Generator | ResumeRoast';
  }, []);

  const handleGenerate = async () => {
    if (!localResume.trim() || !jobDesc.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateCoverLetter(localResume, jobDesc, tone);
      setCoverLetter(result);
      showSuccess('Cover Letter Ready!', 'Your personalized cover letter has been generated.');
    } catch (err: unknown) {
      showError('Generation Failed', err instanceof Error ? err.message : 'Could not generate cover letter.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!coverLetter) return;
    await navigator.clipboard.writeText(coverLetter);
    showSuccess('Copied!', 'Cover letter copied to clipboard.');
  };

  const handleDownload = () => {
    if (!coverLetter) return;
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover_letter.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess('Downloaded!', 'Cover letter has been downloaded.');
  };

  const handleRegenerate = () => {
    setCoverLetter(null);
    handleGenerate();
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-7 h-7 text-brand-blue" />
            <h1 className="text-3xl font-bold font-display">Cover Letter Generator</h1>
          </div>
          <p className="text-text-muted mb-8">AI writes compelling, personalized cover letters in seconds.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-muted block mb-2">Your Resume</label>
              <textarea
                value={localResume}
                onChange={(e) => setLocalResume(e.target.value)}
                placeholder="Paste your resume text here..."
                rows={6}
                className="w-full p-4 rounded-xl bg-surface-2 border border-[--border-1] text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:border-brand-purple/40 resize-none transition-colors"
              />
              {resumeText && !localResume && (
                <button onClick={() => setLocalResume(resumeText)} className="mt-1 text-xs text-brand-purple hover:underline">
                  Use resume from roast
                </button>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-text-muted block mb-2">Job Description</label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
                className="w-full p-4 rounded-xl bg-surface-2 border border-[--border-1] text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:border-brand-purple/40 resize-none transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text-muted block mb-3">Tone</label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`px-4 py-2 text-sm rounded-full border transition-all active:scale-[0.97] ${
                      tone === t.id
                        ? 'bg-brand-purple/20 border-brand-purple/40 text-text-primary'
                        : 'bg-surface-3 border-[--border-1] text-text-muted hover:text-text-primary hover:border-[--border-2] hover:bg-white/[0.04]'
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !localResume.trim() || !jobDesc.trim()}
              className="w-full py-3.5 text-sm font-semibold rounded-full text-white bg-gradient-to-r from-brand-purple to-brand-purple-dark transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_25px_rgba(139,92,246,0.3)]"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Generating Cover Letter...</span>
              ) : 'Generate Cover Letter'}
            </button>
          </motion.div>

          {/* Output Panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {!coverLetter && !isGenerating && (
              <div className="h-full flex items-center justify-center p-8 rounded-2xl bg-surface-2 border border-[--border-1] border-dashed">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                  <p className="text-text-muted text-sm">Your cover letter will appear here</p>
                </div>
              </div>
            )}

            {isGenerating && !coverLetter && (
              <div className="h-full flex items-center justify-center p-8 rounded-2xl bg-surface-2 border border-[--border-1]">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-brand-purple animate-spin mx-auto mb-3" />
                  <p className="text-text-muted text-sm">Writing your cover letter...</p>
                </div>
              </div>
            )}

            {coverLetter && (
              <div className="rounded-2xl bg-surface-2 border border-[--border-1] overflow-hidden">
                <div className="px-6 py-4 border-b border-[--border-1] flex items-center justify-between">
                  <h3 className="font-semibold text-sm font-display">Your Cover Letter</h3>
                  <div className="flex gap-2">
                    <button onClick={handleRegenerate} className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors active:scale-[0.97]" title="Regenerate">
                      <RefreshCw className="w-4 h-4 text-text-muted" />
                    </button>
                  </div>
                </div>
                <div className="p-6 max-h-[500px] overflow-y-auto">
                  <p className="text-sm text-text-primary whitespace-pre-wrap leading-[1.8]">{coverLetter}</p>
                </div>
                <div className="px-6 py-4 border-t border-[--border-1] flex gap-3">
                  <button onClick={handleCopy} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-full bg-surface-3 border border-[--border-2] text-text-primary hover:bg-white/[0.04] transition-all active:scale-[0.97]">
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-full text-white bg-gradient-to-r from-brand-green to-emerald-600 transition-all active:scale-[0.97]">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
