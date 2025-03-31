/**
 * @file page.tsx (admin/levels)
 * @description Страница управления уровнями
 * @dependencies lib/firebase/utils
 */

'use client';

import { useState, useEffect } from 'react';
import { Level, VideoContent } from '@/types';
import { getAllLevels, createLevel, updateLevel } from '@/lib/firebase/utils';
import Link from 'next/link';

/**
 * LevelFormData - Данные формы для создания/редактирования уровня
 */
interface LevelFormData {
  id?: string;
  title: string;
  description: string;
  order: number;
  isLocked: boolean;
  isPremium: boolean;
  skillsFocus: string[];
  videos: VideoContent[];
}

/**
 * Страница управления уровнями
 */
export default function LevelManagementPage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<LevelFormData>({
    title: '',
    description: '',
    order: 1,
    isLocked: false,
    isPremium: false,
    skillsFocus: [],
    videos: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  // Загрузить уровни при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const levelsData = await getAllLevels();
        setLevels(levelsData);
      } catch (error: any) {
        setMessage(`Ошибка загрузки уровней: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Очистить форму
  const resetForm = () => {
    setCurrentLevel({
      title: '',
      description: '',
      order: levels.length > 0 ? Math.max(...levels.map(l => l.order)) + 1 : 1,
      isLocked: false,
      isPremium: false,
      skillsFocus: [],
      videos: []
    });
    setSkillInput('');
    setVideoUrl('');
    setVideoTitle('');
    setIsEditing(false);
  };

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Для чекбоксов обрабатываем как булевы значения
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setCurrentLevel(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setCurrentLevel(prev => ({
        ...prev,
        [name]: name === 'order' ? parseInt(value) : value
      }));
    }
  };

  // Добавить навык
  const addSkill = () => {
    if (skillInput.trim() && !currentLevel.skillsFocus.includes(skillInput.trim())) {
      setCurrentLevel(prev => ({
        ...prev,
        skillsFocus: [...prev.skillsFocus, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  // Удалить навык
  const removeSkill = (skill: string) => {
    setCurrentLevel(prev => ({
      ...prev,
      skillsFocus: prev.skillsFocus.filter(s => s !== skill)
    }));
  };

  // Добавить видео
  const addVideo = () => {
    if (videoUrl.trim() && videoTitle.trim()) {
      const newVideo: VideoContent = {
        url: videoUrl.trim(),
        title: videoTitle.trim()
      };
      
      setCurrentLevel(prev => ({
        ...prev,
        videos: [...prev.videos, newVideo]
      }));
      
      setVideoUrl('');
      setVideoTitle('');
    }
  };

  // Удалить видео
  const removeVideo = (index: number) => {
    setCurrentLevel(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (isEditing && currentLevel.id) {
        // Обновление существующего уровня
        const { id, ...levelData } = currentLevel;
        await updateLevel(id, levelData);
        setMessage('Уровень успешно обновлен!');
      } else {
        // Создание нового уровня
        await createLevel(currentLevel);
        setMessage('Уровень успешно создан!');
      }
      
      // Обновить список уровней
      const updatedLevels = await getAllLevels();
      setLevels(updatedLevels);
      
      // Сбросить форму
      resetForm();
    } catch (error: any) {
      setMessage(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Редактировать существующий уровень
  const handleEdit = (level: Level) => {
    setCurrentLevel({
      id: level.id,
      title: level.title,
      description: level.description,
      order: level.order,
      isLocked: level.isLocked,
      isPremium: level.isPremium || false,
      skillsFocus: level.skillsFocus || [],
      videos: level.videos || []
    });
    setIsEditing(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление уровнями</h1>
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
        {/* Форма создания/редактирования уровня */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Редактировать уровень' : 'Создать новый уровень'}
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
                value={currentLevel.title}
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
                value={currentLevel.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={3}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="order">
                Порядковый номер
              </label>
              <input
                id="order"
                name="order"
                type="number"
                min="1"
                value={currentLevel.order}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4 flex items-center">
              <input
                id="isLocked"
                name="isLocked"
                type="checkbox"
                checked={currentLevel.isLocked}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-gray-700" htmlFor="isLocked">
                Заблокирован
              </label>
            </div>
            
            <div className="mb-4 flex items-center">
              <input
                id="isPremium"
                name="isPremium"
                type="checkbox"
                checked={currentLevel.isPremium}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-gray-700" htmlFor="isPremium">
                Премиум
              </label>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Навыки
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-1 p-2 border rounded-l"
                  placeholder="Введите навык"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
                >
                  Добавить
                </button>
              </div>
              
              {currentLevel.skillsFocus.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {currentLevel.skillsFocus.map((skill, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Видео
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Название видео"
                />
                <div className="flex">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="flex-1 p-2 border rounded-l"
                    placeholder="URL видео"
                  />
                  <button
                    type="button"
                    onClick={addVideo}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
                  >
                    Добавить
                  </button>
                </div>
              </div>
              
              {currentLevel.videos.length > 0 && (
                <div className="mt-2 space-y-2">
                  {currentLevel.videos.map((video, index) => (
                    <div key={index} className="bg-gray-100 p-3 rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">{video.title}</div>
                        <div className="text-xs text-gray-500 truncate">{video.url}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                  : isEditing ? 'Обновить уровень' : 'Создать уровень'
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
        
        {/* Список существующих уровней */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Существующие уровни
          </h2>
          
          {loading && <p className="text-gray-500">Загрузка уровней...</p>}
          
          {!loading && levels.length === 0 && (
            <p className="text-gray-500">Уровни не найдены</p>
          )}
          
          {!loading && levels.length > 0 && (
            <div className="space-y-4">
              {levels.sort((a, b) => a.order - b.order).map(level => (
                <div key={level.id} className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium">
                    {level.order}. {level.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{level.description}</p>
                  <div className="text-sm text-gray-500 mb-3">
                    <p>Видео: {level.videos?.length || 0}</p>
                    <p>Статус: {level.isLocked ? 'Заблокирован' : 'Доступен'}{level.isPremium ? ', Премиум' : ''}</p>
                    {level.skillsFocus && level.skillsFocus.length > 0 && (
                      <div className="mt-1">
                        <p>Навыки:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {level.skillsFocus.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-xs text-blue-800 px-2 py-0.5 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleEdit(level)}
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