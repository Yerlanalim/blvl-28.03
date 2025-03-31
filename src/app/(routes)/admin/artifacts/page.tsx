/**
 * @file page.tsx (admin/artifacts)
 * @description Страница управления артефактами
 * @dependencies lib/services/artifact-service, app/components/ArtifactForm
 */

'use client';

import { useState, useEffect } from 'react';
import { Artifact, ArtifactFileType, Level } from '@/types';
import { 
  getAllArtifacts, 
  createArtifact, 
  updateArtifact, 
  getAllLevels 
} from '@/lib/firebase/utils';
import Link from 'next/link';

/**
 * ArtifactFormData - Данные формы для создания/редактирования артефакта
 */
interface ArtifactFormData {
  id?: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: ArtifactFileType;
  levelId: string;
}

/**
 * Страница управления артефактами
 */
export default function ArtifactManagementPage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState<ArtifactFormData>({
    title: '',
    description: '',
    fileUrl: '',
    fileType: ArtifactFileType.PDF,
    levelId: ''
  });

  // Загрузить артефакты и уровни при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [artifactsData, levelsData] = await Promise.all([
          getAllArtifacts(),
          getAllLevels()
        ]);
        
        setArtifacts(artifactsData);
        setLevels(levelsData);
      } catch (error: any) {
        setMessage(`Ошибка загрузки данных: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Очистить форму
  const resetForm = () => {
    setCurrentArtifact({
      title: '',
      description: '',
      fileUrl: '',
      fileType: ArtifactFileType.PDF,
      levelId: levels.length > 0 ? levels[0].id : ''
    });
    setIsEditing(false);
  };

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentArtifact(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (isEditing && currentArtifact.id) {
        // Обновление существующего артефакта
        const { id, ...artifactData } = currentArtifact;
        await updateArtifact(id, artifactData);
        setMessage('Артефакт успешно обновлен!');
      } else {
        // Создание нового артефакта
        await createArtifact(currentArtifact);
        setMessage('Артефакт успешно создан!');
      }
      
      // Обновить список артефактов
      const updatedArtifacts = await getAllArtifacts();
      setArtifacts(updatedArtifacts);
      
      // Сбросить форму
      resetForm();
    } catch (error: any) {
      setMessage(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Редактировать существующий артефакт
  const handleEdit = (artifact: Artifact) => {
    setCurrentArtifact({
      id: artifact.id,
      title: artifact.title,
      description: artifact.description,
      fileUrl: artifact.fileUrl,
      fileType: artifact.fileType,
      levelId: artifact.levelId
    });
    setIsEditing(true);
  };

  // Получить название уровня по ID
  const getLevelName = (levelId: string) => {
    const level = levels.find(l => l.id === levelId);
    return level ? `${level.order}. ${level.title}` : 'Неизвестный уровень';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление артефактами</h1>
        <Link href="/admin" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
          ← Назад к админ-панели
        </Link>
      </div>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${
          message.includes('Ошибка') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Форма создания/редактирования артефакта */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Редактировать артефакт' : 'Создать новый артефакт'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="title">
                Название
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={currentArtifact.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="description">
                Описание
              </label>
              <textarea
                id="description"
                name="description"
                value={currentArtifact.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={3}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="fileUrl">
                URL файла
              </label>
              <input
                id="fileUrl"
                name="fileUrl"
                type="url"
                value={currentArtifact.fileUrl}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="fileType">
                Тип файла
              </label>
              <select
                id="fileType"
                name="fileType"
                value={currentArtifact.fileType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value={ArtifactFileType.PDF}>PDF</option>
                <option value={ArtifactFileType.DOC}>DOC</option>
                <option value={ArtifactFileType.SPREADSHEET}>SPREADSHEET</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="levelId">
                Уровень
              </label>
              <select
                id="levelId"
                name="levelId"
                value={currentArtifact.levelId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Выберите уровень</option>
                {levels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.order}. {level.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded ${
                  loading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {loading 
                  ? 'Сохранение...' 
                  : isEditing ? 'Обновить артефакт' : 'Создать артефакт'
                }
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Отмена
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Список существующих артефактов */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Существующие артефакты
          </h2>
          
          {loading && <p className="text-gray-500">Загрузка артефактов...</p>}
          
          {!loading && artifacts.length === 0 && (
            <p className="text-gray-500">Артефакты не найдены</p>
          )}
          
          {!loading && artifacts.length > 0 && (
            <div className="space-y-4">
              {artifacts.map(artifact => (
                <div key={artifact.id} className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium">{artifact.title}</h3>
                  <p className="text-gray-600 mb-2">{artifact.description}</p>
                  <div className="text-sm text-gray-500 mb-3">
                    <p>Тип файла: {artifact.fileType}</p>
                    <p>
                      URL: <a href={artifact.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{artifact.fileUrl}</a>
                    </p>
                    <p>Уровень: {getLevelName(artifact.levelId)}</p>
                    <p>Скачиваний: {artifact.downloadCount || 0}</p>
                  </div>
                  <button
                    onClick={() => handleEdit(artifact)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded"
                  >
                    Редактировать
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 