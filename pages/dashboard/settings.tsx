import React, { useState } from 'react';
import Head from 'next/head';
import Sidebar from '../../components/layout/Sidebar';
import { ProtectedRoute } from '../../components/auth';
import { Loading } from '../../components/ui';
import { Menu, Save, User, Shield, Bell, Database } from 'lucide-react';

export default function SettingsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading] = useState(false); // For consistency with other pages

  if (loading) {
    return (
      <ProtectedRoute>
        <Loading message="Loading settings..." />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Settings - School Management System</title>
        <meta name="description" content="Configure your school management system" />
      </Head>
      <div className="dashboard-layout">
        <div className="dashboard-sidebar">
          <Sidebar
            activeItem="setting"
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
                    <h1 className="dashboard-title mb-2">Settings</h1>
                    <p className="dashboard-subtitle mb-0">
                      Configure your school management system
                    </p>
                  </div>
                </div>
              </div>

              {/* Settings Sections */}
              <div className="row g-4">
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="p-4 bg-white rounded shadow-sm h-100 settings-section">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary bg-opacity-10 p-2 rounded me-3 icon-wrapper">
                        <User size={24} className="text-primary" />
                      </div>
                      <h5 className="mb-0">Profile Settings</h5>
                    </div>
                    <p className="text-muted">
                      Manage your personal profile information and preferences.
                    </p>
                    <button className="btn btn-outline-primary w-100">
                      Configure
                    </button>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <div className="p-4 bg-white rounded shadow-sm h-100 settings-section">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-success bg-opacity-10 p-2 rounded me-3 icon-wrapper">
                        <Shield size={24} className="text-success" />
                      </div>
                      <h5 className="mb-0">Security</h5>
                    </div>
                    <p className="text-muted">
                      Update passwords, enable two-factor authentication, and manage security settings.
                    </p>
                    <button className="btn btn-outline-primary w-100">
                      Configure
                    </button>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <div className="p-4 bg-white rounded shadow-sm h-100 settings-section">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-info bg-opacity-10 p-2 rounded me-3 icon-wrapper">
                        <Bell size={24} className="text-info" />
                      </div>
                      <h5 className="mb-0">Notifications</h5>
                    </div>
                    <p className="text-muted">
                      Configure email and push notification preferences.
                    </p>
                    <button className="btn btn-outline-primary w-100">
                      Configure
                    </button>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <div className="p-4 bg-white rounded shadow-sm h-100 settings-section">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-warning bg-opacity-10 p-2 rounded me-3 icon-wrapper">
                        <Database size={24} className="text-warning" />
                      </div>
                      <h5 className="mb-0">Data Management</h5>
                    </div>
                    <p className="text-muted">
                      Backup, restore, and manage your school's data.
                    </p>
                    <button className="btn btn-outline-primary w-100">
                      Configure
                    </button>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <div className="p-4 bg-white rounded shadow-sm h-100 settings-section">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-danger bg-opacity-10 p-2 rounded me-3 icon-wrapper">
                        <Save size={24} className="text-danger" />
                      </div>
                      <h5 className="mb-0">System Preferences</h5>
                    </div>
                    <p className="text-muted">
                      Customize the system behavior and appearance.
                    </p>
                    <button className="btn btn-outline-primary w-100">
                      Configure
                    </button>
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