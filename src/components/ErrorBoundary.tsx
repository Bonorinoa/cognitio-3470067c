import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * App-level error boundary. Catches any uncaught render error in the tree
 * and shows a branded fallback instead of a blank screen. Errors are logged
 * to the console so we can pick them up from session replay during launch.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary] Uncaught error:", error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <AlertTriangle className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">
              Algo salió mal
            </h1>
            <p className="text-muted-foreground">
              Encontramos un problema inesperado. Podés recargar la página o
              volver al inicio. Si el problema persiste, contactanos.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={this.handleReload} variant="default">
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Recargar
            </Button>
            <Button onClick={this.handleGoHome} variant="outline">
              <Home className="h-4 w-4 mr-2" aria-hidden="true" />
              Volver al inicio
            </Button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <pre className="text-xs text-left bg-muted p-3 rounded-md overflow-auto max-h-40 text-muted-foreground">
              {this.state.error.message}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
