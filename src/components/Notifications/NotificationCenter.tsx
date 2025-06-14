import { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, Info, CheckCircle, XCircle, Trash2, MarkAsUnread } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nueva tarea entregada',
      message: 'Carlos López entregó la tarea de matemáticas',
      type: 'success',
      timestamp: '2024-01-15T10:30:00',
      read: false,
      action: {
        label: 'Ver tarea',
        onClick: () => console.log('Ver tarea')
      }
    },
    {
      id: '2',
      title: 'Recordatorio de clase',
      message: 'Clase de física en 30 minutos - Aula 205',
      type: 'info',
      timestamp: '2024-01-15T09:30:00',
      read: false
    },
    {
      id: '3',
      title: 'Calificación pendiente',
      message: '5 exámenes por calificar en matemáticas',
      type: 'warning',
      timestamp: '2024-01-15T08:00:00',
      read: true,
      action: {
        label: 'Calificar',
        onClick: () => console.log('Calificar')
      }
    },
    {
      id: '4',
      title: 'Sistema actualizado',
      message: 'La plataforma se actualizó con nuevas funcionalidades',
      type: 'info',
      timestamp: '2024-01-14T16:00:00',
      read: true
    },
    {
      id: '5',
      title: 'Error en backup',
      message: 'Falló el respaldo automático de datos',
      type: 'error',
      timestamp: '2024-01-14T02:00:00',
      read: false,
      action: {
        label: 'Revisar',
        onClick: () => console.log('Revisar error')
      }
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'success' | 'info' | 'warning' | 'error'>('all');

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: 'Nueva actividad',
          message: 'Se registró nueva actividad en el sistema',
          type: Math.random() > 0.5 ? 'info' : 'success',
          timestamp: new Date().toISOString(),
          read: false
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: false } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-emerald-500 bg-emerald-50';
      case 'warning': return 'border-l-orange-500 bg-orange-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'ahora';
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-[90vh] flex flex-col transform transition-all">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Notificaciones</h3>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600">{unreadCount} sin leer</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'unread', label: 'Sin leer' },
              { key: 'success', label: 'Éxito' },
              { key: 'info', label: 'Info' },
              { key: 'warning', label: 'Aviso' },
              { key: 'error', label: 'Error' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" />
              Marcar todas
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Limpiar
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay notificaciones</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={`font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          {notification.action && (
                            <button
                              onClick={notification.action.onClick}
                              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              {notification.action.label}
                            </button>
                          )}
                          
                          <button
                            onClick={() => notification.read ? markAsUnread(notification.id) : markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                            title={notification.read ? 'Marcar como no leída' : 'Marcar como leída'}
                          >
                            {notification.read ? <MarkAsUnread className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </button>
                          
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}