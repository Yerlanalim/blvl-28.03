/**
 * @file MainLayout.tsx
 * @description Main application layout with sidebar navigation
 * @dependencies hooks/useAuth, components/layout/Sidebar
 */

'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from './Sidebar';
import { ProtectedRoute } from './ProtectedRoute';
import Link from 'next/link';
import { 
  MapIcon, 
  UserIcon, 
  DocumentIcon, 
  ChatBubbleLeftIcon as ChatBubbleOvalLeftIcon, 
  Cog6ToothIcon as CogIcon, 
  QuestionMarkCircleIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout
 * 
 * Основной макет приложения с боковым меню
 */
export function MainLayout({ children }: MainLayoutProps) {
  const { isLoading } = useAuth();

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <Link href="/map" className="text-teal-500 text-2xl font-bold">
              BizLevel
            </Link>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/map" 
                  className="flex items-center p-3 text-gray-700 rounded hover:bg-gray-100"
                >
                  <MapIcon className="mr-3 h-5 w-5" />
                  <span>Карта Уровней</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/profile" 
                  className="flex items-center p-3 text-gray-700 rounded hover:bg-gray-100"
                >
                  <UserIcon className="mr-3 h-5 w-5" />
                  <span>Профиль</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/artifacts" 
                  className="flex items-center p-3 text-gray-700 rounded hover:bg-gray-100"
                >
                  <DocumentIcon className="mr-3 h-5 w-5" />
                  <span>Артефакты</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/chat" 
                  className="flex items-center p-3 text-gray-700 rounded hover:bg-gray-100"
                >
                  <ChatBubbleOvalLeftIcon className="mr-3 h-5 w-5" />
                  <span>Чат</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/settings" 
                  className="flex items-center p-3 text-gray-700 rounded hover:bg-gray-100"
                >
                  <CogIcon className="mr-3 h-5 w-5" />
                  <span>Настройки</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="flex items-center p-3 text-gray-700 rounded hover:bg-gray-100"
                >
                  <QuestionMarkCircleIcon className="mr-3 h-5 w-5" />
                  <span>Частые Вопросы</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin" 
                  className="flex items-center p-3 text-indigo-700 rounded hover:bg-indigo-50"
                >
                  <ShieldCheckIcon className="mr-3 h-5 w-5" />
                  <span>Администрирование</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 