import {
  BookOpen,
  Users,
  GraduationCap,
  ClipboardList,
  Library,
  Bot,
  MessageCircle,
  Settings,
  Home,
  Menu,
  X
} from 'lucide-react';

// Importa el tipo ModuleKey desde App o declara aquí si es necesario
export type ModuleKey =
  | 'dashboard'
  | 'attendance'
  | 'grades'
  | 'evaluations'
  | 'library'
  | 'ai'
  | 'communication'
  | 'admin';

interface SidebarProps {
  activeModule: ModuleKey;
  onModuleChange: (module: ModuleKey) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'attendance', label: 'Asistencia', icon: Users },
  { id: 'grades', label: 'Calificaciones', icon: GraduationCap },
  { id: 'evaluations', label: 'Evaluaciones', icon: ClipboardList },
  { id: 'library', label: 'Biblioteca Digital', icon: Library },
  { id: 'ai', label: 'IA Educativa', icon: Bot },
  { id: 'communication', label: 'Comunicación', icon: MessageCircle },
  { id: 'admin', label: 'Administración', icon: Settings },
] as const;

export default function Sidebar({
  activeModule,
  onModuleChange,
  isCollapsed,
  onToggle
}: SidebarProps) {
  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col`}>
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <BookOpen className="w-8 h-8 text-blue-400" />
            {!isCollapsed && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                EduPlatform
              </h1>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onModuleChange(item.id as ModuleKey)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">JP</span>
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium">Juan Pérez</p>
              <p className="text-xs text-slate-400">Docente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}