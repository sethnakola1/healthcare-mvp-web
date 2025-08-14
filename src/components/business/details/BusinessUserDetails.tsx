import React, { useState, useEffect } from 'react';
import { useBusinessUsers } from '../../../hooks/useBusinessUsers';
import { usePermissions } from '../../../hooks/usePermissions';
import { Modal } from '../../common/Modal';
import { Alert } from '../../common/Alert';
import { Badge } from '../../common/Badge';
import { RoleDisplayWidget } from '../widgets/RoleDisplayWidget';
import { BusinessRole, BusinessUser } from '../../../types/business.types';

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  ipAddress?: string;
}

interface BusinessUserDetailsProps {
  userId: string;
}

const BusinessUserDetails: React.FC<BusinessUserDetailsProps> = ({ userId }) => {
  const {
    selectedUser,
    selectedUserStats,
    loading,
    error,
    getUserDetails,
    getUserStats,
    updateUser,
    deleteUser,
    resetUserPassword,
    clearErrors,
  } = useBusinessUsers();

  const { hasPermission } = usePermissions();

  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'performance'>('overview');

  // Mock activity data (replace with real API call)
  const [activityLog] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'LOGIN',
      description: 'User logged in successfully',
      timestamp: new Date('2024-01-15T10:30:00'),
      ipAddress: '192.168.1.100',
    },
    {
      id: '2',
      type: 'HOSPITAL_ADDED',
      description: 'Added new hospital: City General Hospital',
      timestamp: new Date('2024-01-14T15:45:00'),
      ipAddress: '192.168.1.100',
    },
    {
      id: '3',
      type: 'PROFILE_UPDATE',
      description: 'Updated profile information',
      timestamp: new Date('2024-01-13T09:15:00'),
      ipAddress: '192.168.1.100',
    },
  ]);

  useEffect(() => {
    if (userId) {
      getUserDetails(userId);
      getUserStats(userId);
    }
  }, [userId, getUserDetails, getUserStats]);

  const handlePasswordReset = async () => {
    if (!selectedUser || !newPassword) return;
    
    setPasswordResetLoading(true);
    try {
      await resetUserPassword({
        email: selectedUser.email,
        newPassword,
      });
      setShowPasswordResetModal(false);
      setNewPassword('');
    } catch (error) {
      console.error('Password reset failed:', error);
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const handleDeactivateUser = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.businessUserId);
      setShowDeactivateModal(false);
    } catch (error) {
      console.error('Deactivation failed:', error);
    }
  };

  const handleActivateUser = async () => {
    if (!selectedUser) return;
    
    try {
      await updateUser(selectedUser.businessUserId, { isActive: true });
      setShowActivateModal(false);
    } catch (error) {
      console.error('Activation failed:', error);
    }
  };

  const handleEditUser = () => {
    if (selectedUser) {
      window.location.href = `/admin/users/${selectedUser.businessUserId}/edit`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#219ebc]"></div>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">User not found</h3>
        <p className="text-gray-500">The requested user could not be found.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', count: null },
    { id: 'activity', name: 'Activity', count: activityLog.length },
    ...(selectedUser.businessRole === BusinessRole.TECH_ADVISOR 
      ? [{ id: 'performance', name: 'Performance', count: null }] 
      : []
    ),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-[#219ebc] flex items-center justify-center">
                  <span className="text-xl font-medium text-white">
                    {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  <RoleDisplayWidget role={selectedUser.businessRole} />
                  <Badge variant={selectedUser.isActive ? 'success' : 'error'}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {selectedUser.emailVerified && (
                    <Badge variant="info" size="sm">
                      Email Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {hasPermission('canUpdateBusinessUser') && (
                <button
                  onClick={handleEditUser}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#219ebc]"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              )}
              
              {hasPermission('canResetPasswords') && (
                <button
                  onClick={() => setShowPasswordResetModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#219ebc]"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Reset Password
                </button>
              )}
              
              {hasPermission('canDeactivateBusinessUser') && (
                <button
                  onClick={() => selectedUser.isActive ? setShowDeactivateModal(true) : setShowActivateModal(true)}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    selectedUser.isActive
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  }`}
                >
                  {selectedUser.isActive ? 'Deactivate' : 'Activate'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#219ebc] text-[#219ebc]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                {tab.count !== null && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-[#219ebc] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={clearErrors}
        />
      )}

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Username</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">
                    {selectedUser.username}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedUser.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedUser.phoneNumber || 'Not provided'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Territory</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedUser.territory}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Partner Code</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">
                    {selectedUser.partnerCode}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Login</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedUser.lastLogin 
                      ? new Date(selectedUser.lastLogin).toLocaleString()
                      : 'Never'
                    }
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Role-Specific Information */}
            {selectedUser.businessRole === BusinessRole.TECH_ADVISOR && (
              <div className="bg-white shadow rounded-lg p-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tech Advisor Details</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Commission Rate</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedUser.commissionPercentage}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Monthly Target</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedUser.targetHospitalsMonthly} hospitals
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Total Hospitals</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedUser.totalHospitalsBrought}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Total Commission</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      ${selectedUser.totalCommissionEarned?.toLocaleString() || 0}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <Badge variant={selectedUser.isActive ? 'success' : 'error'}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Email Verified</span>
                  <Badge variant={selectedUser.emailVerified ? 'success' : 'warning'}>
                    {selectedUser.emailVerified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Login Attempts</span>
                  <span className="text-sm text-gray-900">{selectedUser.loginAttempts}</span>
                </div>
              </div>
            </div>

            {selectedUserStats && selectedUser.businessRole === BusinessRole.TECH_ADVISOR && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">This Month</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedUserStats.currentMonthProgress} hospitals
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Rating</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(selectedUserStats.performanceRating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Activity Log</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {activityLog.map((activity) => (
              <div key={activity.id} className="px-6 py-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-[#219ebc] flex items-center justify-center">
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900">{activity.description}</div>
                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                      <span>{activity.timestamp.toLocaleString()}</span>
                      {activity.ipAddress && <span>IP: {activity.ipAddress}</span>}
                      <Badge size="sm" variant="default">{activity.type}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'performance' && selectedUser.businessRole === BusinessRole.TECH_ADVISOR && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Performance</h3>
            {/* Add performance chart here */}
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Performance Chart Coming Soon</span>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-green-900">Target Achieved</div>
                  <div className="text-xs text-green-600">Reached monthly hospital target</div>
                </div>
                <Badge variant="success">+5</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-blue-900">High Performance</div>
                  <div className="text-xs text-blue-600">Top 10% performer this quarter</div>
                </div>
                <Badge variant="info">⭐</Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      <Modal
        isOpen={showPasswordResetModal}
        onClose={() => setShowPasswordResetModal(false)}
        title="Reset Password"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Enter a new password for <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>.
            They will need to use this password to log in.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#219ebc] focus:border-[#219ebc]"
              placeholder="Enter new password"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowPasswordResetModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordReset}
              disabled={!newPassword || passwordResetLoading}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#219ebc] hover:bg-[#1a7a94] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passwordResetLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Deactivate Modal */}
      <Modal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        title="Deactivate User"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to deactivate <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>?
            This will immediately disable their access to the system.
          </p>
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowDeactivateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeactivateUser}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Deactivate
            </button>
          </div>
        </div>
      </Modal>

      {/* Activate Modal */}
      <Modal
        isOpen={showActivateModal}
        onClose={() => setShowActivateModal(false)}
        title="Activate User"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to activate <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>?
            This will restore their access to the system.
          </p>
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowActivateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleActivateUser}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Activate
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BusinessUserDetails;