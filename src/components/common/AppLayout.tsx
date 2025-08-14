// src/components/layout/AppLayout.tsx
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAppSelector } from '../../store/hooks';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-16'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
};