import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  AlertCircle,
  ArrowLeft,
  Loader,
  UserPlus,
  Users,
  Activity,
  Droplet,
  FileText,
  Shield,
  Check
} from 'lucide-react';

// Mock types for demo
enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

interface CreatePatientRequest {
  hospitalId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  gender?: Gender;
  bloodGroup?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  initialSymptoms?: string;
  allergies?: string;
  currentMedications?: string;
  chronicConditions?: string;
  ssnLast4?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const PatientRegistrationForm = ({ hospitalId = 'mock-hospital-id' }: { hospitalId?: string }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreatePatientRequest>({
    hospitalId,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    address: '',
    gender: undefined,
    bloodGroup: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    initialSymptoms: '',
    allergies: '',
    currentMedications: '',
    chronicConditions: '',
    ssnLast4: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const relationships = [
    'Parent', 'Spouse', 'Child', 'Sibling', 'Grandparent', 
    'Guardian', 'Friend', 'Other'
  ];

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Basic patient details' },
    { number: 2, title: 'Contact Info', description: 'Address and contact' },
    { number: 3, title: 'Emergency Contact', description: 'Emergency contact person' },
    { number: 4, title: 'Medical Info', description: 'Medical history and conditions' },
    { number: 5, title: 'Review', description: 'Review and submit' }
  ];

  // Validation functions
  const validateField = (name: string, value: string | undefined): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value || !value.trim()) return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        if (value.length < 2) return `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Only letters, spaces, hyphens and apostrophes allowed';
        return '';
      
      case 'dateOfBirth':
        if (!value) return 'Date of birth is required';
        const birthDate = new Date(value);
        const today = new Date();
        if (birthDate > today) return 'Date of birth cannot be in the future';
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age > 150) return 'Please enter a valid date of birth';
        return '';
      
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'phoneNumber':
        if (value && !/^\+?[1-9]\d{1,14}$/.test(value)) return 'Please enter a valid phone number';
        return '';
      
      case 'emergencyContactPhone':
        if (value && !/^\+?[1-9]\d{1,14}$/.test(value)) return 'Please enter a valid phone number';
        return '';
      
      case 'ssnLast4':
        if (value && !/^\d{4}$/.test(value)) return 'SSN last 4 digits must be exactly 4 numbers';
        return '';
      
      default:
        return '';
    }
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: ValidationErrors = {};
    
    switch (step) {
      case 1:
        ['firstName', 'lastName', 'dateOfBirth'].forEach(field => {
          const error = validateField(field, formData[field as keyof CreatePatientRequest]);
          if (error) stepErrors[field] = error;
        });
        break;
      
      case 2:
        ['email', 'phoneNumber'].forEach(field => {
          const error = validateField(field, formData[field as keyof CreatePatientRequest]);
          if (error) stepErrors[field] = error;
        });
        break;
      
      case 3:
        // Emergency contact validation - if any field is filled, validate all required fields
        const hasEmergencyInfo = formData.emergencyContactName || formData.emergencyContactPhone || formData.emergencyContactRelationship;
        if (hasEmergencyInfo) {
          if (!formData.emergencyContactName) stepErrors.emergencyContactName = 'Emergency contact name is required';
          if (!formData.emergencyContactPhone) {
            stepErrors.emergencyContactPhone = 'Emergency contact phone is required';
          } else {
            const phoneError = validateField('emergencyContactPhone', formData.emergencyContactPhone);
            if (phoneError) stepErrors.emergencyContactPhone = phoneError;
          }
          if (!formData.emergencyContactRelationship) stepErrors.emergencyContactRelationship = 'Emergency contact relationship is required';
        }
        break;
      
      case 4:
        // Medical info validation (optional but validate format if provided)
        if (formData.ssnLast4) {
          const ssnError = validateField('ssnLast4', formData.ssnLast4);
          if (ssnError) stepErrors.ssnLast4 = ssnError;
        }
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof CreatePatientRequest]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(5, prev + 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Creating patient:', formData);
      setSubmitSuccess(true);
      
    } catch (error) {
      setErrors({ submit: 'Failed to register patient. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (submitSuccess) {
    const age = calculateAge(formData.dateOfBirth);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Registered Successfully!</h2>
          <p className="text-gray-600 mb-6">
            {formData.firstName} {formData.lastName} has been registered in the system.
          </p>
          <div className="space-y-2 text-sm text-gray-500 text-left bg-gray-50 rounded-lg p-4">
            <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
            <p><strong>Age:</strong> {age} years</p>
            <p><strong>Gender:</strong> {formData.gender || 'Not specified'}</p>
            <p><strong>Blood Group:</strong> {formData.bloodGroup || 'Not specified'}</p>
            {formData.email && <p><strong>Email:</strong> {formData.email}</p>}
            {formData.phoneNumber && <p><strong>Phone:</strong> {formData.phoneNumber}</p>}
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              
              {/* First & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      onBlur={() => handleBlur('firstName')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter first name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      onBlur={() => handleBlur('lastName')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter last name"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    onBlur={() => handleBlur('dateOfBirth')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.dateOfBirth}
                  </p>
                )}
                {formData.dateOfBirth && !errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-gray-500">
                    Age: {calculateAge(formData.dateOfBirth)} years
                  </p>
                )}
              </div>

              {/* Gender & Blood Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value={Gender.MALE}>Male</option>
                    <option value={Gender.FEMALE}>Female</option>
                    <option value={Gender.OTHER}>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <div className="relative">
                    <Droplet className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.bloodGroup || ''}
                      onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              
              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="patient@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      onBlur={() => handleBlur('phoneNumber')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter complete address"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact Information</h3>
              <p className="text-sm text-gray-600 mb-6">
                Please provide emergency contact details. This information will be used only in case of emergency.
              </p>
              
              {/* Emergency Contact Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Name
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    onBlur={() => handleBlur('emergencyContactName')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.emergencyContactName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter emergency contact name"
                  />
                </div>
                {errors.emergencyContactName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.emergencyContactName}
                  </p>
                )}
              </div>

              {/* Emergency Contact Phone & Relationship */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                      onBlur={() => handleBlur('emergencyContactPhone')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.emergencyContactPhone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  {errors.emergencyContactPhone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.emergencyContactPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship
                  </label>
                  <select
                    value={formData.emergencyContactRelationship}
                    onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.emergencyContactRelationship ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Relationship</option>
                    {relationships.map(rel => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                  {errors.emergencyContactRelationship && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.emergencyContactRelationship}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
              <p className="text-sm text-gray-600 mb-6">
                Please provide any relevant medical information. All fields are optional but will help with better care.
              </p>
              
              {/* Initial Symptoms */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Symptoms / Chief Complaint
                </label>
                <div className="relative">
                  <Activity className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.initialSymptoms}
                    onChange={(e) => handleInputChange('initialSymptoms', e.target.value)}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe current symptoms or reason for visit..."
                  />
                </div>
              </div>

              {/* Allergies */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Known Allergies
                </label>
                <div className="relative">
                  <AlertCircle className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    rows={2}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List any known allergies (food, drug, environmental)..."
                  />
                </div>
              </div>

              {/* Current Medications */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Medications
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.currentMedications}
                    onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                    rows={2}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List current medications and dosages..."
                  />
                </div>
              </div>

              {/* Chronic Conditions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chronic Conditions / Medical History
                </label>
                <div className="relative">
                  <Heart className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.chronicConditions}
                    onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List any chronic conditions, past surgeries, or significant medical history..."
                  />
                </div>
              </div>

              {/* SSN Last 4 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SSN Last 4 Digits (Optional)
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.ssnLast4}
                    onChange={(e) => handleInputChange('ssnLast4', e.target.value)}
                    onBlur={() => handleBlur('ssnLast4')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.ssnLast4 ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="****"
                    maxLength={4}
                  />
                </div>
                {errors.ssnLast4 && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.ssnLast4}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  For identity verification purposes only
                </p>
              </div>
            </div>
          </div>
        );

      case 5:
        const age = calculateAge(formData.dateOfBirth);
        
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review Patient Information</h3>
              
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-600">Name:</span> <span className="font-medium">{formData.firstName} {formData.lastName}</span></div>
                    <div><span className="text-gray-600">Age:</span> <span className="font-medium">{age} years</span></div>
                    <div><span className="text-gray-600">Date of Birth:</span> <span className="font-medium">{formData.dateOfBirth}</span></div>
                    <div><span className="text-gray-600">Gender:</span> <span className="font-medium">{formData.gender || 'Not specified'}</span></div>
                    <div><span className="text-gray-600">Blood Group:</span> <span className="font-medium">{formData.bloodGroup || 'Not specified'}</span></div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Information
                  </h4>
                  <div className="text-sm space-y-1">
                    {formData.email && <div><span className="text-gray-600">Email:</span> <span className="font-medium">{formData.email}</span></div>}
                    {formData.phoneNumber && <div><span className="text-gray-600">Phone:</span> <span className="font-medium">{formData.phoneNumber}</span></div>}
                    {formData.address && <div><span className="text-gray-600">Address:</span> <span className="font-medium">{formData.address}</span></div>}
                  </div>
                </div>

                {/* Emergency Contact */}
                {formData.emergencyContactName && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Emergency Contact
                    </h4>
                    <div className="text-sm space-y-1">
                      <div><span className="text-gray-600">Name:</span> <span className="font-medium">{formData.emergencyContactName}</span></div>
                      {formData.emergencyContactPhone && <div><span className="text-gray-600">Phone:</span> <span className="font-medium">{formData.emergencyContactPhone}</span></div>}
                      {formData.emergencyContactRelationship && <div><span className="text-gray-600">Relationship:</span> <span className="font-medium">{formData.emergencyContactRelationship}</span></div>}
                    </div>
                  </div>
                )}

                {/* Medical Information */}
                {(formData.initialSymptoms || formData.allergies || formData.currentMedications || formData.chronicConditions) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Medical Information
                    </h4>
                    <div className="text-sm space-y-2">
                      {formData.initialSymptoms && (
                        <div>
                          <span className="text-gray-600">Initial Symptoms:</span>
                          <p className="font-medium mt-1">{formData.initialSymptoms}</p>
                        </div>
                      )}
                      {formData.allergies && (
                        <div>
                          <span className="text-gray-600">Allergies:</span>
                          <p className="font-medium mt-1">{formData.allergies}</p>
                        </div>
                      )}
                      {formData.currentMedications && (
                        <div>
                          <span className="text-gray-600">Current Medications:</span>
                          <p className="font-medium mt-1">{formData.currentMedications}</p>
                        </div>
                      )}
                      {formData.chronicConditions && (
                        <div>
                          <span className="text-gray-600">Medical History:</span>
                          <p className="font-medium mt-1">{formData.chronicConditions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Consent */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Patient Consent</p>
                    <p className="text-blue-700">
                      I consent to the collection and use of this medical information for treatment purposes. I understand that this information will be kept confidential and used only for medical care.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Patient Registration</h1>
                <p className="text-sm text-gray-500">Register new patient in the system</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-8 py-6">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="px-8 py-6 bg-gray-50 rounded-b-xl border-t">
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentStep < 5 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Registering Patient...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Register Patient
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistrationForm;