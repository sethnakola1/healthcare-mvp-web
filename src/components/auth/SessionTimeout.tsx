import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import toast from 'react-hot-toast';

interface SessionTimeoutProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
}

const SessionTimeout: React.FC<SessionTimeoutProps> = ({ 
  timeoutMinutes = 15, 
  warningMinutes = 2 
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(timeoutMinutes * 60);

  useEffect(() => {
    let activityTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout; // Changed from NodeJS.Interval to NodeJS.Timeout

    const resetTimers = () => {
      clearTimeout(activityTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
      setShowWarning(false);
      setRemainingTime(timeoutMinutes * 60);

      warningTimer = setTimeout(() => {
        setShowWarning(true);
        let timeLeft = warningMinutes * 60;
        
        countdownInterval = setInterval(() => {
          timeLeft -= 1;
          setRemainingTime(timeLeft);
          
          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            handleTimeout();
          }
        }, 1000) as unknown as NodeJS.Timeout;
      }, (timeoutMinutes - warningMinutes) * 60 * 1000);

      activityTimer = setTimeout(() => {
        handleTimeout();
      }, timeoutMinutes * 60 * 1000);
    };

    const handleTimeout = () => {
      dispatch(logout() as any);
      toast.error('Session expired. Please login again.');
      navigate('/login');
    };

    const handleActivity = () => {
      resetTimers();
    };

    // Set up event listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Initialize timers
    resetTimers();

    // Cleanup
    return () => {
      clearTimeout(activityTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [dispatch, navigate, timeoutMinutes, warningMinutes]);

  const handleExtendSession = () => {
    setShowWarning(false);
    window.dispatchEvent(new Event('mousemove'));
  };

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/login');
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Session Expiring</h3>
        <p className="text-sm text-gray-600 mb-4">
          Your session will expire in {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')} minutes.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={handleExtendSession}
            className="flex-1 py-2 bg-[#219ebc] text-white rounded-lg hover:bg-[#023047]"
          >
            Continue Session
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeout;