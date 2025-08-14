import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axios.config';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await axiosInstance.get(`/patients/${id}`);
      if (response.data.success) {
        setPatient(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load patient details');
      navigate('/patients');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading patient details..." />;
  if (!patient) return <div>Patient not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/patients')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Patient Details</h1>
        </div>
        <button
          onClick={() => navigate(`/patients/${id}/edit`)}
          className="px-4 py-2 bg-[#219ebc] text-white rounded-lg hover:bg-[#023047]"
        >
          Edit Patient
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
            <p className="mt-1 text-lg text-gray-900">{patient.firstName} {patient.lastName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">MRN</h3>
            <p className="mt-1 text-lg text-gray-900">{patient.mrn}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
            <p className="mt-1 text-lg text-gray-900">{patient.dateOfBirth}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Gender</h3>
            <p className="mt-1 text-lg text-gray-900">{patient.gender}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1 text-lg text-gray-900">{patient.email || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
            <p className="mt-1 text-lg text-gray-900">{patient.phoneNumber || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Blood Group</h3>
            <p className="mt-1 text-lg text-gray-900">{patient.bloodGroup || 'Unknown'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              patient.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {patient.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {patient.allergies && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500">Allergies</h3>
            <p className="mt-1 text-gray-900">{patient.allergies}</p>
          </div>
        )}

        {patient.chronicConditions && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500">Chronic Conditions</h3>
            <p className="mt-1 text-gray-900">{patient.chronicConditions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;