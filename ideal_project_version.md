# BizLevel: Ideal Project Version Specification

Дата создания: 1 апреля 2024 г.

## 1. Общая цель

Создать надежное, масштабируемое и удобное в обслуживании веб-приложение BizLevel, полностью реализующее запланированный функционал с использованием Firebase Firestore в качестве бэкенда и React Query для управления состоянием данных на клиенте. Текущая реализация должна быть доработана для устранения зависимости от mock-данных и `localStorage`, а также для внедрения лучших практик разработки.

## 2. Основной технологический стек

*   **Фреймворк**: Next.js 14+ (с App Router)
*   **Язык**: TypeScript
*   **Стилизация**: Tailwind CSS
*   **UI Компоненты**: shadcn/ui
*   **Аутентификация**: Firebase Authentication (Email/Password, возможно Google/другие провайдеры)
*   **База данных**: Firebase Firestore
*   **Хранилище файлов**: Firebase Storage (для артефактов, аватаров и т.д.)
*   **Управление состоянием данных (Data Fetching)**: React Query (`@tanstack/react-query`)
*   **Управление формами**: React Hook Form + Zod (для валидации)
*   **Тестирование**: Jest / Vitest + React Testing Library
*   **Обратная связь (UI)**: Библиотека для Toast-уведомлений (например, `sonner` из shadcn/ui или `react-toastify`)

## 3. Ключевые улучшения и характеристики идеальной версии

### 3.1. Бэкенд и хранение данных (Firebase Firestore)

*   **Полный переход на Firestore**: Все динамические данные приложения должны храниться и извлекаться исключительно из Firestore. Это включает:
    *   **Прогресс пользователя (`userProgress/{userId}`):** Отслеживание просмотренных видео, пройденных тестов, загруженных артефактов, завершенных уровней, прогресса навыков, заработанных значков.
    *   **Данные уровней (`levels/{levelId}`):** Содержание уровней, видео, тесты, связанные артефакты, критерии завершения.
    *   **Артефакты (`artifacts/{artifactId}`):** Метаданные артефактов, ссылки на файлы в Firebase Storage, счетчики загрузок.
    *   **Пользовательские данные (`users/{userId}`):** Дополнительная информация профиля, настройки (если необходимо, может быть объединено с `userProgress`).
    *   **История чата (`chats/{userId}/messages` или подобная структура):** Сохранение диалогов с AI-ассистентом.
    *   **FAQ (`faq/{faqId}` или единый документ):** Данные для страницы FAQ.
*   **Сервисный слой**: Четко определенный сервисный слой (`src/lib/services/`) для инкапсуляции логики взаимодействия с Firestore (например, `progress-service.ts`, `level-service.ts`, `artifact-service.ts`, `chat-service.ts`).
*   **Атомарные операции**: Использование Firestore Transactions или Batched Writes для операций, требующих обновления нескольких документов (например, `completeLevel`, `markArtifactDownloaded`).
*   **Безопасность**: Настроенные правила безопасности Firestore (и Storage) для обеспечения доступа к данным только авторизованным пользователям и предотвращения несанкционированных изменений.
*   **Реализация логики значков**: Функция `checkAndAwardBadges` в `progress-service.ts` должна быть полностью реализована согласно критериям, обновляя массив `badges` в документе `userProgress`.

### 3.2. Получение данных и управление состоянием (React Query)

*   **Единообразное использование React Query**: Все операции получения и изменения данных на клиенте должны управляться React Query.
    *   **`useQuery`**: Для получения данных (прогресс, уровни, артефакты, настройки, чат и т.д.). Ключи запросов (`queryKey`) должны быть четко определены и консистентны. Использовать `staleTime` и `cacheTime` для оптимизации.
    *   **`useMutation`**: Для операций изменения данных (отметка видео/теста, загрузка артефакта, завершение уровня, отправка сообщения в чат, обновление настроек).
    *   **Инвалидация кеша**: Корректная инвалидация кеша (`queryClient.invalidateQueries`) в `onSuccess` хуков `useMutation` для отображения актуальных данных.
*   **Специализированные хуки**: Сохранение кастомных хуков (`src/hooks/`) как оберток над React Query для предоставления удобного API компонентам (например, `useProgress`, `useLevels`, `useArtifacts`, `useChat`, `useSettings`).
*   **Отображение состояний**: Компоненты должны корректно обрабатывать состояния `isLoading`, `isError`, `isFetching`, `isPending` из хуков React Query для отображения индикаторов загрузки, сообщений об ошибках и т.д.

### 3.3. Структура кода и качество

*   **Стандартизированная структура**: Строгое следование структуре проекта с основным кодом в директории `src/` (как описано в `development-plan.md`).
*   **Удаление mock-данных**: Полное удаление всех файлов с mock-данными из `src/lib/data/`. Приложение должно работать исключительно с данными из Firebase.
*   **Рефакторинг `useProfile`**: Удаление хука `useProfile.ts`. Компонент страницы профиля должен получать необходимые данные из других хуков (`useAuth`, `useProgress`, `useSettings` и т.д.).
*   **Консистентность импортов**: Использование псевдонимов пути (`@/`) для импортов из `src/`.
*   **Типизация**: Строгая типизация всего кода с использованием TypeScript. Типы данных (например, из `src/types/`) должны соответствовать схемам данных в Firestore.
*   **Тестирование**: Наличие юнит-тестов (для сервисов, утилит) и интеграционных/компонентных тестов (для хуков и ключевых компонентов). Настройка CI для автоматического запуска тестов.
*   **Чистота кода**: Отсутствие неиспользуемого кода, "закомментированных" блоков старого кода. Регулярный рефакторинг и следование принципам чистого кода.
*   **Документация**: Актуальная документация (`README.md`, `status.md`, комментарии в коде, возможно JSDoc для сервисов и хуков).

