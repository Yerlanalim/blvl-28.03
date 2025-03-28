/**
 * @file layout.tsx (Root)
 * @description Root layout component for the application
 */

import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BizLevel - Карта развития бизнеса',
  description: 'Платформа для визуализации и отслеживания бизнес-уровней',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
