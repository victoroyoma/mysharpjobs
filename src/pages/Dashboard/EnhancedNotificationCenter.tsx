import { useState, useEffect } from 'react';
import { 
  BellIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  MessageCircleIcon,
  DollarSignIcon,
  ClockIcon,
  XIcon,
  SettingsIcon,
  FilterIcon,
  SearchIcon,
  EyeIcon,
  EyeOffIcon
} from 'lucide-react';
import Button from '../../components/Button';
import { mockClients, getNotificationsByUser, Notification } from '../../data/mockData';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead, onDelete }) => {
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'job_update': return <CheckCircleIcon className="w-5 h-5 text-blue-600" />;
      case 'message': return <MessageCircleIcon className="w-5 h-5 text-green-600" />;
      case 'payment': return <DollarSignIcon className="w-5 h-5 text-green-600" />;
      case 'system': return <InfoIcon className="w-5 h-5 text-gray-600" />;
      case 'alert': return <AlertTriangleIcon className="w-5 h-5 text-red-600" />;
      default: return <BellIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-300 bg-white';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={`border-l-4 rounded-lg p-4 mb-3 transition-all hover:shadow-md ${
      notification.isRead 
        ? 'border-l-gray-300 bg-white opacity-75' 
        : getPriorityColor(notification.priority || 'low')
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className={`text-sm font-medium ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                {notification.title || 'Notification'}
              </h4>
              {notification.priority === 'high' && !notification.isRead && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  High Priority
                </span>
              )}
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
              {notification.message}
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-xs text-gray-500 flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" />
                {formatTimeAgo(notification.createdAt)}
              </span>
              {notification.actionUrl && (
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  View Details →
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {!notification.isRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Mark as read"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete notification"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EnhancedNotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  // Notification preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    jobUpdates: true,
    messages: true,
    payments: true,
    marketing: false
  });

  // Get current client and notifications
  const currentClient = mockClients[0];

  useEffect(() => {
    const clientNotifications = getNotificationsByUser(currentClient.id);
    setNotifications(clientNotifications);
  }, [currentClient.id]);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    const matchesRead = !showUnreadOnly || !notification.isRead;
    const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (notification.title && notification.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesPriority && matchesRead && matchesSearch;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const clearAllRead = () => {
    setNotifications(prev => prev.filter(notif => !notif.isRead));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.isRead).length;

  const notificationStats = {
    total: notifications.length,
    unread: unreadCount,
    highPriority: highPriorityCount,
    today: notifications.filter(n => {
      const today = new Date();
      const notifDate = new Date(n.createdAt);
      return notifDate.toDateString() === today.toDateString();
    }).length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notification Center</h1>
            <p className="text-gray-600 mt-2">Stay updated with your job activities and messages</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="primary" size="sm" onClick={markAllAsRead}>
              <EyeIcon className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{notificationStats.total}</p>
              </div>
              <BellIcon className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-blue-900">{notificationStats.unread}</p>
              </div>
              <EyeOffIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-900">{notificationStats.highPriority}</p>
              </div>
              <AlertTriangleIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-green-900">{notificationStats.today}</p>
              </div>
              <ClockIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Notification Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Delivery Methods</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences(prev => ({...prev, emailNotifications: e.target.checked}))}
                      className="rounded mr-3"
                    />
                    <span className="text-sm text-gray-700">Email Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.pushNotifications}
                      onChange={(e) => setPreferences(prev => ({...prev, pushNotifications: e.target.checked}))}
                      className="rounded mr-3"
                    />
                    <span className="text-sm text-gray-700">Push Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.smsNotifications}
                      onChange={(e) => setPreferences(prev => ({...prev, smsNotifications: e.target.checked}))}
                      className="rounded mr-3"
                    />
                    <span className="text-sm text-gray-700">SMS Notifications</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.jobUpdates}
                      onChange={(e) => setPreferences(prev => ({...prev, jobUpdates: e.target.checked}))}
                      className="rounded mr-3"
                    />
                    <span className="text-sm text-gray-700">Job Updates</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.messages}
                      onChange={(e) => setPreferences(prev => ({...prev, messages: e.target.checked}))}
                      className="rounded mr-3"
                    />
                    <span className="text-sm text-gray-700">Messages</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.payments}
                      onChange={(e) => setPreferences(prev => ({...prev, payments: e.target.checked}))}
                      className="rounded mr-3"
                    />
                    <span className="text-sm text-gray-700">Payment Updates</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences(prev => ({...prev, marketing: e.target.checked}))}
                      className="rounded mr-3"
                    />
                    <span className="text-sm text-gray-700">Marketing & Promotions</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowSettings(false)}>
                Save Preferences
              </Button>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FilterIcon className="w-4 h-4 text-gray-500" />
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="job_update">Job Updates</option>
                  <option value="message">Messages</option>
                  <option value="payment">Payments</option>
                  <option value="system">System</option>
                  <option value="alert">Alerts</option>
                </select>
              </div>
              
              <select 
                value={filterPriority} 
                onChange={(e) => setFilterPriority(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Unread only</span>
              </label>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SearchIcon className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-64"
                />
              </div>
              
              <Button variant="secondary" size="sm" onClick={clearAllRead}>
                Clear Read
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-0">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BellIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Notifications ({filteredNotifications.length})
                </h3>
                <div className="text-sm text-gray-500">
                  {unreadCount > 0 && `${unreadCount} unread`}
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
