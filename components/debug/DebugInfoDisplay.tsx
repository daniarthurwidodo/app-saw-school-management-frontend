import React from 'react';

interface DebugInfoDisplayProps {
  title: string;
  data: any;
  className?: string;
}

export const DebugInfoDisplay: React.FC<DebugInfoDisplayProps> = ({ 
  title, 
  data, 
  className = '' 
}) => {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div className={`card mt-3 ${className}`}>
      <div className="card-header bg-dark text-light">
        <h6 className="mb-0">
          Debug: {title}
        </h6>
      </div>
      <div className="card-body">
        <pre className="mb-0 small" style={{ 
          maxHeight: '200px', 
          overflowY: 'auto',
          backgroundColor: '#f8f9fa',
          padding: '10px',
          borderRadius: '4px'
        }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DebugInfoDisplay;