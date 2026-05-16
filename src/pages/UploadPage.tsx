import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, ChevronDown, Lightbulb } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import { parseResume } from '../utils/parseResume';
import Navbar from '../components/Navbar';

const tones = [
  { id: 'Brutal HR', emoji: '🔥', label: 'Brutal HR' },
  { id: 'FAANG Interviewer', emoji: '🧠', label: 'FAANG Interviewer' },
  { id: 'Friendly Mentor', emoji: '🤗', label: 'Friendly Mentor' },
  { id: 'Corporate Politician', emoji: '🏢', label: 'Corporate Politician' },
  { id: 'Startup Founder', emoji: '🚀', label: 'Startup Founder' },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function UploadPage() {
  const navigate = useNavigate();
  const { setResumeText, tone, setTone, jobDescription, setJobDescription } = useAppContext();
  const { showError, showSuccess } = useNotification();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [parsing, setParsing] = useState(false);
  const [showJobDesc, setShowJobDesc] = useState(false);

  useEffect(() => { document.title = 'Upload Resume — RoastMyResume'; }, []);

  const onDrop = useCallback((acceptedFiles: File[], rejections: { file: File }[]) => {
    setError('');
    if (rejections.length > 0) {
      setError('Please upload a PDF or DOCX file under 5MB.');
      showError('Invalid File Type', 'Only PDF and DOCX files are supported.');
      return;
    }
    const f = acceptedFiles[0];
    if (!f) return;
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setError('Only PDF and DOCX files are supported.');
      showError('Invalid File Type', 'Only PDF and DOCX files are supported.');
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setError('File must be under 5MB.');
      showError('File Too Large', 'Your file exceeds 5MB. Please upload a smaller file.');
      return;
    }
    setFile(f);
    showSuccess('File Ready', 'Resume uploaded and ready to roast.');
  }, [showError, showSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const handleSubmit = async () => {
    if (!file) return;
    setParsing(true);
    setError('');
    try {
      const text = await parseResume(file);
      if (!text.trim()) throw new Error('Could not extract text from the file.');
      setResumeText(text);
      navigate('/loading');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to parse file.';
      showError('Parse Error', msg);
      setError('Failed to read file. Try a different one.');
      setParsing(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* Main column */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-purple mb-2">Step 1 of 1</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Upload Your Resume</h1>
            <p className="text-text-muted mb-8">PDF or DOCX &middot; Max 5MB &middot; Processed instantly</p>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`relative p-10 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer min-h-[200px] flex items-center justify-center ${
                isDragActive
                  ? 'border-brand-purple bg-[--purple-subtle] scale-[1.01]'
                  : file
                  ? 'border-brand-green/40 bg-[--green-subtle]'
                  : 'border-[--border-2] hover:border-brand-purple/40 hover:bg-[--purple-subtle]'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center text-center">
                {file ? (
                  <>
                    <CheckCircle className="w-10 h-10 text-brand-green mb-3" />
                    <p className="font-medium text-brand-green">{file.name}</p>
                    <p className="text-sm text-text-muted mt-1">{(file.size / 1024).toFixed(0)} KB &middot; Ready to roast</p>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-2 text-xs text-text-tertiary hover:text-text-primary underline">Change file</button>
                  </>
                ) : (
                  <>
                    <Upload className={`w-10 h-10 mb-3 transition-colors ${isDragActive ? 'text-brand-purple' : 'text-text-tertiary'}`} />
                    <p className="font-medium">Drop your resume here or click to browse</p>
                    <p className="text-sm text-text-muted mt-1">PDF or DOCX, max 5MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-[--red-subtle] border border-brand-red/20">
                  <AlertCircle className="w-4 h-4 text-brand-red shrink-0" />
                  <p className="text-sm text-brand-red">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tone Selector */}
            <div className="mt-8">
              <p className="text-sm font-medium mb-3">Choose your roast tone</p>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`px-4 py-2.5 text-sm rounded-full border transition-all duration-200 active:scale-[0.97] ${
                      tone === t.id
                        ? 'bg-[--purple-subtle] border-brand-purple/40 text-text-primary'
                        : 'bg-surface-3 border-[--border-1] text-text-muted hover:border-[--border-2] hover:bg-surface-4'
                    }`}
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Description */}
            <div className="mt-8">
              <button
                onClick={() => setShowJobDesc(!showJobDesc)}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors py-2"
              >
                <FileText className="w-4 h-4" />
                Add Job Description (optional)
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showJobDesc ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showJobDesc && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description for a more targeted roast..."
                      className="mt-2 w-full h-28 p-4 rounded-xl bg-surface-2 border border-[--border-1] text-sm text-text-primary placeholder:text-text-tertiary resize-none focus:outline-none focus:border-brand-purple/40 transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!file || parsing}
              className={`mt-10 w-full py-4 text-base font-medium rounded-full transition-all duration-200 active:scale-[0.98] ${
                file && !parsing
                  ? 'bg-gradient-to-r from-brand-purple to-brand-purple-dark text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] animate-glow-pulse'
                  : 'bg-surface-3 text-text-tertiary cursor-not-allowed'
              }`}
            >
              {parsing ? 'Parsing resume...' : 'Roast My Resume'}
            </button>
          </motion.div>

          {/* Tips sidebar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block">
            <div className="sticky top-24 p-6 rounded-2xl bg-surface-2 border border-[--border-1]">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-brand-amber" />
                <h3 className="text-sm font-medium">For best results</h3>
              </div>
              <ul className="space-y-3 text-sm text-text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-brand-purple mt-0.5">•</span>
                  Use a single-column layout
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-purple mt-0.5">•</span>
                  Include dates on all positions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-purple mt-0.5">•</span>
                  List skills as text, not graphics
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-purple mt-0.5">•</span>
                  Save as PDF for consistent parsing
                </li>
              </ul>

              <div className="mt-6 p-4 rounded-xl bg-surface-3 border border-[--border-1]">
                <p className="text-xs text-text-tertiary mb-2">You'll get:</p>
                <div className="space-y-1.5">
                  {['ATS Score', 'AI Roast', 'Bullet Rewrites', 'Fixed Resume'].map((item) => (
                    <p key={item} className="text-xs text-text-muted flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-brand-purple" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
