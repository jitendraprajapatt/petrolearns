import { useState } from 'react';
import axios from 'axios';
import customToast from '@/utils/toast';
import api from '@/utils/api';

export default function CreateSubjectForm({ onCreated }: any) {
    const [form, setForm] = useState({
        name: '',
        imageUrl: '',
        imageFile: null as File | null,
        description: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.imageFile && form.imageFile.size > 500 * 1024) {
            customToast('Image must be under 500KB', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);

        if (form.imageFile) {
            formData.append('image', form.imageFile);
        } else if (form.imageUrl) {
            formData.append('imageUrl', form.imageUrl);
        }

        try {
            await api.post('/create/subject', formData, {
              withCredentials: true,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
          
            setForm({ name: '', imageUrl: '', imageFile: null, description: '' });
            customToast('Subject created successfully!', 'success');
            onCreated();
          } catch (error: any) {
            const errMsg = error?.response?.data?.message || 'Failed to create subject';
            customToast(errMsg, 'error');
          }
          
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-2xl p-6 mb-6 space-y-4"
        >
            <h2 className="text-xl font-semibold text-gray-800">Create New Subject</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload (Max 500KB)</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
                    className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Or Paste Image URL</label>
                <input
                    type="text"
                    placeholder="https://example.com/image.png"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
                Create Subject
            </button>
        </form>
    );
}
