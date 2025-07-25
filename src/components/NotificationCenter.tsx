import { useState } from 'react';
import { BellIcon, X, CheckIcon } from 'lucide-react';
import { Notification } from '../data/mockData';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
}

export default function NotificationCenter({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead 
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'job_application': return 'bg-blue-100 text-blue-600';
      case 'job_update': return 'bg-orange-100 text-orange-600';
      case 'payment': return 'bg-green-100 text-green-600';
      case 'message': return 'bg-purple-100 text-purple-600';
      case 'review': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const days = Math.floor(diffInHours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span className="sr-only">View notifications</span>
        <BellIcon className="h-6 w-6" />
      </button>
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[18px]">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-2">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h3 className="text-sm font-medium text-gray-900">
                Notifications ({unreadCount} unread)
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && onMarkAllAsRead && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  No notifications yet
                </div>
              ) : (
                notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 border-l-4 ${
                      notification.isRead ? 'border-transparent' : 'border-blue-500'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${getNotificationIcon(notification.type)} flex-shrink-0`}>
                        <BellIcon className="h-4 w-4" />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          {!notification.isRead && onMarkAsRead && (
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="ml-2 text-gray-400 hover:text-green-600"
                              title="Mark as read"
                            >
                              <CheckIcon className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {getTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {notifications.length > 10 && (
              <div className="px-4 py-2 border-t">
                <button className="text-xs text-blue-600 hover:text-blue-800 w-full text-center">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
