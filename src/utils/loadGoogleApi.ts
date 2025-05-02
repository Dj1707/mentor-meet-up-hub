
/**
 * Dynamically loads the Google API client script
 */
export const loadGoogleApiScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector('script[src*="apis.google.com/js/api.js"]')) {
      if (window.gapi) {
        resolve();
      } else {
        // Script exists but gapi not initialized yet
        const checkGapiInterval = setInterval(() => {
          if (window.gapi) {
            clearInterval(checkGapiInterval);
            resolve();
          }
        }, 100);
        
        // Set timeout to avoid infinite checking
        setTimeout(() => {
          clearInterval(checkGapiInterval);
          reject(new Error('Google API script loaded but gapi not initialized'));
        }, 10000);
      }
      return;
    }
  
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      resolve();
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Google API script'));
    };
    
    // Add script to document
    document.head.appendChild(script);
  });
};

/**
 * Add this to global window object to make TypeScript happy
 */
declare global {
  interface Window {
    gapi: {
      load: (apiName: string, callback: { 
        callback: () => void, 
        onerror: (error: any) => void 
      }) => void;
      client: {
        init: (config: {
          apiKey: string;
          clientId: string;
          discoveryDocs?: string[];
          scope?: string;
        }) => Promise<void>;
        calendar: {
          events: {
            insert: (params: any) => Promise<any>;
            update: (params: any) => Promise<any>;
            delete: (params: any) => Promise<any>;
            list: (params: any) => Promise<any>;
          };
          calendarList: {
            list: (params: any) => Promise<any>;
          };
          freebusy: {
            query: (params: any) => Promise<any>;
          };
        };
      };
      auth2: {
        getAuthInstance: () => {
          isSignedIn: {
            get: () => boolean;
            listen: (callback: (isSignedIn: boolean) => void) => void;
          };
          signIn: () => Promise<any>;
          signOut: () => Promise<void>;
          currentUser: {
            get: () => {
              getAuthResponse: (includeAuthorizationData?: boolean) => {
                access_token: string;
                id_token: string;
                scope: string;
                expires_in: number;
                first_issued_at: number;
                expires_at: number;
                refresh_token?: string;
              };
            };
          };
        };
      };
    };
  }
}
