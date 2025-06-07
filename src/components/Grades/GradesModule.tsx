import { useState } from 'react';
import { Plus, Download, TrendingUp, Calculator, Filter, Edit, Save, X } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  grades: number[];
  average: number;
  trend: 'up' | 'down' | 'stable';
}

interface Assignment {
  name: string;
  weight: number;
}

export default function GradesModule() {
  const [selectedSubject, setSelectedSubject] = useState('matematicas');
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [editingGrades, setEditingGrades] = useState<number[]>([]);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ name: '', weight: 0 });
  
  const [students, setStudents] = useState<Student[]>([
    { 
      id: '1', 
      name: 'Ana García', 
      grades: [9.5, 8.7, 9.2, 8.9], 
      average: 9.1,
      trend: 'up'
    },
    { 
      id: '2', 
      name: 'Carlos López', 
      grades: [7.8, 8.2, 7.5, 8.0], 
      average: 7.9,
      trend: 'stable'
    },
    { 
      id: '3', 
      name: 'María Rodríguez', 
      grades: [9.0, 9.3, 9.1, 9.4], 
      average: 9.2,
      trend: 'up'
    },
    { 
      id: '4', 
      name: 'Pedro Martínez', 
      grades: [6.5, 7.2, 6.8, 7.5], 
      average: 7.0,
      trend: 'up'
    },
    { 
      id: '5', 
      name: 'Laura Sánchez', 
      grades: [8.8, 8.5, 8.2, 8.0], 
      average: 8.4,
      trend: 'down'
    },
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    { name: 'Examen 1', weight: 30 },
    { name: 'Tarea 1', weight: 15 },
    { name: 'Proyecto', weight: 25 },
    { name: 'Examen 2', weight: 30 },
  ]);

  const startEditing = (studentId: string, grades: number[]) => {
    setEditingStudent(studentId);
    setEditingGrades([...grades]);
  };

  const saveGrades = () => {
    if (editingStudent) {
      const newAverage = editingGrades.reduce((sum, grade, index) => 
        sum + (grade * assignments[index].weight / 100), 0
      );
      
      setStudents(prev => prev.map(student => 
        student.id === editingStudent 
          ? { ...student, grades: [...editingGrades], average: newAverage }
          : student
      ));
      
      setEditingStudent(null);
      setEditingGrades([]);
    }
  };

  const cancelEditing = () => {
    setEditingStudent(null);
    setEditingGrades([]);
  };

  const updateGrade = (index: number, value: number) => {
    const newGrades = [...editingGrades];
    newGrades[index] = value;
    setEditingGrades(newGrades);
  };

  const addAssignment = () => {
    const totalWeight = assignments.reduce((sum, a) => sum + a.weight, 0) + newAssignment.weight;
    if (!newAssignment.name || newAssignment.weight <= 0) return;
    if (totalWeight > 100) {
      alert('La suma de los pesos no puede exceder 100%.');
      return;
    }
    setAssignments(prev => [...prev, newAssignment]);
    setStudents(prev => prev.map(student => ({
      ...student,
      grades: [...student.grades, 0]
    })));
    setNewAssignment({ name: '', weight: 0 });
    setShowAddAssignment(false);
  };

  const exportGrades = () => {
    const data = students.map(student => {
      const gradeData: any = { Nombre: student.name };
      assignments.forEach((assignment, index) => {
        gradeData[assignment.name] = student.grades[index] || 0;
      });
      gradeData.Promedio = student.average.toFixed(2);
      return gradeData;
    });
    
    const headers = ['Nombre', ...assignments.map(a => a.name), 'Promedio'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + data.map(row => headers.map(header => row[header]).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `calificaciones_${selectedSubject}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-emerald-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return 'text-emerald-600 bg-emerald-50';
    if (grade >= 8) return 'text-blue-600 bg-blue-50';
    if (grade >= 7) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const stats = {
    average: students.reduce((sum, student) => sum + student.average, 0) / students.length,
    passed: students.filter(s => s.average >= 7).length,
    atRisk: students.filter(s => s.average >= 6 && s.average < 7).length,
    failed: students.filter(s => s.average < 6).length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Materia</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="matematicas">Matemáticas</option>
                <option value="fisica">Física</option>
                <option value="quimica">Química</option>
                <option value="historia">Historia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="2024-1">2024 - Primer Semestre</option>
                <option value="2024-2">2024 - Segundo Semestre</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setShowAddAssignment(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva Evaluación
            </button>
            <button 
              onClick={exportGrades}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Add Assignment Modal */}
      {showAddAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Evaluación</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={newAssignment.name}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Examen Parcial"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peso (%)</label>
                <input
                  type="number"
                  value={newAssignment.weight}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, weight: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={addAssignment}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Agregar
              </button>
              <button
                onClick={() => setShowAddAssignment(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Promedio General</p>
              <p className="text-2xl font-bold text-blue-600">{stats.average.toFixed(1)}</p>
            </div>
            <Calculator className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aprobados</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.passed}</p>
            </div>
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 font-bold">✓</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Riesgo</p>
              <p className="text-2xl font-bold text-orange-600">{stats.atRisk}</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">⚠</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reprobados</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">✗</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Calificaciones por Estudiante</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filtrar
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <TrendingUp className="w-4 h-4" />
                Análisis
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-700">Estudiante</th>
                {assignments.map((assignment, index) => (
                  <th key={index} className="text-center p-4 font-medium text-gray-700">
                    {assignment.name}
                    <div className="text-xs text-gray-500">({assignment.weight}%)</div>
                  </th>
                ))}
                <th className="text-center p-4 font-medium text-gray-700">Promedio</th>
                <th className="text-center p-4 font-medium text-gray-700">Tendencia</th>
                <th className="text-center p-4 font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
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
                  {student.grades.map((grade, index) => (
                    <td key={index} className="p-4 text-center">
                      {editingStudent === student.id ? (
                        <input
                          type="number"
                          value={editingGrades[index] || 0}
                          onChange={(e) => updateGrade(index, Number(e.target.value))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          max="10"
                          step="0.1"
                        />
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(grade)}`}>
                          {grade.toFixed(1)}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(student.average)}`}>
                      {student.average.toFixed(1)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-lg ${getTrendColor(student.trend)}`}>
                      {getTrendIcon(student.trend)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {editingStudent === student.id ? (
                      <div className="flex gap-1 justify-center">
                        <button 
                          onClick={saveGrades}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={cancelEditing}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => startEditing(student.id, student.grades)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
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