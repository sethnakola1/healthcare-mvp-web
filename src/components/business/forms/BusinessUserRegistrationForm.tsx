import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertCircle,
  Shield,
  UserPlus,
  ArrowLeft,
  Loader
} from 'lucide-react';

// Mock types for demo
enum BusinessRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TECH_ADVISOR = 'TECH_ADVISOR'
}

interface CreateBusinessUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  territory: string;
  role: BusinessRole;
}

interface ValidationErrors {
  [key: string]: string;
}

const BusinessUserRegistrationForm = () => {
  const [formData, setFormData] = useState<CreateBusinessUserRequest>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    territory: '',
    role: BusinessRole.TECH_ADVISOR
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false
  });

  const territories = [
    'North America',
    'South America', 
    'Europe',
    'Asia Pacific',
    'Middle East',
    'Africa',
    'India - North',
    'India - South',
    'India - East',
    'India - West'
  ];

  // Validation functions
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        if (value.length < 2) return `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Only letters, spaces, hyphens and apostrophes allowed';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'username':
        if (!value.trim()) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 50) return 'Username must not exceed 50 characters';
        if (!/^[a-zA-Z0-9._-]+$/.test(value)) return 'Username can only contain letters, numbers, dots, underscores, and hyphens';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
          return 'Password must contain uppercase, lowercase, number and special character';
        }
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      
      case 'phoneNumber':
        if (value && !/^\+?[1-9]\d{1,14}$/.test(value)) return 'Please enter a valid phone number';
        return '';
      
      case 'territory':
        if (!value.trim()) return 'Territory is required';
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== 'phoneNumber') { // phoneNumber is optional
        const error = validateField(key, formData[key as keyof CreateBusinessUserRequest] as string);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[@$!%*?&]/.test(password)
    });
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }

    // Auto-generate username from email
    if (name === 'email' && !touched.username) {
      const emailPrefix = value.split('@')[0];
      setFormData(prev => ({ ...prev, username: emailPrefix }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof CreateBusinessUserRequest] as string);
    setErrors(prev => ({ ...prev, [name]: error }));

    // Mock API calls for availability check
    if (name === 'email' && !error) {
      setTimeout(() => setEmailAvailable(Math.random() > 0.3), 500);
    }
    if (name === 'username' && !error) {
      setTimeout(() => setUsernameAvailable(Math.random() > 0.3), 500);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Creating business user:', formData);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
          phoneNumber: '',
          territory: '',
          role: BusinessRole.TECH_ADVISOR
        });
        setSubmitSuccess(false);
        setTouched({});
        setEmailAvailable(null);
        setUsernameAvailable(null);
      }, 3000);
      
    } catch (error) {
      setErrors({ submit: 'Failed to create user. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleConfig = () => {
    return {
      [BusinessRole.SUPER_ADMIN]: {
        title: 'Create Super Administrator',
        description: 'Full system access and management capabilities',
        icon: <Shield className="w-6 h-6" />,
        color: 'from-red-500 to-red-600',
        commission: 0,
        targets: 0
      },
      [BusinessRole.TECH_ADVISOR]: {
        title: 'Create Tech Advisor',
        description: 'Technical advisor for hospital partnerships',
        icon: <UserPlus className="w-6 h-6" />,
        color: 'from-blue-500 to-blue-600',
        commission: 20,
        targets: 5
      }
    };
  };

  const roleConfig = getRoleConfig()[formData.role];

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">
            {roleConfig.title.replace('Create ', '')} has been created successfully.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Role:</strong> {formData.role.replace('_', ' ')}</p>
            <p><strong>Territory:</strong> {formData.territory}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500">Create new business users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className={`bg-gradient-to-r ${roleConfig.color} px-8 py-6 text-white`}>
            <div className="flex items-center gap-3">
              {roleConfig.icon}
              <div>
                <h2 className="text-2xl font-bold">{roleConfig.title}</h2>
                <p className="text-white/90">{roleConfig.description}</p>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="px-8 py-6 bg-gray-50 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(getRoleConfig()).map(([role, config]) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: role as BusinessRole }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === role
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {config.icon}
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        {role.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-gray-500">
                        Commission: {config.commission}%
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-6 space-y-6">
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
                      className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                    {emailAvailable !== null && !errors.email && (
                      <div className="absolute right-3 top-3">
                        {emailAvailable ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <X className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                  {emailAvailable === false && !errors.email && (
                    <p className="mt-1 text-sm text-red-600">Email is already taken</p>
                  )}
                </div>

                {/* Username */}
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
                      className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.username ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter username"
                    />
                    {usernameAvailable !== null && !errors.username && (
                      <div className="absolute right-3 top-3">
                        {usernameAvailable ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <X className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Password */}
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
                  
                  {/* Password Strength Indicators */}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-gray-600 mb-1">Password requirements:</div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className={`flex items-center gap-1 ${passwordStrength.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                          {passwordStrength.minLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          8+ characters
                        </div>
                        <div className={`flex items-center gap-1 ${passwordStrength.hasUpper ? 'text-green-600' : 'text-gray-400'}`}>
                          {passwordStrength.hasUpper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          Uppercase letter
                        </div>
                        <div className={`flex items-center gap-1 ${passwordStrength.hasLower ? 'text-green-600' : 'text-gray-400'}`}>
                          {passwordStrength.hasLower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          Lowercase letter
                        </div>
                        <div className={`flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                          {passwordStrength.hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          Number
                        </div>
                        <div className={`flex items-center gap-1 ${passwordStrength.hasSpecial ? 'text-green-600' : 'text-gray-400'}`}>
                          {passwordStrength.hasSpecial ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          Special character
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact & Location</h3>
              <div className="space-y-4">
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
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Territory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Territory *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.territory}
                      onChange={(e) => handleInputChange('territory', e.target.value)}
                      onBlur={() => handleBlur('territory')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.territory ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select territory</option>
                      {territories.map(territory => (
                        <option key={territory} value={territory}>{territory}</option>
                      ))}
                    </select>
                  </div>
                  {errors.territory && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.territory}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Role Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Role Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Commission Rate:</span>
                  <span className="ml-2 font-medium">{roleConfig.commission}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Monthly Targets:</span>
                  <span className="ml-2 font-medium">{roleConfig.targets} hospitals</span>
                </div>
              </div>
            </div>

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
                disabled={isSubmitting || !emailAvailable || !usernameAvailable}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  isSubmitting || !emailAvailable || !usernameAvailable
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : `bg-gradient-to-r ${roleConfig.color} text-white hover:shadow-lg`
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    {roleConfig.icon}
                    {roleConfig.title}
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