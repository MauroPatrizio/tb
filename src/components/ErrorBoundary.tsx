// src/components/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="min-h-screen bg-gray-100 flex items-center justify-center">
					<div className="bg-white p-8 rounded-lg shadow-md text-center">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Something went wrong
						</h2>
						<p className="text-gray-600 mb-4">
							We're sorry, but something went wrong. Please try refreshing the page.
						</p>
						<button
							onClick={() => window.location.reload()}
							className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
						>
							Refresh Page
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
