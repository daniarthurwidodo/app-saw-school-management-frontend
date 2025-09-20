import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const Documents = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Classes Management</h1>
        <p className="text-gray-600">Manage class schedules, assignments, and academic resources.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Mathematics</h2>
          <p className="text-gray-600 mb-1">Grade 10 - Section A</p>
          <p className="text-gray-600 mb-4">Mr. Johnson</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Students: 28</span>
            <span>Room: 101</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Science</h2>
          <p className="text-gray-600 mb-1">Grade 9 - Section B</p>
          <p className="text-gray-600 mb-4">Dr. Williams</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Students: 25</span>
            <span>Room: 205</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">English</h2>
          <p className="text-gray-600 mb-1">Grade 11 - Section C</p>
          <p className="text-gray-600 mb-4">Ms. Davis</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Students: 30</span>
            <span>Room: 108</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Class Schedule</h2>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md">
            + Add New Class
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Mathematics Grade 10</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Mr. Johnson</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">9:00 AM - 10:00 AM</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Room 101</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Science Grade 9</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Dr. Williams</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">10:30 AM - 11:30 AM</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Lab 205</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Documents;