import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AM Studio Application Error:', error, errorInfo);
  }

  handleReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white">AM STUDIO</h1>
            <p className="text-zinc-400 text-sm">
              We encountered a temporary display issue while loading your portfolio.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-2.5 rounded-lg bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-all"
            >
              Reload Website
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
