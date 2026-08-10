import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalStateContext = createContext();

const STORAGE_KEY = '@AEM_Customer_Profile';

export const GlobalStateProvider = ({ children }) => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isDataSyncing, setIsDataSyncing] = useState(false);
  const [themeMode, setThemeModeState] = useState(null); 
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  
  useEffect(() => {
    const loadGlobalTheme = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          if (parsed && parsed.settings && parsed.settings.theme) {
            setThemeModeState(parsed.settings.theme); 
          } else {
            
            setThemeModeState('light'); 
          }
        }
      } catch (err) {
        console.error('[GlobalState] Tải chủ đề thất bại:', err);
      }
    };
    loadGlobalTheme();
  }, []);

  
  const setThemeMode = async (newTheme) => {
    setThemeModeState(newTheme);
    try {
      const storedProfile = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        const updated = {
          ...parsed,
          settings: {
            ...(parsed.settings || {}),
            theme: newTheme,
          },
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } else {
        
        const dummyProfile = {
          settings: {
            theme: newTheme,
            notifications: true,
            biometrics: false,
            language: 'vi',
          },
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dummyProfile));
      }
    } catch (err) {
      console.error('[GlobalState] Lưu cấu hình chủ đề thất bại:', err);
    }
  };

  const markAllAsRead = () => setUnreadNotifications(0);

  return (
    <GlobalStateContext.Provider
      value={{
        unreadNotifications,
        setUnreadNotifications,
        markAllAsRead,
        isDataSyncing,
        setIsDataSyncing,
        themeMode,
        setThemeMode,
        isSettingsOpen,
        setSettingsOpen,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
