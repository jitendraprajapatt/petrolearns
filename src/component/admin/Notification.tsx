'use client';

import { useEffect, useState } from 'react';
import { customToast } from '@/utils/toast';
import NotificationCard from './NotificationCard';
import api from '@/utils/api';

export interface Notification {
  subjectName: string;
  reason: string;
  actionRequired: boolean;
  _id: string;
  name: string;
  email: string;
  type: string;
  message: string;
}

export default function NotificationModule() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [remarkTexts, setRemarkTexts] = useState<{ [key: string]: string }>({});

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications', { withCredentials: true });
      const data = res.data.notifications;
      setNotifications(data);

      // Initialize remarkText for each notification
      const remarkInit: { [key: string]: string } = {};
      data.forEach((n: Notification) => {
        remarkInit[n._id] = '';
      });
      setRemarkTexts(remarkInit);
    } catch {
      customToast('Failed to fetch notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}/delete`);
      customToast('Notification deleted', 'success');
      fetchNotifications();
    } catch {
      customToast('Delete failed', 'error');
    }
  };

  const handleRemarkSubmit = async (id: string) => {
    const remarkText = remarkTexts[id];
    if (!remarkText.trim()) return;

    try {
      await api.post(`/notifications/${id}/remark`, { remarkText });
      customToast('Remark submitted', 'success');
      setRemarkTexts((prev) => ({ ...prev, [id]: '' }));
      fetchNotifications();
    } catch {
      customToast('Remark failed', 'error');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

 return (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Notifications</h2>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <div className="flex flex-wrap gap-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n._id} className="w-full sm:w-[48%] lg:w-[31%]">
              <NotificationCard
                data={n}
                remarkText={remarkTexts[n._id] || ''}
                setRemarkText={(text) =>
                  setRemarkTexts((prev) => ({ ...prev, [n._id]: text }))
                }
                onRemark={() => handleRemarkSubmit(n._id)}
                onDelete={() => handleDelete(n._id)}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-6">No notifications found.</p>
        )}
      </div>
    )}
  </div>
);

}
