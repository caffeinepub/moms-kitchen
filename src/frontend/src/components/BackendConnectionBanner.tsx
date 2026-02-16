import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useBackendConnectionStatus } from '../hooks/useBackendConnectionStatus';

export default function BackendConnectionBanner() {
  const { hasConnectionError, isConnecting, retry } = useBackendConnectionStatus();
  
  if (!hasConnectionError) {
    return null;
  }
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Connection Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>
          Unable to connect to the backend. Please check your connection and try again.
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={retry}
          disabled={isConnecting}
          className="shrink-0"
        >
          {isConnecting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
