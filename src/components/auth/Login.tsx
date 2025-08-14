import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../../services/auth.service';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login: React.FC = () => {
  console.log("🔑 Login component rendering...");

  const [email, setEmail] = useState('sethnakola@healthhorizon.com'); // Pre-filled for testing
  const [password, setPassword] = useState('SuperAdmin123!'); // Pre-filled for testing
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("🚀 Login form submitted...");
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      console.log("📤 Dispatching login action...");
      const result = await dispatch(login({ email, password })).unwrap();
      
      console.log("✅ Login successful!", result);
      toast.success(`Welcome back, ${result.firstName}!`);

      // Get dashboard route based on user role
      const dashboardRoute = authService.getDashboardRoute(result.role);
      console.log("🏠 Navigating to dashboard:", dashboardRoute);
      navigate(dashboardRoute);

    } catch (error) {
      console.log("❌ Login failed:", error);
      toast.error(error as string);
    } finally {
      setLoading(false);
    }
  };

  // Quick login buttons for testing different roles
  const quickLogin = async (userType: string) => {
    setLoading(true);
    try {
      let testEmail = '';
      let testPassword = 'SuperAdmin123!';

      switch (userType) {
        case 'superadmin':
          testEmail = 'sethnakola@healthhorizon.com';
          break;
        case 'techadvisor':
          testEmail = 'advisor@healthhorizon.com';
          break;
        case 'hospitaladmin':
          testEmail = 'admin@hospital.com';
          break;
        case 'doctor':
          testEmail = 'doctor@hospital.com';
          break;
        default:
          testEmail = 'sethnakola@healthhorizon.com';
      }

      setEmail(testEmail);
      setPassword(testPassword);

      const result = await dispatch(login({ email: testEmail, password: testPassword })).unwrap();
      toast.success(`Welcome back, ${result.firstName}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Quick login failed. Please try manual login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#bde0fe] to-[#219ebc]">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#219ebc] to-[#7ADAA5] rounded-xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#023047]">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your HealthHorizon account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219ebc] focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219ebc] focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-6 w-6" />
                ) : (
                  <EyeIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-[#219ebc] focus:ring-[#219ebc] border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-[#219ebc] hover:text-[#023047] font-medium"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#219ebc] to-[#7ADAA5] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Quick Login Buttons for Testing */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-4">Quick Login for Testing:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => quickLogin('superadmin')}
              disabled={loading}
              className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
            >
              Super Admin
            </button>
            <button
              onClick={() => quickLogin('techadvisor')}
              disabled={loading}
              className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
            >
              Tech Advisor
            </button>
            <button
              onClick={() => quickLogin('hospitaladmin')}
              disabled={loading}
              className="px-3 py-2 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50"
            >
              Hospital Admin
            </button>
            <button
              onClick={() => quickLogin('doctor')}
              disabled={loading}
              className="px-3 py-2 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
            >
              Doctor
            </button>
          </div>
        </div>

        {/* Debug Note */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Test Credentials:</strong><br />
            Email: sethnakola@healthhorizon.com<br />
            Password: SuperAdmin123!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;