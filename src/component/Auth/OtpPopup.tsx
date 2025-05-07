import { ReactNode, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import api from '../../utils/api';
import customToast from '@/utils/toast';

interface OtpPopupProps {
  email: string;
  onClose: () => void;
  type: string;
  onSuccess?: () => void; // Optional success callback
 
}

export default function OtpPopup({ email, onClose, type, onSuccess }: OtpPopupProps) {
  const [otp, setOtp] = useState('');
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');


  const handleVerify = async () => {
    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const res = await api.post('/verify-otp', { email, otp });

      if (res.data.success) {
        customToast('OTP Verify successful', 'success');
        onSuccess?.(); // Call success callback if provided
        // Close popup on success
      } else {
        setError(res.data.message || 'Invalid OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setVerifying(false);
    }
  };


  const reSendOtp = async (email: string, type: string) => {
    try {
      const { data } = await api.post('/resend-otp', { email, type });
      if (data.success) {
        setResending(false)
        customToast('OTP resent to your email', 'success');
      }
    } catch (error: any) {
      console.error('OTP resend error:', error);
      setResending(false)
      customToast(error.response?.data?.message || 'Failed to resend OTP', 'error');
    }
  };
  const handleResend = async () => {

    setResending(true);
    await reSendOtp(email, type);

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-xl p-6 w-80 max-w-[90vw] shadow-2xl border border-gray-200">
        {/* Cancel Icon */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close OTP popup"
        >
          <IoMdClose size={20} />
        </button>

        <h3 className="text-lg font-semibold mb-2 text-gray-900">Enter OTP</h3>
        <p className="text-sm text-gray-500 mb-4">
          Sent to: <span className="font-medium">{email}</span>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); // Only allow numbers, max 6 digits
            setError('');
          }}

          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-center text-lg tracking-widest"
          placeholder="------"
          maxLength={6}
          autoFocus
        />

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <div className="flex justify-between items-center gap-2">
          <button
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            onClick={onClose}
            disabled={verifying || resending}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            onClick={handleVerify}
            disabled={verifying || resending || otp.length < 6}
          >
            {verifying ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        {/* Resend OTP */}
        <div className="mt-4 text-center">
          <button
            className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? 'Sending...' : "Didn't receive code? Resend"}
          </button>
        </div>
      </div>
    </div>
  );
}