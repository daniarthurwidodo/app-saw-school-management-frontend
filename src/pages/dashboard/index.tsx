import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import TanstackExample from '../../components/TanstackExample';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the School Management Dashboard!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
              <span className="text-xl">👥</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Students</h2>
              <p className="text-2xl font-bold text-gray-900">142</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Total enrolled</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
              <span className="text-xl">📚</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Classes</h2>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Active classes</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
              <span className="text-xl">👨‍🏫</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Teachers</h2>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Staff members</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-4">
              <span className="text-xl">✏️</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Assignments</h2>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Due this week</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <p className="font-medium text-gray-800">New student enrolled</p>
              <p className="text-gray-600 text-sm">John Doe joined Math Grade 10</p>
              <p className="text-gray-400 text-xs mt-1">2 hours ago</p>
            </li>
            <li className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <p className="font-medium text-gray-800">Assignment submitted</p>
              <p className="text-gray-600 text-sm">Science Project by Jane Smith</p>
              <p className="text-gray-400 text-xs mt-1">5 hours ago</p>
            </li>
            <li className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <p className="font-medium text-gray-800">Class schedule updated</p>
              <p className="text-gray-600 text-sm">Physics Grade 11 - Room 204</p>
              <p className="text-gray-400 text-xs mt-1">1 day ago</p>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
          <ul className="space-y-4">
            <li className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <p className="font-medium text-gray-800">Parent-Teacher Meeting</p>
              <p className="text-gray-600 text-sm">October 15, 2023 - 3:00 PM</p>
            </li>
            <li className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <p className="font-medium text-gray-800">Midterm Exams</p>
              <p className="text-gray-600 text-sm">October 20-25, 2023</p>
            </li>
            <li className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <p className="font-medium text-gray-800">School Holiday</p>
              <p className="text-gray-600 text-sm">November 2, 2023</p>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Management Example</h2>
        <TanstackExample />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;