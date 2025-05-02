
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import googleAuthService from '@/services/googleAuthService';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const GoogleAuthCallback = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const success = await googleAuthService.handleCallback(window.location.search);
        
        if (success) {
          setStatus('success');
          toast({
            title: "Authentication Successful",
            description: "Successfully connected to Google Calendar.",
          });
          
          // Redirect after a brief delay
          setTimeout(() => {
            // Determine which path to redirect to based on where the user came from
            // For simplicity, we'll use localStorage to store the return path
            const returnPath = localStorage.getItem('googleAuthReturnPath') || '/';
            localStorage.removeItem('googleAuthReturnPath');
            navigate(returnPath);
          }, 2000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
        setStatus('error');
        toast({
          title: "Authentication Failed",
          description: "There was an error connecting to Google Calendar.",
          variant: "destructive"
        });
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          {status === 'processing' && (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <h2 className="text-xl font-medium">Processing Authentication</h2>
              <p className="text-muted-foreground mt-2">Please wait while we complete your Google authentication...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-medium">Authentication Successful</h2>
              <p className="text-muted-foreground mt-2">Successfully connected to Google Calendar. Redirecting...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-medium">Authentication Failed</h2>
              <p className="text-muted-foreground mt-2">There was an error connecting to Google Calendar.</p>
              <button 
                className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
                onClick={() => navigate('/')}
              >
                Return to Application
              </button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleAuthCallback;
