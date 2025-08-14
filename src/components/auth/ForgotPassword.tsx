import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import toast from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setEmailSent(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#bde0fe] to-[#219ebc]">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Check your email</h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent password reset instructions to {email}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-6 w-full py-3 bg-[#219ebc] text-white rounded-lg hover:bg-[#023047]"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#bde0fe] to-[#219ebc]">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center text-[#219ebc] hover:text-[#023047] mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Login
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reset your password</h2>
        <p className="text-gray-600 mb-6">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219ebc]"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#219ebc] to-[#7ADAA5] text-white rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send reset instructions'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;