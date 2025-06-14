import { useState } from 'react';
import {  Users, QrCode, Smartphone, Download, Filter, Check, X, Clock, AlertCircle } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  status: 'present' | 'late' | 'absent' | 'unmarked';
  time?: string;
  avatar?: string;
}

export default function AttendanceModule() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('matematicas');
  const [showQRCode, setShowQRCode] = useState(false);
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Ana García', status: 'present', time: '08:15' },
    { id: '2', name: 'Carlos López', status: 'late', time: '08:25' },
    { id: '3', name: 'María Rodríguez', status: 'absent', time: '-' },
    { id: '4', name: 'Pedro Martínez', status: 'present', time: '08:10' },
    { id: '5', name: 'Laura Sánchez', status: 'unmarked', time: '-' },
    { id: '6', name: 'Diego Morales', status: 'unmarked', time: '-' },
  ]);

  const updateAttendance = (studentId: string, status: 'present' | 'late' | 'absent') => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { 
            ...student, 
            status, 
            time: status === 'absent' ? '-' : new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
          }
        : student
    ));
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({
      ...student,
      status: 'present' as const,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    })));
  };

  const exportAttendance = () => {
    const data = students.map(student => ({
      Nombre: student.name,
      Estado: getStatusText(student.status),
      Hora: student.time,
      Fecha: selectedDate,
      Materia: selectedClass
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Nombre,Estado,Hora,Fecha,Materia\n"
      + data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `asistencia_${selectedDate}_${selectedClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  type StatusType = 'present' | 'late' | 'absent' | 'unmarked';

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'present': return 'bg-emerald-100 text-emerald-800';
      case 'late': return 'bg-orange-100 text-orange-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'unmarked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: StatusType) => {
    switch (status) {
      case 'present': return 'Presente';
      case 'late': return 'Tardanza';
      case 'absent': return 'Ausente';
      case 'unmarked': return 'Sin marcar';
      default: return 'Sin marcar';
    }
  };

  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case 'present': return <Check className="w-4 h-4" />;
      case 'late': return <Clock className="w-4 h-4" />;
      case 'absent': return <X className="w-4 h-4" />;
      case 'unmarked': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const stats = {
    total: students.length,
    present: students.filter(s => s.status === 'present').length,
    late: students.filter(s => s.status === 'late').length,
    absent: students.filter(s => s.status === 'absent').length,
    unmarked: students.filter(s => s.status === 'unmarked').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Materia</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="matematicas">Matemáticas</option>
                <option value="fisica">Física</option>
                <option value="quimica">Química</option>
                <option value="historia">Historia</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setShowQRCode(!showQRCode)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <QrCode className="w-4 h-4" />
              {showQRCode ? 'Ocultar QR' : 'Código QR'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Smartphone className="w-4 h-4" />
              Biométrico
            </button>
            <button 
              onClick={markAllPresent}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Users className="w-4 h-4" />
              Marcar Todos
            </button>
          </div>
        </div>

        {/* QR Code Display */}
        {showQRCode && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Código QR para</p>
                  <p className="text-sm font-medium text-gray-900">{selectedClass} - {selectedDate}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Los estudiantes pueden escanear este código para marcar su asistencia</p>
            </div>
          </div>
        )}
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Presentes</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.present}</p>
            </div>
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tardanzas</p>
              <p className="text-2xl font-bold text-orange-600">{stats.late}</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ausentes</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sin marcar</p>
              <p className="text-2xl font-bold text-gray-600">{stats.unmarked}</p>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Lista de Asistencia</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filtrar
              </button>
              <button 
                onClick={exportAttendance}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-700">Estudiante</th>
                <th className="text-left p-4 font-medium text-gray-700">Estado</th>
                <th className="text-left p-4 font-medium text-gray-700">Hora</th>
                <th className="text-left p-4 font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                        {getStatusIcon(student.status)}
                        {getStatusText(student.status)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{student.time}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => updateAttendance(student.id, 'present')}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          student.status === 'present' 
                            ? 'bg-emerald-200 text-emerald-800' 
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        Presente
                      </button>
                      <button 
                        onClick={() => updateAttendance(student.id, 'late')}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          student.status === 'late' 
                            ? 'bg-orange-200 text-orange-800' 
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                      >
                        Tarde
                      </button>
                      <button 
                        onClick={() => updateAttendance(student.id, 'absent')}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          student.status === 'absent' 
                            ? 'bg-red-200 text-red-800' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        Ausente
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
  );
}