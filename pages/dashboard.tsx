import React, { useState } from 'react';
import Head from 'next/head';
import { Card, Button } from '../components/ui';
import Sidebar from '../components/layout/Sidebar';
import { ProtectedRoute } from '../components/auth';
import {
  Users,
  GraduationCap,
  Calendar,
  BarChart3,
  MessageCircle,
  PartyPopper,
  Menu
} from 'lucide-react';

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const stats = [
    { title: 'Total Students', value: '1,247', change: '+12%', changeType: 'positive' },
    { title: 'Active Teachers', value: '89', change: '+3%', changeType: 'positive' },
    { title: 'Classes Today', value: '24', change: '0%', changeType: 'neutral' },
    { title: 'Attendance Rate', value: '94.2%', change: '+2.1%', changeType: 'positive' }
  ];

  const quickActions = [
    { title: 'Student Management', description: 'Efficiently manage student records, grades, and attendance.', action: 'View Students', icon: Users },
    { title: 'Teacher Portal', description: 'Streamline communication between teachers and students.', action: 'View Teachers', icon: GraduationCap },
    { title: 'Class Schedule', description: 'Manage class schedules and room assignments.', action: 'View Schedule', icon: Calendar },
    { title: 'Reports & Analytics', description: 'Generate comprehensive reports and analytics.', action: 'View Reports', icon: BarChart3 },
    { title: 'Parent Communication', description: 'Keep parents informed about their children\'s progress.', action: 'View Messages', icon: MessageCircle },
    { title: 'School Events', description: 'Manage school events and announcements.', action: 'View Events', icon: PartyPopper }
  ];

  const recentActivities = [
    { action: 'New student enrollment', user: 'John Smith', time: '2 minutes ago' },
    { action: 'Grade updated for Math Class', user: 'Ms. Johnson', time: '15 minutes ago' },
    { action: 'Parent meeting scheduled', user: 'Dr. Williams', time: '1 hour ago' },
    { action: 'Assignment created for Science', user: 'Mr. Davis', time: '2 hours ago' }
  ];

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
                  <div className="col-12 col-md-8">
                    <h1 className="dashboard-title mb-2">Dashboard</h1>
                    <p className="dashboard-subtitle mb-0">
                      Welcome back! Here's what's happening at your school today.
                    </p>
                  </div>
                  <div className="col-12 col-md-4 mt-3 mt-md-0">
                    <div className="text-md-end">
                      <span className="badge bg-success me-2">Online</span>
                      <small className="text-muted">Last updated: 2 minutes ago</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="row g-3 mb-4">
                {stats.map((stat, index) => (
                  <div key={index} className="col-6 col-lg-3">
                    <div className="card stat-card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="card-subtitle mb-2 text-muted">{stat.title}</h6>
                            <h4 className="card-title mb-1 fw-bold">{stat.value}</h4>
                            <small className={`stat-change ${stat.changeType}`}>
                              {stat.change} from last month
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="section-title mb-3">Quick Actions</h5>
                </div>
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <div key={index} className="col-12 col-sm-6 col-lg-4 mb-3">
                      <Card title={action.title} className="action-card">
                        <div className="action-icon mb-3">
                          <IconComponent size={32} />
                        </div>
                        <p className="card-text small">{action.description}</p>
                        <Button variant="primary" className="btn-sm w-100">{action.action}</Button>
                      </Card>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div className="row">
                <div className="col-12 col-lg-8 mb-4">
                  <div className="card activity-card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">Recent Activity</h5>
                      <Button variant="outline-primary" className="btn-sm">View All</Button>
                    </div>
                    <div className="card-body p-0">
                      {recentActivities.length > 0 ? (
                        <div className="list-group list-group-flush">
                          {recentActivities.map((activity, index) => (
                            <div key={index} className="list-group-item d-flex justify-content-between align-items-start">
                              <div className="ms-2 me-auto">
                                <div className="fw-bold small">{activity.action}</div>
                                <small className="text-muted">by {activity.user}</small>
                              </div>
                              <small className="text-muted">{activity.time}</small>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted mb-0">No recent activity to display.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Today's Schedule</h5>
                    </div>
                    <div className="card-body">
                      <div className="schedule-item mb-3">
                        <div className="d-flex justify-content-between">
                          <strong>Math - Grade 10</strong>
                          <span className="badge bg-primary">9:00 AM</span>
                        </div>
                        <small className="text-muted">Room 101</small>
                      </div>
                      <div className="schedule-item mb-3">
                        <div className="d-flex justify-content-between">
                          <strong>Science - Grade 9</strong>
                          <span className="badge bg-success">10:30 AM</span>
                        </div>
                        <small className="text-muted">Lab A</small>
                      </div>
                      <div className="schedule-item">
                        <div className="d-flex justify-content-between">
                          <strong>History - Grade 11</strong>
                          <span className="badge bg-warning">2:00 PM</span>
                        </div>
                        <small className="text-muted">Room 205</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}