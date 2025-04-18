# Snapshot системы FAQ

## Назначение
Предоставление организованного доступа к часто задаваемым вопросам и ответам с функциональностью поиска

## Ключевые файлы
- `/lib/data/faq-data.ts` - Данные содержимого FAQ
- `/components/features/faq/FAQAccordion.tsx` - Раскрывающиеся элементы FAQ
- `/components/features/faq/FAQSearch.tsx` - Функциональность поиска
- `/components/features/faq/FAQCategoryTabs.tsx` - Навигация по категориям
- `/app/(routes)/faq/page.tsx` - Страница FAQ

## Управление состоянием
- Активная категория отслеживается в состоянии страницы
- Поисковый запрос с debounced-обновлениями
- Вычисляемые элементы для отображения на основе поиска или категории
- Состояние вкладок связано с выбором категории

## Поток данных
1. Пользователь выбирает категорию или вводит поисковый запрос
2. Обновляется состояние страницы (активная категория или поисковый запрос)
3. Элементы для отображения вычисляются на основе текущего состояния
4. UI-компоненты рендерят отфильтрованные элементы
5. Пользователь может раскрывать/сворачивать отдельные вопросы

## Ключевые решения
- Организация на основе категорий с навигацией по вкладкам
- Интерфейс аккордеона для вопросов и ответов
- Поиск в реальном времени по всему содержимому
- Четкое визуальное различие между просмотром и поиском
- Дополнительный раздел "Всё ещё нужна помощь?" для нерешенных вопросов

## Пример использования
```tsx
import { FAQAccordion } from '@/components/features/faq/FAQAccordion';
import { getFAQItemsByCategory } from '@/lib/data/faq-data';

function CategoryFAQs({ categoryId }) {
  const items = getFAQItemsByCategory(categoryId);
  
  return (
    <div>
      <h2>Часто задаваемые вопросы</h2>
      <FAQAccordion items={items} />
    </div>
  );
}
```

## Известные проблемы
- На данный момент отсутствуют 