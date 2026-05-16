import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const DISMISS_KEY = 'upgrade_banner_dismissed';
const DISMISS_DURATION = 600000; // 10 minutes

export default function UpgradeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const elapsed = Date.now() - parseInt(dismissed, 10);
      if (elapsed < DISMISS_DURATION) return;
    }

    const roastCount = JSON.parse(localStorage.getItem('roast_history') || '[]').length;
    if (roastCount >= 1) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-dark-card/95 backdrop-blur-xl border-t border-brand-purple/20 shadow-[0_-4px_40px_rgba(139,92,246,0.15)]">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <p className="text-sm text-text-primary">
          <span className="font-semibold">Unlock unlimited roasts, interview prep & more</span>
          <span className="text-text-muted ml-2 hidden sm:inline">$9/month or $49 lifetime</span>
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/pricing"
            className="px-4 py-1.5 text-sm font-medium text-white rounded-lg bg-brand-purple hover:bg-brand-purple/90 transition-colors whitespace-nowrap"
          >
            Upgrade to Pro
          </Link>
          <button onClick={dismiss} className="p-1 text-text-muted hover:text-text-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
