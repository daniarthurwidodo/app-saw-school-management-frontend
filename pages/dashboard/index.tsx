import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Sidebar from '../../components/layout/Sidebar';
import { ProtectedRoute } from '../../components/auth';
import { Card, Loading } from '../../components/ui';
import { DebugPanel, useDebug, useRenderCount, useDebugState } from '../../components/debug';
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
  
  const { debugInfo, setDebugInfo, isDebugEnabled } = useDebug();
  const renderCount = useRenderCount('DashboardPage');
  const debugLoading = useDebugState(loading, 'dashboard_loading');

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchData = async () => {
      try {
        // Always use static data
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
        }, 800);
        setDebugInfo('dashboardData', 'From static data');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDebugInfo('dashboardError', error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [setDebugInfo]);

  useEffect(() => {
    setDebugInfo('dashboardState', {
      isMobileMenuOpen,
      loading,
      summaryLoaded: !!summary
    });
  }, [isMobileMenuOpen, loading, summary, setDebugInfo]);

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
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="w-full md:w-64">
          <Sidebar
            activeItem="user"
            isMobileOpen={isMobileMenuOpen}
            setIsMobileOpen={setIsMobileMenuOpen}
          />
        </div>
        <div className="flex-1">
          <div className="p-4 md:p-8">
            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden mb-4 p-2 rounded-md bg-gray-800 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Menu size={24} />
            </button>

            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600 mt-2">
                    Welcome back! Here's what's happening with your school today.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h6 className="text-gray-500 text-sm mb-1">{stat.title}</h6>
                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <IconComponent size={24} className="text-blue-600" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card title="Recent Activity" className="h-full">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {summary?.recentActivity.map((activity) => (
                          <tr key={activity.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                  {activity.user.charAt(0)}
                                </div>
                                <span>{activity.user}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {activity.action}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">{activity.target}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{activity.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* Upcoming Events */}
              <div>
                <Card title="Upcoming Events" className="h-full">
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="p-4 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex">
                          <div className="mr-4">
                            <div className="bg-gray-100 p-2 rounded">
                              <Calendar size={20} className="text-gray-500" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h6 className="font-medium mb-1">{event.title}</h6>
                            <p className="text-gray-500 text-sm mb-2">
                              <Clock size={14} className="inline mr-1" />
                              {event.date} at {event.time}
                            </p>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              event.type === 'meeting' 
                                ? 'bg-blue-100 text-blue-800' 
                                : event.type === 'exam' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-green-100 text-green-800'
                            }`}>
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
              <div className="lg:col-span-2">
                <Card title="Quick Actions" className="h-full">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => {
                      const IconComponent = action.icon;
                      return (
                        <button 
                          key={index} 
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center"
                        >
                          <div className="mb-2">
                            <IconComponent size={24} className="text-blue-600" />
                          </div>
                          <div className="text-sm font-medium">{action.title}</div>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* Notifications */}
              <div>
                <Card title="Notifications" className="h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex-1 space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start">
                          <div className="mr-3">
                            <Bell size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <h6 className="font-medium mb-1">System Maintenance</h6>
                            <p className="text-gray-500 text-sm">Scheduled for tonight at 11:00 PM</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start">
                          <div className="mr-3">
                            <File size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <h6 className="font-medium mb-1">New Document Upload</h6>
                            <p className="text-gray-500 text-sm">3 documents uploaded today</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      View All Notifications
                    </button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isDebugEnabled && (
        <DebugPanel 
          debugInfo={debugInfo} 
          isOpen={false}
        />
      )}
    </ProtectedRoute>
  );
}