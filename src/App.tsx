import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';
import NotificationContainer from './components/Notification';
import UpgradeBanner from './components/UpgradeBanner';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const LoadingPage = lazy(() => import('./pages/LoadingPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const CoverLetterPage = lazy(() => import('./pages/CoverLetterPage'));
const InterviewPrepPage = lazy(() => import('./pages/InterviewPrepPage'));
const TrackerPage = lazy(() => import('./pages/TrackerPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AppProvider>
          <BrowserRouter>
            <NotificationContainer />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/loading" element={<LoadingPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/cover-letter" element={<CoverLetterPage />} />
                <Route path="/interview-prep" element={<InterviewPrepPage />} />
                <Route path="/tracker" element={<TrackerPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/pricing" element={<PricingPage />} />
              </Routes>
            </Suspense>
            <UpgradeBanner />
          </BrowserRouter>
        </AppProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}
