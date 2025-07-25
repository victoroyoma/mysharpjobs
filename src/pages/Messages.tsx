import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SendIcon } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(0);
  const conversations = [{
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastMessage: 'Hi, are you available for the cabinet installation job?',
    unread: true,
    timestamp: '10:23 AM'
  }, {
    id: 2,
    name: 'Michael Adams',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastMessage: 'Thanks for your quote. When can you start?',
    unread: false,
    timestamp: 'Yesterday'
  }];
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
              {conversations.map(conversation => <div key={conversation.id} className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedConversation === conversation.id ? 'bg-blue-50' : ''}`} onClick={() => setSelectedConversation(conversation.id)}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={conversation.avatar} alt={conversation.name} />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {conversation.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {conversation.timestamp}
                        </p>
                      </div>
                      <p className={`text-sm ${conversation.unread ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread && <span className="ml-2 h-2 w-2 rounded-full bg-blue-600"></span>}
                  </div>
                </div>)}
            </div>
          </div>
          {/* Message area */}
          <div className="w-2/3 flex flex-col">
            {selectedConversation ? <>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img className="h-8 w-8 rounded-full" src={conversations.find(c => c.id === selectedConversation)?.avatar} alt={conversations.find(c => c.id === selectedConversation)?.name} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {conversations.find(c => c.id === selectedConversation)?.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  <p className="text-center text-gray-500 text-sm">
                    This is a placeholder for the message history.
                  </p>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <input type="text" className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Type a message..." />
                    <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <SendIcon className="h-5 w-5" />
                    </button>
                  </div>
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