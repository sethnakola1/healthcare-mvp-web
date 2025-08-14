import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import toast from 'react-hot-toast';
import { validateEmail } from '../../utils/validators';

const RequestPasswordReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error('Invalid email format');
      return;
    }
    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      toast.success('Password reset link sent to your email');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 text-primary hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default RequestPasswordReset;