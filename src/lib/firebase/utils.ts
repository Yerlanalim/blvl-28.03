/**
 * @file utils.ts
 * @description Утилиты для работы с Firebase Firestore
 * @dependencies firebase/firestore, @/types
 */

import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp,
  DocumentData
} from "firebase/firestore";
import { db } from './config';
import { Level, Artifact, UserProgress, SkillType, ArtifactFileType } from '@/types';

/**
 * Добавить документ в коллекцию с автоматическим ID
 * 
 * @param collectionName - Название коллекции
 * @param data - Данные для добавления
 * @returns ID созданного документа
 * @throws Error при неудачном добавлении
 */
export async function addDocument<T>(collectionName: string, data: T): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log(`Документ добавлен в ${collectionName} с ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`Ошибка при добавлении документа в ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Записать документ в коллекцию с указанным ID
 * 
 * @param collectionName - Название коллекции
 * @param docId - ID документа
 * @param data - Данные для записи
 * @returns ID документа
 * @throws Error при неудачной записи
 */
export async function setDocument<T>(collectionName: string, docId: string, data: T): Promise<string> {
  try {
    await setDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: Timestamp.now()
    });
    console.log(`Документ установлен в ${collectionName} с ID: ${docId}`);
    return docId;
  } catch (error) {
    console.error(`Ошибка при установке документа в ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Обновить документ по ID
 * 
 * @param collectionName - Название коллекции
 * @param docId - ID документа
 * @param data - Данные для обновления
 * @returns ID обновленного документа
 * @throws Error при неудачном обновлении
 */
export async function updateDocument<T>(
  collectionName: string, 
  docId: string, 
  data: Partial<T>
): Promise<string> {
  try {
    const updateData = {
      ...data,
      updatedAt: Timestamp.now()
    } as DocumentData;
    
    await updateDoc(doc(db, collectionName, docId), updateData);
    console.log(`Документ обновлен в ${collectionName} с ID: ${docId}`);
    return docId;
  } catch (error) {
    console.error(`Ошибка при обновлении документа в ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Удалить документ по ID
 * 
 * @param collectionName - Название коллекции
 * @param docId - ID документа
 * @returns true при успешном удалении
 * @throws Error при неудачном удалении
 */
export async function deleteDocument(collectionName: string, docId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    console.log(`Документ удален из ${collectionName} с ID: ${docId}`);
    return true;
  } catch (error) {
    console.error(`Ошибка при удалении документа из ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Получить документ по ID
 * 
 * @param collectionName - Название коллекции
 * @param docId - ID документа
 * @returns Документ или null, если не найден
 * @throws Error при неудачном получении
 */
export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return { id: docId, ...docSnap.data() } as unknown as T;
    } else {
      console.log(`Документ не найден в ${collectionName} с ID: ${docId}`);
      return null;
    }
  } catch (error) {
    console.error(`Ошибка при получении документа из ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Получить все документы из коллекции
 * 
 * @param collectionName - Название коллекции
 * @returns Массив документов
 * @throws Error при неудачном получении
 */
export async function getAllDocuments<T>(collectionName: string): Promise<T[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents: T[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() } as unknown as T);
    });
    console.log(`Получено ${documents.length} документов из ${collectionName}`);
    return documents;
  } catch (error) {
    console.error(`Ошибка при получении всех документов из ${collectionName}:`, error);
    throw error;
  }
}

// Функции для работы с уровнями

/**
 * Создание уровня
 * 
 * @param levelData - Данные уровня
 * @returns ID созданного уровня
 */
export async function createLevel(levelData: Omit<Level, 'id'>): Promise<string> {
  try {
    const levelId = `level-${Date.now()}`;
    return await setDocument<Omit<Level, 'id'>>('levels', levelId, levelData);
  } catch (error) {
    console.error('Ошибка при создании уровня:', error);
    throw error;
  }
}

/**
 * Обновление уровня по ID
 * 
 * @param levelId - ID уровня
 * @param data - Данные для обновления
 * @returns ID обновленного уровня
 */
export async function updateLevel(levelId: string, data: Partial<Level>): Promise<string> {
  return updateDocument<Level>('levels', levelId, data);
}

/**
 * Получение всех уровней в порядке возрастания
 * 
 * @returns Массив уровней, отсортированных по полю order
 */
