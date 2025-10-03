import { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  XCircle,
  MoreVertical,
  Trash2,
  Eye
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
  expiresAt?: string;
  metadata?: {
    jobId?: string;
    userId?: string;
    category?: string;
  };
}

interface NotificationCenterProps {
  userId: string;
  userType: 'client' | 'artisan' | 'admin';
}

export default function EnhancedNotificationCenter({ userId, userType }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time notifications
    const eventSource = new EventSource(`/api/notifications/stream/${userId}`);
    
    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications(prev => [newNotification, ...prev]);
      
      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: '/icon-192.png'
        });
      }
    };

    return () => {
      eventSource.close();
    };
  }, [userId]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notifications?userId=${userId}&userType=${userType}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'high':
        return notification.priority === 'high';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      default:
        return 'border-l-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Bell className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="high">High Priority</option>
          </select>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg border-l-4 ${getPriorityColor(notification.priority)} 
                         p-6 shadow-sm hover:shadow-md transition-shadow relative
                         ${!notification.isRead ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <div className="mr-4 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-900 mr-2">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{new Date(notification.createdAt).toLocaleString()}</span>
                        {notification.priority === 'high' && (
                          <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            High Priority
                          </span>
                        )}
                      </div>
                      
                      {notification.actionUrl && notification.actionText && (
                        <a
                          href={notification.actionUrl}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          {notification.actionText} →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(showDropdown === notification.id ? null : notification.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {showDropdown === notification.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        {!notification.isRead && (
                          <button
                            onClick={() => {
                              markAsRead(notification.id);
                              setShowDropdown(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Mark as Read
                          </button>
                        )}
                        <button
                          onClick={() => {
                            deleteNotification(notification.id);
                            setShowDropdown(null);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
