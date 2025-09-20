import React from 'react';
import { useDebug } from './DebugContext';

export const DebugToggle: React.FC = () => {
  const { isDebugEnabled, setIsDebugEnabled } = useDebug();
  
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div className="position-fixed bottom-0 end-0 m-3">
      <button
        className={`btn btn-sm ${isDebugEnabled ? 'btn-danger' : 'btn-outline-dark'}`}
        onClick={() => setIsDebugEnabled(!isDebugEnabled)}
        style={{ zIndex: 9998 }}
      >
        {isDebugEnabled ? 'Disable Debug' : 'Enable Debug'}
      </button>
    </div>
  );
};

export default DebugToggle;