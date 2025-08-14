import React from 'react';
import { UserInfo, Patient, Doctor, AppointmentData } from '../types';
// Alternative import if types are in a types folder:
// import { UserInfo, Patient, Doctor, AppointmentData } from '../types/index';

interface AppointmentFormProps {
  userInfo?: UserInfo;
  onSubmit?: (data: AppointmentData) => void;
  onCancel?: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  userInfo,
  onSubmit,
  onCancel
}) => {
  const [showForm, setShowForm] = React.useState(false);
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [formData, setFormData] = React.useState<AppointmentData>({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    isUrgent: false
  });

  // Mock user info if not provided (for testing)
  const currentUser = userInfo || {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    hospitalId: 'hospital-1'
  };

  React.useEffect(() => {
    // Fetch patients for the hospital
    const fetchPatients = async () => {
      try {
        // Replace with actual API call
        const response = await fetch(`/api/patients?hospitalId=${currentUser.hospitalId}`);
        if (response.ok) {
          const patientsData: Patient[] = await response.json();
          setPatients(patientsData);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    // Fetch doctors for the hospital
    const fetchDoctors = async () => {
      try {
        // Replace with actual API call
        const response = await fetch(`/api/doctors?hospitalId=${currentUser.hospitalId}`);
        if (response.ok) {
          const doctorsData: Doctor[] = await response.json();
          setDoctors(doctorsData);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    if (currentUser.hospitalId) {
      fetchPatients();
      fetchDoctors();
    }
  }, [currentUser.hospitalId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev: AppointmentData) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form data
    if (!formData.patientId || !formData.doctorId || !formData.appointmentDate || !formData.appointmentTime) {
      alert('Please fill in all required fields');
      return;
    }

    // Submit the form
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log('Appointment data:', formData);
    }
  };

  if (!showForm) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            Book New Appointment
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Start Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
              Patient *
            </label>
            <select
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Patient</option>
              {patients.map((patient: Patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-1">
              Doctor *
            </label>
            <select
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor: Doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-1">
              Time *
            </label>
            <select
              id="appointmentTime"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Time</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Visit
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Please describe the reason for the appointment..."
          />
        </div>

        <div className="mt-6 flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isUrgent"
              checked={formData.isUrgent}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Urgent</span>
          </label>

          <label className="flex items-center ml-6">
            <input
              type="checkbox"
              name="followUp"
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Follow-up</span>
          </label>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              if (onCancel) onCancel();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Book Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;