### 3.4. Пользовательский опыт (UX)

*   **Обратная связь**: Четкая обратная связь пользователю о результатах операций (успех/ошибка) с использованием Toast-уведомлений, интегрированных с `useMutation` (`onSuccess`, `onError`).
*   **Обработка ошибок**: Грациозная обработка ошибок как на уровне сервисов (логирование), так и в UI (отображение сообщений пользователю).
*   **Оптимистичные обновления (опционально)**: Для некоторых мутаций можно реализовать оптимистичные обновления для улучшения воспринимаемой производительности.
*   **Индикаторы загрузки**: Понятные индикаторы загрузки данных (`isLoading`, `isFetching` из `useQuery`, `isPending` из `useMutation`).

## 4. Целевая структура проекта (Уточненная)

```
/src
  /app                  # Маршруты Next.js (App Router)
    /(auth)             # Группа маршрутов аутентификации (без MainLayout)
      /login
      /register
      /reset-password
      ... (layout.tsx, page.tsx)
    /(routes)           # Основная группа маршрутов приложения (с MainLayout)
      /map
      /profile
      /artifacts
      /chat
      /settings
      /faq
      /level
        /[levelId]
      ... (layout.tsx, page.tsx)
    /api                # API Routes (если нужны серверные функции)
    page.tsx            # Корневая страница (редирект на /map)
    layout.tsx          # Корневой макет (подключение Providers)
    providers.tsx       # Провайдеры (QueryClientProvider, AuthProvider, ThemeProvider, ToastProvider)
    globals.css         # Глобальные стили
  /components           # Переиспользуемые компоненты
    /auth               # Компоненты для страниц аутентификации
    /features           # Компоненты, специфичные для фич (Map, Profile, Chat...)
    /layout             # Компоненты макета (Sidebar, Header, MainLayout...)
    /ui                 # Базовые UI компоненты (обертки shadcn/ui или кастомные)
  /context              # React Контексты (AuthProvider, ThemeProvider)
  /hooks                # Кастомные React хуки (useAuth, useProgress, useLevels...)
  /lib                  # Библиотеки, утилиты, сервисы
    /firebase           # Конфигурация и утилиты Firebase (auth, firestore, storage)
    /services           # Сервисный слой для взаимодействия с бэкендом (progress, levels, skills...)
    /utils              # Общие утилиты
    /constants.ts       # Константы приложения
    /zod-schemas.ts     # Схемы Zod для валидации
  /types                # TypeScript типы и интерфейсы
/public                 # Статические файлы
/.env.local             # Переменные окружения (Firebase ключи, API ключи)
/components.json        # Конфигурация shadcn/ui
/next.config.ts
/package.json
/tsconfig.json
/tailwind.config.ts
/README.md
/ideal_project_version.md # Этот файл
/docs                   # Дополнительная документация (если нужна)
```

## 5. Рекомендуемые шаги реализации (На основе improvement-plan-tasks.md)

1.  **Task 6.5 (Частично): Миграция данных Levels, Artifacts, FAQ, Chat на Firestore:**
    *   Создать/обновить сервисы (`level-service`, `artifact-service`, `faq-service`, `chat-service`) для чтения/записи данных из Firestore.
    *   Заполнить Firestore тестовыми данными для уровней, артефактов и т.д.
2.  **Task 6.3 (Частично): Рефакторинг хуков на React Query:**
    *   Обновить хуки (`useLevels`, `useLevel`, `useArtifacts`, `useChat`, `useSettings`, `useFaq`?) для использования `useQuery`/`useMutation` и вызова новых Firestore-сервисов.
3.  **Task 6.4: Рефакторинг `useProfile`:**
    *   Обновить `ProfilePage`, чтобы она использовала данные из `useAuth`, `useProgress`, `useSettings` напрямую.
    *   Удалить `useProfile.ts`.
    *   Удалить mock-файл `src/lib/data/user-progress.ts`.
4.  **Task 6.5 (Завершение): Удаление Mock-данных:**
    *   Убедиться, что все компоненты используют хуки на React Query.
    *   Удалить оставшиеся mock-файлы (`levels.ts`, `faq-data.ts`, `chat-history.ts` и др.) из `src/lib/data/`.
5.  **Task 6.6: Реализация логики значков:**
    *   Реализовать функцию `checkAndAwardBadges` в `progress-service.ts`.
    *   Интегрировать ее вызов в `completeLevel`.
    *   Обновить Firestore-сервис и `useProgress` для работы со значками.
6.  **Task 6.7: Улучшение обработки ошибок и обратной связи:**
    *   Установить и настроить библиотеку Toast-уведомлений.
    *   Добавить вызовы toast в `onSuccess` и `onError` во всех `useMutation` хуках.
    *   Улучшить обработку ошибок `isError` в компонентах, использующих `useQuery`.
7.  **Task 6.2: Миграция `skill-service.ts` (если необходимо):**
    *   Проверить, нужны ли `skill-service` данные из Firestore (например, детали уровней для расчета). Если да, реализовать чтение из Firestore.
8.  **Task 6.8: Добавление тестов:**
    *   Настроить тестовое окружение (Jest/Vitest, RTL).
    *   Написать юнит-тесты для сервисов и утилит.
    *   Написать интеграционные тесты для хуков.
    *   Написать тесты для ключевых компонентов.
9.  **Task 6.9: Финальная очистка и обновление документации:**
    *   Удалить неиспользуемый код.
    *   Проверить консистентность форматирования и именования.
    *   Обновить `README.md` и `status.md`.
    *   Проверить актуальность комментариев в коде. 