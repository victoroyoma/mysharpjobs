/**
 * useWebSocket Hook
 * 
 * Custom React hook for managing WebSocket connections and real-time events
 * using Laravel Echo.
 */

import { useEffect, useCallback, useRef } from 'react';
import { getEcho } from '../config/echo';

interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    id: number;
    name: string;
    avatar?: string;
  };
}

interface Job {
  id: number;
  title: string;
  status: string;
  client_id: number;
  artisan_id?: number;
  [key: string]: any;
}

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data?: any;
}

interface WebSocketCallbacks {
  onMessageReceived?: (message: Message) => void;
  onJobUpdated?: (job: Job, updateType: string) => void;
  onNotificationReceived?: (notification: Notification) => void;
}

/**
 * Custom hook for WebSocket real-time communication
 * 
 * @param userId - The authenticated user's ID
 * @param callbacks - Object containing event handler callbacks
 * @returns Object with connection status and methods
 */
export const useWebSocket = (
  userId: number | null,
  callbacks: WebSocketCallbacks = {}
) => {
  const echoRef = useRef<any>(null);
  const channelsRef = useRef<any[]>([]);

  // Initialize Echo instance
  useEffect(() => {
    echoRef.current = getEcho();
  }, []);

  // Subscribe to user's private channel for messages and notifications
  useEffect(() => {
    if (!userId || !echoRef.current) return;

    const echo = echoRef.current;
    
    console.log(`📡 Subscribing to private-user.${userId} channel`);

    // Subscribe to private user channel
    const userChannel = echo.private(`user.${userId}`);
    
    // Listen for incoming messages
    if (callbacks.onMessageReceived) {
      userChannel.listen('.message.sent', (data: any) => {
        console.log('💬 Message received:', data);
        callbacks.onMessageReceived?.(data.message);
      });
    }

    // Listen for notifications
    if (callbacks.onNotificationReceived) {
      userChannel.listen('.notification.sent', (data: Notification) => {
        console.log('🔔 Notification received:', data);
        callbacks.onNotificationReceived?.(data);
      });
    }

    // Listen for job updates
    if (callbacks.onJobUpdated) {
      userChannel.listen('.job.updated', (data: any) => {
        console.log('📋 Job updated:', data);
        callbacks.onJobUpdated?.(data.job, data.update_type);
      });
    }

    // Store channel reference
    channelsRef.current.push(userChannel);

    // Cleanup on unmount
    return () => {
      console.log(`🔌 Unsubscribing from private-user.${userId} channel`);
      userChannel.stopListening('.message.sent');
      userChannel.stopListening('.notification.sent');
      userChannel.stopListening('.job.updated');
      echo.leave(`private-user.${userId}`);
      channelsRef.current = [];
    };
  }, [userId, callbacks.onMessageReceived, callbacks.onNotificationReceived, callbacks.onJobUpdated]);

  /**
   * Subscribe to a specific job channel
   */
  const subscribeToJob = useCallback((jobId: number, callback: (data: any) => void) => {
    if (!echoRef.current) return;

    console.log(`📋 Subscribing to private-job.${jobId} channel`);

    const jobChannel = echoRef.current.private(`job.${jobId}`);
    
    jobChannel.listen('.job.updated', (data: any) => {
      console.log(`📋 Job ${jobId} updated:`, data);
      callback(data);
    });

    channelsRef.current.push(jobChannel);

    return () => {
      console.log(`🔌 Unsubscribing from private-job.${jobId} channel`);
      jobChannel.stopListening('.job.updated');
      echoRef.current?.leave(`private-job.${jobId}`);
    };
  }, []);

  /**
   * Subscribe to admin channel (for admin users only)
   */
  const subscribeToAdmin = useCallback((callback: (data: any) => void) => {
    if (!echoRef.current) return;

    console.log('👮 Subscribing to private-admin channel');

    const adminChannel = echoRef.current.private('admin');
    
    adminChannel.listen('.notification.sent', (data: any) => {
      console.log('👮 Admin notification:', data);
      callback(data);
    });

    channelsRef.current.push(adminChannel);

    return () => {
      console.log('🔌 Unsubscribing from private-admin channel');
      adminChannel.stopListening('.notification.sent');
      echoRef.current?.leave('private-admin');
    };
  }, []);

  /**
   * Check if Echo is connected
   */
  const isConnected = useCallback(() => {
    return echoRef.current !== null;
  }, []);

  return {
    subscribeToJob,
    subscribeToAdmin,
    isConnected,
  };
};

export default useWebSocket;
