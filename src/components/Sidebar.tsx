import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div style={{ 
      width: '250px', 
      backgroundColor: '#333', 
      color: 'white', 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>School Management</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '15px' }}>
            <Link href="/dashboard" style={{ 
              color: 'white', 
              textDecoration: 'none',
              display: 'block',
              padding: '10px',
              borderRadius: '4px'
            }}>
              Home
            </Link>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <Link href="/dashboard/users" style={{ 
              color: 'white', 
              textDecoration: 'none',
              display: 'block',
              padding: '10px',
              borderRadius: '4px'
            }}>
              Users
            </Link>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <Link href="/dashboard/documents" style={{ 
              color: 'white', 
              textDecoration: 'none',
              display: 'block',
              padding: '10px',
              borderRadius: '4px'
            }}>
              Documents
            </Link>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <Link href="/dashboard/tasks" style={{ 
              color: 'white', 
              textDecoration: 'none',
              display: 'block',
              padding: '10px',
              borderRadius: '4px'
            }}>
              Tasks
            </Link>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <Link href="/dashboard/settings" style={{ 
              color: 'white', 
              textDecoration: 'none',
              display: 'block',
              padding: '10px',
              borderRadius: '4px'
            }}>
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;