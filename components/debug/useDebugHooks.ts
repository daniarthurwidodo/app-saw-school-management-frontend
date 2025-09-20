import { useEffect, useRef } from 'react';
import { useDebug } from './DebugContext';

// Hook to track component render count
export const useRenderCount = (componentName: string) => {
  const { setDebugInfo } = useDebug();
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    setDebugInfo(`${componentName}_renderCount`, renderCount.current);
  });
  
  return renderCount.current;
};

// Hook to track state changes
export const useDebugState = <T,>(state: T, stateName: string) => {
  const { setDebugInfo } = useDebug();
  
  useEffect(() => {
    setDebugInfo(stateName, state);
  }, [state, stateName, setDebugInfo]);
  
  return state;
};

// Hook to log function calls
export const useDebugFunction = (fn: Function, functionName: string) => {
  const { setDebugInfo } = useDebug();
  
  return (...args: any[]) => {
    setDebugInfo(`${functionName}_call`, {
      timestamp: new Date().toISOString(),
      args
    });
    return fn(...args);
  };
};

// Hook to track performance
export const useDebugPerformance = (componentName: string) => {
  const { setDebugInfo } = useDebug();
  const startTime = useRef<number>(0);
  
  useEffect(() => {
    startTime.current = performance.now();
    return () => {
      const endTime = performance.now();
      setDebugInfo(`${componentName}_mountTime`, endTime - startTime.current);
    };
  }, [componentName, setDebugInfo]);
};