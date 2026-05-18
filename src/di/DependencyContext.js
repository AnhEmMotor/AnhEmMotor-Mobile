import React, { createContext, useContext } from 'react';
import { container } from './Container';

const DependencyContext = createContext(container);

export const DependencyProvider = ({ children, customContainer }) => {
  return (
    <DependencyContext.Provider value={customContainer || container}>
      {children}
    </DependencyContext.Provider>
  );
};

export const useDependency = () => useContext(DependencyContext);
