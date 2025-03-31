# BizLevel: План Реализации Проекта с Нуля

Дата создания: 1 апреля 2024 г.

## 1. Введение и Цель

Этот документ представляет собой детальный план для создания веб-приложения BizLevel с нуля. Цель — построить надежную, масштабируемую и удобную в обслуживании платформу для отслеживания и управления прогрессом в развитии бизнеса, используя современные веб-технологии и лучшие практики разработки. План учитывает уроки, извлеченные из анализа предыдущей итерации проекта, чтобы избежать повторения ошибок.

**Основная концепция:** Предоставить пользователям визуальную карту развития бизнеса (Level Map), структурированную по уровням с задачами (видео, тесты), артефактами (документы) и возможностью получения помощи от AI-ассистента.

## 2. Технологический Стек

*   **Фреймворк**: Next.js 14+ (с App Router)
*   **Язык**: TypeScript
*   **Стилизация**: Tailwind CSS
*   **UI Компоненты**: shadcn/ui
*   **Аутентификация**: Firebase Authentication (Email/Password, опционально Google)
*   **База данных**: Firebase Firestore
*   **Хранилище файлов**: Firebase Storage (для артефактов, возможно, аватаров)
*   **Управление состоянием данных (Data Fetching)**: React Query (`@tanstack/react-query`)
*   **Управление формами**: React Hook Form + Zod (для валидации)
*   **Тестирование**: Jest / Vitest + React Testing Library
*   **Обратная связь (UI)**: Библиотека для Toast-уведомлений (`sonner` из shadcn/ui или `react-toastify`)

## 3. Целевая Архитектура и Структура Проекта

Структура будет основана на `/src` директории для четкого разделения исходного кода от конфигурационных файлов.

```
/src
  /app                  # Маршруты Next.js (App Router)
    /(auth)             # Группа маршрутов аутентификации (без MainLayout)
      /login
      /register
      /reset-password
      layout.tsx        # Макет для страниц аутентификации
      page.tsx          # Страницы login/register...
    /(routes)           # Основная группа маршрутов приложения (с MainLayout)
      /map
      /profile
      /artifacts
      /chat
      /settings
      /faq
      /level
        /[levelId]
      layout.tsx        # Основной макет приложения (с Sidebar, Header)
      page.tsx          # Страницы map/profile...
    /api                # API Routes (например, для взаимодействия с OpenAI)
    page.tsx            # Корневая страница (редирект на /map)
    layout.tsx          # Корневой макет (подключение Providers)
    providers.tsx       # Все провайдеры (QueryClient, Auth, Theme, Toast)
    globals.css         # Глобальные стили
  /components           # Переиспользуемые компоненты
    /auth               # Компоненты для страниц аутентификации (AuthCard, LoginForm...)
    /features           # Компоненты, специфичные для фич (LevelMap, ProfileCard, ChatWindow...)
    /layout             # Компоненты макета (Sidebar, Header, MainLayout, UserNav...)
    /ui                 # Базовые UI компоненты (обертки shadcn/ui или кастомные: Button, Card...)
  /context              # React Контексты (AuthProvider, ThemeProvider)
  /hooks                # Кастомные React хуки (useAuth, useProgress, useLevels...)
  /lib                  # Библиотеки, утилиты, сервисы
    /firebase           # Конфигурация и утилиты Firebase (index, config, auth, firestore, storage)
    /services           # Сервисный слой для Firestore (progress, levels, skills, artifacts, chat...)
    /utils              # Общие утилиты (форматирование дат, и т.д.)
    /constants.ts       # Константы приложения (имена коллекций Firestore, роли и т.д.)
    /zod-schemas.ts     # Схемы Zod для валидации форм
  /types                # TypeScript типы и интерфейсы (Firebase моделей, API ответов и т.д.)
/public                 # Статические файлы (изображения, шрифты)
/.env.local             # Переменные окружения (НЕ КОММИТИТЬ В GIT)
/components.json        # Конфигурация shadcn/ui
/next.config.ts
/package.json
/tsconfig.json
/tailwind.config.ts
/README.md              # Описание проекта, инструкции по установке и запуску
/firestore.rules        # Правила безопасности Firestore
/storage.rules          # Правила безопасности Storage
/.gitignore             # Файлы, игнорируемые Git
```

**Ключевые моменты архитектуры:**

