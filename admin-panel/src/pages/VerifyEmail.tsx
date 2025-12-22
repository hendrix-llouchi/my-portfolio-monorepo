import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../lib/api';

export default function VerifyEmail() {
  const { id, hash } = useParams<{ id: string; hash: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!id || !hash) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const verified = urlParams.get('verified');
      const error = urlParams.get('error');

      if (verified === '1') {
        setStatus('success');
        setMessage('Email verified successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        return;
      }

      if (error) {
        setStatus('error');
        setMessage(decodeURIComponent(error));
        return;
      }

      try {
        const response = await api.get(`/email/verify/${id}/${hash}`);
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Failed to verify email. The link may be invalid or expired.');
      }
    };

    verifyEmail();
  }, [id, hash, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-y-auto py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-white mb-2">Verifying Email</h2>
              <p className="text-gray-300">Please wait...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
              <p className="text-gray-300 mb-4">{message}</p>
              <p className="text-sm text-gray-400">Redirecting to login...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
              <p className="text-gray-300 mb-6">{message}</p>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold"
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

