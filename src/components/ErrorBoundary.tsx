import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
          <div className="max-w-md w-full p-8 rounded-2xl bg-dark-card border border-white/[0.06] text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text-primary mb-2">Something went wrong</h2>
            <p className="text-sm text-text-muted mb-6">
              {this.state.error || 'An unexpected error occurred. Please try again.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: '' });
                window.location.href = '/';
              }}
              className="px-6 py-2.5 text-sm font-medium bg-brand-purple text-white rounded-xl hover:bg-brand-purple/90 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
