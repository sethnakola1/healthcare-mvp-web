import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  UserX,
  UserCheck,
  Eye,
  Shield,
  UserPlus,
  Download,
  RefreshCw,
  Calendar,
  MapPin,
  Mail,
  Phone,
  TrendingUp,
  Building,
  DollarSign
} from 'lucide-react';

// Mock types and data
enum BusinessRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TECH_ADVISOR = 'TECH_ADVISOR'
}

interface BusinessUserListItem {
  businessUserId: string;
  fullName: string;
  email: string;
  businessRole: BusinessRole;
  territory?: string;
  partnerCode: string;
  totalHospitalsBrought: number;
  commissionPercentage: number;
  isActive: boolean;
  createdAt: string;
  phoneNumber?: string;
  lastLogin?: string;
  totalCommissionEarned: number;
}

const mockUsers: BusinessUserListItem[] = [
  {
    businessUserId: '1',
    fullName: 'Sethna Kola',
    email: 'sethnakola@healthhorizon.com',
    businessRole: BusinessRole.SUPER_ADMIN,
    territory: 'Global',
    partnerCode: 'SA001',
    totalHospitalsBrought: 0,
    commissionPercentage: 0,
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    phoneNumber: '+1 555 0123',
    lastLogin: '2024-01-20T14:30:00Z',
    totalCommissionEarned: 0
  },
  {
    businessUserId: '2',
    fullName: 'John Smith',
    email: 'john.smith@healthhorizon.com',
    businessRole: BusinessRole.TECH_ADVISOR,
    territory: 'North America',
    partnerCode: 'TA001',
    totalHospitalsBrought: 12,
    commissionPercentage: 20,
    isActive: true,
    createdAt: '2024-01-10T09:15:00Z',
    phoneNumber: '+1 555 0234',
    lastLogin: '2024-01-19T16:45:00Z',
    totalCommissionEarned: 24000
  },
  {
    businessUserId: '3',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@healthhorizon.com',
    businessRole: BusinessRole.TECH_ADVISOR,
    territory: 'Europe',
    partnerCode: 'TA002',
    totalHospitalsBrought: 8,
    commissionPercentage: 20,
    isActive: true,
    createdAt: '2024-01-12T11:20:00Z',
    phoneNumber: '+44 20 1234 5678',
    lastLogin: '2024-01-18T10:30:00Z',
    totalCommissionEarned: 16000
  },
  {
    businessUserId: '4',
    fullName: 'Michael Chen',
    email: 'michael.chen@healthhorizon.com',
    businessRole: BusinessRole.TECH_ADVISOR,
    territory: 'Asia Pacific',
    partnerCode: 'TA003',
    totalHospitalsBrought: 15,
    commissionPercentage: 20,
    isActive: false,
    createdAt: '2024-01-08T14:45:00Z',
    phoneNumber: '+65 9876 5432',
    lastLogin: '2024-01-15T08:20:00Z',
    totalCommissionEarned: 30000
  }
];

const BusinessUsersList = () => {
  const [users, setUsers] = useState<BusinessUserListItem[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<BusinessUserListItem[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<BusinessRole | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalUsers);
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Apply filters
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.partnerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.territory?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (selectedRole !== 'ALL') {
      filtered = filtered.filter(user => user.businessRole === selectedRole);
    }

    // Status filter
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(user =>
        selectedStatus === 'ACTIVE' ? user.isActive : !user.isActive
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField as keyof BusinessUserListItem];
      let bValue = b[sortField as keyof BusinessUserListItem];

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchTerm, selectedRole, selectedStatus, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === currentUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(currentUsers.map(u => u.businessUserId)));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getRoleBadge = (role: BusinessRole) => {
    if (role === BusinessRole.SUPER_ADMIN) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
          <Shield className="w-3 h-3" />
          Super Admin
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          <UserPlus className="w-3 h-3" />
          Tech Advisor
        </span>
      );
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          <UserCheck className="w-3 h-3" />
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
          <UserX className="w-3 h-3" />
          Inactive
        </span>
      );
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Business Users</h1>
              <p className="text-sm text-gray-500">Manage Super Admins and Tech Advisors</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tech Advisors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.businessRole === BusinessRole.TECH_ADVISOR).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hospitals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.reduce((sum, user) => sum + user.totalHospitalsBrought, 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Commission</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(users.reduce((sum, user) => sum + user.totalCommissionEarned, 0))}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by name, email, partner code, or territory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as BusinessRole | 'ALL')}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">All Roles</option>
                  <option value={BusinessRole.SUPER_ADMIN}>Super Admin</option>
                  <option value={BusinessRole.TECH_ADVISOR}>Tech Advisor</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Created Date</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Territory</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="">All Territories</option>
                      <option value="North America">North America</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia Pacific">Asia Pacific</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hospitals Brought</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="">Any Number</option>
                      <option value="0">0 Hospitals</option>
                      <option value="1-5">1-5 Hospitals</option>
                      <option value="6-10">6-10 Hospitals</option>
                      <option value="11+">11+ Hospitals</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedUsers.size > 0 && (
            <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedUsers.size} user(s) selected
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                    Activate
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                    Deactivate
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                    Export
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === currentUsers.length && currentUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('fullName')}
                  >
                    User
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('businessRole')}
                  >
                    Role
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('territory')}
                  >
                    Territory
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('totalHospitalsBrought')}
                  >
                    Performance
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('isActive')}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.businessUserId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.businessUserId)}
                        onChange={() => handleSelectUser(user.businessUserId)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.fullName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          {user.phoneNumber && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {user.phoneNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.businessRole)}
                      <div className="text-xs text-gray-500 mt-1">
                        {user.partnerCode}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {user.territory}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1 mb-1">
                          <Building className="w-3 h-3 text-gray-400" />
                          {user.totalHospitalsBrought} hospitals
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-gray-400" />
                          {formatCurrency(user.totalCommissionEarned)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.isActive)}
                      {user.lastLogin && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Last: {formatDate(user.lastLogin)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {endIndex} of {totalUsers} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm rounded-lg ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessUsersList;