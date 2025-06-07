import  { useState } from 'react';
import { Plus, Play, Edit, Trash2, Clock, Users, BarChart3, Eye } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  options?: string[];
  correctAnswer?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  uses: number;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  questions: number;
  duration: number;
  attempts: number;
  avgScore: number;
  status: 'active' | 'completed' | 'draft';
  created: string;
}

export default function EvaluationsModule() {
  const [activeTab, setActiveTab] = useState('exams');
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      title: 'Examen de Álgebra Lineal',
      subject: 'Matemáticas',
      questions: 20,
      duration: 90,
      attempts: 28,
      avgScore: 8.2,
      status: 'active',
      created: '2024-01-15'
    },
    {
      id: '2',
      title: 'Quiz de Cinemática',
      subject: 'Física',
      questions: 10,
      duration: 30,
      attempts: 32,
      avgScore: 7.8,
      status: 'completed',
      created: '2024-01-10'
    },
    {
      id: '3',
      title: 'Evaluación de Química Orgánica',
      subject: 'Química',
      questions: 15,
      duration: 60,
      attempts: 0,
      avgScore: 0,
      status: 'draft',
      created: '2024-01-20'
    },
  ]);

  const [questionBank, setQuestionBank] = useState<Question[]>([
    {
      id: '1',
      text: '¿Cuál es la derivada de x²?',
      type: 'multiple-choice',
      options: ['2x', 'x', '2', 'x²'],
      correctAnswer: '2x',
      difficulty: 'easy',
      category: 'Cálculo',
      uses: 15
    },
    {
      id: '2',
      text: 'Resuelve la ecuación: 2x + 5 = 13',
      type: 'essay',
      difficulty: 'medium',
      category: 'Álgebra',
      uses: 8
    },
    {
      id: '3',
      text: '¿Es verdadero que la velocidad es la derivada de la posición?',
      type: 'true-false',
      correctAnswer: 'true',
      difficulty: 'easy',
      category: 'Física',
      uses: 12
    },
  ]);

  const [newExam, setNewExam] = useState({
    title: '',
    subject: '',
    duration: 60,
    questions: 10
  });

  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'multiple-choice' as 'multiple-choice' | 'true-false' | 'essay',
    options: ['', '', '', ''],
    correctAnswer: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    category: ''
  });

  const createExam = () => {
    if (newExam.title && newExam.subject) {
      const exam: Exam = {
        id: Date.now().toString(),
        title: newExam.title,
        subject: newExam.subject,
        questions: newExam.questions,
        duration: newExam.duration,
        attempts: 0,
        avgScore: 0,
        status: 'draft',
        created: new Date().toISOString().split('T')[0]
      };
      
      setExams(prev => [...prev, exam]);
      setNewExam({ title: '', subject: '', duration: 60, questions: 10 });
      setShowCreateExam(false);
    }
  };

  const createQuestion = () => {
    if (newQuestion.text && newQuestion.category) {
      const question: Question = {
        id: Date.now().toString(),
        text: newQuestion.text,
        type: newQuestion.type,
        options: newQuestion.type === 'multiple-choice' ? newQuestion.options.filter(opt => opt.trim()) : undefined,
        correctAnswer: newQuestion.correctAnswer,
        difficulty: newQuestion.difficulty,
        category: newQuestion.category,
        uses: 0
      };
      
      setQuestionBank(prev => [...prev, question]);
      setNewQuestion({
        text: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: '',
        difficulty: 'easy',
        category: ''
      });
      setShowCreateQuestion(false);
    }
  };

  const deleteExam = (examId: string) => {
    setExams(prev => prev.filter(exam => exam.id !== examId));
  };

  const deleteQuestion = (questionId: string) => {
    setQuestionBank(prev => prev.filter(question => question.id !== questionId));
  };

  const toggleExamStatus = (examId: string) => {
    setExams(prev => prev.map(exam => 
      exam.id === examId 
        ? { ...exam, status: exam.status === 'active' ? 'draft' : 'active' as 'active' | 'draft' }
        : exam
    ));
  };

  const getStatusColor = (status: 'active' | 'completed' | 'draft') => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: 'active' | 'completed' | 'draft') => {
    switch (status) {
      case 'active': return 'Activo';
      case 'completed': return 'Completado';
      case 'draft': return 'Borrador';
      default: return 'Sin estado';
    }
  };

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-100 text-emerald-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Evaluaciones</h2>
            <p className="text-gray-600 mt-1">Gestiona exámenes, cuestionarios y banco de preguntas</p>
          </div>
          <button 
            onClick={() => setShowCreateExam(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Evaluación
          </button>
        </div>
      </div>

      {/* Create Exam Modal */}
      {showCreateExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Evaluación</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={newExam.title}
                  onChange={(e) => setNewExam(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Examen de Matemáticas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Materia</label>
                <select
                  value={newExam.subject}
                  onChange={(e) => setNewExam(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar materia</option>
                  <option value="Matemáticas">Matemáticas</option>
                  <option value="Física">Física</option>
                  <option value="Química">Química</option>
                  <option value="Historia">Historia</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duración (minutos)</label>
                <input
                  type="number"
                  value={newExam.duration}
                  onChange={(e) => setNewExam(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número de preguntas</label>
                <input
                  type="number"
                  value={newExam.questions}
                  onChange={(e) => setNewExam(prev => ({ ...prev, questions: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={createExam}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear
              </button>
              <button
                onClick={() => setShowCreateExam(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Question Modal */}
      {showCreateQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Pregunta</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pregunta</label>
                <textarea
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Escribe la pregunta aquí..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value as 'multiple-choice' | 'true-false' | 'essay' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="multiple-choice">Opción múltiple</option>
                    <option value="true-false">Verdadero/Falso</option>
                    <option value="essay">Ensayo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dificultad</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="easy">Fácil</option>
                    <option value="medium">Medio</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <input
                  type="text"
                  value={newQuestion.category}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Álgebra, Cálculo, etc."
                />
              </div>
              
              {newQuestion.type === 'multiple-choice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opciones</label>
                  <div className="space-y-2">
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...newQuestion.options];
                            newOptions[index] = e.target.value;
                            setNewQuestion(prev => ({ ...prev, options: newOptions }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Opción ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => setNewQuestion(prev => ({ ...prev, correctAnswer: option }))}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            newQuestion.correctAnswer === option
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          Correcta
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newQuestion.type === 'true-false' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Respuesta correcta</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNewQuestion(prev => ({ ...prev, correctAnswer: 'true' }))}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        newQuestion.correctAnswer === 'true'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      Verdadero
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewQuestion(prev => ({ ...prev, correctAnswer: 'false' }))}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        newQuestion.correctAnswer === 'false'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      Falso
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={createQuestion}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Pregunta
              </button>
              <button
                onClick={() => setShowCreateQuestion(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('exams')}
              className={`px-6 py-3 font-medium border-b-2 ${
                activeTab === 'exams'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Exámenes
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-6 py-3 font-medium border-b-2 ${
                activeTab === 'questions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Banco de Preguntas
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-3 font-medium border-b-2 ${
                activeTab === 'results'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Resultados
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'exams' && (
            <div className="space-y-4">
              {exams.map((exam) => (
                <div key={exam.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                          {getStatusText(exam.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{exam.subject}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {exam.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {exam.questions} preguntas
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          Promedio: {exam.avgScore.toFixed(1)}
                        </span>
                        <span>{exam.attempts} intentos</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleExamStatus(exam.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          exam.status === 'active' 
                            ? 'bg-orange-600 text-white hover:bg-orange-700' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        <Play className="w-4 h-4" />
                        {exam.status === 'active' ? 'Pausar' : 'Activar'}
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteExam(exam.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Todas las categorías</option>
                    <option value="algebra">Álgebra</option>
                    <option value="calculo">Cálculo</option>
                    <option value="fisica">Física</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Todas las dificultades</option>
                    <option value="easy">Fácil</option>
                    <option value="medium">Medio</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>
                <button 
                  onClick={() => setShowCreateQuestion(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Nueva Pregunta
                </button>
              </div>

              {questionBank.map((question) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-900 mb-2">{question.text}</p>
                      {question.options && (
                        <div className="mb-2 text-sm text-gray-600">
                          <strong>Opciones:</strong> {question.options.join(', ')}
                        </div>
                      )}
                      {question.correctAnswer && (
                        <div className="mb-2 text-sm text-emerald-600">
                          <strong>Respuesta correcta:</strong> {question.correctAnswer}
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {question.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                        <span className="text-sm text-gray-500">{question.category}</span>
                        <span className="text-sm text-gray-500">Usado {question.uses} veces</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteQuestion(question.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'results' && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Análisis de Resultados</h3>
              <p className="text-gray-600">Aquí se mostrarán estadísticas detalladas de las evaluaciones</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}