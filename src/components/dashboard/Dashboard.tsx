import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store'; // Ensure this matches your store configuration
import { clearUser } from '../../store/userSlice';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth); // Changed from state.user to state.auth
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await axios.post('/auth/logout');

      // Clear local storage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');

      // Clear axios default header
      delete axios.defaults.headers.common['Authorization'];

      // Clear Redux state
      dispatch(clearUser());

      // Navigate to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);

      // Force logout even if backend call fails
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
      dispatch(clearUser());
      navigate('/login');
    }
  };

  return (
    <div>Dashboard</div>
  );
};

export default Dashboard;