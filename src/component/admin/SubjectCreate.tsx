import { useState, useEffect } from 'react';
import customToast from '@/utils/toast';
import api from '@/utils/api';

interface Domain {
  _id: string;
  domain: string;
}

interface Props {
  onCreated: () => void;
}

export default function CreateSubjectForm({ onCreated }: Props) {
  const [form, setForm] = useState({
    name: '',
    imageUrl: '',
    imageFile: null as File | null,
    description: '',
    domain: '',
    subdomain: '',
  });

  const [domainList, setDomainList] = useState<Domain[]>([]);
  const [subdomainList, setSubdomainList] = useState<Domain[]>([]);
  const [customDomain, setCustomDomain] = useState('');
  const [customSubdomain, setCustomSubdomain] = useState('');

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await api.get('/domains'); // Expects { domains: Domain[] }
        console.log(res)
        setDomainList(res.data.domains);
      } catch (err) {
        customToast('Failed to fetch domains', 'error');
      }
    };

    fetchDomains();
  }, []);

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setForm({ ...form, domain: value, subdomain: '' });

    if (value !== 'Other') {
      api
        .get(`/subdomains?domain=${value}`) // Expects { subdomains: Domain[] }
        .then((res) => {
          setSubdomainList(res.data.subdomains);
        })
        .catch(() => {
          customToast('Failed to fetch subdomains', 'error');
        });
    } else {
      setSubdomainList([]);
    }

    setCustomDomain('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.imageFile && form.imageFile.size > 500 * 1024) {
      customToast('Image must be under 500KB', 'error');
      return;
    }

    const finalDomain = form.domain === 'Other' ? customDomain : form.domain;
    const finalSubdomain = form.subdomain === 'Other' ? customSubdomain : form.subdomain;

    if (!finalDomain) {
      customToast('Please provide a domain', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('domain', finalDomain);
    formData.append('subdomain', finalSubdomain);

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

      setForm({
        name: '',
        imageUrl: '',
        imageFile: null,
        description: '',
        domain: '',
        subdomain: '',
      });
      setCustomDomain('');
      setCustomSubdomain('');
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

      {/* Name */}
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

      {/* Domain */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
        <select
          value={form.domain}
          onChange={handleDomainChange}
          className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        >
          <option value="">Select Domain</option>
          {domainList.map((d) => (
            <option  key={d._id} value={d.domain}>
              {d.domain}
            </option>
          ))}
          <option value="Other">Other</option>
        </select>
        {form.domain === 'Other' && (
          <input
            type="text"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="Enter custom domain"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        )}
      </div>

      {/* Subdomain */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain</label>
        <select
          value={form.subdomain}
          onChange={(e) => {
            setForm({ ...form, subdomain: e.target.value });
            setCustomSubdomain('');
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Select Subdomain</option>
          {subdomainList.map((s:any ,idx:any) => (
            <option key={idx} value={s}>
              {s}
            </option>
          ))}
          <option value="Other">Other</option>
        </select>
        {form.subdomain === 'Other' && (
          <input
            type="text"
            value={customSubdomain}
            onChange={(e) => setCustomSubdomain(e.target.value)}
            placeholder="Enter custom subdomain"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image Upload (Max 500KB)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
          className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
        />
      </div>

      {/* Image URL */}
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

      {/* Description */}
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