*   **Четкое разделение ответственности:** Компоненты отвечают за UI, хуки - за логику получения/обновления данных, сервисы - за взаимодействие с Firebase, контексты - за глобальное состояние (аутентификация, тема).
*   **Маршрутизация:** Использование групп маршрутов `(auth)` и `(routes)` для применения разных макетов.
*   **Состояние:** Глобальное состояние (информация о пользователе, тема) управляется через React Context. Состояние серверных данных (прогресс, уровни и т.д.) управляется через React Query.

## 4. Настройка и Использование Firebase

### 4.1. Настройка Firebase Проекта

1.  Создать проект в [Firebase Console](https://console.firebase.google.com/).
2.  **Authentication:** Включить провайдер "Email/Password". Рассмотреть добавление Google для удобства.
3.  **Firestore Database:** Создать базу данных Firestore в нативном режиме. Выбрать регион.
4.  **Storage:** Включить Firebase Storage.
5.  **Регистрация веб-приложения:** Зарегистрировать веб-приложение в настройках проекта Firebase и скопировать конфигурационные ключи.
6.  **Переменные окружения:** Добавить ключи Firebase в файл `.env.local` (см. `README.md` из предыдущей версии проекта). Убедиться, что `.env.local` добавлен в `.gitignore`.

### 4.2. Конфигурация Firebase в Коде (`src/lib/firebase/`)

*   `config.ts`: Инициализация Firebase App с использованием ключей из `.env.local`.
*   `auth.ts`: Экспорт инстанса `getAuth()`, функции для регистрации, входа, выхода, сброса пароля.
*   `firestore.ts`: Экспорт инстанса `getFirestore()`, общие хелперы для работы с документами/коллекциями (как `getDocumentById`, `saveDocument` и т.д., возможно, из предыдущей версии).
*   `storage.ts`: Экспорт инстанса `getStorage()`, хелперы для загрузки/получения файлов.
*   `index.ts`: Центральный экспорт всех утилит Firebase.

### 4.3. Модели Данных Firestore

**Коллекция `users`:**
*   Документ: `{userId}` (совпадает с Firebase Auth UID)
*   Поля:
    *   `email`: `string`
    *   `displayName`: `string | null`
    *   `photoURL`: `string | null`
    *   `createdAt`: `Timestamp`
    *   `settings`: `{ theme: 'light' | 'dark', notificationsEnabled: boolean }` (Пример)

**Коллекция `userProgress`:**
*   Документ: `{userId}`
*   Поля:
    *   `userId`: `string` (для удобства запросов)
    *   `currentLevelId`: `string` (ID текущего уровня, например, `level-1`)
    *   `completedLevelIds`: `string[]` (Массив ID завершенных уровней)
    *   `watchedVideoIds`: `string[]`
    *   `completedTestIds`: `string[]`
    *   `downloadedArtifactIds`: `string[]`
    *   `skillProgress`: `Map<SkillType, number>` (Прогресс по каждому навыку, `SkillType` - enum или строка)
    *   `badges`: `Badge[]` (Массив объектов значков)
    *   `lastUpdated`: `Timestamp`

**Коллекция `levels`:**
*   Документ: `{levelId}` (например, `level-1`, `level-2`)
*   Поля:
    *   `title`: `string`
    *   `description`: `string`
    *   `order`: `number` (для сортировки)
    *   `videoContent`: `{ id: string, title: string, url: string }[]`
    *   `tests`: `{ id: string, title: string, questions: Question[] }[]`
    *   `relatedArtifactIds`: `string[]` (ID связанных артефактов)
    *   `completionCriteria`: `{ videosRequired: number, testsRequired: number }`
    *   `skillFocus`: `SkillType[]` (Навыки, развиваемые на этом уровне)

**Коллекция `artifacts`:**
*   Документ: `{artifactId}`
*   Поля:
    *   `title`: `string`
    *   `description`: `string`
    *   `fileURL`: `string` (Ссылка на файл в Firebase Storage)
    *   `fileName`: `string`
    *   `fileType`: `string` (MIME type)
    *   `levelId`: `string` (К какому уровню относится)
    *   `downloadCount`: `number`
    *   `uploadedAt`: `Timestamp`

**Коллекция `chats` (Пример):**
*   Документ: `{userId}`
    *   **Подколлекция `messages`:**
        *   Документ: `{messageId}` (автоматически генерируемый)
        *   Поля:
            *   `role`: `'user' | 'assistant'`
            *   `content`: `string`
            *   `timestamp`: `Timestamp`

**Коллекция `faq`:**
*   Документ: `{faqId}`
*   Поля:
    *   `question`: `string`
    *   `answer`: `string`
    *   `category`: `string`
    *   `order`: `number`

*(Примечание: Модели данных могут быть доработаны в процессе реализации)*

### 4.4. Правила Безопасности

Создать файлы `firestore.rules` и `storage.rules`. Основные принципы:
*   **Запретить всё по умолчанию.**
*   **Firestore:**
    *   Разрешить чтение/запись в `users/{userId}` и `userProgress/{userId}` только аутентифицированному пользователю с соответствующим `userId`.
    *   Разрешить чтение `levels`, `artifacts`, `faq` всем аутентифицированным пользователям.
    *   Разрешить запись `chats/{userId}/messages` только пользователю с `{userId}`.
    *   Запретить обновление `downloadCount` в `artifacts` напрямую пользователем (только через сервисные функции, если используются Cloud Functions, или доверенный клиентский код с проверками).
*   **Storage:**
    *   Разрешить чтение всех файлов аутентифицированным пользователям.
    *   Разрешить запись (загрузку артефактов, аватаров) только аутентифицированным пользователям в определенные папки (например, `artifacts/{artifactId}` или `avatars/{userId}`).
*   **Валидация данных:** Использовать правила для базовой валидации типов и обязательных полей при записи.

## 5. Управление Состоянием (React Query)

*   **Настройка:** Обернуть приложение в `QueryClientProvider` в `src/app/providers.tsx`.
*   **Хуки:** Создать кастомные хуки (`useProgress`, `useLevels`, `useArtifacts` и т.д.) в `src/hooks/`.
    *   Каждый хук инкапсулирует логику `useQuery` (для чтения) и `useMutation` (для записи) для своей области данных.
    *   Хуки используют соответствующие функции из сервисного слоя (`src/lib/services/`) для взаимодействия с Firestore.
    *   Пример `useProgress`:
        *   `useQuery(['userProgress', userId], () => progressService.getUserProgress(userId), { enabled: !!userId })`
        *   `useMutation(progressService.markVideoWatched, { onSuccess: () => queryClient.invalidateQueries(['userProgress', userId]) })`
*   **Обратная связь:** В `onSuccess` и `onError` хуков `useMutation` добавлять вызовы toast-уведомлений.

## 6. Пошаговый План Реализации с Нуля

Этот план предполагает итерационную разработку, начиная с основы и постепенно добавляя функционал.

**Этап 1: Инициализация и Базовая Настройка (Основа)**

1.  **Инициализация проекта:**
    *   `npx create-next-app@latest bizlevel --ts --tailwind --eslint --app --src-dir --import-alias "@/*"`
2.  **Установка зависимостей:**
    *   Firebase: `npm install firebase`
    *   React Query: `npm install @tanstack/react-query`
    *   React Hook Form, Zod: `npm install react-hook-form zod @hookform/resolvers`
    *   shadcn/ui: `npx shadcn-ui@latest init` (настроить базовые стили, цвета)
    *   Toast-библиотека (если `sonner`): `npm install sonner` (и добавить через shadcn)
    *   Тестирование (Vitest пример): `npm install -D vitest @vitejs/plugin-react @testing-library/react jsdom` (настроить `vite.config.ts`)
3.  **Настройка Firebase:**
    *   Создать проект в Firebase Console.
    *   Настроить Auth, Firestore, Storage.
    *   Скопировать ключи в `.env.local`.
    *   Написать базовые `firestore.rules` и `storage.rules` (запретить всё по умолчанию).
    *   Реализовать конфигурацию Firebase в `src/lib/firebase/`.
4.  **Создание структуры проекта:** Создать все директории согласно целевой структуре.
5.  **Настройка Провайдеров:**
    *   Создать `src/app/providers.tsx`.
    *   Обернуть `children` в `QueryClientProvider`, `ThemeProvider` (из shadcn/ui или кастомный), `ToastProvider` (`<Toaster />` из `sonner`).
    *   Подключить `Providers` в корневой `src/app/layout.tsx`.

**Этап 2: Аутентификация**

1.  **Контекст Аутентификации (`AuthProvider`):**
    *   Создать `src/context/AuthContext.tsx`.
    *   Использовать `onAuthStateChanged` из Firebase Auth для отслеживания состояния пользователя.
    *   Хранить `user` (из Firebase) и `loading` состояние.
    *   Предоставить функции `login`, `register`, `logout`, `resetPassword`, которые вызывают соответствующие функции из `src/lib/firebase/auth.ts`.
    *   Подключить `AuthProvider` в `src/app/providers.tsx`.
2.  **Хук `useAuth`:** Создать `src/hooks/useAuth.ts` для удобного доступа к контексту.
3.  **Макет и Страницы Аутентификации:**
    *   Создать `src/app/(auth)/layout.tsx` (простой центрированный макет).
    *   Создать страницы `login`, `register`, `reset-password` в `src/app/(auth)/`.
    *   Создать компоненты форм (`LoginForm`, `RegisterForm`) в `src/components/auth/`, используя `react-hook-form`, `zod` и `shadcn/ui`.
4.  **Защищенные Маршруты:**
    *   Создать компонент `ProtectedRoute` или логику в `src/app/(routes)/layout.tsx`, которая проверяет `user` из `useAuth`. Если пользователя нет, перенаправлять на `/login`.
    *   Аналогично, в `src/app/(auth)/layout.tsx` проверять: если пользователь есть, перенаправлять на `/map`.
5.  **Правила Firestore/Storage:** Обновить правила, разрешив создание `users/{userId}` при регистрации (или использовать Cloud Function).

**Этап 3: Основной Макет и Навигация**

1.  **Компоненты Макета:**
    *   Создать `MainLayout` в `src/components/layout/`.
    *   Создать `Sidebar`, `Header`, `UserNav` (меню пользователя в шапке).
2.  **Макет `(routes)`:**
    *   Использовать `MainLayout` в `src/app/(routes)/layout.tsx`.
    *   Добавить `ProtectedRoute` логику.
3.  **Навигация в Sidebar:** Добавить ссылки на основные разделы (`/map`, `/profile`, `/artifacts` и т.д.).
4.  **Корневая страница:** Настроить редирект с `/` на `/map` в `src/app/page.tsx`.

**Этап 4: Профиль Пользователя и Настройки**

1.  **Сервис и Хук Настроек:**
    *   Создать `settings-service.ts` для чтения/записи документа `users/{userId}`.
    *   Создать хук `useSettings`, использующий `useQuery` для чтения настроек и `useMutation` для их обновления.
2.  **Страница Профиля (`/profile`):**
    *   Создать `src/app/(routes)/profile/page.tsx`.
    *   Отобразить данные пользователя из `useAuth`.
    *   Отобразить прогресс и навыки из `useProgress` (будет реализован позже).
    *   Отобразить значки из `useProgress`.
3.  **Страница Настроек (`/settings`):**
    *   Создать `src/app/(routes)/settings/page.tsx`.
    *   Создать форму для обновления `displayName`, `photoURL` (с загрузкой аватара в Storage), настроек темы/уведомлений.
    *   Использовать хук `useSettings` для загрузки и сохранения данных.

**Этап 5: Уровни и Прогресс (Ключевая Логика)**

1.  **Типы и Константы:** Определить типы `Level`, `UserProgress`, `SkillType`, `Badge` в `src/types/`.
2.  **Сервис Прогресса (`progress-service.ts`):**
    *   Реализовать функции: `initializeUserProgress`, `getUserProgress`, `markVideoWatched`, `markTestCompleted`, `markArtifactDownloaded`, `completeLevel`, `checkAndAwardBadges` (пока пустую). Функции должны взаимодействовать с Firestore (`userProgress/{userId}`).
    *   Использовать `arrayUnion`, `increment`, `serverTimestamp`, `writeBatch` где необходимо.
3.  **Сервис Навыков (`skill-service.ts`):**
    *   Реализовать `calculateSkillProgress` (на основе `completedLevelIds` и `skillFocus` из данных уровней), `getSkillRecommendations`.
4.  **Сервис Уровней (`level-service.ts`):**
    *   Реализовать `getLevels` (получение списка уровней для карты) и `getLevelById` (получение деталей уровня).
5.  **Хук `useProgress`:**
    *   Реализовать хук с `useQuery` для `getUserProgress`.
    *   Добавить `useMutation` для всех функций-модификаторов из `progress-service`.
    *   Добавить хелперы (например, `isVideoWatched`, `getSkillProgress`).
6.  **Хуки `useLevels`, `useLevel`:**
    *   Реализовать хуки с `useQuery` для `getLevels` и `getLevelById`.
7.  **Страница Карты Уровней (`/map`):**
    *   Использовать `useLevels` для получения данных.
    *   Создать компонент `LevelMap` в `src/components/features/` для визуализации карты.
    *   Отображать прогресс пользователя на карте, используя данные из `useProgress`.
8.  **Страница Деталей Уровня (`/level/[levelId]`):**
    *   Использовать `useLevel` для получения данных уровня.
    *   Использовать `useProgress` для отслеживания и отображения прогресса по видео/тестам.
    *   Создать компоненты для отображения видео, тестов.
    *   Реализовать логику вызова мутаций `markVideoWatched`, `markTestCompleted` при взаимодействии пользователя.
    *   Добавить кнопку "Завершить уровень", вызывающую `completeLevel`.
9.  **Реализация Значков:**
    *   Определить критерии значков.
    *   Реализовать логику в `checkAndAwardBadges`.
    *   Вызывать эту функцию внутри `completeLevel`.
    *   Отображать значки на странице профиля.
10. **Firestore Данные:** Заполнить коллекцию `levels` тестовыми данными.

**Этап 6: Артефакты**

1.  **Сервис и Хук Артефактов:**
    *   Создать `artifact-service.ts` (`getArtifacts`, `getArtifactById`).
    *   Создать `useArtifacts` (`useQuery` для `getArtifacts`).
2.  **Страница Артефактов (`/artifacts`):**
    *   Отобразить список артефактов с возможностью фильтрации/поиска.
    *   Реализовать скачивание артефакта, вызывая мутацию `markArtifactDownloaded` из `useProgress` (которая обновляет и `userProgress`, и счетчик в `artifacts/{artifactId}`).
3.  **Firebase Storage:** Настроить загрузку файлов артефактов (возможно, через отдельный интерфейс администратора или скрипт).

**Этап 7: Чат с AI**

1.  **API Route:** Создать API route в `src/app/api/chat/route.ts` для взаимодействия с OpenAI (или другой LLM). Этот роут будет принимать историю сообщений и возвращать ответ ассистента. (Использовать `OPENAI_API_KEY` из `.env.local`).
2.  **Сервис и Хук Чата:**
    *   Создать `chat-service.ts` для чтения истории из Firestore (`chats/{userId}/messages`) и отправки новых сообщений (вызов API route и сохранение ответа в Firestore).
    *   Создать `useChat` с `useQuery` для получения истории и `useMutation` для отправки сообщения.
3.  **Страница Чата (`/chat`):**
    *   Создать интерфейс чата (`ChatWindow`, `MessageList`, `MessageInput`) в `src/components/features/`.
    *   Использовать `useChat` для отображения истории и отправки сообщений.

**Этап 8: FAQ**

1.  **Сервис и Хук FAQ:**
    *   Создать `faq-service.ts` (`getFaqs`).
    *   Создать `useFaqs` (`useQuery` для `getFaqs`).
2.  **Страница FAQ (`/faq`):**
    *   Отобразить список вопросов/ответов, сгруппированных по категориям.
    *   Добавить поиск/фильтрацию.
3.  **Firestore Данные:** Заполнить коллекцию `faq`.

**Этап 9: Тестирование**

1.  **Настройка:** Настроить среду тестирования (Vitest/Jest, RTL).
2.  **Юнит-тесты:** Написать тесты для утилит, функций сервисов (с моками вызовов Firebase).
3.  **Интеграционные тесты:** Написать тесты для кастомных хуков (используя `renderHook` из RTL, мокая сервисы).
4.  **Компонентные тесты:** Написать тесты для ключевых компонентов (формы, сложные UI элементы).

**Этап 10: Финализация**

1.  **Обратная связь и Ошибки:** Убедиться, что все мутации имеют `onSuccess`/`onError` с toast-уведомлениями.
2.  **Оптимизация:** Проверить производительность, настроить `staleTime`/`cacheTime` в React Query.
3.  **Чистка кода:** Удалить неиспользуемый код, консольные логи.
4.  **Документация:** Обновить `README.md`, добавить комментарии к сложному коду.
5.  **Правила Безопасности:** Финализировать и протестировать правила Firebase.

Этот план обеспечивает пошаговое создание проекта с нуля, придерживаясь заданной архитектуры и используя Firebase и React Query с самого начала. 