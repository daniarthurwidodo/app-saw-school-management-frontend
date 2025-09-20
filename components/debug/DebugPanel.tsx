import React, { useState } from 'react';

interface DebugInfo {
  [key: string]: any;
}

interface DebugPanelProps {
  debugInfo: DebugInfo;
  isOpen?: boolean;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ debugInfo, isOpen = false }) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isVisible) {
    return (
      <button
        className="btn btn-dark position-fixed"
        style={{ 
          bottom: '20px', 
          right: '20px',
          zIndex: 9999
        }}
        onClick={() => setIsVisible(true)}
      >
        Debug
      </button>
    );
  }

  return (
    <div
      className="position-fixed bg-dark text-light rounded shadow"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex: 9999,
        minWidth: '300px',
        maxHeight: '400px',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="d-flex justify-content-between align-items-center p-2 bg-secondary"
        onMouseDown={handleMouseDown}
        style={{ cursor: 'move' }}
      >
        <strong>Debug Panel</strong>
        <div>
          <button
            className="btn btn-sm btn-outline-light me-1"
            onClick={() => setIsVisible(false)}
          >
            Hide
          </button>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setIsVisible(false)}
          >
            ×
          </button>
        </div>
      </div>
      <div className="p-2" style={{ maxHeight: '350px', overflowY: 'auto' }}>
        <pre className="text-light small mb-0">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DebugPanel;