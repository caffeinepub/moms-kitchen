import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

/**
 * Hook to monitor backend connection status and provide retry functionality
 */
export function useBackendConnectionStatus() {
  const queryClient = useQueryClient();
  const { actor, isFetching } = useActor();
  
  // Get the actor query state to check for errors
  const actorQueryState = queryClient.getQueryState(['actor', undefined]);
  
  const hasConnectionError = actorQueryState?.status === 'error' || (!actor && !isFetching);
  
  const retry = () => {
    // Invalidate and refetch the actor query
    queryClient.invalidateQueries({ queryKey: ['actor'] });
    queryClient.refetchQueries({ queryKey: ['actor'] });
  };
  
  return {
    hasConnectionError,
    isConnecting: isFetching,
    retry,
  };
}
