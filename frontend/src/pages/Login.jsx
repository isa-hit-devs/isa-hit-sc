import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { googleLogin } from '../services/api';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      if (credentialResponse.credential) {
        const data = await googleLogin(credentialResponse.credential);
        if (data.user?.role === 'admin') {
          navigate('/admin');
        } else {
          setError(`Logged in as ${data.user?.email}, but this account does not have Admin privileges.`);
        }
      }
    } catch (err) {
      console.error('Login error detail:', err);
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(serverMessage || 'Authentication failed. Please check backend environment logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    setError('Google Sign-In prompt closed or failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 px-6 py-20">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-blue-100/80 shadow-2xl rounded-3xl p-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-blue-500/30 mb-6">
            ISA
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900">
            Admin <span className="text-blue-600">Portal</span>
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in with your authorized Google account to manage articles & chapter members.
          </p>

          {!GOOGLE_CLIENT_ID && (
            <div className="mt-6 rounded-xl bg-amber-50 p-4 border border-amber-200 text-xs font-semibold text-amber-800 text-left">
              ⚠️ <code>VITE_GOOGLE_CLIENT_ID</code> environment variable is missing in <code>frontend/.env</code>.
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 border border-red-200 text-xs font-semibold text-red-600 text-left">
              {error}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            {loading ? (
              <div className="flex items-center gap-3 text-sm font-semibold text-blue-600">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                Verifying Credentials...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
                theme="filled_blue"
                shape="circle"
                text="signin_with"
              />
            )}
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <a
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
            >
              ← Back to Main Website
            </a>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
