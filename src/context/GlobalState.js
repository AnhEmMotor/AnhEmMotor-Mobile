import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalStateContext = createContext();

const STORAGE_KEY = '@AEM_Customer_Profile';

export const GlobalStateProvider = ({ children }) => {
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Mock 3 unread
  const [isDataSyncing, setIsDataSyncing] = useState(false);
  const [themeMode, setThemeModeState] = useState(null); // Khởi tạo là null hoặc undefined để chỉ ra rằng theme chưa được tải
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  // Tải chủ đề toàn hệ thống từ AsyncStorage khi ứng dụng khởi chạy
  useEffect(() => {
    const loadGlobalTheme = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          if (parsed && parsed.settings && parsed.settings.theme) {
            setThemeModeState(parsed.settings.theme); // Sử dụng theme đã lưu
          } else {
            // Nếu không có theme đã lưu, đặt mặc định
            setThemeModeState('dark'); // Mặc định là tối theo chuẩn AEM
          }
        }
      } catch (err) {
        console.error('[GlobalState] Tải chủ đề thất bại:', err);
      }
    };
    loadGlobalTheme();
  }, []);

  // Cập nhật chủ đề toàn hệ thống và lưu trữ xuống AsyncStorage
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
            theme: newTheme
          }
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } else {
        // Nếu chưa có profile trong máy, tạo mới bản ghi lưu cài đặt
        const dummyProfile = {
          settings: {
            theme: newTheme,
            notifications: true,
            biometrics: false,
            language: 'vi'
          }
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dummyProfile));
      }
    } catch (err) {
      console.error('[GlobalState] Lưu cấu hình chủ đề thất bại:', err);
    }
  };

  const markAllAsRead = () => setUnreadNotifications(0);

  return (
    <GlobalStateContext.Provider value={{
      unreadNotifications,
      setUnreadNotifications,
      markAllAsRead,
      isDataSyncing,
      setIsDataSyncing,
      themeMode,
      setThemeMode,
      isSettingsOpen,
      setSettingsOpen
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
