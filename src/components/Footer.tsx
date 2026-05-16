import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[--border-1]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-brand-purple" />
            <span className="font-display font-bold text-sm">
              <span className="gradient-text">Roast</span>
              <span className="text-text-primary">MyResume</span>
            </span>
            <span className="text-xs text-text-tertiary ml-2">From Roast to Hired.</span>
          </div>
          <div className="flex gap-6 text-sm text-text-muted">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <Link to="/pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[--border-1] text-center text-xs text-text-tertiary">
          &copy; {new Date().getFullYear()} RoastMyResume. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
