import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Eye, Copy } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  options?: string[];
  correctAnswer?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  instructions: string;
  questions: Question[];
  settings: {
    shuffleQuestions: boolean;
    showResults: boolean;
    allowRetakes: boolean;
    timeLimit: boolean;
  };
}

interface EditExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam | null;
  onSave: (exam: Exam) => void;
}

export default function EditExamModal({ isOpen, onClose, exam, onSave }: EditExamModalProps) {
  const [editedExam, setEditedExam] = useState<Exam | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'questions' | 'settings'>('general');
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (exam) {
      setEditedExam({ ...exam });
    }
  }, [exam]);

  if (!isOpen || !editedExam) return null;

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      difficulty: 'medium',
      category: editedExam.subject,
      points: 1
    };

    setEditedExam(prev => prev ? {
      ...prev,
      questions: [...prev.questions, newQuestion]
    } : null);
    setEditingQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setEditedExam(prev => prev ? {
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    } : null);
  };

  const deleteQuestion = (questionId: string) => {
    setEditedExam(prev => prev ? {
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    } : null);
  };

  const duplicateQuestion = (questionId: string) => {
    const question = editedExam.questions.find(q => q.id === questionId);
    if (question) {
      const duplicated: Question = {
        ...question,
        id: Date.now().toString(),
        text: `${question.text} (Copia)`
      };
      setEditedExam(prev => prev ? {
        ...prev,
        questions: [...prev.questions, duplicated]
      } : null);
    }
  };

  const handleSave = () => {
    if (editedExam) {
      onSave(editedExam);
      onClose();
    }
  };

  const totalPoints = editedExam.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Editar Evaluación</h2>
            <p className="text-gray-600 mt-1">{editedExam.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { key: 'general', label: 'General' },
              { key: 'questions', label: `Preguntas (${editedExam.questions.length})` },
              { key: 'settings', label: 'Configuración' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título de la evaluación
                  </label>
                  <input
                    type="text"
                    value={editedExam.title}
                    onChange={(e) => setEditedExam(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Materia
                  </label>
                  <select
                    value={editedExam.subject}
                    onChange={(e) => setEditedExam(prev => prev ? { ...prev, subject: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Matemáticas">Matemáticas</option>
                    <option value="Física">Física</option>
                    <option value="Química">Química</option>
                    <option value="Historia">Historia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  value={editedExam.duration}
                  onChange={(e) => setEditedExam(prev => prev ? { ...prev, duration: Number(e.target.value) } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instrucciones
                </label>
                <textarea
                  value={editedExam.instructions}
                  onChange={(e) => setEditedExam(prev => prev ? { ...prev, instructions: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Instrucciones para los estudiantes..."
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Resumen</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Preguntas:</span>
                    <span className="ml-2 font-medium">{editedExam.questions.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Puntos totales:</span>
                    <span className="ml-2 font-medium">{totalPoints}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Duración:</span>
                    <span className="ml-2 font-medium">{editedExam.duration} min</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Preguntas ({editedExam.questions.length})
                </h3>
                <button
                  onClick={addQuestion}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Pregunta
                </button>
              </div>

              {editedExam.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">
                      Pregunta {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingQuestion(editingQuestion === question.id ? null : question.id)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => duplicateQuestion(question.id)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {editingQuestion === question.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pregunta
                        </label>
                        <textarea
                          value={question.text}
                          onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo
                          </label>
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(question.id, { type: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="multiple-choice">Opción múltiple</option>
                            <option value="true-false">Verdadero/Falso</option>
                            <option value="essay">Ensayo</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dificultad
                          </label>
                          <select
                            value={question.difficulty}
                            onChange={(e) => updateQuestion(question.id, { difficulty: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="easy">Fácil</option>
                            <option value="medium">Medio</option>
                            <option value="hard">Difícil</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Puntos
                          </label>
                          <input
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuestion(question.id, { points: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="1"
                          />
                        </div>
                      </div>

                      {question.type === 'multiple-choice' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Opciones
                          </label>
                          <div className="space-y-2">
                            {question.options?.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...(question.options || [])];
                                    newOptions[optionIndex] = e.target.value;
                                    updateQuestion(question.id, { options: newOptions });
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder={`Opción ${optionIndex + 1}`}
                                />
                                <button
                                  onClick={() => updateQuestion(question.id, { correctAnswer: option })}
                                  className={`px-3 py-2 rounded-lg transition-colors ${
                                    question.correctAnswer === option
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

                      {question.type === 'true-false' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Respuesta correcta
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateQuestion(question.id, { correctAnswer: 'true' })}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                question.correctAnswer === 'true'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              Verdadero
                            </button>
                            <button
                              onClick={() => updateQuestion(question.id, { correctAnswer: 'false' })}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                question.correctAnswer === 'false'
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
                  ) : (
                    <div>
                      <p className="text-gray-900 mb-2">{question.text || 'Sin texto'}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {question.type}
                        </span>
                        <span>{question.difficulty}</span>
                        <span>{question.points} pts</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Configuración de la evaluación</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Mezclar preguntas</h4>
                    <p className="text-sm text-gray-600">Las preguntas aparecerán en orden aleatorio</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedExam.settings.shuffleQuestions}
                      onChange={(e) => setEditedExam(prev => prev ? {
                        ...prev,
                        settings: { ...prev.settings, shuffleQuestions: e.target.checked }
                      } : null)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Mostrar resultados</h4>
                    <p className="text-sm text-gray-600">Los estudiantes verán sus resultados al terminar</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedExam.settings.showResults}
                      onChange={(e) => setEditedExam(prev => prev ? {
                        ...prev,
                        settings: { ...prev.settings, showResults: e.target.checked }
                      } : null)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Permitir reintentos</h4>
                    <p className="text-sm text-gray-600">Los estudiantes pueden realizar la evaluación múltiples veces</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedExam.settings.allowRetakes}
                      onChange={(e) => setEditedExam(prev => prev ? {
                        ...prev,
                        settings: { ...prev.settings, allowRetakes: e.target.checked }
                      } : null)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Límite de tiempo</h4>
                    <p className="text-sm text-gray-600">Aplicar el tiempo límite configurado</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedExam.settings.timeLimit}
                      onChange={(e) => setEditedExam(prev => prev ? {
                        ...prev,
                        settings: { ...prev.settings, timeLimit: e.target.checked }
                      } : null)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}