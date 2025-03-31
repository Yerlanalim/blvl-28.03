/**
 * @file FAQAccordion.tsx
 * @description Компонент аккордеона для отображения элементов FAQ
 */

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQItem } from '@/lib/data/faq-data';

interface FAQAccordionProps {
  items: FAQItem[];
  defaultValue?: string;
}

/**
 * Компонент FAQAccordion
 * 
 * Отображает элементы FAQ в раскрывающемся аккордеоне
 */
export function FAQAccordion({ items, defaultValue }: FAQAccordionProps) {
  // Если нет элементов, показать сообщение
  if (items.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-gray-500">Элементы FAQ не найдены.</p>
      </div>
    );
  }
  
  return (
    <Accordion type="single" collapsible defaultValue={defaultValue}>
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="text-left">
            {item.question}
          </AccordionTrigger>
          <AccordionContent>
            <div className="prose prose-sm max-w-none">
              <p>{item.answer}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
} 