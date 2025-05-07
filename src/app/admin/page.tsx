'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaLessThanEqual } from 'react-icons/fa';
import api from '@/utils/api';
import UserManagement from '@/component/admin/UserManagement';
import TopicManagement from '@/component/admin/TopicManagement';
import SubjectManagement from '@/component/admin/SubjectManagement';
import Settings from '@/component/admin/Settings';
import Sidebar from '@/component/admin/Sidebar';

export default function AdminPage() {
  const router = useRouter();
  const [loading , setLoading] = useState(true) ;
  const [selected, setSelected] = useState("user");

  const renderModule = () => {
    switch (selected) {
      case "user":
        return <UserManagement />;
      case "topics":
        return <TopicManagement />;
      case "create":
        return <SubjectManagement />;
      case "settings":
        return <Settings />;
      default:
        return <UserManagement />;
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/user/check-auth', {
          withCredentials: true,
        });

        if (res.data.role !== 'Admin') {
          // Not an admin -> go to login
          setLoading(false)
          router.replace('/login');
        }
      } catch (err) {
        // Not logged in -> go to login
        setLoading(false)
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);
if(loading){
    return (
      <div className="flex h-screen">
      <Sidebar selected={selected} setSelected={setSelected} />
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">{renderModule()}</main>
    </div>
      );
}else{
    return (
        <div>
         loading...
        </div>
      );
}
  
}
