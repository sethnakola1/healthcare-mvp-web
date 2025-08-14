import React, { useState, useEffect } from 'react';
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Calendar,
  User,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  ArrowLeft,
  Loader,
  Shield,
  CreditCard,
  Users
} from 'lucide-react';

interface CreateHospitalRequest {
  hospitalName: string;
  licenseNumber?: string;
  taxId?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  partnerCodeUsed?: string;
  techSupport1Id?: string;
  techSupport2Id?: string;
  subscriptionPlan: string;
  contractStartDate?: string;
  contractEndDate?: string;
  // Hospital Admin details
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminUsername: string;
  adminPassword: string;
  adminPhoneNumber?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const HospitalRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateHospitalRequest>({
    hospitalName: '',
    licenseNumber: '',
    taxId: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    phoneNumber: '',
    email: '',
    website: '',
    partnerCodeUsed: '',
    subscriptionPlan: 'BASIC',
    contractStartDate: '',
    contractEndDate: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminUsername: '',
    adminPassword: '',
    adminPhoneNumber: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const subscriptionPlans = [
    { value: 'BASIC', label: 'Basic Plan', price: '$99/month', features: ['Up to 50 patients', 'Basic reports', 'Email support'] },
    { value: 'PROFESSIONAL', label: 'Professional Plan', price: '$199/month', features: ['Up to 200 patients', 'Advanced reports', 'Priority support', 'API access'] },
    { value: 'ENTERPRISE', label: 'Enterprise Plan', price: '$399/month', features: ['Unlimited patients', 'Custom reports', '24/7 support', 'Custom integrations'] }
  ];

  const countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia'];
  const indianStates = [
    'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Kerala',
    'Maharashtra', 'Gujarat', 'Rajasthan', 'Delhi', 'Punjab', 'Haryana'
  ];

  const steps = [
    { number: 1, title: 'Hospital Information', description: 'Basic hospital details' },
    { number: 2, title: 'Contact & Location', description: 'Address and contact info' },
    { number: 3, title: 'Subscription & Support', description: 'Plan and support details' },
    { number: 4, title: 'Hospital Admin', description: 'Create admin account' },
    { number: 5, title: 'Review & Submit', description: 'Confirm all details' }
  ];

  // Validation functions
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'hospitalName':
        if (!value.trim()) return 'Hospital name is required';
        if (value.length < 3) return 'Hospital name must be at least 3 characters';
        return '';

      case 'address':
        if (!value.trim()) return 'Address is required';
        return '';

      case 'city':
        if (!value.trim()) return 'City is required';
        return '';

      case 'state':
        if (!value.trim()) return 'State is required';
        return '';

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';

      case 'phoneNumber':
        if (value && !/^\+?[1-9]\d{1,14}$/.test(value)) return 'Please enter a valid phone number';
        return '';

      case 'website':
        if (value && !/^https?:\/\/.+\..+/.test(value)) return 'Please enter a valid website URL';
        return '';

      case 'adminFirstName':
      case 'adminLastName':
        if (!value.trim()) return `${name === 'adminFirstName' ? 'First' : 'Last'} name is required`;
        if (value.length < 2) return `${name === 'adminFirstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        return '';

      case 'adminEmail':
        if (!value.trim()) return 'Admin email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';

      case 'adminUsername':
        if (!value.trim()) return 'Admin username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        return '';

      case 'adminPassword':
        if (!value) return 'Admin password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
          return 'Password must contain uppercase, lowercase, number and special character';
        }
        return '';

      default:
        return '';
    }
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: ValidationErrors = {};

    switch (step) {
      case 1:
        ['hospitalName', 'licenseNumber', 'taxId'].forEach(field => {
          if (field === 'hospitalName' || formData[field as keyof CreateHospitalRequest]) {
            const error = validateField(field, formData[field as keyof CreateHospitalRequest] as string);
            if (error) stepErrors[field] = error;
          }
        });
        break;

      case 2:
        ['address', 'city', 'state', 'email', 'phoneNumber', 'website'].forEach(field => {
          const error = validateField(field, formData[field as keyof CreateHospitalRequest] as string);
          if (error) stepErrors[field] = error;
        });
        break;

      case 4:
        ['adminFirstName', 'adminLastName', 'adminEmail', 'adminUsername', 'adminPassword'].forEach(field => {
          const error = validateField(field, formData[field as keyof CreateHospitalRequest] as string);
          if (error) stepErrors[field] = error;
        });
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

    // Auto-generate admin username from email
    if (name === 'adminEmail' && !touched.adminUsername) {
      const emailPrefix = value.split('@')[0];
      setFormData(prev => ({ ...prev, adminUsername: emailPrefix }));
    }

    // Auto-set contract dates
    if (name === 'contractStartDate') {
      const startDate = new Date(value);
      const endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
      setFormData(prev => ({ ...prev, contractEndDate: endDate.toISOString().split('T')[0] }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof CreateHospitalRequest] as string);
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
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log('Creating hospital:', formData);
      setSubmitSuccess(true);

    } catch (error) {
      setErrors({ submit: 'Failed to create hospital. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hospital Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            {formData.hospitalName} has been registered and the admin account has been created.
          </p>
          <div className="space-y-2 text-sm text-gray-500 text-left bg-gray-50 rounded-lg p-4">
            <p><strong>Hospital:</strong> {formData.hospitalName}</p>
            <p><strong>Admin Email:</strong> {formData.adminEmail}</p>
            <p><strong>Plan:</strong> {subscriptionPlans.find(p => p.value === formData.subscriptionPlan)?.label}</p>
            <p><strong>Location:</strong> {formData.city}, {formData.state}</p>
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hospital Information</h3>

              {/* Hospital Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.hospitalName}
                    onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                    onBlur={() => handleBlur('hospitalName')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.hospitalName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter hospital name"
                  />
                </div>
                {errors.hospitalName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.hospitalName}
                  </p>
                )}
              </div>

              {/* License Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical License Number
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    onBlur={() => handleBlur('licenseNumber')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter license number"
                  />
                </div>
              </div>

              {/* Tax ID */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID / GST Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    onBlur={() => handleBlur('taxId')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter tax ID or GST number"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact & Location</h3>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                    rows={3}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter complete address"
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.address}
                  </p>
                )}
              </div>

              {/* City, State, Country */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    onBlur={() => handleBlur('city')}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="City"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    onBlur={() => handleBlur('state')}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.state ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Postal Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter postal code"
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
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
                      placeholder="hospital@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              {/* Website */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    onBlur={() => handleBlur('website')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.website ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://www.hospital.com"
                  />
                </div>
                {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription & Support</h3>

              {/* Subscription Plans */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Choose Subscription Plan</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {subscriptionPlans.map((plan) => (
                    <div
                      key={plan.value}
                      onClick={() => handleInputChange('subscriptionPlan', plan.value)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.subscriptionPlan === plan.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <h4 className="font-medium text-gray-900">{plan.label}</h4>
                        <p className="text-2xl font-bold text-blue-600 my-2">{plan.price}</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contract Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contract Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.contractStartDate}
                      onChange={(e) => handleInputChange('contractStartDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contract End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.contractEndDate}
                      onChange={(e) => handleInputChange('contractEndDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Partner Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Partner Code (Optional)</label>
                <input
                  type="text"
                  value={formData.partnerCodeUsed}
                  onChange={(e) => handleInputChange('partnerCodeUsed', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tech advisor partner code"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter a tech advisor's partner code to associate this hospital with them
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Hospital Admin Account
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                This account will have full administrative access to manage the hospital
              </p>

              {/* Admin Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.adminFirstName}
                      onChange={(e) => handleInputChange('adminFirstName', e.target.value)}
                      onBlur={() => handleBlur('adminFirstName')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.adminFirstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter first name"
                    />
                  </div>
                  {errors.adminFirstName && <p className="mt-1 text-sm text-red-600">{errors.adminFirstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.adminLastName}
                      onChange={(e) => handleInputChange('adminLastName', e.target.value)}
                      onBlur={() => handleBlur('adminLastName')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.adminLastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter last name"
                    />
                  </div>
                  {errors.adminLastName && <p className="mt-1 text-sm text-red-600">{errors.adminLastName}</p>}
                </div>
              </div>

              {/* Admin Account Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                      onBlur={() => handleBlur('adminEmail')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.adminEmail ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="admin@hospital.com"
                    />
                  </div>
                  {errors.adminEmail && <p className="mt-1 text-sm text-red-600">{errors.adminEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.adminUsername}
                      onChange={(e) => handleInputChange('adminUsername', e.target.value)}
                      onBlur={() => handleBlur('adminUsername')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.adminUsername ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter username"
                    />
                  </div>
                  {errors.adminUsername && <p className="mt-1 text-sm text-red-600">{errors.adminUsername}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.adminPassword}
                      onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                      onBlur={() => handleBlur('adminPassword')}
                      className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.adminPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter secure password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.adminPassword && <p className="mt-1 text-sm text-red-600">{errors.adminPassword}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.adminPhoneNumber}
                      onChange={(e) => handleInputChange('adminPhoneNumber', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review & Confirm</h3>

              <div className="space-y-6">
                {/* Hospital Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Hospital Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-600">Name:</span> <span className="font-medium">{formData.hospitalName}</span></div>
                    <div><span className="text-gray-600">License:</span> <span className="font-medium">{formData.licenseNumber || 'Not provided'}</span></div>
                    <div><span className="text-gray-600">Tax ID:</span> <span className="font-medium">{formData.taxId || 'Not provided'}</span></div>
                    <div><span className="text-gray-600">Plan:</span> <span className="font-medium">{subscriptionPlans.find(p => p.value === formData.subscriptionPlan)?.label}</span></div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location & Contact
                  </h4>
                  <div className="text-sm space-y-1">
                    <div>{formData.address}</div>
                    <div>{formData.city}, {formData.state} {formData.postalCode}</div>
                    <div>{formData.country}</div>
                    {formData.phoneNumber && <div>Phone: {formData.phoneNumber}</div>}
                    {formData.email && <div>Email: {formData.email}</div>}
                    {formData.website && <div>Website: {formData.website}</div>}
                  </div>
                </div>

                {/* Admin Account */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Hospital Administrator
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-600">Name:</span> <span className="font-medium">{formData.adminFirstName} {formData.adminLastName}</span></div>
                    <div><span className="text-gray-600">Email:</span> <span className="font-medium">{formData.adminEmail}</span></div>
                    <div><span className="text-gray-600">Username:</span> <span className="font-medium">{formData.adminUsername}</span></div>
                    {formData.adminPhoneNumber && <div><span className="text-gray-600">Phone:</span> <span className="font-medium">{formData.adminPhoneNumber}</span></div>}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Terms and Conditions</p>
                    <p className="text-blue-700">
                      I agree to the HealthHorizon Terms of Service and Privacy Policy. The hospital admin account will have full access to manage hospital operations and patient data.
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
                <h1 className="text-xl font-semibold text-gray-900">Hospital Registration</h1>
                <p className="text-sm text-gray-500">Create new hospital and admin account</p>
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
                      Creating Hospital...
                    </>
                  ) : (
                    <>
                      <Building className="w-5 h-5" />
                      Create Hospital
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

export default HospitalRegistrationForm;