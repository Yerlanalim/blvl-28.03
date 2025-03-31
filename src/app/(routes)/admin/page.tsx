/**
 * @file page.tsx (admin)
 * @description Административная страница для управления данными Firebase
 * @dependencies app/components/AdminPanel
 */

'use client';

import { useState, useEffect } from 'react';
import { Level, Artifact } from '@/types';
import { 
  getAllLevels, 
  getAllArtifacts, 
  initializeBasicData
} from '@/lib/firebase/utils';
import Link from 'next/link';

/**
 * AdminPage
 * 
 * Административная страница для управления данными Firebase
 */
export default function AdminPage() {
  const [message, setMessage] = useState<string>('');
  const [levels, setLevels] = useState<Level[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'levels' | 'artifacts'>('levels');

  /**
   * Загрузить данные из Firebase
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      setMessage('Загрузка данных...');

      // Загружаем уровни
      const levelsData = await getAllLevels();
      setLevels(levelsData);
      
      // Загружаем артефакты
      const artifactsData = await getAllArtifacts();
      setArtifacts(artifactsData);
      
      if (levelsData.length === 0 && artifactsData.length === 0) {
        setMessage('Данные не найдены. Используйте кнопку "Инициализировать базовые данные".');
      } else {
        setMessage(`Загружено ${levelsData.length} уровней и ${artifactsData.length} артефактов.`);
      }
    } catch (error: any) {
      setMessage(`Ошибка при загрузке данных: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Инициализировать базовые данные
   */
  const handleInitData = async () => {
    try {
      setInitializing(true);
      setMessage('Инициализация базовых данных...');
      await initializeBasicData();
      setMessage('Базовые данные успешно инициализированы!');
      fetchData(); // Обновить данные
    } catch (error: any) {
      setMessage(`Ошибка при инициализации данных: ${error.message}`);
    } finally {
      setInitializing(false);
    }
  };

  // Загрузить данные при монтировании компонента
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Панель администратора BizLevel</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Управление данными</h2>
        
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={handleInitData}
            disabled={initializing}
            className={`px-4 py-2 rounded ${
              initializing 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {initializing ? 'Инициализация...' : 'Инициализировать базовые данные'}
          </button>
          
          <button 
            onClick={fetchData}
            disabled={loading}
            className={`px-4 py-2 rounded ${
              loading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {loading ? 'Загрузка...' : 'Обновить данные'}
          </button>
          
          <Link 
            href="/admin/artifacts" 
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Управление артефактами
          </Link>
          
          <Link 
            href="/admin/levels" 
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded"
          >
            Управление уровнями
          </Link>
        </div>
        
        {message && (
          <div className={`p-4 mb-4 rounded ${
            message.includes('Ошибка') 
            ? 'bg-red-100 text-red-700' 
            : message.includes('не найдены')
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="border-b border-gray-200 mb-6">
          <div className="flex">
            <button 
              onClick={() => setActiveTab('levels')}
              className={`py-3 px-6 ${
                activeTab === 'levels' 
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Уровни
            </button>
            <button 
              onClick={() => setActiveTab('artifacts')}
              className={`py-3 px-6 ${
                activeTab === 'artifacts' 
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Артефакты
            </button>
          </div>
        </div>
        
        {activeTab === 'levels' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Существующие уровни</h2>
            
            {levels.length === 0 ? (
              <p className="text-gray-500">Уровни не найдены</p>
            ) : (
              <div className="space-y-4">
                {levels.map((level) => (
                  <div key={level.id} className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium">
                      {level.order}. {level.title} <span className="text-xs text-gray-500">({level.id})</span>
                    </h3>
                    <p className="text-gray-600 mb-2">{level.description}</p>
                    <div className="text-sm text-gray-500">
                      <p>Видео: {level.videos?.length || 0}</p>
                      <p>Тесты: {level.tests?.length || 0}</p>
                      <p>Артефакты: {level.artifacts?.length || 0}</p>
                      <p>Навыки: {level.skillsFocus?.join(', ')}</p>
                      <p>Статус: {level.isLocked ? 'Заблокирован' : 'Доступен'}{level.isPremium ? ', Премиум' : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'artifacts' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Существующие артефакты</h2>
            
            {artifacts.length === 0 ? (
              <p className="text-gray-500">Артефакты не найдены</p>
            ) : (
              <div className="space-y-4">
                {artifacts.map((artifact) => (
                  <div key={artifact.id} className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium">
                      {artifact.title} <span className="text-xs text-gray-500">({artifact.id})</span>
                    </h3>
                    <p className="text-gray-600 mb-2">{artifact.description}</p>
                    <div className="text-sm text-gray-500">
                      <p>Тип файла: {artifact.fileType}</p>
                      <p>URL: <a href={artifact.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{artifact.fileUrl}</a></p>
                      <p>Уровень: {artifact.levelId}</p>
                      <p>Скачиваний: {artifact.downloadCount}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 