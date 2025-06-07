import { Users, GraduationCap, BookOpen, TrendingUp, Calendar, Clock,  } from 'lucide-react';
import StatsCard from './StatsCard';

export default function Dashboard() {
  const quickActions = [
    { title: 'Registrar Asistencia', description: 'Marcar asistencia de hoy', color: 'bg-blue-500', icon: Users },
    { title: 'Nueva Evaluación', description: 'Crear examen o cuestionario', color: 'bg-purple-500', icon: BookOpen },
    { title: 'Subir Material', description: 'Agregar recursos a biblioteca', color: 'bg-emerald-500', icon: Calendar },
    { title: 'Ver Reportes', description: 'Analizar rendimiento', color: 'bg-orange-500', icon: TrendingUp },
  ];

  const recentActivity = [
    { action: 'Evaluación de Matemáticas completada', time: '2 horas', type: 'success' },
    { action: 'Juan Carlos marcó asistencia tarde', time: '3 horas', type: 'warning' },
    { action: 'Nuevo material subido a Física', time: '5 horas', type: 'info' },
    { action: 'Reporte mensual generado', time: '1 día', type: 'success' },
  ];

  return (
    <div className="p-6 space-y-6">
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
          value="8.7"
          change="+0.3 puntos"
          changeType="positive"
          icon={GraduationCap}
          color="green"
        />
        <StatsCard
          title="Evaluaciones Pendientes"
          value={15}
          change="3 para esta semana"
          changeType="neutral"
          icon={BookOpen}
          color="purple"
        />
        <StatsCard
          title="Asistencia Promedio"
          value="92%"
          change="-2% desde ayer"
          changeType="negative"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left group"
                    aria-label={action.title}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-medium text-gray-900">{action.title}</h4>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-emerald-500' :
                  activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">hace {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Horario de Hoy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Matemáticas</p>
              <p className="text-sm text-blue-600">08:00 - 09:30</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
            <Clock className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-medium text-emerald-900">Física</p>
              <p className="text-sm text-emerald-600">10:00 - 11:30</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Clock className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-medium text-purple-900">Química</p>
              <p className="text-sm text-purple-600">14:00 - 15:30</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}