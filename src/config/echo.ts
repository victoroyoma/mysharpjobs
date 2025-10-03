/**
 * Laravel Echo Configuration
 * 
 * This file configures Laravel Echo for real-time WebSocket communication
 * with the Laravel backend using Laravel Reverb.
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for Echo
declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<'pusher'> | undefined;
  }
}

window.Pusher = Pusher;

// Laravel Echo Configuration
const echoConfig = {
  broadcaster: 'pusher' as const,
  key: 'mysharpjob-key',
  wsHost: '127.0.0.1',
  wsPort: 6001,
  wssPort: 6001,
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  enabledTransports: ['ws', 'wss'] as any,
  authEndpoint: 'http://localhost:8000/broadcasting/auth',
};

let echoInstance: Echo<'pusher'> | null = null;

/**
 * Initialize Laravel Echo with authentication token
 */
export const initializeEcho = (token: string | null): Echo<'pusher'> => {
  // Disconnect existing instance if any
  if (echoInstance) {
    echoInstance.disconnect();
  }

  // Create configuration with auth headers
  const config = {
    ...echoConfig,
    auth: token ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } : undefined,
  };

  // Create new Echo instance
  echoInstance = new Echo<'pusher'>(config);
  window.Echo = echoInstance;

  console.log('✅ Laravel Echo initialized');
  
  return echoInstance;
};

/**
 * Get the current Echo instance
 */
export const getEcho = (): Echo<'pusher'> | null => {
  return echoInstance;
};

/**
 * Disconnect Echo and cleanup
 */
export const disconnectEcho = (): void => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
    delete window.Echo;
    console.log('🔌 Laravel Echo disconnected');
  }
};

/**
 * Update Echo authentication token
 */
export const updateEchoToken = (token: string | null): void => {
  if (token) {
    // Reconnect with new token
    initializeEcho(token);
  }
};

/**
 * Check if Echo is connected
 */
export const isEchoConnected = (): boolean => {
  return echoInstance !== null;
};

export default echoInstance;
