import React, { useState } from 'react';
import { Alert } from '../common/Alert';
import { Modal } from '../common/Modal';

interface SystemConfig {
  general: {
    systemName: string;
    systemEmail: string;
    timezone: string;
    dateFormat: string;
    language: string;
  };
  security: {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireLowercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSymbols: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    accountLockoutDuration: number;
    twoFactorEnabled: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    smtpSecure: boolean;
    fromName: string;
    fromEmail: string;
    welcomeEmailEnabled: boolean;
    passwordResetEmailEnabled: boolean;
  };
  business: {
    defaultCommissionRate: number;
    defaultTargetHospitals: number;
    partnerCodePrefix: string;
    hospitalCodePrefix: string;
    autoApprovalEnabled: boolean;
    commissionPayoutDay: number;
  };
  system: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    backupEnabled: boolean;
    backupFrequency: string;
    logRetentionDays: number;
    debugMode: boolean;
  };
}

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<keyof SystemConfig>('general');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  const [config, setConfig] = useState<SystemConfig>({
    general: {
      systemName: 'HealthHorizon',
      systemEmail: 'support@healthhorizon.com',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      language: 'en',
    },
    security: {
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireLowercase: true,
      passwordRequireNumbers: true,
      passwordRequireSymbols: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      accountLockoutDuration: 15,
      twoFactorEnabled: false,
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
      smtpSecure: true,
      fromName: 'HealthHorizon Support',
      fromEmail: 'support@healthhorizon.com',
      welcomeEmailEnabled: true,
      passwordResetEmailEnabled: true,
    },
    business: {
      defaultCommissionRate: 20.0,
      defaultTargetHospitals: 5,
      partnerCodePrefix: 'TA',
      hospitalCodePrefix: 'HOS',
      autoApprovalEnabled: false,
      commissionPayoutDay: 1,
    },
    system: {
      maintenanceMode: false,
      maintenanceMessage: 'System is currently under maintenance. Please try again later.',
      backupEnabled: true,
      backupFrequency: 'daily',
      logRetentionDays: 90,
      debugMode: false,
    },
  });

  const tabs = [
    {
      id: 'general',
      name: 'General',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'security',
      name: 'Security',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 'email',
      name: 'Email',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'business',
      name: 'Business',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
        </svg>
      ),
    },
    {
      id: 'system',
      name: 'System',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
    },
  ];

  const handleInputChange = (
    section: keyof SystemConfig,
    field: string,
    value: string | number | boolean
  ) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenanceToggle = () => {
    if (!config.system.maintenanceMode) {
      setShowMaintenanceModal(true);
    } else {
      handleInputChange('system', 'maintenanceMode', false);
    }
  };

  const confirmMaintenanceMode = () => {
    handleInputChange('system', 'maintenanceMode', true);
    setShowMaintenanceModal(false);
  };

  const testEmailConnection = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Email connection test successful!');
    } catch (err) {
      alert('Email connection test failed!');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Name
                </label>
                <input
                  type="text"
                  value={config.general.systemName}
                  onChange={(e) => handleInputChange('general', 'systemName', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Email
                </label>
                <input
                  type="email"
                  value={config.general.systemEmail}
                  onChange={(e) => handleInputChange('general', 'systemEmail', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={config.general.timezone}
                  onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <select
                  value={config.general.dateFormat}
                  onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Security Settings</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Changes to security settings will affect all users immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  min="6"
                  max="20"
                  value={config.security.passwordMinLength}
                  onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={config.security.sessionTimeout}
                  onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={config.security.maxLoginAttempts}
                  onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Lockout Duration (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={config.security.accountLockoutDuration}
                  onChange={(e) => handleInputChange('security', 'accountLockoutDuration', parseInt(e.target.value))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Password Requirements</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.security.passwordRequireUppercase}
                    onChange={(e) => handleInputChange('security', 'passwordRequireUppercase', e.target.checked)}
                    className="h-4 w-4 text-[#219ebc] focus:ring-[#219ebc] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Require uppercase letters</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.security.passwordRequireLowercase}
                    onChange={(e) => handleInputChange('security', 'passwordRequireLowercase', e.target.checked)}
                    className="h-4 w-4 text-[#219ebc] focus:ring-[#219ebc] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Require lowercase letters</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.security.passwordRequireNumbers}
                    onChange={(e) => handleInputChange('security', 'passwordRequireNumbers', e.target.checked)}
                    className="h-4 w-4 text-[#219ebc] focus:ring-[#219ebc] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Require numbers</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.security.passwordRequireSymbols}
                    onChange={(e) => handleInputChange('security', 'passwordRequireSymbols', e.target.checked)}
                    className="h-4 w-4 text-[#219ebc] focus:ring-[#219ebc] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Require symbols</label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">SMTP Configuration</h3>
              <button
                onClick={testEmailConnection}
                disabled={loading}
                className="px-4 py-2 bg-[#219ebc] text-white rounded-md hover:bg-[#1a7a94] disabled:opacity-50"
              >
                Test Connection
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={config.email.smtpHost}
                  onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Port
                </label>
                <input
                  type="number"
                  value={config.email.smtpPort}
                  onChange={(e) => handleInputChange('email', 'smtpPort', parseInt(e.target.value))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={config.email.smtpUsername}
                  onChange={(e) => handleInputChange('email', 'smtpUsername', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={config.email.smtpPassword}
                  onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Name
                </label>
                <input
                  type="text"
                  value={config.email.fromName}
                  onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Email
                </label>
                <input
                  type="email"
                  value={config.email.fromEmail}
                  onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Email Features</h4>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.email.smtpSecure}
                    onChange={(e) => handleInputChange('email', 'smtpSecure', e.target.checked)}
                    className="h-4 w-4 text-[#219ebc] focus:ring-[#219ebc] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Use secure connection (TLS/SSL)</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.email.welcomeEmailEnabled}
                    onChange={(e) => handleInputChange('email', 'welcomeEmailEnabled', e.target.checked)}
                    className="h-4 w-4 text-[#219ebc] focus:ring-[#219ebc] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Send welcome emails to new users</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.email.passwordResetEmailEnabled}
                    onChange={(e) => handleInputChange('email', 'passwordResetEmailEnabled', e.target.checked)}
                    className="h-4 w-4 text-[#219ebc] focus:ring-[#219ebc] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Send password reset emails</label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'business':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Commission Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={config.business.defaultCommissionRate}
                  onChange={(e) => handleInputChange('business', 'defaultCommissionRate', parseFloat(e.target.value))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Target Hospitals (Monthly)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={config.business.defaultTargetHospitals}
                  onChange={(e) => handleInputChange('business', 'defaultTargetHospitals', parseInt(e.target.value))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner Code Prefix
                </label>
                <input
                  type="text"
                  value={config.business.partnerCodePrefix}
                  onChange={(e) => handleInputChange('business', 'partnerCodePrefix', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Code Prefix
                </label>
                <input
                  type="text"
                  value={config.business.hospitalCodePrefix}
                  onChange={(e) => handleInputChange('business', 'hospitalCodePrefix', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission Payout Day
                </label>
                <select
                  value={config.business.commissionPayoutDay}
                  onChange={(e) => handleInputChange('business', 'commissionPayoutDay', parseInt(e.target.value))}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                >
                  {[...Array(28)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Day {i + 1} of month
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.business.autoApprovalEnabled}
                  onChange={(e) => handleInputChange('business', 'autoApprovalEnabled', e.target.checked)}
                  className="h-4 w-4 text-[#219ebc] focus:ring-[#219ebc] border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Auto-approve new hospital registrations</label>
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">System Control</h3>
                  <p className="text-sm text-red-700 mt-1">
                    These settings affect system availability and should be used with caution.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
                  <p className="text-sm text-gray-500">Temporarily disable system access for all users</p>
                </div>
                <button
                  onClick={handleMaintenanceToggle}
                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#219ebc] ${
                    config.system.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                      config.system.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {config.system.maintenanceMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Message
                  </label>
                  <textarea
                    rows={3}
                    value={config.system.maintenanceMessage}
                    onChange={(e) => handleInputChange('system', 'maintenanceMessage', e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    value={config.system.backupFrequency}
                    onChange={(e) => handleInputChange('system', 'backupFrequency', e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Log Retention (days)
                  </label>
                  <input
                    type="number"
                    min="7"
                    max="365"
                    value={config.system.logRetentionDays}
                    onChange={(e) => handleInputChange('system', 'logRetentionDays', parseInt(e.target.value))}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.system.backupEnabled}
                    onChange={(e) => handleInputChange('system', 'backupEnabled', e.target.checked)}
                    className="h-4 w-4 text-[#219ebc] focus:ring-[#219ebc] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Enable automatic backups</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.system.debugMode}
                    onChange={(e) => handleInputChange('system', 'debugMode', e.target.checked)}
                    className="h-4 w-4 text-[#219ebc] focus:ring-[#219ebc] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Enable debug mode (development only)</label>
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure system-wide settings and preferences
        </p>
      </div>

      {/* Alerts */}
      {saveSuccess && (
        <Alert
          type="success"
          message="Settings saved successfully!"
          onClose={() => setSaveSuccess(false)}
        />
      )}
      
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {config.system.maintenanceMode && (
        <Alert
          type="warning"
          title="Maintenance Mode Active"
          message="The system is currently in maintenance mode. All users except Super Admins are locked out."
        />
      )}

      {/* Settings Container */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <nav className="mt-5 px-2">
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as keyof SystemConfig)}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left ${
                      activeTab === tab.id
                        ? 'bg-[#219ebc] text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className={`mr-3 flex-shrink-0 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`}>
                      {tab.icon}
                    </div>
                    {tab.name}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#219ebc] hover:bg-[#1a7a94] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>

      {/* Maintenance Mode Modal */}
      <Modal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
        title="Enable Maintenance Mode"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <p className="text-sm text-red-700 mt-1">
                  Enabling maintenance mode will immediately lock out all users except Super Admins.
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            This action will display a maintenance message to users and prevent them from accessing the system.
            You can disable maintenance mode at any time to restore normal operation.
          </p>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowMaintenanceModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmMaintenanceMode}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Enable Maintenance Mode
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SystemSettings;