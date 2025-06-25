'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import TopicForm from '@/component/createTopic/TopicForm';

export default function CreateNewTopic() {
  const router = useRouter();
  const { isLoggedIn, role } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        router.replace('/login');
      } else if (role !== 'Volunteer') {
        router.replace('/unauthorized');
      } else {
        setChecking(false); // Done checking
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [isLoggedIn, role, router]);

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 text-lg">
        Checking access...
      </div>
    );
  }

  return (

    <TopicForm />

  );
}
