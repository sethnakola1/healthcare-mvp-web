import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import axiosInstance from '../../services/axios.config';
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  EyeIcon,
  PencilIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Patient {
  patientId: string;
  globalPatientId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  bloodGroup: string;
  isActive: boolean;
}

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchPatients();
  }, [currentPage, searchTerm]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const hospitalId = user?.hospitalId || localStorage.getItem('hospitalId');
      
      if (!hospitalId) {
        toast.error('Hospital ID not found');
        return;
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: '10',
        ...(searchTerm && { search: searchTerm })
      });

      const response = await axiosInstance.get(
        `/patients/hospital/${hospitalId}?${params}`
      );

      if (response.data.success) {
        const data = response.data.data;
        setPatients(data.content || []);
        setTotalPages(data.totalPages || 0);
      }
    } catch (error: any) {
      console.error('Failed to fetch patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchPatients();
  };

  const handleAddPatient = () => {
    navigate('/patients/new');
  };

  const handleViewPatient = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  const handleEditPatient = (patientId: string) => {
    navigate(`/patients/${patientId}/edit`);
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading && patients.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-600 mt-1">Manage patient records and information</p>
        </div>
        <button
          onClick={handleAddPatient}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-[#219ebc] to-[#7ADAA5] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or MRN..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219ebc] focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#219ebc] text-white rounded-lg hover:bg-[#023047] transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MRN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age/Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.patientId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#219ebc] to-[#7ADAA5] flex items-center justify-center text-white font-semibold">
                          {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {patient.globalPatientId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.mrn}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {calculateAge(patient.dateOfBirth)} yrs / {patient.gender}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.email || '-'}</div>
                    <div className="text-sm text-gray-500">{patient.phoneNumber || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {patient.bloodGroup || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {patient.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewPatient(patient.patientId)}
                        className="text-[#219ebc] hover:text-[#023047]"
                        title="View"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditPatient(patient.patientId)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {patients.length === 0 && !loading && (
          <div className="text-center py-12">
            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding a new patient'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={handleAddPatient}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#219ebc] hover:bg-[#023047]"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Patient
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage + 1}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;