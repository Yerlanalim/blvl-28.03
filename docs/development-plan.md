# Анализ текущего состояния проекта

Дата анализа: 28.03.2024

## Выявленные расхождения между текущим проектом и документацией задач

### 1. Проблема структуры проекта

**Описание расхождения:** 
В проекте одновременно используются две структуры директорий:
- Файлы в корневой директории (`/app`, `/components`, `/hooks`, `/context`, `/lib`)
- Файлы в директории `src` (`/src/app`, `/src/components`, `/src/hooks`, `/src/lib`)

**Причина расхождения:**
Согласно task-1.1-initialize-nextjs.md, проект должен был иметь структуру, в которой все файлы размещены в корне. Однако, в процессе реализации task-2.1-main-layout.md были созданы дублирующие директории внутри `/src`. При этом в `tsconfig.json` настроено path-mapping: `"@/*": ["./src/*"]`, что указывает на то, что все компоненты должны находиться в `/src`.

**Влияние:**
Возникает конфликт между маршрутами. Маршрутизация Next.js пытается использовать файлы как из `/app`, так и из `/src/app`, что приводит к ошибке 404 при переходе на `/map`.

### 2. Проблема с импортами компонентов

**Описание расхождения:**
Компоненты макета используют несогласованный подход к импортам:
- Некоторые импорты используют относительные пути (`../../hooks/useAuth`)
- Другие используют alias из tsconfig.json (`@/components/layout/MainLayout`)

**Причина расхождения:**
При создании компонентов макета в задаче 2.1 первоначально были использованы импорты с alias `@/`, но потом некоторые были заменены на относительные пути для устранения ошибок TypeScript. Это создало несогласованность в стиле импортов.

### 3. Проблема с маршрутизацией

**Описание расхождения:**
В проекте присутствуют страницы в двух местах:
- В директории `/app` (старая структура)
- В директории `/src/app` (новая структура)

**Причина расхождения:**
При переносе страниц в `/src/app` старые страницы в `/app` не были удалены, что создало конфликт маршрутизации. Next.js пытается определить, какой маршрут использовать, и возникает ошибка.

### 4. Проблема с группами маршрутов

**Описание расхождения:**
В задаче 2.1 предлагалось создать группу маршрутов `(main)`, но при реализации возникла путаница с тем, как именно Next.js обрабатывает группы в скобках.

**Причина расхождения:**
Непонимание того, как Next.js обрабатывает группы маршрутов в скобках. В документации Next.js указано, что группы в скобках не влияют на URL-путь, но влияют на организацию файлов и макетов.

## Рекомендации по устранению расхождений

### 1. Стандартизация структуры проекта

1. **Выбрать единую структуру директорий:**
   - Предпочтительно использовать структуру с директорией `/src`, так как это более современный подход и соответствует настройкам в `tsconfig.json`
   - Переместить все файлы из корневых директорий `/app`, `/components`, `/hooks`, `/context`, `/lib` в соответствующие директории внутри `/src`
   - Удалить пустые директории в корне проекта

2. **Обновить все импорты:**
   - Использовать alias `@/` для всех импортов, чтобы обеспечить единообразие
   - Например, изменить `import { useAuth } from '../../hooks/useAuth'` на `import { useAuth } from '@/hooks/useAuth'`

### 2. Исправление маршрутизации

1. **Удалить старые файлы маршрутов:**
   - Удалить все файлы и директории в `/app`

2. **Правильно структурировать маршруты:**
   - Убедиться, что все маршруты находятся в `/src/app`
   - Каждый маршрут должен иметь свой файл `page.tsx`
   - Для страниц, требующих единого макета, использовать файл `layout.tsx` внутри соответствующей директории

3. **Правильное использование групп маршрутов:**
   - Для маршрутов, которые должны использовать общий макет:
     - Либо создать директорию с группой в скобках, например, `(main)`
     - Либо разместить макет в каждой директории маршрута
   - Учесть, что группы в скобках не влияют на URL-путь

### 3. Проверка и тестирование

1. **Проверить TypeScript:**
   - Запустить `npx tsc --noEmit` для проверки наличия ошибок TypeScript
   - Исправить все обнаруженные ошибки

2. **Проверить маршрутизацию:**
   - Запустить приложение с помощью `npm run dev`
   - Проверить, что все маршруты работают корректно
   - Проверить перенаправление с корневого маршрута `/` на `/map`

3. **Обновить документацию:**
   - Обновить файл `status.md` с текущим состоянием проекта
   - Документировать принятые решения по структуре проекта для будущих задач

## План исправлений

Для приведения проекта в соответствие с документацией и устранения выявленных проблем, будут выполнены следующие действия:

1. **Удаление дублирующих файлов**:
   - Удаление директорий `/app`, `/components` в корне проекта
   - Сохранение директорий `context`, `hooks`, `lib` и `types` в корне (согласно структуре из bizlevel-project-description.md)

2. **Исправление структуры в src/app**:
   - Создание группы маршрутов `(routes)` в соответствии с документацией вместо `(main)`
   - Перемещение всех маршрутов (`map`, `profile`, `artifacts`, `chat`, `settings`, `faq`) в группу `(routes)`

3. **Стандартизация импортов**:
   - Обновление всех импортов на использование alias `@/` для ссылок на файлы в директории `src`
   - Использование относительных путей для компонентов внутри той же директории

