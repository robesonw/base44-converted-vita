import { createContext, FC, useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Settings', href: '/settings' },
  // additional items...
];

const Layout: FC<{ children: React.ReactNode; currentPageName: string }> = ({ children, currentPageName }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const { data: user, refetch } = useQuery('currentUser', () => base44.auth.me(), {
    retry: false,
  });

  const isActive = (pageName: string) => currentPageName === pageName;

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}> 
        <nav>
          {navigation.map((item) => (
            <Link key={item.name} to={item.href} className={`p-4 text-left ${isActive(item.name) ? 'bg-gray-200' : ''}`}>{item.name}</Link>
          ))}
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
};

export default Layout;