import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();

  const menuItems = [
    { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
    { icon: '👥', label: 'Students', path: '/dashboard/users' },
    { icon: '📚', label: 'Classes', path: '/dashboard/documents' },
    { icon: '✏️', label: 'Assignments', path: '/dashboard/tasks' },
    { icon: '📋', label: 'Kanban Board', path: '/dashboard/kanban' },
    { icon: '⚙️', label: 'Settings', path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white min-h-screen p-5 flex flex-col shadow-xl">
      <div className="mb-8 mt-4">
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          School Management
        </h2>
        <p className="text-xs text-gray-400 text-center mt-1">Admin Dashboard</p>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link 
                href={item.path}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-700 ${
                  router.pathname === item.path 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                    : 'text-gray-300'
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="pt-4 border-t border-gray-700">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors duration-200"
        >
          <span className="text-lg mr-3">🔐</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;