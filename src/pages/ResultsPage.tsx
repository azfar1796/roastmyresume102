import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RotateCcw, Copy, Twitter, AlertTriangle, Lightbulb, Check,
  Clipboard, Loader2, Wrench, Target, Linkedin, DollarSign, FileText, FileType
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import {
  fixResume, scoreJobMatch, tailorResume,
  generateLinkedInHeadlines, generateLinkedInSummary, getSalaryInsights
} from '../utils/ai';
import { downloadAsPDF, downloadAsWord } from '../utils/downloadResume';
import { JobMatchResult, SalaryInsight } from '../types';
import Navbar from '../components/Navbar';
import ScoreCard from '../components/ScoreCard';
import RoastCard from '../components/RoastCard';
import BulletComparison from '../components/BulletComparison';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { result, resumeText, clearAll } = useAppContext();
  const { showSuccess, showWarning, showError } = useNotification();
  const [copied, setCopied] = useState(false);

  // Fix Resume state
  const [fixedResume, setFixedResume] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);

  // Job Match state
  const [matchJD, setMatchJD] = useState('');
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [tailoredResume, setTailoredResume] = useState<string | null>(null);
  const [isTailoring, setIsTailoring] = useState(false);

  // LinkedIn state
  const [headlines, setHeadlines] = useState<string[] | null>(null);
  const [linkedInSummary, setLinkedInSummary] = useState<string | null>(null);
  const [isGeneratingHeadlines, setIsGeneratingHeadlines] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Salary state
  const [salaryData, setSalaryData] = useState<SalaryInsight | null>(null);
  const [isLoadingSalary, setIsLoadingSalary] = useState(false);

  // Tab state for sections
  const [activeTab, setActiveTab] = useState<'results' | 'jobmatch'>('results');

  useEffect(() => {
    if (!result) {
      showWarning('No Results Found', 'Please upload a resume first.');
      navigate('/upload', { replace: true });
    }
  }, [result, navigate, showWarning]);

  useEffect(() => {
    if (result) {
      const history = JSON.parse(localStorage.getItem('roast_history') || '[]');
      const entry = {
        date: Date.now(),
        atsScore: result.atsScore,
        readabilityScore: result.readabilityScore,
        technicalClarity: result.technicalClarity,
        roast: result.roast,
        finalVerdict: result.finalVerdict,
      };
      history.push(entry);
      localStorage.setItem('roast_history', JSON.stringify(history));
    }
  }, [result]);

  if (!result) return null;

  const getFullText = () => {
    return `ATS Score: ${result.atsScore}/100\nReadability: ${result.readabilityScore}/100\nTechnical Clarity: ${result.technicalClarity}/100\n\nRoast: ${result.roast}\n\nATS Issues:\n${result.atsIssues.map((i) => `- ${i}`).join('\n')}\n\nSuggestions:\n${result.suggestions.map((s) => `- ${s}`).join('\n')}\n\nBullet Rewrites:\n${result.rewrittenBullets.map((b) => `Before: ${b.before}\nAfter: ${b.after}`).join('\n\n')}\n\nVerdict: ${result.finalVerdict}`;
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(getFullText());
      setCopied(true);
      showSuccess('Copied!', 'Results copied to clipboard successfully.');
      setTimeout(() => setCopied(false), 2000);
    } catch { /* */ }
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(
      `My resume just got roasted by AI\n\nATS Score: ${result.atsScore}/100\n\n"${result.roast.slice(0, 120)}..."\n\nTry RoastMyResume`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleRoastAnother = () => {
    clearAll();
    navigate('/upload');
  };

  const handleFixResume = async () => {
    setIsFixing(true);
    try {
      const improved = await fixResume(resumeText, result.roast, result.atsIssues, result.suggestions);
      setFixedResume(improved);
      showSuccess('Resume Fixed!', 'Your improved resume is ready to download.');
    } catch (err: unknown) {
      showError('Fix Failed', err instanceof Error ? err.message : 'Could not generate improved resume.');
    } finally {
      setIsFixing(false);
    }
  };

  const handleDownloadPDF = (text: string) => {
    downloadAsPDF(text);
    showSuccess('Preparing PDF', "Print dialog will open. Choose 'Save as PDF'.");
  };

  const handleDownloadWord = (text: string) => {
    downloadAsWord(text);
    showSuccess('Downloaded!', 'Opening in Word or Google Docs.');
  };

  const handleCopyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    showSuccess('Copied!', 'Text copied to clipboard.');
  };

  const handleJobMatch = async () => {
    if (!matchJD.trim()) return;
    setIsMatching(true);
    try {
      const data = await scoreJobMatch(resumeText, matchJD);
      setMatchResult(data);
    } catch (err: unknown) {
      showError('Match Failed', err instanceof Error ? err.message : 'Could not analyze job match.');
    } finally {
      setIsMatching(false);
    }
  };

  const handleTailorResume = async () => {
    if (!matchJD.trim()) return;
    setIsTailoring(true);
    try {
      const tailored = await tailorResume(resumeText, matchJD);
      setTailoredResume(tailored);
      showSuccess('Resume Tailored!', 'Your resume has been customized for this role.');
    } catch (err: unknown) {
      showError('Tailor Failed', err instanceof Error ? err.message : 'Could not tailor resume.');
    } finally {
      setIsTailoring(false);
    }
  };

  const handleLinkedInHeadlines = async () => {
    setIsGeneratingHeadlines(true);
    try {
      const data = await generateLinkedInHeadlines(resumeText);
      setHeadlines(data);
    } catch (err: unknown) {
      showError('Failed', err instanceof Error ? err.message : 'Could not generate headlines.');
    } finally {
      setIsGeneratingHeadlines(false);
    }
  };

  const handleLinkedInSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const data = await generateLinkedInSummary(resumeText);
      setLinkedInSummary(data);
    } catch (err: unknown) {
      showError('Failed', err instanceof Error ? err.message : 'Could not generate summary.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSalaryInsights = async () => {
    setIsLoadingSalary(true);
    try {
      const data = await getSalaryInsights(resumeText);
      setSalaryData(data);
    } catch (err: unknown) {
      showError('Failed', err instanceof Error ? err.message : 'Could not get salary insights.');
    } finally {
      setIsLoadingSalary(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score < 50) return 'text-red-400';
    if (score < 75) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6"
        >
          Your Roast Results
        </motion.h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'results'
                ? 'bg-brand-purple/20 border border-brand-purple/40 text-text-primary'
                : 'bg-white/[0.04] border border-white/[0.08] text-text-muted hover:text-text-primary'
            }`}
          >
            Roast Results
          </button>
          <button
            onClick={() => setActiveTab('jobmatch')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'jobmatch'
                ? 'bg-brand-purple/20 border border-brand-purple/40 text-text-primary'
                : 'bg-white/[0.04] border border-white/[0.08] text-text-muted hover:text-text-primary'
            }`}
          >
            <Target className="w-4 h-4" />
            Job Match
          </button>
        </div>

        {activeTab === 'results' && (
          <>
            {/* Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <ScoreCard label="ATS Score" score={result.atsScore} delay={0} />
              <ScoreCard label="Readability" score={result.readabilityScore} delay={200} />
              <ScoreCard label="Technical Clarity" score={result.technicalClarity} delay={400} />
            </div>

            {/* Roast */}
            <div className="mb-8">
              <RoastCard roast={result.roast} />
            </div>

            {/* ATS Issues */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                ATS Flags
              </h3>
              <div className="space-y-2">
                {result.atsIssues.map((issue, i) => (
                  <div key={i} className="p-4 rounded-xl bg-red-500/[0.04] border border-red-500/10">
                    <p className="text-sm text-red-300/90">{issue}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Suggestions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-8">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-brand-blue" />
                Suggestions
              </h3>
              <div className="space-y-2">
                {result.suggestions.map((suggestion, i) => (
                  <div key={i} className="p-4 rounded-xl bg-brand-blue/[0.04] border border-brand-blue/10">
                    <p className="text-sm text-blue-300/90">{suggestion}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bullet Rewrites */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mb-8">
              <BulletComparison bullets={result.rewrittenBullets} />
            </motion.div>

            {/* Final Verdict */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="p-8 rounded-2xl bg-dark-card border border-white/[0.06] text-center mb-10"
            >
              <p className="text-sm text-text-muted mb-2">The Verdict</p>
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent leading-relaxed">
                {result.finalVerdict}
              </p>
            </motion.div>

            {/* Fix My Resume Section */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mb-10">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-dark-card to-dark-bg border border-brand-purple/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-brand-blue/5 pointer-events-none" />
                <div className="relative text-center">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <Wrench className="w-6 h-6 text-brand-blue" />
                    <h3 className="text-2xl font-bold text-text-primary">Want a Better Resume? Let AI Fix It.</h3>
                  </div>
                  <p className="text-text-muted text-sm max-w-lg mx-auto mb-8">
                    Based on your roast, our AI will rewrite your entire resume with stronger bullets, better keywords, and ATS-friendly formatting.
                  </p>

                  {!fixedResume && (
                    <button
                      onClick={handleFixResume}
                      disabled={isFixing}
                      className="w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-xl text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02]"
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                        boxShadow: isFixing ? 'none' : '0 0 30px rgba(139, 92, 246, 0.4)',
                      }}
                    >
                      {isFixing ? (
                        <span className="flex items-center justify-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          AI is rewriting your resume...
                        </span>
                      ) : (
                        'Generate Improved Resume'
                      )}
                    </button>
                  )}

                  {fixedResume && (
                    <ResumePreviewCard
                      title="Your Improved Resume"
                      subtitle="AI-rewritten based on your roast feedback"
                      text={fixedResume}
                      onCopy={() => handleCopyText(fixedResume)}
                      onDownloadPDF={() => handleDownloadPDF(fixedResume)}
                      onDownloadWord={() => handleDownloadWord(fixedResume)}
                    />
                  )}
                </div>
              </div>
            </motion.div>

            {/* Salary Insights */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mb-10">
              <div className="p-6 rounded-2xl bg-dark-card border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold">Salary Insights for Your Profile</h3>
                </div>

                {!salaryData && (
                  <button
                    onClick={handleSalaryInsights}
                    disabled={isLoadingSalary}
                    className="px-5 py-2.5 text-sm font-medium rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                  >
                    {isLoadingSalary ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Analyzing...</span>
                    ) : 'Get Salary Insights'}
                  </button>
                )}

                {salaryData && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10 text-center">
                        <p className="text-2xl font-bold text-emerald-400">
                          ${salaryData.estimatedRange.min.toLocaleString()} - ${salaryData.estimatedRange.max.toLocaleString()}
                        </p>
                        <p className="text-xs text-text-muted mt-1">Estimated Range (USD)</p>
                      </div>
                      <div className="p-4 rounded-xl bg-brand-blue/[0.04] border border-brand-blue/10 text-center">
                        <p className="text-lg font-bold text-brand-blue capitalize">{salaryData.level}</p>
                        <p className="text-xs text-text-muted mt-1">Experience Level</p>
                      </div>
                      <div className="p-4 rounded-xl bg-brand-purple/[0.04] border border-brand-purple/10">
                        <p className="text-xs text-text-muted mb-2">Top Hiring Cities</p>
                        {salaryData.topHiringCities.map((city, i) => (
                          <p key={i} className="text-sm text-text-primary">{city}</p>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-yellow-500/[0.04] border border-yellow-500/10">
                      <p className="text-xs text-text-muted mb-2">Skills That Could Boost Salary by 20%+</p>
                      <div className="flex flex-wrap gap-2">
                        {salaryData.salaryBoostSkills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 text-xs rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-text-muted italic">AI-estimated based on resume analysis. Not guaranteed.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* LinkedIn Section */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="mb-10">
              <div className="p-6 rounded-2xl bg-dark-card border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-4">
                  <Linkedin className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold">Fix Your LinkedIn Too</h3>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={handleLinkedInHeadlines}
                    disabled={isGeneratingHeadlines}
                    className="px-5 py-2.5 text-sm font-medium rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 transition-all disabled:opacity-50"
                  >
                    {isGeneratingHeadlines ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Generating...</span>
                    ) : 'Generate LinkedIn Headlines'}
                  </button>
                  <button
                    onClick={handleLinkedInSummary}
                    disabled={isGeneratingSummary}
                    className="px-5 py-2.5 text-sm font-medium rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 transition-all disabled:opacity-50"
                  >
                    {isGeneratingSummary ? (
                      <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Generating...</span>
                    ) : 'Generate LinkedIn Summary'}
                  </button>
                </div>

                {headlines && (
                  <div className="space-y-2 mb-4">
                    <p className="text-xs text-text-muted uppercase tracking-wider">Headline Options</p>
                    {headlines.map((h, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                        <p className="text-sm text-text-primary">{h}</p>
                        <button onClick={() => handleCopyText(h)} className="shrink-0 p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors">
                          <Clipboard className="w-4 h-4 text-text-muted" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {linkedInSummary && (
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-2">About Section</p>
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                      <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{linkedInSummary}</p>
                      <button
                        onClick={() => handleCopyText(linkedInSummary)}
                        className="mt-3 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 transition-colors"
                      >
                        Copy Summary
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleRoastAnother} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-xl bg-brand-purple/10 border border-brand-purple/30 text-text-primary hover:bg-brand-purple/20 transition-all min-h-[44px]">
                <RotateCcw className="w-4 h-4" />
                Roast Another Resume
              </button>
              <button onClick={copyAll} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary hover:bg-white/[0.08] transition-all min-h-[44px]">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Full Results'}
              </button>
              <button onClick={shareTwitter} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary hover:bg-white/[0.08] transition-all min-h-[44px]">
                <Twitter className="w-4 h-4" />
                Share on Twitter
              </button>
            </div>
          </>
        )}

        {activeTab === 'jobmatch' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-dark-card border border-white/[0.06]">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-blue" />
                Job Match Scorer
              </h3>
              <textarea
                value={matchJD}
                onChange={(e) => setMatchJD(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
                className="w-full p-4 rounded-xl bg-dark-bg border border-white/[0.08] text-text-primary text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-brand-purple/40 resize-none"
              />
              <button
                onClick={handleJobMatch}
                disabled={isMatching || !matchJD.trim()}
                className="mt-4 px-6 py-3 text-sm font-medium rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
              >
                {isMatching ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Analyzing Match...</span>
                ) : 'Analyze Match'}
              </button>
            </div>

            {matchResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="p-6 rounded-2xl bg-dark-card border border-white/[0.06] text-center">
                  <p className="text-sm text-text-muted mb-2">Match Score</p>
                  <p className={`text-6xl font-bold ${getMatchColor(matchResult.matchScore)}`}>
                    {matchResult.matchScore}%
                  </p>
                  <div className="mt-3 h-2 rounded-full bg-white/[0.06] max-w-xs mx-auto">
                    <div
                      className={`h-full rounded-full transition-all ${
                        matchResult.matchScore < 50 ? 'bg-red-500' : matchResult.matchScore < 75 ? 'bg-yellow-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${matchResult.matchScore}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Strong Matches</p>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.strongMatches.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-300">{kw}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-red-500/[0.04] border border-red-500/10">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Missing Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.missingKeywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs rounded-full bg-red-500/10 text-red-300">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-brand-blue/[0.04] border border-brand-blue/10">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Improvements to Reach 90%+</p>
                  <ul className="space-y-1.5">
                    {matchResult.improvements.map((imp, i) => (
                      <li key={i} className="text-sm text-blue-300/90">• {imp}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleTailorResume}
                  disabled={isTailoring}
                  className="w-full sm:w-auto px-6 py-3 text-sm font-medium rounded-xl text-white transition-all disabled:opacity-50 hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
                >
                  {isTailoring ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Tailoring Resume...</span>
                  ) : 'Tailor My Resume for This Job'}
                </button>

                {tailoredResume && (
                  <ResumePreviewCard
                    title="Tailored Resume"
                    subtitle="Customized for this specific job description"
                    text={tailoredResume}
                    onCopy={() => handleCopyText(tailoredResume)}
                    onDownloadPDF={() => handleDownloadPDF(tailoredResume)}
                    onDownloadWord={() => handleDownloadWord(tailoredResume)}
                  />
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ResumePreviewCard({ title, subtitle, text, onCopy, onDownloadPDF, onDownloadWord }: {
  title: string;
  subtitle: string;
  text: string;
  onCopy: () => void;
  onDownloadPDF: () => void;
  onDownloadWord: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-left">
      <div className="rounded-xl border border-emerald-500/30 bg-dark-card/80 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-500/20 flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-400" />
          <h4 className="font-semibold text-text-primary">{title}</h4>
          <span className="text-xs text-text-muted ml-2">{subtitle}</span>
        </div>
        <div className="p-6 max-h-[500px] overflow-y-auto" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <pre className="whitespace-pre-wrap font-mono text-sm leading-[1.8] text-text-primary/90">{text}</pre>
        </div>
        <div className="px-6 py-4 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={onCopy} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-xl bg-white/[0.04] border border-white/[0.08] text-text-primary hover:bg-white/[0.08] transition-all">
              <Clipboard className="w-4 h-4" />
              Copy Resume
            </button>
            <button onClick={onDownloadPDF} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-xl bg-red-500/[0.08] border border-red-500/30 text-red-300 hover:bg-red-500/[0.15] transition-all">
              <FileText className="w-4 h-4" />
              Download PDF
            </button>
            <button onClick={onDownloadWord} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-xl bg-blue-500/[0.08] border border-blue-500/30 text-blue-300 hover:bg-blue-500/[0.15] transition-all">
              <FileType className="w-4 h-4" />
              Download Word
            </button>
          </div>
          <p className="text-xs text-text-muted text-center mt-3">PDF works everywhere - Word lets you edit further</p>
        </div>
      </div>
    </motion.div>
  );
}
