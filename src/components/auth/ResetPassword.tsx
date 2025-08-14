import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/auth.service';
import toast from 'react-hot-toast';
import { validatePassword } from '../../utils/validators';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.errors[0]);
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      toast.success('Password reset successful');
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
        <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;