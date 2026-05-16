import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown } from 'lucide-react';
import Navbar from '../components/Navbar';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    description: 'Perfect for trying things out',
    features: [
      '1 resume roast per day',
      'Basic ATS score',
      '1 cover letter per week',
      'Job tracker (unlimited)',
    ],
    cta: 'Get Started',
    href: '/upload',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For active job seekers',
    features: [
      'Unlimited roasts',
      'All 5 tones',
      'Unlimited cover letters',
      'Interview prep (unlimited)',
      'LinkedIn optimizer',
      'Salary insights',
      'Priority AI speed',
      'Cancel anytime',
    ],
    cta: 'Upgrade to Pro',
    href: 'https://buy.stripe.com/placeholder',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Lifetime',
    price: '$49',
    period: ' once',
    description: 'Pay once, own forever',
    features: [
      'Everything in Pro',
      'Forever access',
      'All future features included',
      'Priority support',
    ],
    cta: 'Get Lifetime Access',
    href: 'https://buy.stripe.com/placeholder',
    highlight: false,
    badge: 'Best Value',
    badgeGold: true,
  },
];

export default function PricingPage() {
  useEffect(() => {
    document.title = 'Pricing — RoastMyResume';
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      <Navbar />
      <div className="pt-28 pb-16 px-4 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-purple mb-3">Pricing</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-text-muted text-lg max-w-md mx-auto">
            Start free. Upgrade when you need unlimited access to all career tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className={`relative p-6 rounded-2xl border ${
                plan.highlight
                  ? 'bg-surface-2 border-brand-purple/40 shadow-[0_0_40px_rgba(139,92,246,0.12)]'
                  : 'bg-surface-2 border-[--border-1]'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-semibold rounded-full ${
                  plan.badgeGold
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black'
                    : 'bg-brand-purple text-white'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-lg font-semibold mb-1">{plan.name}</h3>
                <p className="text-text-tertiary text-xs mb-3">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-text-primary">{plan.price}</span>
                  {plan.period && <span className="text-text-muted text-sm">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    {plan.highlight ? (
                      <Zap className="w-4 h-4 text-brand-purple mt-0.5 shrink-0" />
                    ) : plan.badgeGold ? (
                      <Crown className="w-4 h-4 text-brand-amber mt-0.5 shrink-0" />
                    ) : (
                      <Check className="w-4 h-4 text-brand-blue mt-0.5 shrink-0" />
                    )}
                    <span className="text-sm text-text-muted">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`block w-full py-2.5 text-center text-sm font-semibold rounded-full transition-all active:scale-[0.97] ${
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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-text-tertiary text-xs mt-8"
        >
          Payments processed securely via Stripe. Cancel or pause anytime.
        </motion.p>
      </div>
    </div>
  );
}
