import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../auth';
import {
  Home,
  FileText,
  CheckSquare,
  Settings,
  LogOut,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Users
} from 'lucide-react';

interface SidebarProps {
  activeItem?: 'user' | 'document' | 'task' | 'setting' | 'users';
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem = 'user',
  isMobileOpen: externalMobileOpen,
  setIsMobileOpen: externalSetMobileOpen
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const { logout } = useAuth();

  // Use external state if provided, otherwise use internal state
  const isMobileOpen = externalMobileOpen !== undefined ? externalMobileOpen : internalMobileOpen;
  const setMobileOpenState = externalSetMobileOpen || setInternalMobileOpen;

  const menuItems = [
    { id: 'user', label: 'Dashboard', href: '/dashboard', icon: Home },
    { id: 'users', label: 'Users', href: '/dashboard/users', icon: Users },
    { id: 'document', label: 'Documents', href: '/dashboard/documents', icon: FileText },
    { id: 'task', label: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
    { id: 'setting', label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('.sidebar');
      const hamburger = document.querySelector('.mobile-hamburger');

      if (isMobileOpen && sidebar &&
          !sidebar.contains(event.target as Node)) {
        setMobileOpenState(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const handleLogout = () => {
    logout();
  };

  const handleMobileMenuClose = () => {
    setMobileOpenState(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={handleMobileMenuClose} />}

      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''} bg-gradient-to-b from-gray-800 to-gray-900 text-gray-300 min-h-screen flex flex-col transition-all duration-300`}>
      <div className="sidebar-header p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="sidebar-logo mr-2">
              <GraduationCap size={24} />
            </div>
            {!isCollapsed && <h5 className="mb-0 sidebar-title font-semibold text-white">School Management</h5>}
          </div>
          <button
            className="hidden md:block text-gray-300 hover:text-white p-1 rounded"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      <div className="sidebar-menu flex-1 flex flex-col">
        <ul className="flex flex-col space-y-1 p-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    activeItem === item.id
                      ? 'bg-gray-700 text-white'
                      : 'hover:bg-gray-700 hover:text-white'
                  }`}
                  title={item.label}
                  onClick={handleMobileMenuClose}
                >
                  <span className="menu-icon mr-3 flex items-center">
                    <IconComponent size={20} />
                  </span>
                  {!isCollapsed && <span className="menu-text">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-footer mt-auto">
          <div>
            <a
              className="flex items-center p-3 rounded-lg text-red-400 hover:bg-red-900 hover:bg-opacity-20 hover:text-red-300 cursor-pointer"
              onClick={() => {
                handleMobileMenuClose();
                handleLogout();
              }}
              title="Logout"
            >
              <span className="menu-icon mr-3 flex items-center">
                <LogOut size={20} />
              </span>
              {!isCollapsed && <span className="menu-text">Logout</span>}
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Sidebar;