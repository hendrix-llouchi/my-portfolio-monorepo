import { useState, useEffect } from 'react';
import { Eye, Trash2, X, Mail, Phone, Calendar, User } from 'lucide-react';
import api from '../lib/api';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMessages();
    
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages?t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (message: Message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/messages/${id}`);
      await fetchMessages();
      alert('Message deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting message:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Error deleting message. Please try again.';
      alert(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateMessage = (message: string, maxLength: number = 100) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const isRecent = (dateString: string) => {
    const date = new Date(dateString);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600 mt-1">
            {messages.length} message{messages.length !== 1 ? 's' : ''} received
          </p>
        </div>
        {messages.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
            <Mail className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">
              {messages.filter(m => isRecent(m.created_at)).length} new this week
            </span>
          </div>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-soft">
          <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-600">Messages from your portfolio contact form will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-xl p-6 shadow-soft hover:shadow-hover transition-all duration-300 border ${
                isRecent(message.created_at) ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'
              } group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isRecent(message.created_at)
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                      : 'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{message.name}</h3>
                    <p className="text-sm text-gray-600">{message.email}</p>
                  </div>
                </div>
                {isRecent(message.created_at) && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    New
                  </span>
                )}
              </div>

              <div className="mb-4">
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {truncateMessage(message.message, 120)}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(message.created_at)}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleViewDetails(message)}
                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="text-2xl font-bold text-gray-900">Message Details</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedMessage(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Name
                  </label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">{selectedMessage.name}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">{formatDate(selectedMessage.created_at)}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>
                {selectedMessage.phone && (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Phone
                    </label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {selectedMessage.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Message
                </label>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedMessage(null);
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Your message from portfolio`}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg font-medium transition-all duration-200"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
