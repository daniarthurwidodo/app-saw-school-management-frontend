import React from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            School Management System
          </h1>
          <p className="text-gray-600">
            Welcome to the School Management Dashboard
          </p>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <span className="text-blue-600">👥</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Student Management</h3>
              <p className="text-sm text-gray-600">Track student progress and performance</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <span className="text-green-600">📚</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Class Management</h3>
              <p className="text-sm text-gray-600">Organize classes and schedules</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <span className="text-yellow-600">✏️</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Assignment Tracking</h3>
              <p className="text-sm text-gray-600">Monitor assignments and deadlines</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md font-medium"
        >
          Login to Dashboard
        </button>
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>© 2023 School Management System. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Home;