import React, { useState } from 'react';

type BusinessRole = 'SUPER_ADMIN' | 'TECH_ADVISOR';

interface BusinessUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  territory: string;
  businessRole: BusinessRole;
  commissionPercentage: number;
  targetHospitalsMonthly: number;
}

interface ValidationErrors {
  [key: string]: string;
}

const BusinessUserRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<BusinessUserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    territory: '',
    businessRole: 'TECH_ADVISOR',
    commissionPercentage: 20.00,
    targetHospitalsMonthly: 5
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState<any>(null);

  // Update role-specific defaults when role changes
  const handleRoleChange = (role: BusinessRole) => {
    setFormData(prev => ({
      ...prev,
      businessRole: role,
      commissionPercentage: role === 'SUPER_ADMIN' ? 0 : 20.00,
      targetHospitalsMonthly: role === 'SUPER_ADMIN' ? 0 : 5
    }));
  };

  // Password strength validation
  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };
    return requirements;
  };

  const passwordRequirements = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordRequirements).every(req => req);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'businessRole') {
      handleRoleChange(value as BusinessRole);
    } else if (name === 'commissionPercentage' || name === 'targetHospitalsMonthly') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required field validations
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.territory.trim()) newErrors.territory = 'Territory is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (formData.username && !usernameRegex.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, dots, underscores, and hyphens';
    }

    // Password validation
    if (formData.password && !isPasswordValid) {
      newErrors.password = 'Password must meet all requirements';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone number validation (optional)
    if (formData.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Role-specific validations
    if (formData.businessRole === 'TECH_ADVISOR') {
      if (formData.commissionPercentage < 0 || formData.commissionPercentage > 100) {
        newErrors.commissionPercentage = 'Commission percentage must be between 0 and 100';
      }
      if (formData.targetHospitalsMonthly < 1) {
        newErrors.targetHospitalsMonthly = 'Target hospitals must be at least 1';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        username: formData.username.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phoneNumber: formData.phoneNumber || undefined,
        territory: formData.territory.trim(),
        role: formData.businessRole,
        commissionPercentage: formData.commissionPercentage,
        targetHospitalsMonthly: formData.targetHospitalsMonthly
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCreatedUser({
        ...requestData,
        businessUserId: 'generated-uuid',
        partnerCode: 'AUTO-GENERATED',
        createdAt: new Date().toISOString()
      });
      
      setSuccess(true);
      console.log('Business user created successfully:', requestData);
      
    } catch (error) {
      console.error('Business user creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      territory: '',
      businessRole: 'TECH_ADVISOR',
      commissionPercentage: 20.00,
      targetHospitalsMonthly: 5
    });
    setErrors({});
    setSuccess(false);
    setCreatedUser(null);
  };

  const RequirementIndicator = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
      <div className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center ${met ? 'bg-green-100' : 'bg-gray-100'}`}>
        {met ? (
          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      {text}
    </div>
  );

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {formData.businessRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Tech Advisor'} Created Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              {createdUser?.firstName} {createdUser?.lastName} has been registered and will receive login credentials via email.
            </p>
            
            {/* Created User Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-3">Account Details:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium">
                    {formData.businessRole === 'SUPER_ADMIN' ? 'Super Administrator' : 'Technical Advisor'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{createdUser?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Username:</span>
                  <span className="font-medium">{createdUser?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Territory:</span>
                  <span className="font-medium">{createdUser?.territory}</span>
                </div>
                {formData.businessRole === 'TECH_ADVISOR' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission:</span>
                      <span className="font-medium">{createdUser?.commissionPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Target:</span>
                      <span className="font-medium">{createdUser?.targetHospitalsMonthly} hospitals</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-x-4">
              <button 
                onClick={resetForm}
                className="px-6 py-2 bg-[#219ebc] text-white rounded-lg hover:bg-[#1a7a94] transition-colors"
              >
                Create Another User
              </button>
              <button 
                onClick={() => console.log('Navigate to dashboard')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button className="flex items-center text-[#219ebc] hover:text-[#1a7a94] transition-colors">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
          
          <div className="flex items-center">
            <div className="bg-[#219ebc] p-3 rounded-lg mr-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Business User</h1>
              <p className="text-gray-600 mt-1">Register a new Super Admin or Technical Advisor in the system</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
            <p className="text-sm text-gray-600">Fill in the details to create a new business user account</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                User Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    formData.businessRole === 'SUPER_ADMIN' 
                      ? 'border-[#219ebc] bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleRoleChange('SUPER_ADMIN')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="businessRole"
                      value="SUPER_ADMIN"
                      checked={formData.businessRole === 'SUPER_ADMIN'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#219ebc] focus:ring-[#219ebc]"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">Super Administrator</div>
                      <div className="text-xs text-gray-500">Full system access and control</div>
                    </div>
                  </div>
                </div>

                <div 
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    formData.businessRole === 'TECH_ADVISOR' 
                      ? 'border-[#219ebc] bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleRoleChange('TECH_ADVISOR')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="businessRole"
                      value="TECH_ADVISOR"
                      checked={formData.businessRole === 'TECH_ADVISOR'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#219ebc] focus:ring-[#219ebc]"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">Technical Advisor</div>
                      <div className="text-xs text-gray-500">Hospital partnerships and support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219ebc] ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219ebc] ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219ebc] ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219ebc] ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+1234567890"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>
            </div>

            {/* Account Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219ebc] ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter username"
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Only letters, numbers, dots, underscores, and hyphens allowed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Territory <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="territory"
                  value={formData.territory}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219ebc] ${
                    errors.territory ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., North America, Europe, Asia"
                />
                {errors.territory && <p className="text-red-500 text-sm mt-1">{errors.territory}</p>}
              </div>
            </div>

            {/* Role-Specific Fields */}
            {formData.businessRole === 'TECH_ADVISOR' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Advisor Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Percentage (%)
                    </label>
                    <input
                      type="number"
                      name="commissionPercentage"
                      value={formData.commissionPercentage}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219ebc] ${
                        errors.commissionPercentage ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="20.00"
                    />
                    {errors.commissionPercentage && <p className="text-red-500 text-sm mt-1">{errors.commissionPercentage}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Hospitals (Monthly)
                    </label>
                    <input
                      type="number"
                      name="targetHospitalsMonthly"
                      value={formData.targetHospitalsMonthly}
                      onChange={handleInputChange}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219ebc] ${
                        errors.targetHospitalsMonthly ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="5"
                    />
                    {errors.targetHospitalsMonthly && <p className="text-red-500 text-sm mt-1">{errors.targetHospitalsMonthly}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Password Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Security Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219ebc] ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#219ebc] ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Password Requirements:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <RequirementIndicator met={passwordRequirements.length} text="At least 8 characters" />
                    <RequirementIndicator met={passwordRequirements.uppercase} text="One uppercase letter" />
                    <RequirementIndicator met={passwordRequirements.lowercase} text="One lowercase letter" />
                    <RequirementIndicator met={passwordRequirements.number} text="One number" />
                    <RequirementIndicator met={passwordRequirements.special} text="One special character (!@#$%^&*)" />
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !isPasswordValid}
                className="px-6 py-2 bg-[#219ebc] text-white rounded-lg hover:bg-[#1a7a94] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Create {formData.businessRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Tech Advisor'}
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

export default BusinessUserRegistrationForm;