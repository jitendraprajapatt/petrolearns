import { Notification } from './Notification';
import { useState } from 'react';

interface NotificationCardProps {
  data: Notification;
  remarkText: string;
  setRemarkText: (text: string) => void;
  onRemark: () => void;
  onDelete: () => void;
  loading?: boolean;
}

export default function NotificationCard({
  data,
  remarkText,
  setRemarkText,
  onRemark,
  onDelete,
  loading = false,
}: NotificationCardProps) {
  const [isRemarking, setIsRemarking] = useState(false);

  const handleRemark = async () => {
    setIsRemarking(true);
    await onRemark();
    setIsRemarking(false);
  };

  return (
    <div className="bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-lg p-4 transition-all duration-200 text-sm">
      <div className="flex justify-between items-start gap-3 mb-2">
        <div>
          <p className="font-medium text-gray-800">{data.name}</p>
          <p className="text-gray-500">{data.email}</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 capitalize">
          {data.type}
        </span>
      </div>

      {data.type === 'general' ? (
        <p className="text-gray-700 mb-3 whitespace-pre-wrap">
          {data.message || 'No message provided.'}
        </p>
      ) : (
        <div className="text-gray-700 mb-3 space-y-1">
          <p>
            <span className="font-medium">Subject Name:</span>{' '}
            {data.subjectName || 'N/A'}
          </p>
          <p>
            <span className="font-medium">Reason:</span>{' '}
            {data.reason || 'N/A'}
          </p>
        </div>
      )}

      {data.actionRequired !== false && (
        <div className="space-y-2 mb-3">
          <textarea
            placeholder="Write your remark..."
            id={`remark-${data._id}`}
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-blue-400 focus:ring-2 focus:outline-none resize-none"
            rows={2}
          />
          <button
            onClick={handleRemark}
            disabled={loading || isRemarking || !remarkText.trim()}
            className={`w-fit px-3 py-1.5 text-xs rounded-md font-medium transition 
              ${loading || isRemarking || !remarkText.trim()
                ? 'bg-green-300 cursor-not-allowed text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'}`}
          >
            {isRemarking ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onDelete}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
