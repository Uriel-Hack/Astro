import { useState } from 'react';
import { Bot, TrendingUp, AlertTriangle, Lightbulb, MessageSquare, BarChart3, Send, RefreshCw } from 'lucide-react';

interface AIRecommendation {
  id: string;
  student: string;
  issue: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  implemented?: boolean;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export default function AIModule() {
  const [selectedInsight, setSelectedInsight] = useState('performance');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hola! Soy tu asistente de IA educativa. Puedo ayudarte a analizar el rendimiento de tus estudiantes, detectar dificultades y generar recomendaciones personalizadas. ¿En qué puedo ayudarte hoy?',
      timestamp: '10:00'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([
    {
      id: '1',
      student: 'Ana García',
      issue: 'Dificultad en álgebra lineal',
      recommendation: 'Reforzar conceptos básicos con ejercicios visuales',
      priority: 'high',
      confidence: 87,
      implemented: false
    },
    {
      id: '2',
      student: 'Carlos López',
      issue: 'Bajo rendimiento en exámenes',
      recommendation: 'Implementar técnicas de manejo de ansiedad',
      priority: 'medium',
      confidence: 73,
      implemented: false
    },
    {
      id: '3',
      student: 'María Rodríguez',
      issue: 'Excelente rendimiento sostenido',
      recommendation: 'Ofrecer desafíos adicionales y proyectos avanzados',
      priority: 'low',
      confidence: 92,
      implemented: true
    }
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState([
    { metric: 'Promedio General', value: '8.3', trend: '+0.2', positive: true },
    { metric: 'Tasa de Aprobación', value: '94%', trend: '+3%', positive: true },
    { metric: 'Asistencia Promedio', value: '92%', trend: '-1%', positive: false },
    { metric: 'Participación en Clase', value: '78%', trend: '+5%', positive: true },
  ]);

  const insights = [
    {
      id: 'performance',
      title: 'Análisis de Rendimiento',
      description: 'Patrones de aprendizaje y tendencias académicas',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      id: 'difficulties',
      title: 'Detección de Dificultades',
      description: 'Identificación temprana de problemas de aprendizaje',
      icon: AlertTriangle,
      color: 'orange'
    },
    {
      id: 'recommendations',
      title: 'Recomendaciones Pedagógicas',
      description: 'Sugerencias personalizadas para mejorar la enseñanza',
      icon: Lightbulb,
      color: 'purple'
    },
    {
      id: 'reports',
      title: 'Informes Automáticos',
      description: 'Reportes de progreso generados automáticamente',
      icon: BarChart3,
      color: 'emerald'
    }
  ];

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(),
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (): string => {
    const responses = [
      'Basándome en los datos recientes, he identificado algunos patrones interesantes en el rendimiento de tus estudiantes.',
      'Los análisis muestran que el 85% de los estudiantes han mejorado en las últimas 3 semanas.',
      'Recomiendo implementar más actividades prácticas para reforzar los conceptos teóricos.',
      'He detectado que algunos estudiantes podrían beneficiarse de sesiones de tutoría adicionales.',
      'Los datos sugieren que el método de enseñanza actual está funcionando bien para la mayoría del grupo.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const implementRecommendation = (recommendationId: string) => {
    setAiRecommendations(prev => prev.map(rec => 
      rec.id === recommendationId 
        ? { ...rec, implemented: true }
        : rec
    ));
  };

  const generateNewRecommendations = () => {
    // Simulate generating new recommendations
    const newRec: AIRecommendation = {
      id: Date.now().toString(),
      student: 'Nuevo Estudiante',
      issue: 'Análisis en progreso',
      recommendation: 'Recomendación generada automáticamente',
      priority: 'medium',
      confidence: Math.floor(Math.random() * 30) + 70,
      implemented: false
    };
    
    setAiRecommendations(prev => [...prev, newRec]);
  };

  const refreshMetrics = () => {
    setPerformanceMetrics(prev => prev.map(metric => ({
      ...metric,
      value: metric.metric.includes('%') 
        ? `${Math.floor(Math.random() * 20) + 80}%`
        : (Math.random() * 2 + 7).toFixed(1),
      trend: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 5).toFixed(1)}${metric.metric.includes('%') ? '%' : ''}`,
      positive: Math.random() > 0.3
    })));
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Sin definir';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Inteligencia Artificial Educativa</h2>
              <p className="text-purple-100 mt-1">Análisis inteligente para mejorar el proceso de enseñanza-aprendizaje</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-purple-100">Estado del Sistema</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Activo y aprendiendo</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight) => {
          const Icon = insight.icon;
          const isSelected = selectedInsight === insight.id;
          return (
            <button
              key={insight.id}
              onClick={() => setSelectedInsight(insight.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 transform scale-105'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <Icon className={`w-6 h-6 mb-3 ${
                isSelected ? 'text-blue-600' : 'text-gray-600'
              }`} />
              <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </button>
          );
        })}
      </div>

      {/* Performance Metrics */}
      {selectedInsight === 'performance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Métricas de Rendimiento</h3>
            <button 
              onClick={refreshMetrics}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-600 mb-1">{metric.metric}</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  <span className={`text-sm font-medium ${
                    metric.positive ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {metric.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Tendencias</h3>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600">Gráfico de tendencias de rendimiento</p>
                <p className="text-sm text-gray-500 mt-1">Los datos se actualizan en tiempo real</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {selectedInsight === 'recommendations' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recomendaciones Inteligentes</h3>
                <p className="text-gray-600 mt-1">Sugerencias personalizadas basadas en análisis de datos</p>
              </div>
              <button 
                onClick={generateNewRecommendations}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Bot className="w-4 h-4" />
                Generar Nuevas
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {aiRecommendations.map((rec) => (
              <div key={rec.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">{rec.student}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                        Prioridad {getPriorityText(rec.priority)}
                      </span>
                      {rec.implemented && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                          Implementada
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.issue}</p>
                    <p className="text-sm text-gray-900 font-medium mb-3">{rec.recommendation}</p>
                    {!rec.implemented && (
                      <button 
                        onClick={() => implementRecommendation(rec.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Implementar
                      </button>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Confianza</div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                          style={{ width: `${rec.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{rec.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Difficulty Detection */}
      {selectedInsight === 'difficulties' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detección Temprana de Dificultades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h4 className="font-medium text-red-900">Riesgo Alto</h4>
                </div>
                <p className="text-sm text-red-700">3 estudiantes muestran patrones de bajo rendimiento sostenido</p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h4 className="font-medium text-orange-900">Riesgo Medio</h4>
                </div>
                <p className="text-sm text-orange-700">7 estudiantes requieren atención en materias específicas</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Factores Identificados</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  Ausencias frecuentes en días de evaluación
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Tiempo insuficiente para completar exámenes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Bajo engagement en actividades prácticas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Dificultades en conceptos fundamentales
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Chat */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Asistente Virtual</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
          <div className="space-y-3">
            {chatMessages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}>
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-blue-600 font-medium">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="¿Cómo está el rendimiento en matemáticas?"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            onClick={sendMessage}
            disabled={!newMessage.trim() || isTyping}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}