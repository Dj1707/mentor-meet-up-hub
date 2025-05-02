
import { toast } from "@/hooks/use-toast";

// OAuth 2.0 configuration
const GOOGLE_AUTH_CONFIG = {
  clientId: "1064934162615-2sstbp9jriv6npgklt57qso1691svm3s.apps.googleusercontent.com",
  apiKey: "AIzaSyCDjknu3G65T6JrfCgzabr8s72eX_6dP6U",
  scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`
};

// Token storage keys
const TOKEN_STORAGE_KEY = 'google_oauth_token';
const REFRESH_TOKEN_STORAGE_KEY = 'google_oauth_refresh_token';
const TOKEN_EXPIRY_KEY = 'google_oauth_expiry';

interface GoogleAuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

/**
 * Service to handle Google OAuth authentication
 */
class GoogleAuthService {
  private token: GoogleAuthToken | null = null;
  private authInstance: any = null;
  private isInitialized = false;

  constructor() {
    this.loadStoredToken();
  }

  /**
   * Initialize Google API client
   */
  async init(): Promise<boolean> {
    if (this.isInitialized) return true;
    
    try {
      // Check if Google API client is available
      if (typeof window.gapi !== 'undefined') {
        await new Promise<void>((resolve, reject) => {
          window.gapi.load('client:auth2', {
            callback: () => {
              window.gapi.client.init({
                apiKey: GOOGLE_AUTH_CONFIG.apiKey,
                clientId: GOOGLE_AUTH_CONFIG.clientId,
                discoveryDocs: GOOGLE_AUTH_CONFIG.discoveryDocs,
                scope: GOOGLE_AUTH_CONFIG.scope
              }).then(() => {
                this.authInstance = window.gapi.auth2.getAuthInstance();
                this.isInitialized = true;
                resolve();
              }).catch((error: any) => {
                console.error('Error initializing Google API client:', error);
                reject(error);
              });
            },
            onerror: (error: any) => {
              console.error('Error loading Google API client:', error);
              reject(error);
            }
          });
        });
        
        return true;
      } else {
        // Fallback if gapi isn't available
        console.log('Google API client not available, using OAuth redirect flow');
        this.isInitialized = true;
        return true;
      }
    } catch (error) {
      console.error('Failed to initialize Google API client:', error);
      toast({
        title: "Google API Error",
        description: "Failed to initialize Google services.",
        variant: "destructive"
      });
      return false;
    }
  }

  /**
   * Sign in with Google
   */
  async signIn(): Promise<boolean> {
    if (!this.isInitialized) await this.init();
    
    try {
      // If gapi auth2 is available, use it
      if (this.authInstance) {
        const googleUser = await this.authInstance.signIn();
        const authResponse = googleUser.getAuthResponse(true);
        
        this.token = {
          accessToken: authResponse.access_token,
          refreshToken: authResponse.refresh_token,
          expiresAt: Date.now() + authResponse.expires_in * 1000
        };
        
        this.storeToken();
        
        toast({
          title: "Google Calendar Connected",
          description: "Successfully connected to your Google Calendar.",
        });
        
        return true;
      } else {
        // Use OAuth redirect flow
        const state = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('googleOAuthState', state);
        
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.append('client_id', GOOGLE_AUTH_CONFIG.clientId);
        authUrl.searchParams.append('redirect_uri', GOOGLE_AUTH_CONFIG.redirectUri);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('scope', GOOGLE_AUTH_CONFIG.scope);
        authUrl.searchParams.append('access_type', 'offline');
        authUrl.searchParams.append('prompt', 'consent');
        authUrl.searchParams.append('state', state);
        
        // Redirect to Google OAuth
        window.location.href = authUrl.toString();
        return false; // This will actually not return as we're redirecting
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast({
        title: "Authentication Failed",
        description: "Could not sign in to Google.",
        variant: "destructive"
      });
      return false;
    }
  }

  /**
   * Handle OAuth callback
   */
  async handleCallback(search: string): Promise<boolean> {
    const urlParams = new URLSearchParams(search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    
    // Check if there was an error
    if (error) {
      console.error('OAuth error:', error);
      toast({
        title: "Authentication Failed",
        description: "Google authentication failed: " + error,
        variant: "destructive"
      });
      return false;
    }
    
    // Validate state to prevent CSRF attacks
    const savedState = localStorage.getItem('googleOAuthState');
    if (!state || state !== savedState) {
      console.error('Invalid OAuth state');
      toast({
        title: "Authentication Failed",
        description: "Invalid authentication state. Please try again.",
        variant: "destructive"
      });
      return false;
    }
    
    // Clean up state
    localStorage.removeItem('googleOAuthState');
    
    if (!code) {
      console.error('No authorization code received');
      toast({
        title: "Authentication Failed",
        description: "No authorization code received from Google.",
        variant: "destructive"
      });
      return false;
    }
    
    // Exchange code for token
    try {
      // In a production app, this should be done server-side
      // For this demo, we'll simulate it as if we received the token
      console.log('Exchanging authorization code for tokens...');
      
      // Simulate token exchange - in a real app, this would be an API call
      // to your backend which would securely exchange the code for tokens
      const tokenResponse = await this.simulateTokenExchange(code);
      
      this.token = {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: Date.now() + tokenResponse.expires_in * 1000
      };
      
      this.storeToken();
      
      toast({
        title: "Google Calendar Connected",
        description: "Successfully connected to your Google Calendar.",
      });
      
      return true;
    } catch (error) {
      console.error('Failed to exchange code for tokens:', error);
      toast({
        title: "Authentication Failed",
        description: "Failed to complete Google authentication.",
        variant: "destructive"
      });
      return false;
    }
  }

  /**
   * Simulate token exchange (in a real app this would be a server call)
   * This is a placeholder for demo purposes only
   */
  private async simulateTokenExchange(code: string): Promise<any> {
    // This would normally be a fetch call to your backend
    console.log(`Simulating token exchange for code: ${code}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      access_token: 'simulated-access-token-' + Math.random().toString(36).substring(2, 15),
      refresh_token: 'simulated-refresh-token-' + Math.random().toString(36).substring(2, 15),
      expires_in: 3600,
      token_type: 'Bearer'
    };
  }

  /**
   * Sign out from Google
   */
  signOut(): void {
    // If using gapi, sign out from there too
    if (this.authInstance) {
      this.authInstance.signOut().catch((error: any) => {
        console.error('Error signing out from Google:', error);
      });
    }
    
    this.token = null;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    
    toast({
      title: "Signed Out",
      description: "Disconnected from Google Calendar."
    });
  }

  /**
   * Check if user is authenticated with Google
   */
  isAuthenticated(): boolean {
    if (!this.token) return false;
    
    // Check if token is expired
    if (Date.now() > this.token.expiresAt) {
      // Try to refresh the token if available
      // For now, we'll just consider it not authenticated
      return false;
    }
    
    return true;
  }

  /**
   * Get the current auth token
   */
  async getToken(): Promise<string | null> {
    if (!this.isAuthenticated()) {
      // Try to refresh token if available
      if (this.token?.refreshToken) {
        await this.refreshAccessToken();
      } else {
        return null;
      }
    }
    
    return this.token?.accessToken || null;
  }

  /**
   * Refresh the access token using refresh token
   */
  private async refreshAccessToken(): Promise<boolean> {
    if (!this.token?.refreshToken) return false;
    
    try {
      // In a real implementation, this would make an API call to refresh the token
      console.log('Refreshing access token');
      
      // Simulate token refresh - in a real app this would be a server-side API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.token = {
        ...this.token,
        accessToken: 'refreshed-access-token-' + Math.random().toString(36).substring(2, 15),
        expiresAt: Date.now() + 3600000, // 1 hour expiry
      };
      
      this.storeToken();
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.token = null;
      return false;
    }
  }

  /**
   * Store token in local storage
   */
  private storeToken(): void {
    if (!this.token) return;
    
    localStorage.setItem(TOKEN_STORAGE_KEY, this.token.accessToken);
    if (this.token.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, this.token.refreshToken);
    }
    localStorage.setItem(TOKEN_EXPIRY_KEY, this.token.expiresAt.toString());
  }

  /**
   * Load token from local storage
   */
  private loadStoredToken(): void {
    const accessToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
    
    if (accessToken && expiryStr) {
      this.token = {
        accessToken,
        refreshToken: refreshToken || undefined,
        expiresAt: parseInt(expiryStr, 10),
      };
    }
  }
}

export default new GoogleAuthService();
