import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import authService from '../../services/auth.service';
import toast from 'react-hot-toast';

const MFAVerification: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && value) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        handleSubmit(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (mfaCode: string) => {
    setLoading(true);
    try {
      const response = await authService.verifyMFA(mfaCode);
      toast.success('MFA verification successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid verification code');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#bde0fe] to-[#219ebc]">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#023047] mb-6 text-center">
          Two-Factor Authentication
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Enter the 6-digit code from your authenticator app
        </p>

        <div className="flex justify-center space-x-2 mb-8">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-[#219ebc] focus:outline-none"
              disabled={loading}
            />
          ))}
        </div>

        <button
          onClick={() => handleSubmit(code.join(''))}
          disabled={loading || code.join('').length !== 6}
          className="w-full py-3 bg-gradient-to-r from-[#219ebc] to-[#7ADAA5] text-white rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        <button
          onClick={() => navigate('/login')}
          className="w-full mt-4 text-[#219ebc] hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default MFAVerification;