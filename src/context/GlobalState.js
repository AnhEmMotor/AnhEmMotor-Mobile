import React, { createContext, useState, useContext } from 'react';

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Mock 3 unread
  const [isDataSyncing, setIsDataSyncing] = useState(false);

  const markAllAsRead = () => setUnreadNotifications(0);

  return (
    <GlobalStateContext.Provider value={{
      unreadNotifications,
      setUnreadNotifications,
      markAllAsRead,
      isDataSyncing,
      setIsDataSyncing
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
