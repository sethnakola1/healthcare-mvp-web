import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import LoadingSpinner from './../common/LoadingSpinner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      // Parse URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
          // For now, redirect to login since we're not using AWS Amplify
        // Exchange code for tokens (handled automatically by Amplify)
//         const user = await getCurrentUser();
//         if (user) {
//           const session = await fetchAuthSession();
//           const token = session.tokens?.idToken?.toString();
//
//           if (!token) {
//             throw new Error('No token found');
//           }
//
//           // Get user attributes (simplified for now)
//           const userData = {
//             token,
//             userId: user.userId,
//             email: user.username,
//             name: user.username,
//             role: 'USER', // Will be updated from custom attributes
//             hospitalId: null,
//             hospitalName: null,
//             department: null,
//             licenseNumber: null
//           };
//
//           dispatch(setUser(userData));
//           sessionStorage.setItem('token', token);
//
//           // Navigate to appropriate dashboard
//           const dashboardRoute = getDashboardRoute(userData.role);
//           navigate(dashboardRoute);
//          }
        navigate('/login');
      } else {
        // No code, redirect to login
        navigate('/login');
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      navigate('/login');
    }
  };

//   const getDashboardRoute = (role: string) => {
//     switch (role) {
//       case 'SUPERADMIN':
//         return '/admin/dashboard';
//       case 'HOSPITALADMIN':
//         return '/hospital/dashboard';
//       case 'TECHADVISOR':
//         return '/advisor/dashboard';
//       case 'CLINICALSTAFF':
//         return '/clinical/dashboard';
//       case 'SUPPORTSTAFF':
//         return '/support/dashboard';
//       default:
//         return '/dashboard';
//     }
//   };
//
//   return <LoadingSpinner />;
        return <LoadingSpinner fullScreen />;
};

export default AuthCallback;