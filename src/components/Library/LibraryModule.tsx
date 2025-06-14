import React, { useState } from 'react';
import { Upload, Search, Filter, Download, Eye, Trash2, FolderOpen, FileText, Video, Image, File } from 'lucide-react';

interface Material {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'image' | 'document';
  subject: string;
  size: string;
  uploadDate: string;
  downloads: number;
  views: number;
  url?: string;
}

export default function LibraryModule() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: '1',
      title: 'Introducción al Cálculo Diferencial',
      description: 'Material completo sobre límites y derivadas',
      type: 'pdf',
      subject: 'Matemáticas',
      size: '2.3 MB',
      uploadDate: '2024-01-15',
      downloads: 45,
      views: 128
    },
    {
      id: '2',
      title: 'Experimentos de Física Mecánica',
      description: 'Guía práctica para laboratorio de física',
      type: 'video',
      subject: 'Física',
      size: '156 MB',
      uploadDate: '2024-01-12',
      downloads: 32,
      views: 89
    },
    {
      id: '3',
      title: 'Tabla Periódica Interactiva',
      description: 'Elementos químicos con propiedades detalladas',
      type: 'document',
      subject: 'Química',
      size: '8.7 MB',
      uploadDate: '2024-01-10',
      downloads: 67,
      views: 156
    },
    {
      id: '4',
      title: 'Historia de las Civilizaciones Antiguas',
      description: 'Presentación multimedia sobre civilizaciones',
      type: 'image',
      subject: 'Historia',
      size: '45 MB',
      uploadDate: '2024-01-08',
      downloads: 23,
      views: 78
    },
  ]);

  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    subject: '',
    type: 'pdf' as 'pdf' | 'video' | 'image' | 'document'
  });

  const handleFileUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const fileType = getFileType(file.name);

      // Validar tamaño máximo (100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        alert('El archivo excede el tamaño máximo de 100MB.');
        return;
      }

      const material: Material = {
        id: Date.now().toString(),
        title: newMaterial.title || file.name.split('.')[0],
        description: newMaterial.description,
        type: fileType,
        subject: newMaterial.subject,
        size: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        downloads: 0,
        views: 0,
        url: URL.createObjectURL(file)
      };

      setMaterials(prev => [...prev, material]);
      setNewMaterial({ title: '', description: '', subject: '', type: 'pdf' });
      setShowUploadModal(false);
    }
  };

  const getFileType = (filename: string): 'pdf' | 'video' | 'image' | 'document' => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(extension || '')) return 'pdf';
    if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) return 'video';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension || '')) return 'image';
    return 'document';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Limpieza de URL al eliminar material
  const deleteMaterial = (materialId: string) => {
    setMaterials(prev => {
      const material = prev.find(m => m.id === materialId);
      if (material && material.url) {
        URL.revokeObjectURL(material.url);
      }
      return prev.filter(material => material.id !== materialId);
    });
  };

  const downloadMaterial = (material: Material) => {
    setMaterials(prev => prev.map(m => 
      m.id === material.id 
        ? { ...m, downloads: m.downloads + 1 }
        : m
    ));
    
    // Simulate download
    const link = document.createElement('a');
    link.href = material.url || '#';
    link.download = material.title;
    link.click();
  };

  const viewMaterial = (material: Material) => {
    setMaterials(prev => prev.map(m => 
      m.id === material.id 
        ? { ...m, views: m.views + 1 }
        : m
    ));
    
    // Simulate view
    if (material.url) {
      window.open(material.url, '_blank');
    }
  };

  // Normalización de materias para el filtro
  const filteredMaterials = materials.filter(material => {
    const matchesCategory =
      selectedCategory === 'all' ||
      material.subject.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: materials.length,
    totalDownloads: materials.reduce((sum, m) => sum + m.downloads, 0),
    totalViews: materials.reduce((sum, m) => sum + m.views, 0),
    totalSize: materials.reduce((sum, m) => {
      const sizeNum = parseFloat(m.size.split(' ')[0]);
      const unit = m.size.split(' ')[1];
      const bytes = unit === 'GB' ? sizeNum * 1024 * 1024 * 1024 :
                   unit === 'MB' ? sizeNum * 1024 * 1024 :
                   unit === 'KB' ? sizeNum * 1024 : sizeNum;
      return sum + bytes;
    }, 0)
  };

  // Tipado explícito para los iconos
  const getTypeIcon = (type: 'pdf' | 'video' | 'image' | 'document') => {
    switch (type) {
      case 'pdf': return <FileText className="w-6 h-6 text-red-600" />;
      case 'video': return <Video className="w-6 h-6 text-purple-600" />;
      case 'image': return <Image className="w-6 h-6 text-green-600" />;
      case 'document': return <File className="w-6 h-6 text-blue-600" />;
      default: return <File className="w-6 h-6 text-gray-600" />;
    }
  };

  const getTypeColor = (type: 'pdf' | 'video' | 'image' | 'document') => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'image': return 'bg-green-100 text-green-800';
      case 'document': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Biblioteca Digital</h2>
            <p className="text-gray-600 mt-1">Gestiona y organiza todos los materiales educativos</p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Subir Material
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subir Material</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Título del material"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descripción del material"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Materia</label>
                <select
                  value={newMaterial.subject}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, subject: e.target.value }))}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Archivo</label>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.jpg,.jpeg,.png,.gif"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar materiales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las materias</option>
            <option value="Matemáticas">Matemáticas</option>
            <option value="Física">Física</option>
            <option value="Química">Química</option>
            <option value="Historia">Historia</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Materiales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Descargas Totales</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.totalDownloads}</p>
            </div>
            <Download className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vistas Totales</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalViews}</p>
            </div>
            <Eye className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Espacio Usado</p>
              <p className="text-2xl font-bold text-orange-600">{formatFileSize(stats.totalSize)}</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <div key={material.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getTypeIcon(material.type)}
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                    {material.type.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => viewMaterial(material)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => downloadMaterial(material)}
                  className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteMaterial(material.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">{material.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{material.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{material.subject}</span>
              <span>{material.size}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Subido: {material.uploadDate}</span>
              <div className="flex gap-3">
                <span>👁 {material.views}</span>
                <span>⬇ {material.downloads}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Area */}
      <div 
        className={`bg-white rounded-xl p-8 shadow-sm border-2 border-dashed transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Subir nuevos materiales</h3>
          <p className="text-gray-600 mb-4">Arrastra archivos aquí o haz clic para seleccionar</p>
          <input
            type="file"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id="file-upload"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.jpg,.jpeg,.png,.gif"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Seleccionar Archivos
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Formatos soportados: PDF, DOC, PPT, MP4, PNG, JPG (Máximo 100MB)
          </p>
        </div>
      </div>
    </div>
  );
}