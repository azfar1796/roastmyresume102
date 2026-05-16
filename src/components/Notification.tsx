import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Notification as NotificationType, useNotification } from '../context/NotificationContext';

const typeConfig = {
  error: { color: '#ef4444', icon: AlertCircle, label: 'Error' },
  success: { color: '#22c55e', icon: CheckCircle, label: 'Success' },
  warning: { color: '#f59e0b', icon: AlertTriangle, label: 'Warning' },
  info: { color: '#8b5cf6', icon: Info, label: 'Info' },
};

export default function NotificationContainer() {
  const { notifications, dismiss } = useNotification();

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-[200] flex flex-col gap-3 sm:max-w-sm sm:w-full">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationCard({
  notification,
  onDismiss,
}: {
  notification: NotificationType;
  onDismiss: (id: string) => void;
}) {
  const [progress, setProgress] = useState(100);
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  useEffect(() => {
    const duration = 5000;
    const interval = 30;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - step;
        if (next <= 0) {
          clearInterval(timer);
          return 0;
        }
        return next;
      });
    }, interval);

    const dismissTimer = setTimeout(() => onDismiss(notification.id), duration);

    return () => {
      clearInterval(timer);
      clearTimeout(dismissTimer);
    };
  }, [notification.id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="relative overflow-hidden rounded-xl"
      style={{
        background: 'rgba(17, 17, 24, 0.95)',
        backdropFilter: 'blur(12px)',
        borderLeft: `3px solid ${config.color}`,
        border: `1px solid ${config.color}30`,
        borderLeftWidth: '3px',
        borderLeftColor: config.color,
      }}
    >
      <div className="p-4 flex items-start gap-3">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: config.color }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{notification.title}</p>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{notification.message}</p>
        </div>
        <button
          onClick={() => onDismiss(notification.id)}
          className="shrink-0 text-gray-500 hover:text-gray-300 transition-colors p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-transparent overflow-hidden rounded-b-xl">
        <div
          className="h-full transition-[width] duration-[30ms] linear rounded-b-xl"
          style={{ width: `${progress}%`, backgroundColor: config.color }}
        />
      </div>
    </motion.div>
  );
}
