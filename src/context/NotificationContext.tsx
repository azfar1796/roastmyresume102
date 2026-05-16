import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
}

interface NotificationContextType {
  notifications: Notification[];
  showError: (title: string, message: string) => void;
  showSuccess: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((type: Notification['type'], title: string, message: string) => {
    const id = generateId();
    setNotifications((prev) => [...prev, { id, type, title, message }]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showError = useCallback((title: string, message: string) => {
    addNotification('error', title, message);
  }, [addNotification]);

  const showSuccess = useCallback((title: string, message: string) => {
    addNotification('success', title, message);
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string) => {
    addNotification('warning', title, message);
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string) => {
    addNotification('info', title, message);
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, showError, showSuccess, showWarning, showInfo, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
}
