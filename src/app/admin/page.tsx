'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserManagement from '@/component/admin/UserManagement';
import TopicManagement from '@/component/admin/TopicManagement';
import SubjectManagement from '@/component/admin/SubjectManagement';
import Settings from '@/component/admin/Settings';
import Sidebar from '@/component/admin/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import Notification from '@/component/admin/Notification';


export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState('user');
  const { isLoggedIn, role } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn === undefined || role === undefined) return;

      if (!isLoggedIn) {
        router.replace('/login');
      } else if (role !== 'Admin') {
        console.log(role);
        router.replace('/unauthorized');
      } else {
        console.log(role);
        setLoading(false); // Access granted, stop loading
      }
    }, 500); // Delay for 500ms

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [isLoggedIn, role, router]);

  const renderModule = () => {
    switch (selected) {
      case 'user':
        return <UserManagement />;
      case 'topics':
        return <TopicManagement />;
      case 'create':
        return <SubjectManagement />;
      case 'settings':
        return <Settings />;
       case 'notification':
        return <Notification/>;
      default:
        return <UserManagement />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 text-lg">
        Checking admin access...
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar selected={selected} setSelected={setSelected} />
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">{renderModule()}</main>
    </div>
  );
}
