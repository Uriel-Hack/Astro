import { useState } from 'react';
import { X, Copy, Share2, Mail, MessageCircle, QrCode, Check, ExternalLink } from 'lucide-react';

interface ShareExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: {
    id: string;
    title: string;
    subject: string;
    duration: number;
    questions: number;
  } | null;
}

export default function ShareExamModal({ isOpen, onClose, exam }: ShareExamModalProps) {
  const [shareMethod, setShareMethod] = useState<'link' | 'email' | 'qr'>('link');
  const [copied, setCopied] = useState(false);
  const [emailList, setEmailList] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  if (!isOpen || !exam) return null;

  // Generate a realistic exam URL
  const examUrl = `https://eduplatform.com/exam/${exam.id}`;
  const shortUrl = `https://edu.ly/${exam.id.slice(-6)}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Evaluación: ${exam.title}`);
    const body = encodeURIComponent(
      `Hola,\n\nTe invito a realizar la evaluación "${exam.title}" de ${exam.subject}.\n\n` +
      `Detalles:\n` +
      `• Duración: ${exam.duration} minutos\n` +
      `• Preguntas: ${exam.questions}\n\n` +
      `Enlace: ${examUrl}\n\n` +
      `${customMessage}\n\n` +
      `Saludos`
    );
    window.open(`mailto:${emailList}?subject=${subject}&body=${body}`);
  };

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(
      `📝 *Evaluación: ${exam.title}*\n\n` +
      `Materia: ${exam.subject}\n` +
      `Duración: ${exam.duration} minutos\n` +
      `Preguntas: ${exam.questions}\n\n` +
      `Enlace: ${examUrl}\n\n` +
      `${customMessage}`
    );
    window.open(`https://wa.me/?text=${message}`);
  };

  const generateGoogleForm = () => {
    // Simulate Google Forms integration
    const formUrl = `https://forms.google.com/create?title=${encodeURIComponent(exam.title)}`;
    window.open(formUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Share2 className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Compartir Evaluación</h2>
                <p className="text-gray-600">{exam.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Share Methods */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Método de compartir</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setShareMethod('link')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  shareMethod === 'link'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ExternalLink className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <span className="text-sm font-medium">Enlace directo</span>
              </button>
              
              <button
                onClick={() => setShareMethod('email')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  shareMethod === 'email'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Mail className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <span className="text-sm font-medium">Email</span>
              </button>
              
              <button
                onClick={() => setShareMethod('qr')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  shareMethod === 'qr'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <QrCode className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <span className="text-sm font-medium">Código QR</span>
              </button>
            </div>
          </div>

          {/* Share Content */}
          {shareMethod === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enlace de la evaluación
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shortUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(shortUrl)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Información de la evaluación</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Título:</strong> {exam.title}</p>
                  <p><strong>Materia:</strong> {exam.subject}</p>
                  <p><strong>Duración:</strong> {exam.duration} minutos</p>
                  <p><strong>Preguntas:</strong> {exam.questions}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={shareViaWhatsApp}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
                <button
                  onClick={generateGoogleForm}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Google Forms
                </button>
              </div>
            </div>
          )}

          {shareMethod === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correos electrónicos (separados por comas)
                </label>
                <textarea
                  value={emailList}
                  onChange={(e) => setEmailList(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="estudiante1@email.com, estudiante2@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje personalizado (opcional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Mensaje adicional para los estudiantes..."
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Vista previa del email</h4>
                <div className="text-sm text-blue-800">
                  <p><strong>Asunto:</strong> Evaluación: {exam.title}</p>
                  <p className="mt-2"><strong>Contenido:</strong></p>
                  <div className="mt-1 text-xs bg-white p-2 rounded border">
                    Hola,<br/><br/>
                    Te invito a realizar la evaluación "{exam.title}" de {exam.subject}.<br/><br/>
                    Detalles:<br/>
                    • Duración: {exam.duration} minutos<br/>
                    • Preguntas: {exam.questions}<br/><br/>
                    Enlace: {shortUrl}<br/><br/>
                    {customMessage && `${customMessage}\n\n`}
                    Saludos
                  </div>
                </div>
              </div>

              <button
                onClick={shareViaEmail}
                disabled={!emailList.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar por Email
              </button>
            </div>
          )}

          {shareMethod === 'qr' && (
            <div className="text-center space-y-4">
              <div className="w-64 h-64 bg-white border-2 border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600">Código QR para</p>
                  <p className="text-sm font-medium text-gray-900">{exam.title}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Los estudiantes pueden escanear este código para acceder directamente a la evaluación
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => copyToClipboard(shortUrl)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Copiar enlace
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Descargar QR
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Google Forms Integration */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Integración con Google Forms</h4>
                <p className="text-sm text-gray-600">Convierte esta evaluación en un formulario de Google</p>
              </div>
            </div>
            <button
              onClick={generateGoogleForm}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Google Form
            </button>
          </div>

          {/* Access Settings */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Configuración de acceso</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-gray-700">Requerir autenticación</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-700">Permitir acceso anónimo</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-gray-700">Registrar intentos</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}