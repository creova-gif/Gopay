import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
          style={{ background: '#080d08' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)' }}
          >
            <span style={{ fontSize: '28px' }}>!</span>
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">Something went wrong</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '24px' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-3 rounded-xl text-white"
            style={{ backgroundColor: '#16a34a', fontWeight: 600 }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
