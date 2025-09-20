import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Sidebar from '../../components/layout/Sidebar';
import { ProtectedRoute } from '../../components/auth';
import { Card, Loading } from '../../components/ui';
import {
  Users,
  FileText,
  CheckSquare,
  Calendar,
  BookOpen,
  TrendingUp,
  Menu,
  ArrowUpRight,
  MoreHorizontal,
  Bell,
  Clock,
  User,
  File,
  BarChart2
} from 'lucide-react';

interface SummaryData {
  totalUsers: number;
  totalDocuments: number;
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  upcomingEvents: number;
  recentActivity: Activity[];
}

interface Activity {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
}

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upcomingEvents] = useState<Event[]>([
    { id: 1, title: "Parent-Teacher Conference", date: "2024-09-25", time: "14:00", type: "meeting" },
    { id: 2, title: "Math Exam", date: "2024-09-28", time: "09:00", type: "exam" },
    { id: 3, title: "Sports Day", date: "2024-10-02", time: "08:00", type: "event" },
    { id: 4, title: "Staff Meeting", date: "2024-10-05", time: "15:00", type: "meeting" },
  ]);

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchData = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setSummary({
          totalUsers: 142,
          totalDocuments: 56,
          totalTasks: 89,
          activeTasks: 23,
          completedTasks: 66,
          upcomingEvents: 5,
          recentActivity: [
            { id: 1, user: "John Smith", action: "uploaded", target: "Student Handbook", time: "2 hours ago" },
            { id: 2, user: "Sarah Wilson", action: "completed", target: "Grade Reports", time: "4 hours ago" },
            { id: 3, user: "Michael Davis", action: "assigned", target: "Math Homework", time: "1 day ago" },
            { id: 4, user: "Emily Johnson", action: "updated", target: "Class Schedule", time: "1 day ago" },
            { id: 5, user: "Robert Green", action: "created", target: "Budget Proposal", time: "2 days ago" }
          ]
        });
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Users', value: summary?.totalUsers || 0, icon: Users, color: 'primary' },
    { title: 'Documents', value: summary?.totalDocuments || 0, icon: FileText, color: 'info' },
    { title: 'Active Tasks', value: summary?.activeTasks || 0, icon: CheckSquare, color: 'warning' },
    { title: 'Completed Tasks', value: summary?.completedTasks || 0, icon: CheckSquare, color: 'success' },
  ];

  const quickActions = [
    { title: 'Create New Task', icon: CheckSquare, color: 'primary' },
    { title: 'Upload Document', icon: FileText, color: 'info' },
    { title: 'Add New User', icon: User, color: 'success' },
    { title: 'View Reports', icon: BarChart2, color: 'warning' },
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <Loading message="Loading dashboard..." />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard - School Management System</title>
        <meta name="description" content="School Management System Dashboard" />
      </Head>
      <div className="dashboard-layout">
        <div className="dashboard-sidebar">
          <Sidebar
            activeItem="user"
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
                    <h1 className="dashboard-title mb-2">Dashboard</h1>
                    <p className="dashboard-subtitle mb-0">
                      Welcome back! Here's what's happening with your school today.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="row g-4 mb-4">
                {statCards.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div className="col-12 col-md-6 col-lg-3" key={index}>
                      <div className="card h-100 stat-card">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="text-muted mb-1">{stat.title}</h6>
                              <h3 className="mb-0">{stat.value}</h3>
                            </div>
                            <div className={`bg-${stat.color} bg-opacity-10 p-3 rounded-circle`}>
                              <IconComponent size={24} className={`text-${stat.color}`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Main Content Grid */}
              <div className="row g-4">
                {/* Recent Activity */}
                <div className="col-12 col-lg-8">
                  <Card title="Recent Activity" className="h-100">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Action</th>
                            <th>Target</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {summary?.recentActivity.map((activity) => (
                            <tr key={activity.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-placeholder bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                                    {activity.user.charAt(0)}
                                  </div>
                                  <span>{activity.user}</span>
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-light text-dark">{activity.action}</span>
                              </td>
                              <td>{activity.target}</td>
                              <td>{activity.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>

                {/* Upcoming Events */}
                <div className="col-12 col-lg-4">
                  <Card title="Upcoming Events" className="h-100">
                    <div className="list-group list-group-flush">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="list-group-item px-0 py-3 border-0 event-item">
                          <div className="d-flex">
                            <div className="me-3">
                              <div className="bg-light p-2 rounded">
                                <Calendar size={20} className="text-muted" />
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{event.title}</h6>
                              <p className="text-muted mb-1">
                                <Clock size={14} className="me-1" />
                                {event.date} at {event.time}
                              </p>
                              <span className={`badge bg-${event.type === 'meeting' ? 'primary' : event.type === 'exam' ? 'warning' : 'success'}`}>
                                {event.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="col-12 col-lg-8">
                  <Card title="Quick Actions" className="h-100">
                    <div className="row g-3">
                      {quickActions.map((action, index) => {
                        const IconComponent = action.icon;
                        return (
                          <div className="col-6 col-md-3" key={index}>
                            <button className="btn btn-outline-primary w-100 h-100 p-3 action-card">
                              <div className="action-icon">
                                <IconComponent size={24} className={`text-${action.color}`} />
                              </div>
                              <div className="fw-medium">{action.title}</div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>

                {/* Notifications */}
                <div className="col-12 col-lg-4">
                  <Card title="Notifications" className="h-100">
                    <div className="d-flex flex-column h-100">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-3 p-3 bg-light rounded">
                          <div className="me-3">
                            <Bell size={20} className="text-primary" />
                          </div>
                          <div>
                            <h6 className="mb-0">System Maintenance</h6>
                            <p className="text-muted mb-0 small">Scheduled for tonight at 11:00 PM</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mb-3 p-3 bg-light rounded">
                          <div className="me-3">
                            <File size={20} className="text-info" />
                          </div>
                          <div>
                            <h6 className="mb-0">New Document Upload</h6>
                            <p className="text-muted mb-0 small">3 documents uploaded today</p>
                          </div>
                        </div>
                      </div>
                      <button className="btn btn-outline-primary w-100 mt-auto">
                        View All Notifications
                      </button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}