4. **Исправление корневого маршрута**:
   - Обновление `/src/app/page.tsx` для корректного перенаправления на `/map`

5. **Исправление конфликтов**:
   - Проверка и устранение конфликтов маршрутизации
   - Проверка и исправление ошибок TypeScript

## Журнал внесенных исправлений

### Исправление 1: Удаление дублирующих директорий в корне проекта

**Действие**: Удалены дублирующие директории `/app` и `components/layout`.

**Результат**: Устранение конфликта маршрутизации и четкое разделение структуры проекта.

### Исправление 2: Реорганизация маршрутов в src/app

**Действие**: 
- Создана группа маршрутов `(routes)`
- Перемещены маршруты внутрь группы `(routes)`
- Исправлены импорты в файлах маршрутов

**Результат**: Соответствие структуры приложения документации, корректная работа маршрутизации.

### Исправление 3: Стандартизация импортов

**Действие**: Обновлены импорты во всех компонентах, используя единый подход с alias `@/`.

**Результат**: Единообразие в коде, устранение проблем с разрешением зависимостей.

### Исправление 4: Проверка типов и тестирование

**Действие**: 
- Выполнена проверка TypeScript `npx tsc --noEmit`
- Запущен сервер разработки для проверки работы маршрутизации

**Результат**: Отсутствие ошибок TypeScript, корректная работа всех маршрутов.

## Project Analysis: Discrepancies with Documentation

### Issues Identified

1. **Project Structure Issues**:
   - The project uses two directory structures: files in both the root and `/src` directory.
   - This leads to confusion and potential routing conflicts.

2. **Inconsistent Imports**:
   - Some files use relative paths like `../../component` while others use alias imports like `@/component`.
   - This inconsistency makes the codebase harder to maintain.

3. **Routing Conflicts**:
   - Pages are present in both `/app` and `/src/app`, causing routing errors.
   - This dual structure creates confusion for Next.js routing system.

4. **Route Grouping Confusion**:
   - There's a misunderstanding about how Next.js handles route groups.
   - The `(main)` group was removed, but routes weren't properly structured afterward.

### Recommendations

1. **Standardize Project Structure**:
   - Consolidate all files into the `/src` directory.
   - Follow the pattern established in the project description document.

2. **Update Imports**:
   - Use the alias `@/` consistently for all imports.
   - Update existing imports to follow this pattern.

3. **Remove Duplicate Routes**:
   - Keep routes only in `/src/app` directory.
   - Remove duplicate route files from `/app` directory.

4. **Properly Structure Routes**:
   - Use a route group like `(routes)` to organize pages.
   - Understand how Next.js route groups work.

## Plan for Corrections

1. **Remove Duplicate Directories**:
   - Delete `app` and `components` directories in the root project.
   - Maintain all files in the `src` directory structure.

2. **Correct Route Structure**:
   - Create a route group `(routes)` in `src/app`.
   - Move all routes (`map`, `profile`, etc.) into this group.
   - Create a layout for the route group that uses `MainLayout`.

3. **Standardize Imports**:
   - Update all imports to use the `@/` alias.
   - Ensure consistent import patterns across the codebase.

4. **Update Root Route**:
   - Make sure the root route (`/`) correctly redirects to `/map`.

5. **Check Routing and TypeScript Errors**:
   - Verify the application routes work correctly.
   - Resolve any TypeScript errors.

## Change Log

- **Removed duplicate directories**: Deleted `app` and `components` directories from the root, keeping only `src` structure.
- **Created route group**: Created `src/app/(routes)` and moved all page routes into it.
- **Added route group layout**: Created `src/app/(routes)/layout.tsx` using `MainLayout`.
- **Updated root page**: Modified `src/app/page.tsx` for proper redirection to `/map`.
- **Standardized imports**: Updated import paths to use `@/` alias in layout components.
- **Resolved context paths**: Fixed import path issues between context and hooks.
- **Fixed TypeScript errors**: Corrected type issues in `ProtectedRoute` component.
- **Consolidated Firebase files**: Moved and corrected imports for Firebase configuration.
- **Validated TypeScript**: Confirmed all TypeScript errors are resolved with `npx tsc --noEmit`.

## Additional Changes (2023-04-03)

- **Removed remaining root directories**: Removed the remaining duplicate directories (`context`, `hooks`, `lib`, `types`) from the root.
- **Created AuthLayout component**: Created a proper AuthLayout component in the components directory.
- **Moved level route**: Moved the `level/[id]` page into the `(routes)` group for consistency.
- **Added auth components**: Created AuthCard and FormError components for authentication pages.
- **Fixed authentication imports**: Updated import paths in authentication pages to use the `@/` alias.
- **Ensured TypeScript compatibility**: Verified all changes with TypeScript checking.

## Project Structure Alignment

The project structure now follows the recommended pattern:

```
/src
  /app
    /auth (authentication pages outside routes group)
      /login
      /register
      /reset-password
    /(routes) (main application routes)
      /map
      /profile
      /artifacts
      /chat
      /settings 
      /faq
      /level
        /[id]
  /components
    /features
    /layout
    /ui
  /context
  /hooks
  /lib
  /types
```

This structure aligns with the project documentation and follows Next.js recommended practices for organizing components and pages.
