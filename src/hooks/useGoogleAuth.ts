
import { useState, useEffect, useCallback } from 'react';
import googleAuthService from '@/services/googleAuthService';
import { loadGoogleApiScript } from '@/utils/loadGoogleApi';
import { useToast } from '@/hooks/use-toast';

export const useGoogleAuth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();

  // Initialize the Google API
  useEffect(() => {
    const initGoogleApi = async () => {
      try {
        setIsInitializing(true);
        
        // Try to load the Google API script
        try {
          await loadGoogleApiScript();
        } catch (error) {
          console.warn('Failed to load Google API script, will use redirect flow:', error);
        }
        
        // Initialize the service
        await googleAuthService.init();
        
        // Check if already authenticated
        const authenticated = googleAuthService.isAuthenticated();
        setIsConnected(authenticated);
      } catch (error) {
        console.error('Error initializing Google Auth:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initGoogleApi();
  }, []);

  // Connect to Google
  const connectGoogle = useCallback(async () => {
    try {
      // Store return path before redirecting
      localStorage.setItem('googleAuthReturnPath', window.location.pathname);
      
      const success = await googleAuthService.signIn();
      if (success) {
        setIsConnected(true);
      }
      return success;
    } catch (error) {
      console.error('Error connecting to Google:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  // Disconnect from Google
  const disconnectGoogle = useCallback(() => {
    googleAuthService.signOut();
    setIsConnected(false);
  }, []);

  return {
    isConnected,
    isInitializing,
    connectGoogle,
    disconnectGoogle
  };
};

export default useGoogleAuth;
