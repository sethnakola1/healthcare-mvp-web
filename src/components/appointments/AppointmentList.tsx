import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import axiosInstance from '../../services/axios.config';
import { 
  CalendarDaysIcon,
  PlusIcon,
  UserIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { BusinessRole } from '../../types/user.types';


interface Appointment {
  appointmentId: string;
  patientName: string;
  patientMrn: string;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDateTime: string;
  durationMinutes: number;
  status: string;
  appointmentType: string;
  chiefComplaint: string;
  isVirtual: boolean;
  meetingLink?: string;
  isEmergency: boolean;
}

const AppointmentList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('today');

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let endpoint = '';

      // Determine endpoint based on user role and filter
      const hospitalId = user?.hospitalId || localStorage.getItem('hospitalId');
      const userId = user?.userId;

      if (user?.role === BusinessRole.DOCTOR) {
        endpoint = filter === 'today' 
          ? `/appointments/doctor/${userId}/today`
          : `/appointments/doctor/${userId}`;
      } else if (user?.role === BusinessRole.PATIENT) {
        endpoint = filter === 'today'
          ? `/appointments/patient/${userId}/today`
          : `/appointments/patient/${userId}`;
      } else if (user?.role === BusinessRole.HOSPITAL_ADMIN || 
                 user?.role === BusinessRole.RECEPTIONIST) {
        endpoint = filter === 'today'
          ? `/appointments/hospital/${hospitalId}/today`
          : `/appointments/hospital/${hospitalId}`;
      } else {
        // Default to hospital appointments
        endpoint = `/appointments/hospital/${hospitalId}`;
      }

      const response = await axiosInstance.get(endpoint);

      if (response.data.success) {
        setAppointments(response.data.data || []);
      }
    } catch (error: any) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, status: string) => {
    try {
      const response = await axiosInstance.put(
        `/appointments/${appointmentId}/status`,
        null,
        { params: { status } }
      );

      if (response.data.success) {
        toast.success('Appointment status updated');
        fetchAppointments();
      }
    } catch (error) {
      toast.error('Failed to update appointment status');
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `/appointments/${appointmentId}`,
        { params: { reason: 'Cancelled by user' } }
      );

      if (response.data.success) {
        toast.success('Appointment cancelled');
        fetchAppointments();
      }
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'NO_SHOW':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#219ebc]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and track appointments</p>
        </div>
        {(user?.role === BusinessRole.HOSPITAL_ADMIN || 
          user?.role === BusinessRole.RECEPTIONIST) && (
          <button
            onClick={() => navigate('/appointments/new')}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-[#219ebc] to-[#7ADAA5] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Book Appointment
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setFilter('today')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                filter === 'today'
                  ? 'border-[#219ebc] text-[#219ebc]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                filter === 'upcoming'
                  ? 'border-[#219ebc] text-[#219ebc]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                filter === 'all'
                  ? 'border-[#219ebc] text-[#219ebc]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All
            </button>
          </nav>
        </div>

        {/* Appointments List */}
        <div className="p-6">
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => {
                const { date, time } = formatDateTime(appointment.appointmentDateTime);
                return (
                  <div
                    key={appointment.appointmentId}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{date}</p>
                            <p className="text-sm text-gray-500">{time}</p>
                          </div>
                          {appointment.isEmergency && (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Emergency
                            </span>
                          )}
                          {appointment.isVirtual && (
                            <VideoCameraIcon className="h-5 w-5 text-blue-500" title="Virtual Appointment" />
                          )}
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {appointment.patientName}
                              </p>
                              <p className="text-xs text-gray-500">MRN: {appointment.patientMrn}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Dr. {appointment.doctorName}
                              </p>
                              <p className="text-xs text-gray-500">{appointment.doctorSpecialization}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Type:</span> {appointment.appointmentType}
                          </p>
                          {appointment.chiefComplaint && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Complaint:</span> {appointment.chiefComplaint}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="ml-4 flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>

                        {appointment.status === 'SCHEDULED' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(appointment.appointmentId, 'CONFIRMED')}
                              className="text-green-600 hover:text-green-800"
                              title="Confirm"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(appointment.appointmentId)}
                              className="text-red-600 hover:text-red-800"
                              title="Cancel"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </div>
                        )}

                        {appointment.isVirtual && appointment.meetingLink && appointment.status === 'CONFIRMED' && (
                          <a
                            href={appointment.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Join Meeting
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'today' 
                  ? 'No appointments scheduled for today' 
                  : 'No appointments found'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;