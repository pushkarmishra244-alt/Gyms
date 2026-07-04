import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-screen" className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-2xl w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-4 text-rose-500">
              <svg className="w-12 h-12 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Application Error Detected</h1>
                <p className="text-sm text-slate-400 mt-1">A runtime exception occurred in the application view.</p>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs overflow-auto max-h-64 space-y-2 text-rose-400">
              <div className="font-bold text-rose-300">Error: {this.state.error?.toString()}</div>
              {this.state.errorInfo && (
                <pre className="whitespace-pre-wrap text-[11px] text-slate-400 leading-relaxed">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="reload-button"
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-4 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition duration-200 text-sm shadow-md"
              >
                Reload Page
              </button>
              <button
                id="reset-db-button"
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-xl font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 transition duration-200 text-sm border border-slate-600"
              >
                Reset Database & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

