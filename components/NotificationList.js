import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

export default function NotificationList({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setNotifications(res.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    socket.on('connect', () => {
      console.log('Socket.IO connected:', socket.id);
      setSocketConnected(true);
      socket.emit('join', userId);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('notification', (notification) => {
      console.log('Received notification:', notification);
      setNotifications((prev) => [{ ...notification, read: false, _id: notification.taskId }, ...prev]);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error.message);
      setSocketConnected(false);
    });

    return () => {
      console.log('Disconnecting Socket.IO');
      socket.disconnect();
    };
  }, [userId]);

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return notificationTime.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        );
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        <div className="flex items-center">
          <span className={`h-2 w-2 rounded-full mr-2 ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-xs text-gray-500">{socketConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-12 px-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <p className="text-gray-500 mt-4">No notifications yet</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className={`px-6 py-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-indigo-50' : ''}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notification.read ? 'font-medium' : 'text-gray-600'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(notification.createdAt)}</p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}