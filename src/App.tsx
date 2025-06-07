import { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import AttendanceModule from './components/Attendance/AttendanceModule';
import GradesModule from './components/Grades/GradesModule';
import EvaluationsModule from './components/Evaluations/EvaluationsModule';
import LibraryModule from './components/Library/LibraryModule';
import AIModule from './components/AI/AIModule';
import CommunicationModule from './components/Communication/CommunicationModule';
import AdminModule from './components/Admin/AdminModule';

const moduleTitle = {
  dashboard: 'Dashboard',
  attendance: 'Gestión de Asistencia',
  grades: 'Gestión de Calificaciones',
  evaluations: 'Evaluaciones',
  library: 'Biblioteca Digital',
  ai: 'Inteligencia Artificial',
  communication: 'Comunicación',
  admin: 'Administración y Seguridad',
};

type ModuleKey = keyof typeof moduleTitle;

function App() {
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Función para manejar el cambio de módulo desde Sidebar
  const handleModuleChange = (module: string) => {
    if (module in moduleTitle) {
      setActiveModule(module as ModuleKey);
    }
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard />;
      case 'attendance': return <AttendanceModule />;
      case 'grades': return <GradesModule />;
      case 'evaluations': return <EvaluationsModule />;
      case 'library': return <LibraryModule />;
      case 'ai': return <AIModule />;
      case 'communication': return <CommunicationModule />;
      case 'admin': return <AdminModule />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={moduleTitle[activeModule]} />
        
        <main className="flex-1 overflow-y-auto">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}

export default App;