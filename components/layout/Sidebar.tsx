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
      {isMobileOpen && <div className="mobile-overlay d-block d-md-none" onClick={handleMobileMenuClose} />}

      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="sidebar-logo me-2">
              <GraduationCap size={24} />
            </div>
            {!isCollapsed && <h5 className="mb-0 sidebar-title">School Management</h5>}
          </div>
          <button
            className="btn btn-link sidebar-toggle d-none d-md-block"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      <div className="sidebar-menu">
        <ul className="nav flex-column">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id} className="nav-item">
                <Link
                  href={item.href}
                  className={`nav-link d-flex align-items-center ${activeItem === item.id ? 'active' : ''}`}
                  title={item.label}
                  onClick={handleMobileMenuClose}
                >
                  <span className="menu-icon me-3">
                    <IconComponent size={20} />
                  </span>
                  {!isCollapsed && <span className="menu-text">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-footer mt-auto">
          <div className="nav-item">
            <a
              className="nav-link d-flex align-items-center logout-link"
              onClick={() => {
                handleMobileMenuClose();
                handleLogout();
              }}
              style={{ cursor: 'pointer' }}
              title="Logout"
            >
              <span className="menu-icon me-3">
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