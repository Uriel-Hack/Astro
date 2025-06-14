import { useState } from 'react';
import { Send, Users, Bell, Mail, Phone, Video, Plus, Search, Paperclip, Smile } from 'lucide-react';

interface Chat {
  id: string;
  name: string;
  type: 'student' | 'group' | 'teacher';
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatar?: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
  type: 'text' | 'file' | 'image';
}

interface Forum {
  id: string;
  title: string;
  subject: string;
  posts: number;
  lastActivity: string;
  participants: number;
  isActive: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
}

export default function CommunicationModule() {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedChat, setSelectedChat] = useState('1');
  const [newMessage, setNewMessage] = useState('');
  const [showNewForum, setShowNewForum] = useState(false);
  const [newForumTitle, setNewForumTitle] = useState('');
  const [newForumSubject, setNewForumSubject] = useState('');
  const [, setShowNewChat] = useState(false);
  
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Ana García',
      type: 'student',
      lastMessage: 'Tengo dudas sobre el examen de mañana',
      time: '10:30',
      unread: 2,
      online: true
    },
    {
      id: '2',
      name: 'Grupo Matemáticas 1A',
      type: 'group',
      lastMessage: 'Material de estudio subido',
      time: '09:15',
      unread: 0,
      online: false
    },
    {
      id: '3',
      name: 'Carlos López',
      type: 'student',
      lastMessage: 'Gracias por la explicación',
      time: '08:45',
      unread: 0,
      online: false
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Ana García',
      content: 'Profesor, tengo algunas dudas sobre los límites en cálculo',
      time: '10:25',
      isOwn: false,
      type: 'text'
    },
    {
      id: '2',
      sender: 'Yo',
      content: '¡Por supuesto! ¿Qué específicamente te está costando trabajo?',
      time: '10:27',
      isOwn: true,
      type: 'text'
    },
    {
      id: '3',
      sender: 'Ana García',
      content: 'No entiendo cómo resolver límites con indeterminaciones',
      time: '10:30',
      isOwn: false,
      type: 'text'
    },
  ]);

  const [forums, setForums] = useState<Forum[]>([
    {
      id: '1',
      title: 'Dudas sobre Álgebra Lineal',
      subject: 'Matemáticas',
      posts: 12,
      lastActivity: '2 horas',
      participants: 8,
      isActive: true
    },
    {
      id: '2',
      title: 'Experimentos de Laboratorio',
      subject: 'Física',
      posts: 7,
      lastActivity: '1 día',
      participants: 15,
      isActive: true
    },
    {
      id: '3',
      title: 'Preparación para Examen Final',
      subject: 'Química',
      posts: 23,
      lastActivity: '30 min',
      participants: 22,
      isActive: true
    },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nueva tarea entregada',
      message: 'Carlos López entregó la tarea de matemáticas',
      time: '1 hora',
      type: 'success',
      read: false
    },
    {
      id: '2',
      title: 'Recordatorio de clase',
      message: 'Clase de física en 30 minutos',
      time: '30 min',
      type: 'info',
      read: false
    },
    {
      id: '3',
      title: 'Calificación pendiente',
      message: '5 exámenes por calificar',
      time: '2 horas',
      type: 'warning',
      read: true
    },
  ]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'Yo',
      content: newMessage,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update chat last message
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat 
        ? { ...chat, lastMessage: newMessage, time: message.time }
        : chat
    ));
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId 
        ? { ...notif, read: true }
        : notif
    ));
  };

  const createNewForum = (title: string, subject: string) => {
    const forum: Forum = {
      id: Date.now().toString(),
      title,
      subject,
      posts: 0,
      lastActivity: 'Ahora',
      participants: 1,
      isActive: true
    };
    
    setForums(prev => [...prev, forum]);
    setShowNewForum(false);
  };

  const startVideoCall = () => {
    alert('Iniciando videollamada...');
  };

  const sendMassEmail = () => {
    alert('Abriendo editor de email masivo...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Centro de Comunicación</h2>
            <p className="text-gray-600 mt-1">Mantente conectado con estudiantes y colegas</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={startVideoCall}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Video className="w-4 h-4" />
              Videollamada
            </button>
            <button 
              onClick={sendMassEmail}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email Masivo
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 font-medium border-b-2 ${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Mensajes
              {chats.reduce((sum, chat) => sum + chat.unread, 0) > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {chats.reduce((sum, chat) => sum + chat.unread, 0)}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('forums')}
              className={`px-6 py-3 font-medium border-b-2 ${
                activeTab === 'forums'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Foros
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-3 font-medium border-b-2 ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Notificaciones
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'messages' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
              {/* Chat List */}
              <div className="border-r border-gray-200 pr-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Conversaciones</h3>
                  <button 
                    onClick={() => setShowNewChat(true)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar conversaciones..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`w-full p-3 rounded-lg text-left hover:bg-gray-50 transition-colors ${
                        selectedChat === chat.id ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            {chat.type === 'group' ? (
                              <Users className="w-6 h-6 text-gray-600" />
                            ) : (
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600">
                                  {chat.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            )}
                            {chat.online && chat.type !== 'group' && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{chat.name}</span>
                        </div>
                        {chat.unread > 0 && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                        <span className="text-xs text-gray-500">{chat.time}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-2 flex flex-col">
                <div className="flex items-center justify-between p-3 border-b border-gray-200 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">AG</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Ana García</h4>
                      <p className="text-xs text-emerald-600">En línea</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isOwn 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Message Input */}
                <div className="flex gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Smile className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={sendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'forums' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Foros de Discusión</h3>
                <button 
                  onClick={() => setShowNewForum(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Foro
                </button>
              </div>
              
              {showNewForum && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Crear Nuevo Foro</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Título del foro"
                      value={newForumTitle}
                      onChange={e => setNewForumTitle(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      value={newForumSubject}
                      onChange={e => setNewForumSubject(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar materia</option>
                      <option value="Matemáticas">Matemáticas</option>
                      <option value="Física">Física</option>
                      <option value="Química">Química</option>
                      <option value="Historia">Historia</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        if (newForumTitle && newForumSubject) {
                          createNewForum(newForumTitle, newForumSubject);
                          setNewForumTitle('');
                          setNewForumSubject('');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Crear
                    </button>
                    <button 
                      onClick={() => {
                        setShowNewForum(false);
                        setNewForumTitle('');
                        setNewForumSubject('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
              
              {forums.map((forum) => (
                <div key={forum.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{forum.title}</h4>
                        {forum.isActive && (
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        )}
                      </div>
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mb-2">
                        {forum.subject}
                      </span>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{forum.posts} publicaciones</span>
                        <span>{forum.participants} participantes</span>
                        <span>Última actividad: {forum.lastActivity}</span>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notificaciones Recientes</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  Marcar todas como leídas
                </button>
              </div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    notification.read ? 'border-gray-200 bg-white' : 'border-blue-200 bg-blue-50'
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <Bell className={`w-5 h-5 mt-0.5 ${
                      notification.type === 'success' ? 'text-emerald-600' :
                      notification.type === 'warning' ? 'text-orange-600' : 
                      notification.type === 'error' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <span className="text-xs text-gray-500">hace {notification.time}</span>
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