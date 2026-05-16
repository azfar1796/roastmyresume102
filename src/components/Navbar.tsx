import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Flame } from 'lucide-react';

const navLinks = [
  { path: '/cover-letter', label: 'Cover Letter' },
  { path: '/interview-prep', label: 'Interview Prep' },
  { path: '/tracker', label: 'Tracker' },
  { path: '/pricing', label: 'Pricing' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100]">
      {/* Scroll progress */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent z-10">
        <div
          className="h-full bg-brand-purple transition-[width] duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="bg-[rgba(8,8,15,0.8)] backdrop-blur-xl border-b border-[--border-1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <Flame className="w-5 h-5 text-brand-purple group-hover:scale-110 transition-transform duration-200" />
              <span className="text-base font-display font-bold tracking-tight">
                <span className="gradient-text">Roast</span>
                <span className="text-text-primary">MyResume</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-text-primary bg-white/[0.06]'
                      : 'text-text-muted hover:text-text-primary hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/history"
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                History
              </Link>
              <button
                onClick={() => navigate('/upload')}
                className="px-4 py-2 text-sm font-medium text-white rounded-full bg-gradient-to-r from-brand-purple to-brand-purple-dark hover:shadow-[0_0_24px_rgba(139,92,246,0.3)] transition-all duration-200 active:scale-[0.97]"
              >
                Roast My Resume
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-text-muted hover:text-text-primary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-[rgba(8,8,15,0.98)] backdrop-blur-xl z-50"
          >
            <div className="px-6 py-8 space-y-1">
              {[{ path: '/upload', label: 'Resume Roast' }, ...navLinks, { path: '/history', label: 'History' }].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3.5 text-lg rounded-xl transition-colors ${
                    location.pathname === link.path
                      ? 'text-text-primary bg-white/[0.06] font-medium'
                      : 'text-text-muted hover:text-text-primary hover:bg-white/[0.04]'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4">
                <button
                  onClick={() => { navigate('/upload'); setMobileOpen(false); }}
                  className="w-full py-3.5 text-base font-medium text-white rounded-full bg-gradient-to-r from-brand-purple to-brand-purple-dark"
                >
                  Roast My Resume
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