export async function getAllLevels(): Promise<Level[]> {
  try {
    const levelsQuery = query(
      collection(db, 'levels'),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(levelsQuery);
    const levels: Level[] = [];
    
    querySnapshot.forEach((doc) => {
      levels.push({ id: doc.id, ...doc.data() } as Level);
    });
    
    return levels;
  } catch (error) {
    console.error('Ошибка при получении всех уровней:', error);
    throw error;
  }
}

// Функции для работы с артефактами

/**
 * Создание артефакта
 * 
 * @param artifactData - Данные артефакта
 * @returns ID созданного артефакта
 */
export async function createArtifact(artifactData: Omit<Artifact, 'id'>): Promise<string> {
  try {
    const artifactId = `artifact-${Date.now()}`;
    return await setDocument<Omit<Artifact, 'id'>>('artifacts', artifactId, artifactData);
  } catch (error) {
    console.error('Ошибка при создании артефакта:', error);
    throw error;
  }
}

/**
 * Обновление артефакта по ID
 * 
 * @param artifactId - ID артефакта
 * @param data - Данные для обновления
 * @returns ID обновленного артефакта
 */
export async function updateArtifact(artifactId: string, data: Partial<Artifact>): Promise<string> {
  return updateDocument<Artifact>('artifacts', artifactId, data);
}

/**
 * Получение всех артефактов
 * 
 * @returns Массив артефактов
 */
export async function getAllArtifacts(): Promise<Artifact[]> {
  try {
    const artifactsQuery = query(
      collection(db, 'artifacts'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(artifactsQuery);
    const artifacts: Artifact[] = [];
    
    querySnapshot.forEach((doc) => {
      artifacts.push({ id: doc.id, ...doc.data() } as Artifact);
    });
    
    return artifacts;
  } catch (error) {
    console.error('Ошибка при получении всех артефактов:', error);
    throw error;
  }
}

/**
 * Получение артефактов для конкретного уровня
 * 
 * @param levelId - ID уровня
 * @returns Массив артефактов
 */
export async function getArtifactsByLevel(levelId: string): Promise<Artifact[]> {
  try {
    const artifactsQuery = query(
      collection(db, 'artifacts'),
      where('levelId', '==', levelId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(artifactsQuery);
    const artifacts: Artifact[] = [];
    
    querySnapshot.forEach((doc) => {
      artifacts.push({ id: doc.id, ...doc.data() } as Artifact);
    });
    
    return artifacts;
  } catch (error) {
    console.error(`Ошибка при получении артефактов для уровня ${levelId}:`, error);
    throw error;
  }
}

/**
 * Инициализация базовых данных для тестирования
 */
export async function initializeBasicData(): Promise<void> {
  try {
    // Создаем уровни
    const levelIds = await initializeBasicLevels();
    
    // Создаем артефакты с привязкой к созданным уровням
    await initializeArtifacts(levelIds);
    
    console.log("Базовые данные успешно инициализированы");
  } catch (error) {
    console.error("Ошибка при инициализации базовых данных:", error);
    throw error;
  }
}

/**
 * Инициализация базовых уровней
 * @returns Объект с ID созданных уровней
 */
export async function initializeBasicLevels(): Promise<{[key: number]: string}> {
  try {
    const levelIds: {[key: number]: string} = {};
    
    // Создаем уровень 1
    const level1Id = await createLevel({
      order: 1,
      title: "Основы бизнеса",
      description: "Введение в базовые принципы предпринимательства",
      isLocked: false,
      isPremium: false,
      skillsFocus: [SkillType.PERSONAL_SKILLS, SkillType.MANAGEMENT],
      videos: [
        {
          id: "video-1-1",
          title: "Введение в бизнес",
          description: "Базовые понятия и определения",
          youtubeId: "dQw4w9WgXcQ",
          duration: 180,
          order: 1
        }
      ],
      tests: [
        {
          id: "test-1-1",
          afterVideoId: "video-1-1",
          questions: [
            {
              id: "q-1-1-1",
              text: "Что такое бизнес?",
              options: [
                "Способ заработать деньги",
                "Деятельность, направленная на получение прибыли",
                "Работа на себя",
                "Все вышеперечисленное"
              ],
              correctAnswer: 3
            }
          ]
        }
      ],
      artifacts: []
    });
    
    levelIds[1] = level1Id;

    // Создаем уровень 2
    const level2Id = await createLevel({
      order: 2,
      title: "Маркетинг и продвижение",
      description: "Стратегии продвижения бизнеса и привлечения клиентов",
      isLocked: true,
      isPremium: false,
      skillsFocus: [SkillType.CLIENT_WORK, SkillType.MANAGEMENT],
      videos: [
        {
          id: "video-2-1",
          title: "Основы маркетинга",
          description: "Введение в маркетинг и стратегии",
          youtubeId: "dQw4w9WgXcQ",
          duration: 240,
          order: 1
        }
      ],
      tests: [],
      artifacts: []
    });
    
    levelIds[2] = level2Id;

    // Создаем уровень 3
    const level3Id = await createLevel({
      order: 3,
      title: "Финансы и учет",
      description: "Основы финансового учета и планирования",
      isLocked: true,
      isPremium: false,
      skillsFocus: [SkillType.FINANCE, SkillType.LEGAL],
      videos: [
        {
          id: "video-3-1",
          title: "Финансовые основы",
          description: "Базовые финансовые концепции для предпринимателей",
          youtubeId: "dQw4w9WgXcQ",
          duration: 300,
          order: 1
        }
      ],
      tests: [],
      artifacts: []
    });
    
    levelIds[3] = level3Id;

    console.log("Базовые уровни успешно инициализированы");
    return levelIds;
  } catch (error) {
    console.error("Ошибка при инициализации базовых уровней:", error);
    throw error;
  }
}

/**
 * Инициализация базовых артефактов
 * 
 * @param levelIds - Объект с ID созданных уровней
 * @returns void
 */
export async function initializeArtifacts(levelIds: {[key: number]: string}): Promise<void> {
  try {
    // Артефакт 1
    await createArtifact({
      title: "Шаблон бизнес-плана",
      description: "Базовый шаблон для составления бизнес-плана",
      fileUrl: "https://example.com/business_plan_template.pdf",
      fileType: "pdf" as ArtifactFileType,
      levelId: levelIds[1],
      downloadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Артефакт 2
    await createArtifact({
      title: "Таблица маркетингового анализа",
      description: "Электронная таблица для проведения маркетингового анализа",
      fileUrl: "https://example.com/marketing_analysis.xlsx",
      fileType: "spreadsheet" as ArtifactFileType,
      levelId: levelIds[2],
      downloadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Артефакт 3
    await createArtifact({
      title: "Шаблон финансовой отчетности",
      description: "Таблица для ведения финансовой отчетности",
      fileUrl: "https://example.com/financial_template.xlsx",
      fileType: "spreadsheet" as ArtifactFileType,
      levelId: levelIds[3],
      downloadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log("Базовые артефакты успешно инициализированы");
  } catch (error) {
    console.error("Ошибка при инициализации базовых артефактов:", error);
    throw error;
  }
} 