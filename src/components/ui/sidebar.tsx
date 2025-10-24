'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarProps {
  logo?: React.ReactNode;
  logoText?: string;
  version?: string;
  sections: SidebarSection[];
  bottomItems?: SidebarItem[];
  className?: string;
}

export function Sidebar({
  logo,
  logoText = 'Untitled UI',
  version = 'v4.0',
  sections,
  bottomItems,
  className,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn('w-64 h-screen bg-white border-r border-gray-200 flex flex-col', className)}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {logo || (
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">
                UI
              </div>
            )}
            <span className="font-semibold text-gray-900">{logoText}</span>
          </div>
          <span className="text-xs text-gray-500">{version}</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {sections.map((section, idx) => (
          <div key={idx} className={cn('mb-6', idx > 0 && 'pt-6 border-t border-gray-200')}>
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const isActive = pathname === item.href;
                return (
                  <li key={itemIdx}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <span className="text-gray-500">{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Items */}
      {bottomItems && bottomItems.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <ul className="space-y-1">
            {bottomItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <span className="text-gray-500">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}