
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
    gapi: any;
  }
}
