import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import axiosInstance from '../../services/axios.config';
import {
  CalendarIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const HospitalAdminDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get('/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#219ebc]"></div>
      </div>
    );
  }

  const todaysAppointments = dashboardData.appointments || [];
  const recentBills = dashboardData.bills || [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#219ebc] to-[#7ADAA5] rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Hospital Administrator Dashboard</h1>
        <p className="mt-2">{user?.hospitalName || 'Healthcare Facility'}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{todaysAppointments.length}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-[#219ebc]" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Patients</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <ClipboardDocumentListIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Bills</p>
              <p className="text-2xl font-bold text-gray-900">{recentBills.length}</p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h2>
        {todaysAppointments.length > 0 ? (
          <div className="space-y-3">
            {todaysAppointments.slice(0, 5).map((appointment: any, index: number) => (
              <div key={index} className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">{appointment.patientName}</p>
                  <p className="text-sm text-gray-500">
                    Dr. {appointment.doctorName} - {appointment.appointmentType}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(appointment.appointmentDateTime).toLocaleTimeString()}
                  </p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    appointment.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No appointments scheduled for today</p>
        )}
      </div>
    </div>
  );
};

export default HospitalAdminDashboard;