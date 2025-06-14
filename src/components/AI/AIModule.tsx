import { useState } from 'react';
import { Bot, TrendingUp, AlertTriangle, Lightbulb, MessageSquare, BarChart3, Send, RefreshCw, FileText, Download, Wand2, BookOpen, PenTool } from 'lucide-react';

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

interface GeneratedInstrument {
  id: string;
  title: string;
  subject: string;
  type: 'exam' | 'quiz' | 'worksheet' | 'rubric';
  content: string;
  createdAt: string;
}

export default function AIModule() {
  const [selectedInsight, setSelectedInsight] = useState('chatgpt');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: '¡Hola! Soy tu asistente de IA educativa powered by ChatGPT. Puedo ayudarte a:\n\n• Analizar el rendimiento de tus estudiantes\n• Generar instrumentos de evaluación personalizados\n• Crear contenido educativo\n• Detectar dificultades de aprendizaje\n• Sugerir estrategias pedagógicas\n\n¿En qué puedo ayudarte hoy?',
      timestamp: '10:00'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInstrumentGenerator, setShowInstrumentGenerator] = useState(false);
  const [instrumentForm, setInstrumentForm] = useState({
    subject: '',
    topic: '',
    type: 'exam' as 'exam' | 'quiz' | 'worksheet' | 'rubric',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    questions: 10,
    duration: 60
  });
  const [generatedInstruments, setGeneratedInstruments] = useState<GeneratedInstrument[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
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
      id: 'chatgpt',
      title: 'ChatGPT Educativo',
      description: 'Asistente IA para generar contenido y evaluaciones',
      icon: MessageSquare,
      color: 'blue'
    },
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
    const currentMessage = newMessage;
    setNewMessage('');
    setIsTyping(true);

    // Check if user is asking for evaluation instrument
    const isInstrumentRequest = currentMessage.toLowerCase().includes('evaluación') || 
                               currentMessage.toLowerCase().includes('examen') ||
                               currentMessage.toLowerCase().includes('quiz') ||
                               currentMessage.toLowerCase().includes('instrumento');

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = '';
      
      if (isInstrumentRequest) {
        aiResponse = `Perfecto! Puedo ayudarte a crear un instrumento de evaluación. He detectado que necesitas generar material educativo.

¿Podrías especificarme:
• ¿Qué materia o tema específico?
• ¿Qué tipo de evaluación? (examen, quiz, hoja de trabajo, rúbrica)
• ¿Nivel de dificultad?
• ¿Cuántas preguntas necesitas?

También puedes usar el **Generador de Instrumentos** haciendo clic en el botón "Generar Instrumento" para crear evaluaciones automáticamente que podrás exportar a Word.`;
      } else {
        aiResponse = generateContextualResponse(currentMessage);
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const generateContextualResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('rendimiento') || lowerMessage.includes('calificaciones')) {
      return 'Basándome en los datos actuales, el rendimiento general está en 8.3/10. He identificado que el 94% de estudiantes están aprobando. Te recomiendo enfocarte en los estudiantes con calificaciones entre 6-7 para prevenir reprobación.';
    }
    
    if (lowerMessage.includes('asistencia')) {
      return 'La asistencia promedio es del 92%. He notado una ligera disminución del 1% esta semana. Recomiendo implementar estrategias de motivación y seguimiento personalizado para estudiantes con ausencias frecuentes.';
    }
    
    if (lowerMessage.includes('matemáticas') || lowerMessage.includes('álgebra')) {
      return 'En matemáticas, he detectado que los estudiantes tienen más dificultades con álgebra lineal. Sugiero usar métodos visuales, ejercicios prácticos y refuerzo en conceptos fundamentales. ¿Te gustaría que genere ejercicios específicos?';
    }
    
    if (lowerMessage.includes('estrategia') || lowerMessage.includes('metodología')) {
      return 'Basándome en el análisis de datos, recomiendo implementar: 1) Aprendizaje adaptativo, 2) Gamificación para aumentar participación, 3) Evaluaciones formativas frecuentes, 4) Retroalimentación inmediata. ¿Quieres que profundice en alguna estrategia?';
    }
    
    const responses = [
      'Excelente pregunta. Basándome en los patrones de aprendizaje que he analizado, puedo sugerirte estrategias personalizadas para mejorar el rendimiento académico.',
      'He procesado los datos de rendimiento y puedo ayudarte a identificar áreas de oportunidad específicas para cada estudiante.',
      'Según mi análisis, hay tendencias interesantes en el comportamiento de aprendizaje de tus estudiantes. ¿Te gustaría que genere un reporte detallado?',
      'Puedo ayudarte a crear contenido educativo personalizado basado en las necesidades específicas de tu grupo. ¿Qué tema te interesa desarrollar?',
      'He identificado patrones en los datos que sugieren oportunidades de mejora en metodologías de enseñanza. ¿Quieres que elabore recomendaciones específicas?'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateInstrument = async () => {
    if (!instrumentForm.subject || !instrumentForm.topic) {
      alert('Por favor completa la materia y el tema');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const instrumentContent = generateInstrumentContent(instrumentForm);
      
      const newInstrument: GeneratedInstrument = {
        id: Date.now().toString(),
        title: `${instrumentForm.type === 'exam' ? 'Examen' : instrumentForm.type === 'quiz' ? 'Quiz' : instrumentForm.type === 'worksheet' ? 'Hoja de Trabajo' : 'Rúbrica'} de ${instrumentForm.subject}: ${instrumentForm.topic}`,
        subject: instrumentForm.subject,
        type: instrumentForm.type,
        content: instrumentContent,
        createdAt: new Date().toISOString()
      };

      setGeneratedInstruments(prev => [...prev, newInstrument]);
      setIsGenerating(false);
      setShowInstrumentGenerator(false);
      
      // Add success message to chat
      const successMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `¡Perfecto! He generado tu ${instrumentForm.type} sobre "${instrumentForm.topic}" en ${instrumentForm.subject}. Puedes verlo en la sección de instrumentos generados y exportarlo a Word cuando gustes.`,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, successMessage]);
    }, 3000);
  };

  const generateInstrumentContent = (form: typeof instrumentForm): string => {
    const { subject, topic, type, difficulty, questions, duration } = form;
    
    if (type === 'exam') {
      return `# EXAMEN DE ${subject.toUpperCase()}
## Tema: ${topic}
**Duración:** ${duration} minutos
**Instrucciones:** Lee cuidadosamente cada pregunta antes de responder.

### SECCIÓN I: OPCIÓN MÚLTIPLE (${Math.floor(questions * 0.6)} puntos)

1. ¿Cuál es el concepto fundamental de ${topic}?
   a) Opción A
   b) Opción B  
   c) Opción C
   d) Opción D

2. En el contexto de ${topic}, ¿qué significa...?
   a) Definición A
   b) Definición B
   c) Definición C
   d) Definición D

### SECCIÓN II: DESARROLLO (${Math.floor(questions * 0.4)} puntos)

1. Explica detalladamente el proceso de ${topic} y proporciona un ejemplo práctico.

2. Analiza la importancia de ${topic} en el contexto de ${subject}.

**Criterios de evaluación:**
- Claridad conceptual (40%)
- Aplicación práctica (30%)
- Análisis crítico (30%)`;
    }
    
    if (type === 'quiz') {
      return `# QUIZ RÁPIDO: ${topic}
**Materia:** ${subject}
**Tiempo estimado:** 15 minutos

${Array.from({length: questions}, (_, i) => `
${i + 1}. Pregunta sobre ${topic} - nivel ${difficulty}
   □ Verdadero
   □ Falso
`).join('')}

**Respuestas:**
${Array.from({length: questions}, (_, i) => `${i + 1}. ${Math.random() > 0.5 ? 'Verdadero' : 'Falso'}`).join('\n')}`;
    }
    
    if (type === 'worksheet') {
      return `# HOJA DE TRABAJO: ${topic}
**Materia:** ${subject}
**Objetivo:** Reforzar conceptos de ${topic}

## Actividades:

### Actividad 1: Conceptos básicos
Complete los siguientes enunciados sobre ${topic}:

1. _________________ es fundamental para entender ${topic}
2. Los elementos principales incluyen: _________________
3. La aplicación práctica se observa en: _________________

### Actividad 2: Ejercicios prácticos
Resuelve los siguientes problemas:

${Array.from({length: Math.min(questions, 5)}, (_, i) => `
${i + 1}. Problema relacionado con ${topic}
   Solución: _______________
`).join('')}

### Actividad 3: Reflexión
Escribe un párrafo explicando la importancia de ${topic} en ${subject}.`;
    }
    
    // Rubric
    return `# RÚBRICA DE EVALUACIÓN: ${topic}
**Materia:** ${subject}

| Criterio | Excelente (4) | Bueno (3) | Satisfactorio (2) | Necesita Mejora (1) |
|----------|---------------|-----------|-------------------|---------------------|
| Comprensión de ${topic} | Demuestra comprensión completa | Comprensión sólida | Comprensión básica | Comprensión limitada |
| Aplicación práctica | Aplica conceptos creativamente | Aplica conceptos correctamente | Aplicación básica | Dificultad en aplicación |
| Comunicación | Explica claramente | Explica bien | Explicación básica | Explicación confusa |
| Análisis crítico | Análisis profundo | Buen análisis | Análisis superficial | Sin análisis |

**Puntuación total:** ___/16 puntos
**Calificación:** ___________`;
  };

  const exportToWord = (instrument: GeneratedInstrument) => {
    // Create a simple HTML document that can be saved as .doc
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${instrument.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
          h2 { color: #1e40af; margin-top: 30px; }
          h3 { color: #1e3a8a; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f3f4f6; }
          .header { text-align: center; margin-bottom: 30px; }
          .footer { margin-top: 40px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${instrument.title}</h1>
          <p><strong>Generado por IA Educativa</strong></p>
          <p>Fecha: ${new Date(instrument.createdAt).toLocaleDateString('es-ES')}</p>
        </div>
        
        <div style="white-space: pre-line;">${instrument.content}</div>
        
        <div class="footer">
          <p>Documento generado automáticamente por el Sistema de IA Educativa</p>
          <p>Materia: ${instrument.subject} | Tipo: ${instrument.type}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${instrument.title.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const implementRecommendation = (recommendationId: string) => {
    setAiRecommendations(prev => prev.map(rec => 
      rec.id === recommendationId 
        ? { ...rec, implemented: true }
        : rec
    ));
  };

  const generateNewRecommendations = () => {
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
              <p className="text-purple-100 mt-1">Powered by ChatGPT - Análisis inteligente para mejorar el proceso de enseñanza-aprendizaje</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

      {/* ChatGPT Interface */}
      {selectedInsight === 'chatgpt' && (
        <div className="space-y-6">
          {/* Instrument Generator Modal */}
          {showInstrumentGenerator && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wand2 className="w-6 h-6 text-purple-600" />
                  Generador de Instrumentos de Evaluación
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Materia</label>
                    <input
                      type="text"
                      value={instrumentForm.subject}
                      onChange={(e) => setInstrumentForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ej: Matemáticas, Física, Historia..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tema Específico</label>
                    <input
                      type="text"
                      value={instrumentForm.topic}
                      onChange={(e) => setInstrumentForm(prev => ({ ...prev, topic: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ej: Álgebra Lineal, Cinemática, Revolución Francesa..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Instrumento</label>
                    <select
                      value={instrumentForm.type}
                      onChange={(e) => setInstrumentForm(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="exam">Examen Completo</option>
                      <option value="quiz">Quiz Rápido</option>
                      <option value="worksheet">Hoja de Trabajo</option>
                      <option value="rubric">Rúbrica de Evaluación</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Dificultad</label>
                    <select
                      value={instrumentForm.difficulty}
                      onChange={(e) => setInstrumentForm(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="easy">Fácil</option>
                      <option value="medium">Intermedio</option>
                      <option value="hard">Avanzado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número de Preguntas</label>
                    <input
                      type="number"
                      value={instrumentForm.questions}
                      onChange={(e) => setInstrumentForm(prev => ({ ...prev, questions: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                      max="50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duración (minutos)</label>
                    <input
                      type="number"
                      value={instrumentForm.duration}
                      onChange={(e) => setInstrumentForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="5"
                      max="180"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={generateInstrument}
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Generando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Generar Instrumento
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowInstrumentGenerator(false)}
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Generated Instruments */}
          {generatedInstruments.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Instrumentos Generados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedInstruments.map((instrument) => (
                  <div key={instrument.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{instrument.title}</h4>
                        <p className="text-sm text-gray-600">{instrument.subject}</p>
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mt-2">
                          {instrument.type}
                        </span>
                      </div>
                      <button
                        onClick={() => exportToWord(instrument)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Exportar a Word
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Creado: {new Date(instrument.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ChatGPT Interface */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">ChatGPT Educativo</h3>
              </div>
              <button
                onClick={() => setShowInstrumentGenerator(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <PenTool className="w-4 h-4" />
                Generar Instrumento
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4 h-96 overflow-y-auto">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}>
                      {message.type === 'ai' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-blue-600 font-medium">ChatGPT Educativo</span>
                        </div>
                      )}
                      <div className="text-sm whitespace-pre-line">{message.content}</div>
                      <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-900 border border-gray-200 px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-600 font-medium">ChatGPT Educativo</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Pregunta sobre evaluaciones, análisis de rendimiento, estrategias pedagógicas..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                onClick={sendMessage}
                disabled={!newMessage.trim() || isTyping}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>💡 Sugerencias:</strong> Pregunta sobre "crear evaluación de matemáticas", "analizar rendimiento del grupo", "estrategias para estudiantes con dificultades", o "generar rúbrica de evaluación"
              </p>
            </div>
          </div>
        </div>
      )}

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

      {/* Reports */}
      {selectedInsight === 'reports' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informes Automáticos</h3>
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Generación de Reportes</h4>
            <p className="text-gray-600">Los reportes automáticos estarán disponibles próximamente</p>
          </div>
        </div>
      )}
    </div>
  );
}