import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Card, Button, Loading } from '../../components/ui';
import Sidebar from '../../components/layout/Sidebar';
import { ProtectedRoute } from '../../components/auth';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Menu,
  Eye,
  User as UserIcon,
  Phone,
  Calendar
} from 'lucide-react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  grade?: string;
  phone: string;
  dateJoined: string;
  status: string;
  avatar: string;
}

interface UsersData {
  users: User[];
  summary: {
    totalUsers: number;
    byRole: {
      students: number;
      teachers: number;
      admins: number;
    };
    byStatus: {
      active: number;
      inactive: number;
    };
  };
}

export default function Users() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/data/users.json');
        const data: UsersData = await response.json();
        setUsers(data.users);
        setFilteredUsers(data.users);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter, users]);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'teacher': return 'bg-primary';
      case 'student': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return status === 'active' ? 'bg-success' : 'bg-warning';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Loading message="Loading users..." />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Users - School Management System</title>
        <meta name="description" content="Manage users in the school management system" />
      </Head>
      <div className="dashboard-layout">
        <div className="dashboard-sidebar">
          <Sidebar
            activeItem="users"
            isMobileOpen={isMobileMenuOpen}
            setIsMobileOpen={setIsMobileMenuOpen}
          />
        </div>
        <div className="dashboard-main">
          <div className="main-content">
            <div className="container-fluid p-0">
              {/* Mobile Hamburger Button */}
              <button
                className="mobile-hamburger d-block d-md-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <Menu size={24} />
              </button>

              {/* Header Section */}
              <div className="dashboard-header mb-4">
                <div className="row align-items-center">
                  <div className="col-12">
                    <h1 className="dashboard-title mb-2">User Management</h1>
                    <p className="dashboard-subtitle mb-0">
                      Manage students, teachers, and administrators
                    </p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="row mb-4">
                <div className="col-12">
                  <Card title="" className="filter-card">
                    <div className="row g-3 align-items-center">
                      <div className="col-12 col-lg-5">
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <Search size={16} className="text-muted" />
                          </span>
                          <input
                            type="text"
                            className="form-control task-search-input"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              setCurrentPage(1);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-6 col-md-4 col-lg-2">
                        <select
                          className="form-select"
                          value={roleFilter}
                          onChange={(e) => {
                            setRoleFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                        >
                          <option value="all">All Roles</option>
                          <option value="student">Students</option>
                          <option value="teacher">Teachers</option>
                          <option value="admin">Admins</option>
                        </select>
                      </div>
                      <div className="col-6 col-md-4 col-lg-2">
                        <select
                          className="form-select"
                          value={statusFilter}
                          onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                        >
                          <option value="all">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="col-6 col-md-4 col-lg-1">
                        <button
                          className="btn btn-outline-secondary w-100"
                          onClick={resetFilters}
                        >
                          <Filter size={16} />
                          <span className="d-none d-md-inline ms-1">Reset</span>
                        </button>
                      </div>
                      <div className="col-6 col-md-4 col-lg-2">
                        <div className="d-flex justify-content-end align-items-center">
                          <span className="badge bg-light text-dark">
                            {filteredUsers.length} of {users.length} users
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Action Bar */}
              <div className="row mb-3">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-muted">Users</h5>
                    <Button variant="primary" className="btn-sm">
                      <Plus size={16} className="me-1" />
                      Add User
                    </Button>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th scope="col" className="border-0">User</th>
                              <th scope="col" className="border-0">Role</th>
                              <th scope="col" className="border-0">Department/Grade</th>
                              <th scope="col" className="border-0">Contact</th>
                              <th scope="col" className="border-0">Status</th>
                              <th scope="col" className="border-0">Joined</th>
                              <th scope="col" className="border-0 text-end">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentUsers.length > 0 ? (
                              currentUsers.map((user) => (
                                <tr key={user.id} className="align-middle">
                                  <td className="border-0">
                                    <div className="d-flex align-items-center">
                                      <div className="me-3">
                                        <div className="avatar-placeholder bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                        </div>
                                      </div>
                                      <div>
                                        <h6 className="mb-0">{user.firstName} {user.lastName}</h6>
                                        <p className="text-muted mb-0 small">{user.email}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="border-0">
                                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                  </td>
                                  <td className="border-0">
                                    {user.department ? (
                                      <span className="badge bg-secondary">{user.department}</span>
                                    ) : user.grade ? (
                                      <span className="badge bg-info">Grade {user.grade}</span>
                                    ) : (
                                      '-'
                                    )}
                                  </td>
                                  <td className="border-0">
                                    <div className="d-flex align-items-center">
                                      <Phone size={14} className="me-1 text-muted" />
                                      <span>{user.phone}</span>
                                    </div>
                                  </td>
                                  <td className="border-0">
                                    <span className={`badge ${getStatusBadgeClass(user.status)}`}>
                                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                    </span>
                                  </td>
                                  <td className="border-0">
                                    <div className="d-flex align-items-center">
                                      <Calendar size={14} className="me-1 text-muted" />
                                      <span>{new Date(user.dateJoined).toLocaleDateString()}</span>
                                    </div>
                                  </td>
                                  <td className="border-0 text-end">
                                    <div className="btn-group" role="group">
                                      <button className="btn btn-sm btn-outline-primary" title="View">
                                        <Eye size={14} />
                                      </button>
                                      <button className="btn btn-sm btn-outline-secondary" title="Edit">
                                        <Edit size={14} />
                                      </button>
                                      <button className="btn btn-sm btn-outline-danger" title="Delete">
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="text-center py-5">
                                  <UserIcon size={48} className="text-muted mb-3" />
                                  <h5>No users found</h5>
                                  <p className="text-muted">
                                    {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                                      ? 'Try adjusting your filters or search term'
                                      : 'No users have been added yet'}
                                  </p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="row mt-4">
                  <div className="col-12">
                    <nav aria-label="Users pagination">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => setCurrentPage(number)}
                            >
                              {number}
                            </button>
                          </li>
                        ))}
                        
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}