import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  ArrowLeft,
  Loader,
  UserPlus,
  Stethoscope,
  Shield,
  ClipboardCheck,
  Users,
  Activity,
  DollarSign,
  Calendar,
  Clock
} from 'lucide-react';

// Mock types for demo
enum HospitalUserRole {
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  LAB_ADMIN = 'LAB_ADMIN',
  LAB_STAFF = 'LAB_STAFF',
  PHARMACY_ADMIN = 'PHARMACY_ADMIN',
  PHARMACY_STAFF = 'PHARMACY_STAFF',
  BILLING_STAFF = 'BILLING_STAFF',
  TECHNICIAN = 'TECHNICIAN'
}

interface CreateHospitalUserRequest {
  hospitalId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phoneNumber?: string;
  userRole: HospitalUserRole;
  specialization?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  availableFrom?: string;
  availableTo?: string;
  maxPatientsPerDay?: number;
  workingDays?: number[];
  reportsTo?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const HospitalUserRegistrationForm = ({ hospitalId = 'mock-hospital-id' }: { hospitalId?: string }) => {
  const [formData, setFormData] = useState<CreateHospitalUserRequest>({
    hospitalId,
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
    userRole: HospitalUserRole.DOCTOR,
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: undefined,
    consultationFee: undefined,
    availableFrom: '09:00',
    availableTo: '17:00',
    maxPatientsPerDay: 20,
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    reportsTo: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const roleConfigs = {
    [HospitalUserRole.HOSPITAL_ADMIN]: {
      title: 'Hospital Administrator',
      description: 'Full hospital management access',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      fields: ['basic', 'contact'],
      showSchedule: false,
      showMedical: false
    },
    [HospitalUserRole.DOCTOR]: {
      title: 'Doctor',
      description: 'Medical practitioner with patient care access',
      icon: <Stethoscope className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      fields: ['basic', 'contact', 'medical', 'schedule'],
      showSchedule: true,
      showMedical: true
    },
    [HospitalUserRole.NURSE]: {
      title: 'Nurse',
      description: 'Nursing staff with patient care support',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      fields: ['basic', 'contact', 'schedule'],
      showSchedule: true,
      showMedical: false
    },
    [HospitalUserRole.RECEPTIONIST]: {
      title: 'Receptionist',
      description: 'Front desk and appointment management',
      icon: <Users className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      fields: ['basic', 'contact'],
      showSchedule: false,
      showMedical: false
    },
    [HospitalUserRole.LAB_ADMIN]: {
      title: 'Lab Administrator',
      description: 'Laboratory management and oversight',
      icon: <ClipboardCheck className="w-6 h-6" />,
      color: 'from-yellow-500 to-yellow-600',
      fields: ['basic', 'contact'],
      showSchedule: false,
      showMedical: false
    },
    [HospitalUserRole.LAB_STAFF]: {
      title: 'Lab Staff',
      description: 'Laboratory technician and testing',
      icon: <ClipboardCheck className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      fields: ['basic', 'contact'],
      showSchedule: false,
      showMedical: false
    },
    [HospitalUserRole.PHARMACY_ADMIN]: {
      title: 'Pharmacy Administrator',
      description: 'Pharmacy management and inventory',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-teal-500 to-teal-600',
      fields: ['basic', 'contact'],
      showSchedule: false,
      showMedical: false
    },
    [HospitalUserRole.PHARMACY_STAFF]: {
      title: 'Pharmacy Staff',
      description: 'Medication dispensing and support',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-cyan-500 to-cyan-600',
      fields: ['basic', 'contact'],
      showSchedule: false,
      showMedical: false
    },
    [HospitalUserRole.BILLING_STAFF]: {
      title: 'Billing Staff',
      description: 'Financial management and billing',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-indigo-500 to-indigo-600',
      fields: ['basic', 'contact'],
      showSchedule: false,
      showMedical: false
    },
    [HospitalUserRole.TECHNICIAN]: {
      title: 'Technician',
      description: 'Technical support and equipment',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-pink-500 to-pink-600',
      fields: ['basic', 'contact'],
      showSchedule: false,
      showMedical: false
    }
  };

  const specializations = [
    'Cardiology', 'Dermatology', 'Emergency Medicine', 'Endocrinology',
    'Family Medicine', 'Gastroenterology', 'General Surgery', 'Hematology',
    'Internal Medicine', 'Neurology', 'Obstetrics and Gynecology', 'Oncology',
    'Ophthalmology', 'Orthopedics', 'Otolaryngology', 'Pathology',
    'Pediatrics', 'Psychiatry', 'Pulmonology', 'Radiology', 'Urology'
  ];

  const weekDays = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 7, label: 'Sunday' }
  ];

  // Validation functions
  const validateField = (name: string, value: string | number | undefined): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value || !value.toString().trim()) return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        if (value.toString().length < 2) return `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        return '';

      case 'email':
        if (!value || !value.toString().trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString())) return 'Please enter a valid email address';
        return '';

      case 'username':
        if (!value || !value.toString().trim()) return 'Username is required';
        if (value.toString().length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9._-]+$/.test(value.toString())) return 'Username can only contain letters, numbers, dots, underscores, and hyphens';
        return '';

      case 'password':
        if (!value || !value.toString().trim()) return 'Password is required';
        if (value.toString().length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value.toString())) {
          return 'Password must contain uppercase, lowercase, number and special character';
        }
        return '';

      case 'phoneNumber':
        if (value && !/^\+?[1-9]\d{1,14}$/.test(value.toString())) return 'Please enter a valid phone number';
        return '';

      case 'yearsOfExperience':
        if (value && (isNaN(Number(value)) || Number(value) < 0)) return 'Years of experience must be a positive number';
        return '';

      case 'consultationFee':
        if (value && (isNaN(Number(value)) || Number(value) < 0)) return 'Consultation fee must be a positive number';
        return '';

      case 'maxPatientsPerDay':
        if (value && (isNaN(Number(value)) || Number(value) < 1)) return 'Max patients per day must be at least 1';
        return '';

      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const config = roleConfigs[formData.userRole];

    // Basic fields
    ['firstName', 'lastName', 'email', 'username', 'password'].forEach(field => {
      const error = validateField(field, formData[field as keyof CreateHospitalUserRequest] as string);
      if (error) newErrors[field] = error;
    });

    // Role-specific validation
    if (config.showMedical && formData.userRole === HospitalUserRole.DOCTOR) {
      if (!formData.specialization) newErrors.specialization = 'Specialization is required for doctors';
      if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required for doctors';
    }

    // Optional fields validation
    if (formData.phoneNumber) {
      const phoneError = validateField('phoneNumber', formData.phoneNumber);
      if (phoneError) newErrors.phoneNumber = phoneError;
    }

    if (formData.yearsOfExperience !== undefined) {
      const expError = validateField('yearsOfExperience', formData.yearsOfExperience);
      if (expError) newErrors.yearsOfExperience = expError;
    }

    if (formData.consultationFee !== undefined) {
      const feeError = validateField('consultationFee', formData.consultationFee);
      if (feeError) newErrors.consultationFee = feeError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name: string, value: string | number | number[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto-generate username from email
    if (name === 'email' && !touched.username) {
      const emailPrefix = value.toString().split('@')[0];
      setFormData(prev => ({ ...prev, username: emailPrefix }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof CreateHospitalUserRequest] as string | number);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleWorkingDaysChange = (day: number) => {
    const currentDays = formData.workingDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort();

    handleInputChange('workingDays', newDays);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Creating hospital user:', formData);
      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          hospitalId,
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          password: '',
          phoneNumber: '',
          userRole: HospitalUserRole.DOCTOR,
          specialization: '',
          licenseNumber: '',
          yearsOfExperience: undefined,
          consultationFee: undefined,
          availableFrom: '09:00',
          availableTo: '17:00',
          maxPatientsPerDay: 20,
          workingDays: [1, 2, 3, 4, 5],
          reportsTo: ''
        });
        setSubmitSuccess(false);
        setTouched({});
      }, 3000);

    } catch (error) {
      setErrors({ submit: 'Failed to create user. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentConfig = roleConfigs[formData.userRole];

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            {formData.firstName} {formData.lastName} has been added as {currentConfig.title}.
          </p>
          <div className="space-y-2 text-sm text-gray-500 text-left bg-gray-50 rounded-lg p-4">
            <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Role:</strong> {currentConfig.title}</p>
            {formData.specialization && <p><strong>Specialization:</strong> {formData.specialization}</p>}
          </div>
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl font-semibold text-gray-900">Add Hospital Staff</h1>
                <p className="text-sm text-gray-500">Create new hospital user account</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className={`bg-gradient-to-r ${currentConfig.color} px-8 py-6 text-white`}>
            <div className="flex items-center gap-3">
              {currentConfig.icon}
              <div>
                <h2 className="text-2xl font-bold">Create {currentConfig.title}</h2>
                <p className="text-white/90">{currentConfig.description}</p>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="px-8 py-6 bg-gray-50 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Role
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(roleConfigs).map(([role, config]) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userRole: role as HospitalUserRole }))}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    formData.userRole === role
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {React.cloneElement(config.icon, { className: 'w-5 h-5' })}
                    </div>
                    <div className="text-xs font-medium text-gray-900">
                      {config.title}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-6 space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
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

                {/* Last Name */}
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
            </div>

            {/* Account Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
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
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Username & Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        onBlur={() => handleBlur('username')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.username ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter username"
                      />
                    </div>
                    {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        onBlur={() => handleBlur('password')}
                        className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>
                </div>

                {/* Phone Number */}
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
                  {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                </div>
              </div>
            </div>

            {/* Medical Information (for Doctors) */}
            {currentConfig.showMedical && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Specialization */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization *
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.specialization ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select specialization</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                    {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>}
                  </div>

                  {/* License Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical License Number *
                    </label>
                    <input
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.licenseNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter license number"
                    />
                    {errors.licenseNumber && <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>}
                  </div>

                  {/* Experience & Fee */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={formData.yearsOfExperience || ''}
                      onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || undefined)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter years of experience"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Fee (₹)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.consultationFee || ''}
                        onChange={(e) => handleInputChange('consultationFee', parseInt(e.target.value) || undefined)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter consultation fee"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Information */}
            {currentConfig.showSchedule && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule Information</h3>

                {/* Working Days */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Working Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map(day => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => handleWorkingDaysChange(day.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.workingDays?.includes(day.value)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Working Hours */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available From
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        value={formData.availableFrom}
                        onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available To
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        value={formData.availableTo}
                        onChange={(e) => handleInputChange('availableTo', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Patients/Day
                    </label>
                    <input
                      type="number"
                      value={formData.maxPatientsPerDay || ''}
                      onChange={(e) => handleInputChange('maxPatientsPerDay', parseInt(e.target.value) || 20)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="mt-1 text-sm text-red-700">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : `bg-gradient-to-r ${currentConfig.color} text-white hover:shadow-lg`
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create {currentConfig.title}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalUserRegistrationForm;