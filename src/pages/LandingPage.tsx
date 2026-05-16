import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Zap, Target, PenTool, Search, ChevronDown, Flame,
  BarChart3, Clock, Check, X, Star
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AnalysisResult } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const mockData: AnalysisResult = {
  atsScore: 68, readabilityScore: 59, technicalClarity: 77,
  roast: "This resume reads like it was assembled during a fire drill. The skills section is a graveyard of buzzwords nobody asked for.",
  atsIssues: [], suggestions: [],
  rewrittenBullets: [
    { before: "Worked on the company dashboard", after: "Built a React analytics dashboard used by 3,000+ daily active users, reducing report generation time by 40%" },
    { before: "Helped with backend tasks", after: "Developed 12 REST API endpoints in Node.js, cutting average response time from 800ms to 120ms" },
    { before: "Was part of the agile team", after: "Contributed to a 6-engineer scrum team shipping bi-weekly releases with 99.2% uptime" }
  ],
  finalVerdict: "Technically employable. Currently interviewing for roles at companies that haven't opened the email yet."
};

const features = [
  { icon: Target, title: 'ATS Score Analysis', desc: 'See exactly how ATS systems read your resume' },
  { icon: Flame, title: 'Savage AI Roast', desc: 'Brutally honest feedback you actually remember' },
  { icon: BarChart3, title: 'Recruiter Simulation', desc: 'Know what a hiring manager really thinks' },
  { icon: PenTool, title: 'Bullet Rewrites', desc: 'Before/after rewrites that get interviews' },
  { icon: Search, title: 'Keyword Detection', desc: 'Find the missing keywords costing you callbacks' },
  { icon: Zap, title: 'Instant Results', desc: 'Full analysis in under 60 seconds' },
];

const testimonials = [
  { quote: 'Got 3 callbacks the week after fixing my resume based on the roast. This thing is brutally accurate.', name: 'Sarah K.', role: 'Software Engineer', initials: 'SK' },
  { quote: 'The AI called out my resume for exactly what recruiters told me in feedback. Scary good.', name: 'Marcus T.', role: 'Product Manager', initials: 'MT' },
  { quote: 'Downloaded the fixed resume, sent it out, got my dream job interview in 4 days.', name: 'Priya M.', role: 'Data Analyst', initials: 'PM' },
];

const faqs = [
  { q: 'Is my resume stored anywhere?', a: 'No. Your resume is processed in memory and never stored on our servers.' },
  { q: 'What file types are supported?', a: 'PDF and DOCX files up to 5MB. Both are parsed accurately.' },
  { q: 'How accurate is the ATS score?', a: 'Very accurate. We analyze keyword density, formatting, and structure — the same signals ATS systems use.' },
  { q: 'Can I use this for any industry?', a: 'Yes. The AI adapts its feedback based on your industry and role level.' },
  { q: 'How is this different from other resume tools?', a: 'Most tools just check formatting. We simulate an actual recruiter reading your resume and tell you the brutal truth.' },
];

const pricingPlans = [
  {
    name: 'Free', price: '$0', period: '', desc: 'Perfect for trying things out',
    features: ['1 resume roast per day', 'ATS score + basic analysis', '1 cover letter per week', 'Job tracker'],
    excluded: ['Interview prep', 'Unlimited roasts', 'LinkedIn optimizer', 'Priority AI'],
    cta: 'Get Started', href: '/upload', highlight: false,
  },
  {
    name: 'Pro', price: '$9', period: '/month', desc: 'For active job seekers',
    features: ['Everything in Free', 'Unlimited roasts', 'All 5 roast tones', 'Interview prep', 'LinkedIn optimizer', 'Salary insights', 'Priority AI speed', 'PDF + Word downloads'],
    excluded: [], cta: 'Upgrade to Pro', href: 'https://buy.stripe.com/placeholder', highlight: true, badge: 'Most Popular',
  },
  {
    name: 'Lifetime', price: '$49', period: ' once', desc: 'Pay once, own forever',
    features: ['Everything in Pro', 'Forever access', 'All future features', 'Early access to new tools'],
    excluded: [], cta: 'Get Lifetime Access', href: 'https://buy.stripe.com/placeholder', highlight: false, badge: 'Best Value', gold: true,
  },
];

function useCountUp(target: number, trigger: boolean, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(interval); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(interval);
  }, [target, trigger, duration]);
  return value;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { setResult } = useAppContext();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const stat1 = useCountUp(50000, statsVisible);
  const stat2 = useCountUp(1000000, statsVisible, 2000);
  const stat3 = useCountUp(87, statsVisible, 1200);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => { document.title = 'RoastMyResume — Brutal AI Resume Feedback'; }, []);

  const handleExampleRoast = () => { setResult(mockData); navigate('/results'); };

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-brand-purple/[0.12] rounded-full blur-[160px]" />
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-brand-blue/[0.08] rounded-full blur-[140px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center pt-20 pb-16">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[--purple-subtle] border border-brand-purple/20 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
            <span className="text-xs font-medium text-brand-purple-light">AI-Powered Resume Analysis</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-display text-[clamp(2.5rem,8vw,5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] mb-6">
            Your Resume{'\n'}Deserves{' '}
            <span className="gradient-text-animated">Brutal Honesty.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg sm:text-xl text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Upload your resume and get an AI-powered roast, ATS score, and a fully rewritten version — in under 60 seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button
              onClick={() => navigate('/upload')}
              className="px-8 py-3.5 text-base font-medium text-white rounded-full bg-gradient-to-r from-brand-purple to-brand-purple-dark shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-all duration-200 active:scale-[0.97]"
            >
              Upload Resume &rarr;
            </button>
            <button
              onClick={handleExampleRoast}
              className="px-8 py-3.5 text-base font-medium text-text-primary rounded-full border border-[--border-2] hover:bg-white/[0.04] transition-all duration-200 active:scale-[0.97]"
            >
              See Example Roast
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xs text-text-tertiary">
            50,000+ resumes roasted &middot; No signup required &middot; Free to start
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle"
        >
          <ChevronDown className="w-5 h-5 text-text-tertiary" />
        </motion.div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-16 border-y border-[--border-1] bg-surface-1/50">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { value: stat1, suffix: '+', label: 'Resumes Roasted' },
            { value: stat2, suffix: '+', label: 'ATS Issues Found' },
            { value: stat3, suffix: '%', label: 'Score Improvement' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-4xl sm:text-5xl font-bold gradient-text">
                {item.value.toLocaleString()}{item.suffix}
              </p>
              <p className="text-sm text-text-muted mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-purple mb-3">How It Works</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Three steps to a better resume</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', icon: Upload, title: 'Upload', desc: 'Drop your PDF or DOCX. We handle the rest.' },
              { step: '2', icon: Flame, title: 'Get Roasted', desc: 'AI reviews it like a brutal but honest recruiter.' },
              { step: '3', icon: Target, title: 'Get Hired', desc: 'Fix issues, download improved resume, apply.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="relative p-6 rounded-2xl bg-surface-2 border border-[--border-1] hover:border-[--border-2] transition-all duration-200 group"
              >
                <span className="absolute top-4 right-4 font-display text-6xl font-bold text-white/[0.03] select-none">{item.step}</span>
                <div className="w-10 h-10 rounded-xl bg-[--purple-subtle] flex items-center justify-center mb-4 group-hover:bg-brand-purple/15 transition-colors">
                  <item.icon className="w-5 h-5 text-brand-purple" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-purple mb-3">Features</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Everything you need to land the job</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                className="p-5 rounded-xl bg-surface-2 border border-[--border-1] hover:border-brand-purple/20 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-[--purple-subtle] flex items-center justify-center mb-3">
                  <f.icon className="w-4.5 h-4.5 text-brand-purple" />
                </div>
                <h3 className="font-medium text-[15px] mb-1">{f.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Roast */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-purple/[0.06] rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Roast card */}
          <div className="p-6 rounded-2xl bg-surface-2 border border-brand-purple/20 shadow-[0_0_40px_rgba(139,92,246,0.1)]">
            <div className="flex gap-3 mb-5">
              {[
                { score: 68, label: 'ATS', color: 'text-amber-400' },
                { score: 59, label: 'Read', color: 'text-red-400' },
                { score: 77, label: 'Clarity', color: 'text-blue-400' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-[--border-1]">
                  <span className={`font-mono text-sm font-medium ${s.color}`}>{s.score}</span>
                  <span className="text-xs text-text-muted">{s.label}</span>
                </div>
              ))}
            </div>
            <p className="text-lg italic text-text-primary/90 leading-relaxed mb-5 relative">
              <span className="absolute -top-3 -left-2 text-4xl text-brand-purple/30 font-serif">&ldquo;</span>
              {mockData.roast}
            </p>
            <div className="px-3 py-2 rounded-lg bg-[--purple-subtle] border border-brand-purple/20 inline-block">
              <p className="text-xs font-medium gradient-text">{mockData.finalVerdict}</p>
            </div>
          </div>

          {/* Feature list */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-6">What you get with every roast</h3>
            <ul className="space-y-3">
              {[
                'ATS compatibility score',
                'Witty but constructive roast',
                'Specific issues identified',
                'Rewritten bullet points',
                'Final hiring verdict',
                'Improved resume download',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[--green-subtle] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-brand-green" />
                  </div>
                  <span className="text-sm text-text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-purple mb-3">Testimonials</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Real results from real people</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={i} whileHover={{ y: -2 }} className="p-6 rounded-xl bg-surface-2 border border-[--border-1] transition-all duration-200">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-text-primary/90 italic leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-xs font-medium text-text-muted">{t.initials}</div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-purple mb-3">Pricing</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Simple, transparent pricing</h2>
            <p className="text-text-muted mt-3">Start free. Upgrade when you need unlimited access.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className={`relative p-6 rounded-2xl border transition-all duration-200 ${
                  plan.highlight
                    ? 'bg-surface-2 border-brand-purple/40 shadow-[0_0_40px_rgba(139,92,246,0.12)] scale-[1.02]'
                    : 'bg-surface-2 border-[--border-1]'
                }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-semibold rounded-full ${
                    plan.gold ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black' : 'bg-brand-purple text-white'
                  }`}>
                    {plan.badge}
                  </div>
                )}
                <p className="text-sm text-text-muted mb-1">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-sm text-text-muted">{plan.period}</span>}
                </div>
                <p className="text-xs text-text-tertiary mb-5">{plan.desc}</p>
                <div className="h-px bg-[--border-1] mb-5" />
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-text-muted">
                      <Check className="w-3.5 h-3.5 text-brand-green shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.excluded?.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-text-tertiary">
                      <X className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  className={`block w-full py-2.5 text-center text-sm font-medium rounded-full transition-all duration-200 active:scale-[0.97] ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-brand-purple to-brand-purple-dark text-white hover:shadow-[0_0_24px_rgba(139,92,246,0.3)]'
                      : 'border border-[--border-2] text-text-primary hover:bg-white/[0.04]'
                  }`}
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-purple mb-3">FAQ</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Frequently asked questions</h2>
          </div>
          <div className="space-y-0 divide-y divide-[--border-1]">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="font-medium text-[15px] text-text-primary group-hover:text-brand-purple-light transition-colors">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-text-muted shrink-0 ml-4 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="pb-5 text-sm text-text-muted leading-[1.7]">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
