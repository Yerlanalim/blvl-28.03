/**
 * @file Sidebar.tsx
 * @description Sidebar navigation component
 * @dependencies hooks/useAuth
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Map, 
  User, 
  FileText, 
  MessageCircle, 
  Settings, 
  HelpCircle 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Navigation item type
interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

/**
 * Sidebar component
 * 
 * Navigation sidebar for the application
 */
export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  
  // Create navigation items
  const navItems: NavItem[] = [
    {
      href: '/map',
      label: 'Карта Уровней',
      icon: <Map className="w-5 h-5" />,
    },
    {
      href: '/profile',
      label: 'Профиль',
      icon: <User className="w-5 h-5" />,
    },
    {
      href: '/artifacts',
      label: 'Артефакты',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      href: '/chat',
      label: 'Чат',
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      href: '/settings',
      label: 'Настройки',
      icon: <Settings className="w-5 h-5" />,
    },
    {
      href: '/faq',
      label: 'Частые Вопросы',
      icon: <HelpCircle className="w-5 h-5" />,
    },
  ];

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (!user?.displayName) return 'U';
    
    const nameParts = user.displayName.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0);
    
    return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/map" className="text-2xl font-bold text-teal-500">
          BizLevel
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`
                    flex items-center p-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-teal-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback className="bg-teal-100 text-teal-800">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
} 