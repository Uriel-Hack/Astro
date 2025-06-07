import { useState } from 'react';
import { Users, Shield, Settings, Database, Activity, UserPlus, Eye, Edit, Trash2, Search,  Download, Lock, Unlock } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student' | 'admin';
  status: 'active' | 'inactive';
  lastLogin: string;
  courses: number;
}

interface SystemLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  ip: string;
  status: 'success' | 'error' | 'warning' | 'info';
}

export default function AdminModule() {
  const [activeSection, setActiveSection] = useState('users');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@escuela.edu',
      role: 'teacher',
      status: 'active',
      lastLogin: '2024-01-15 09:30',
      courses: 3
    },
    {
      id: '2',
      name: 'Ana García',
      email: 'ana.garcia@estudiante.edu',
      role: 'student',
      status: 'active',
      lastLogin: '2024-01-15 08:15',
      courses: 5
    },
    {
      id: '3',
      name: 'Carlos López',
      email: 'carlos.lopez@estudiante.edu',
      role: 'student',
      status: 'inactive',
      lastLogin: '2024-01-10 14:22',
      courses: 4
    },
    {
      id: '4',
      name: 'María Rodríguez',
      email: 'maria.rodriguez@admin.edu',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15 07:45',
      courses: 0
    },
  ]);

  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([
    {
      id: '1',
      action: 'Login exitoso',
      user: 'Juan Pérez',
      timestamp: '2024-01-15 09:30:15',
      ip: '192.168.1.100',
      status: 'success'
    },
    {
      id: '2',
      action: 'Error de autenticación',
      user: 'Desconocido',
      timestamp: '2024-01-15 09:15:32',
      ip: '203.0.113.42',
      status: 'error'
    },
    {
      id: '3',
      action: 'Backup automático completado',
      user: 'Sistema',
      timestamp: '2024-01-15 02:00:00',
      ip: 'localhost',
      status: 'info'
    },
    {
      id: '4',
      action: 'Usuario creado',
      user: 'María Rodríguez',
      timestamp: '2024-01-14 16:45:23',
      ip: '192.168.1.105',
      status: 'success'
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student' as 'teacher' | 'student' | 'admin',
    password: ''
  });

  const createUser = () => {
    if (newUser.name && newUser.email && newUser.password) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'active',
        lastLogin: 'Nunca',
        courses: 0
      };
      
      setUsers(prev => [...prev, user]);
      
      // Add log entry
      const logEntry: SystemLog = {
        id: Date.now().toString(),
        action: 'Usuario creado',
        user: 'Administrador',
        timestamp: new Date().toLocaleString('es-ES'),
        ip: '192.168.1.1',
        status: 'success'
      };
      
      setSystemLogs(prev => [logEntry, ...prev]);
      setNewUser({ name: '', email: '', role: 'student', password: '' });
      setShowCreateUser(false);
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    
    const user = users.find(u => u.id === userId);
    if (user) {
      const logEntry: SystemLog = {
        id: Date.now().toString(),
        action: `Usuario ${user.status === 'active' ? 'desactivado' : 'activado'}`,
        user: 'Administrador',
        timestamp: new Date().toLocaleString('es-ES'),
        ip: '192.168.1.1',
        status: 'info'
      };
      
      setSystemLogs(prev => [logEntry, ...prev]);
    }
  };

  const deleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && window.confirm(`¿Estás seguro de eliminar a ${user.name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      
      const logEntry: SystemLog = {
        id: Date.now().toString(),
        action: 'Usuario eliminado',
        user: 'Administrador',
        timestamp: new Date().toLocaleString('es-ES'),
        ip: '192.168.1.1',
        status: 'warning'
      };
      
      setSystemLogs(prev => [logEntry, ...prev]);
    }
  };

  const exportUsers = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Nombre,Email,Rol,Estado,Último Login,Cursos\n"
      + users.map(user => `${user.name},${user.email},${getRoleText(user.role)},${user.status === 'active' ? 'Activo' : 'Inactivo'},${user.lastLogin},${user.courses}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "usuarios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Acción,Usuario,Fecha y Hora,IP,Estado\n"
      + systemLogs.map(log => `${log.action},${log.user},${log.timestamp},${log.ip},${log.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "logs_sistema.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'teacher': return 'Docente';
      case 'student': return 'Estudiante';
      default: return 'Sin rol';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLogStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-emerald-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-orange-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const adminSections = [
    { id: 'users', label: 'Gestión de Usuarios', icon: Users },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'system', label: 'Sistema', icon: Settings },
    { id: 'logs', label: 'Auditoría', icon: Activity },
    { id: 'backup', label: 'Respaldos', icon: Database },
  ];

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    students: users.filter(u => u.role === 'student').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Panel de Administración</h2>
              <p className="text-slate-300 mt-1">Gestión completa del sistema y usuarios</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-300">Sistema</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Operativo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crear Nuevo Usuario</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="juan@escuela.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="student">Estudiante</option>
                  <option value="teacher">Docente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña temporal</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={createUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Usuario
              </button>
              <button
                onClick={() => setShowCreateUser(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeSection === section.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeSection === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={exportUsers}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Exportar
                  </button>
                  <button 
                    onClick={() => setShowCreateUser(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Nuevo Usuario
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos los roles</option>
                  <option value="admin">Administradores</option>
                  <option value="teacher">Docentes</option>
                  <option value="student">Estudiantes</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Total Usuarios</p>
                      <p className="text-2xl font-bold text-blue-900">{userStats.total}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-emerald-600">Activos</p>
                      <p className="text-2xl font-bold text-emerald-900">{userStats.active}</p>
                    </div>
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-bold">✓</span>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600">Docentes</p>
                      <p className="text-2xl font-bold text-purple-900">{userStats.teachers}</p>
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold">👨‍🏫</span>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600">Estudiantes</p>
                      <p className="text-2xl font-bold text-orange-900">{userStats.students}</p>
                    </div>
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold">🎓</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-700">Usuario</th>
                        <th className="text-left p-4 font-medium text-gray-700">Rol</th>
                        <th className="text-left p-4 font-medium text-gray-700">Estado</th>
                        <th className="text-left p-4 font-medium text-gray-700">Último Login</th>
                        <th className="text-left p-4 font-medium text-gray-700">Cursos</th>
                        <th className="text-left p-4 font-medium text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                              {getRoleText(user.role)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                              {user.status === 'active' ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-600">{user.lastLogin}</td>
                          <td className="p-4 text-sm text-gray-600">{user.courses}</td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => toggleUserStatus(user.id)}
                                className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              >
                                {user.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => deleteUser(user.id)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'logs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Registro de Auditoría</h3>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="all">Todas las acciones</option>
                    <option value="login">Inicios de sesión</option>
                    <option value="error">Errores</option>
                    <option value="system">Sistema</option>
                  </select>
                  <button 
                    onClick={exportLogs}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Exportar
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-700">Acción</th>
                        <th className="text-left p-4 font-medium text-gray-700">Usuario</th>
                        <th className="text-left p-4 font-medium text-gray-700">Fecha y Hora</th>
                        <th className="text-left p-4 font-medium text-gray-700">IP</th>
                        <th className="text-left p-4 font-medium text-gray-700">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {systemLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-medium text-gray-900">{log.action}</td>
                          <td className="p-4 text-gray-600">{log.user}</td>
                          <td className="p-4 text-sm text-gray-600">{log.timestamp}</td>
                          <td className="p-4 text-sm text-gray-600">{log.ip}</td>
                          <td className="p-4">
                            <span className={`text-sm font-medium ${getLogStatusColor(log.status)}`}>
                              ●
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {(activeSection === 'security' || activeSection === 'system' || activeSection === 'backup') && (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sección en Desarrollo</h3>
              <p className="text-gray-600">Esta funcionalidad estará disponible próximamente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}