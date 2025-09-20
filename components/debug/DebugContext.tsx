import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DebugContextType {
  debugInfo: Record<string, any>;
  setDebugInfo: (key: string, value: any) => void;
  clearDebugInfo: (key?: string) => void;
  isDebugEnabled: boolean;
  setIsDebugEnabled: (enabled: boolean) => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

interface DebugProviderProps {
  children: ReactNode;
}

export const DebugProvider: React.FC<DebugProviderProps> = ({ children }) => {
  const [debugInfo, setDebugInfoState] = useState<Record<string, any>>({});
  const [isDebugEnabled, setIsDebugEnabled] = useState(false);

  const setDebugInfo = (key: string, value: any) => {
    if (isDebugEnabled) {
      setDebugInfoState(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const clearDebugInfo = (key?: string) => {
    if (key) {
      setDebugInfoState(prev => {
        const newInfo = { ...prev };
        delete newInfo[key];
        return newInfo;
      });
    } else {
      setDebugInfoState({});
    }
  };

  return (
    <DebugContext.Provider value={{
      debugInfo,
      setDebugInfo,
      clearDebugInfo,
      isDebugEnabled,
      setIsDebugEnabled
    }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = (): DebugContextType => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};