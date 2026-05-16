import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import { analyzeResume } from '../utils/ai';

const messages = [
  "Scanning for corporate trauma...",
  "Counting buzzwords per sentence...",
  "Simulating recruiter eye-rolls...",
  "Detecting survival probability in meetings...",
  "Translating 'team player' from HR speak...",
  "Measuring synergy levels...",
  "Checking if your font choice is why you got ghosted...",
  "Running ATS compatibility algorithms...",
];

const steps = ['Parsing', 'Analyzing', 'Generating'];

export default function LoadingPage() {
  const navigate = useNavigate();
  const { resumeText, tone, jobDescription, setResult } = useAppContext();
  const { showError, showSuccess } = useNotification();
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const called = useRef(false);

  useEffect(() => { document.title = 'Analyzing... — RoastMyResume'; }, []);

  useEffect(() => {
    if (!resumeText) {
      navigate('/upload', { replace: true });
      return;
    }
    if (called.current) return;
    called.current = true;

    const attemptAnalysis = async () => {
      try {
        const data = await analyzeResume(resumeText, tone, jobDescription);
        setProgress(100);
        setActiveStep(2);
        setResult(data);
        showSuccess('Roast Complete!', 'Your resume has been brutally analyzed.');
        setTimeout(() => navigate('/results', { replace: true }), 400);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Something went wrong with the AI.';
        showError('Analysis Failed', message);
        setTimeout(() => navigate('/upload', { replace: true }), 2000);
      }
    };

    attemptAnalysis();
  }, [resumeText, tone, jobDescription, setResult, navigate, showError, showSuccess]);

  // Fake progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { clearInterval(interval); return 90; }
        const increment = p < 30 ? 2 : p < 60 ? 1 : 0.5;
        return Math.min(p + increment, 90);
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Steps based on progress
  useEffect(() => {
    if (progress < 30) setActiveStep(0);
    else if (progress < 70) setActiveStep(1);
    else setActiveStep(2);
  }, [progress]);

  // Rotating messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-brand-purple/[0.08] rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[20%] left-[20%] w-[300px] h-[300px] bg-brand-blue/[0.06] rounded-full blur-[100px] animate-float [animation-delay:2s]" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-brand-pink/[0.04] rounded-full blur-[80px] animate-float [animation-delay:4s]" />
      </div>

      <div className="relative text-center max-w-md mx-auto">
        {/* Concentric rings animation */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          <div className="absolute inset-0 rounded-full border border-brand-purple/20 animate-pulse-ring" />
          <div className="absolute inset-0 rounded-full border border-brand-blue/15 animate-pulse-ring [animation-delay:0.6s]" />
          <div className="absolute inset-0 rounded-full border border-brand-pink/10 animate-pulse-ring [animation-delay:1.2s]" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-brand-purple/60 to-brand-blue/60 animate-spin-slow" />
          <div className="absolute inset-6 rounded-full bg-dark-bg" />
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-brand-purple/40 to-brand-pink/40 animate-pulse" />
        </div>

        {/* Heading */}
        <h2 className="font-display text-2xl font-bold text-text-primary mb-4">
          Analyzing your resume...
        </h2>

        {/* Rotating message */}
        <div className="h-6 mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-text-muted italic"
            >
              {messages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full h-[3px] bg-surface-3 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-brand-purple rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-4">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i <= activeStep ? 'bg-brand-purple' : 'bg-surface-3'
              }`} />
              <span className={`text-xs transition-colors duration-300 ${
                i <= activeStep ? 'text-text-muted' : 'text-text-tertiary'
              }`}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
