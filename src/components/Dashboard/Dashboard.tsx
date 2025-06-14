import { Users, GraduationCap, BookOpen, TrendingUp, Calendar, Clock, ChevronRight, Activity, Award, Target } from 'lucide-react';
import StatsCard from './StatsCard';
import { useState } from 'react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: any;
  module: string;
}

interface DashboardProps {
  onModuleChange?: (module: string) => void;
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export default function Dashboard({ onModuleChange, user }: DashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const quickActions: QuickAction[] = [
    { 
      id: 'attendance',
      title: 'Registrar Asistencia', 
      description: 'Marcar asistencia de hoy', 
      color: 'bg-blue-500', 
      icon: Users,
      module: 'attendance'
    },
    { 
      id: 'evaluation',
      title: 'Nueva Evaluación', 
      description: 'Crear examen o cuestionario', 
      color: 'bg-purple-500', 
      icon: BookOpen,
      module: 'evaluations'
    },
    { 
      id: 'library',
      title: 'Subir Material', 
      description: 'Agregar recursos a biblioteca', 
      color: 'bg-emerald-500', 
      icon: Calendar,
      module: 'library'
    },
    { 
      id: 'ai',
      title: 'Asistente IA', 
      description: 'Generar contenido educativo', 
      color: 'bg-orange-500', 
      icon: TrendingUp,
      module: 'ai'
    },
  ];

  const recentActivity = [
    { action: 'Evaluación de Matemáticas completada', time: '2 horas', type: 'success', student: 'Ana García' },
    { action: 'Juan Carlos marcó asistencia tarde', time: '3 horas', type: 'warning', student: 'Juan Carlos' },
    { action: 'Nuevo material subido a Física', time: '5 horas', type: 'info', student: 'Sistema' },
    { action: 'Reporte mensual generado', time: '1 día', type: 'success', student: 'Sistema' },
    { action: 'María completó tarea de Química', time: '2 días', type: 'success', student: 'María Rodríguez' },
  ];

  const upcomingClasses = [
    { subject: 'Matemáticas', time: '08:00 - 09:30', room: 'Aula 101', students: 28 },
    { subject: 'Física', time: '10:00 - 11:30', room: 'Lab 205', students: 25 },
    { subject: 'Química', time: '14:00 - 15:30', room: 'Lab 301', students: 22 },
  ];

  const performanceData = {
    week: { attendance: 94, average: 8.7, completed: 89 },
    month: { attendance: 92, average: 8.5, completed: 91 },
    semester: { attendance: 90, average: 8.3, completed: 88 }
  };

  const currentData = performanceData[selectedPeriod as keyof typeof performanceData];

  const handleQuickAction = (action: QuickAction) => {
    if (onModuleChange) {
      onModuleChange(action.module);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {getGreeting()}, {user?.name || 'Usuario'}
            </h2>
            <p className="text-blue-100 mt-1">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                Rol: {user?.role === 'teacher' ? 'Docente' : user?.role === 'admin' ? 'Administrador' : 'Estudiante'}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {user?.email}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl font-bold">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm">En línea</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Period Selector */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Rendimiento General</h3>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="semester">Este semestre</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Estudiantes Activos"
            value={248}
            change="+12% desde el mes pasado"
            changeType="positive"
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Promedio General"
            value={currentData.average.toString()}
            change="+0.3 puntos"
            changeType="positive"
            icon={GraduationCap}
            color="green"
          />
          <StatsCard
            title="Asistencia"
            value={`${currentData.attendance}%`}
            change="-2% desde ayer"
            changeType="negative"
            icon={Activity}
            color="purple"
          />
          <StatsCard
            title="Tareas Completadas"
            value={`${currentData.completed}%`}
            change="+5% esta semana"
            changeType="positive"
            icon={Target}
            color="orange"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left group transform hover:scale-105"
                    aria-label={action.title}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-medium text-gray-900">{action.title}</h4>
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-600 transition-colors" />
                    </div>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            <button 
              onClick={() => onModuleChange?.('communication')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todo
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-emerald-500' :
                  activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{activity.student}</p>
                    <p className="text-xs text-gray-500">hace {activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Horario de Hoy</h3>
          <button 
            onClick={() => onModuleChange?.('attendance')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            Gestionar Asistencia
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingClasses.map((classItem, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
              <Clock className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">{classItem.subject}</p>
                <p className="text-sm text-blue-600">{classItem.time}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-blue-500">
                  <span>{classItem.room}</span>
                  <span>{classItem.students} estudiantes</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-6 h-6 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900">Logros Recientes</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-bold">🏆</span>
              </div>
              <span className="font-medium text-gray-900">Excelencia Académica</span>
            </div>
            <p className="text-sm text-gray-600">95% de aprobación este mes</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">📚</span>
              </div>
              <span className="font-medium text-gray-900">Material Innovador</span>
            </div>
            <p className="text-sm text-gray-600">50+ recursos subidos</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">⭐</span>
              </div>
              <span className="font-medium text-gray-900">Participación Activa</span>
            </div>
            <p className="text-sm text-gray-600">Comunicación constante</p>
          </div>
        </div>
      </div>
    </div>
  );
}