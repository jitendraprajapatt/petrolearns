import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ReadOnlySlateViewer from '../Study/ReadOnlySlateViewer';
import api from '@/utils/api';
import OtpPopup from '../Auth/OtpPopup';

interface TopicCardProps {
  topicId: string;
  contentId: string;
  title: string;
  description: string;
  subject: string;
  domain: string;
  subdomain: string;
  status?: 'pending' | 'verified' | 'reported';
  onVerify: () => void;
  onReport: (remark: string) => void;
}

const getStatusStyle = (status: string | undefined) => {
  switch (status) {
    case 'verified':
      return 'bg-green-100 text-green-700';
    case 'reported':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-yellow-100 text-yellow-700';
  }
};

const TopicCard: React.FC<TopicCardProps> = ({
  contentId,
  title,
  description,
  subject,
  domain,
  subdomain,
  status = 'pending',
  onVerify,
  onReport
}) => {
  const [showViewer, setShowViewer] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [remark, setRemark] = useState('');
  const [content, setContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [verifierEmail, setVerifierEmail] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!showViewer) return;

      setLoadingContent(true);
      setError('');
      try {
        const response = await api.get(`/get/verify/topic/content/${contentId}`);
        setContent(response.data.content);
      } catch (err) {
        setError('Failed to load topic content.');
      } finally {
        setLoadingContent(false);
      }
    };

    fetchContent();
  }, [showViewer, contentId]);

  const handleOpenOtp = async () => {
    setVerifying(true);
    try {
      const res = await api.get('/get/user/email'); // Replace with actual endpoint
      setVerifierEmail(res.data.email);
      setShowViewer(false);
      setShowOtp(true);
    } catch (e) {
      console.error('Failed to fetch email:', e);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition rounded-xl border border-gray-200 p-6 w-full max-w-xl mx-auto relative">
      <span
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(status)}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>

      <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Subject:</strong> <span className="text-gray-700">{subject}</span>
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Domain:</strong> <span className="text-gray-700">{domain}</span>
      </p>
      <p className="text-sm text-gray-500 mb-4">
        <strong>Subdomain:</strong> <span className="text-gray-700">{subdomain}</span>
      </p>
      <p className="text-gray-600 mb-5">{description}</p>

      <div className="flex justify-between items-center gap-4">
        <button
          onClick={() => setShowViewer(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
        >
          View Content
        </button>
        <button
          onClick={() => setShowReport(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm"
        >
          Report
        </button>
      </div>

      {/* Viewer Modal */}
      {showViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-3xl p-6 rounded-lg relative shadow-xl max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowViewer(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Topic Content</h2>
            {loadingContent ? (
              <p className="text-gray-500">Loading content...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : content ? (
              <ReadOnlySlateViewer content={content} />
            ) : (
              <p className="text-gray-500">No content available.</p>
            )}
            <div className="mt-6 text-right">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm flex items-center justify-center min-w-[100px]"
                onClick={handleOpenOtp}
                disabled={verifying}
              >
                {verifying ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 018 8z"
                    />
                  </svg>
                ) : (
                  'Verify'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg relative shadow-xl">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowReport(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Report Issue</h2>
            <p className="text-sm text-gray-500 mb-2">
              Support Email: <span className="text-blue-600">support@petrolearn.com</span>
            </p>
            <textarea
              placeholder="Enter your remark here..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-red-500"
              rows={4}
            />
            <div className="mt-4 text-right">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                onClick={() => {
                  onReport(remark);
                  setShowReport(false);
                }}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Popup */}
      {showOtp && verifierEmail && (
        <OtpPopup
          email={verifierEmail}
          type="verify"
          onClose={() => setShowOtp(false)}
          onSuccess={() => {
            onVerify();
            setShowOtp(false);
          }}
        />
      )}
    </div>
  );
};

export default TopicCard;
