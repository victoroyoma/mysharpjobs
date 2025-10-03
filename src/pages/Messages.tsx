import { useState, useEffect } from 'react';
import { SendIcon } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { messageApi } from '../utils/api';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Real-time message listener
  useWebSocket(user?.id ? Number(user.id) : null, {
    onMessageReceived: (message) => {
      console.log('📨 New message received:', message);
      
      // Add to messages if in active conversation
      if (selectedConversation && 
          (message.sender_id === selectedConversation || 
           message.recipient_id === selectedConversation)) {
        setMessages(prev => [...prev, message]);
      }
      
      // Refresh conversations to update last message
      fetchConversations();
    }
  });

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await messageApi.getConversations();
      setConversations(response.data || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (userId: number) => {
    try {
      const response = await messageApi.getConversation(userId);
      setMessages(response.data || []);
      
      // Mark messages as read
      response.data?.forEach((msg: any) => {
        if (msg.recipient_id === user?.id && !msg.is_read) {
          messageApi.markAsRead(msg.id).catch(console.error);
        }
      });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await messageApi.sendMessage({
        recipient_id: selectedConversation,
        content: newMessage,
        message_type: 'text'
      });
      
      setNewMessage('');
      // Message will be added via WebSocket
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchConversations();
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);
  return <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden h-[600px] flex">
          {/* Conversation list */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Messages</h2>
            </div>
            <div className="overflow-y-auto h-[calc(600px-57px)]">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No conversations yet</div>
              ) : (
                conversations.map(conversation => <div key={conversation.id} className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedConversation === conversation.user_id ? 'bg-blue-50' : ''}`} onClick={() => setSelectedConversation(conversation.user_id)}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={conversation.user?.avatar || 'https://via.placeholder.com/40'} alt={conversation.user?.name || 'User'} />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {conversation.user?.name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(conversation.last_message_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <p className={`text-sm ${conversation.unread_count > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                        {conversation.last_message || 'No messages yet'}
                      </p>
                    </div>
                    {conversation.unread_count > 0 && <span className="ml-2 h-2 w-2 rounded-full bg-blue-600"></span>}
                  </div>
                </div>)
              )}
            </div>
          </div>
          {/* Message area */}
          <div className="w-2/3 flex flex-col">
            {selectedConversation ? <>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img className="h-8 w-8 rounded-full" src={conversations.find(c => c.user_id === selectedConversation)?.user?.avatar || 'https://via.placeholder.com/32'} alt={conversations.find(c => c.user_id === selectedConversation)?.user?.name || 'User'} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {conversations.find(c => c.user_id === selectedConversation)?.user?.name || 'User'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm">
                      No messages yet. Start a conversation!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender_id === user?.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}>
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-xs mt-1 ${msg.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'}`}>
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex items-center">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Type a message..." 
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <SendIcon className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </> : <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">
                  Select a conversation to start messaging
                </p>
              </div>}
          </div>
        </div>
      </div>
      <Footer />
    </div>;
}
