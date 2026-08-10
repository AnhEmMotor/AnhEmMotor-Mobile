import React, { useEffect, useState } from 'react';
import { Platform, useColorScheme, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutGrid, User, LifeBuoy, Motorbike, Package, Bell } from 'lucide-react-native';
import { Theme, useActiveColors } from '../theme/Theme';
import { useGlobalState } from '../context/GlobalState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/Shared/RegisterScreen';
import ForgotPasswordScreen from '../screens/Shared/ForgotPasswordScreen';
import HomeScreen from '../screens/Customer/HomeScreen';
import CatalogScreen from '../screens/Customer/CatalogScreen';
import BookingScreen from '../screens/Customer/BookingScreen';
import MyVehiclesScreen from '../screens/Customer/MyVehiclesScreen';
import SupportScreen from '../screens/Customer/SupportScreen';
import ProfileScreen from '../screens/Customer/ProfileScreen';
import NotificationScreen from '../screens/Customer/NotificationScreen';
import ProfileEditScreen from '../screens/Customer/ProfileEditScreen';
import VehicleDetailScreen from '../screens/Customer/VehicleDetail/VehicleDetailScreen';
import MyVehicleDetailScreen from '../screens/Customer/MyVehicles/MyVehicleDetailScreen';
import AIChatScreen from '../screens/Customer/AIChatScreen';
import QRScanScreen from '../screens/Customer/QRScanScreen';
import SavedNewsScreen from '../screens/Customer/SavedNewsScreen';
import ProductListScreen from '../screens/Customer/ProductList/ProductListScreen';
import ContactStaffScreen from '../screens/Customer/ContactStaffScreen';
import HomeDetailScreen from '../screens/Customer/HomeDetailScreen';
import InvoiceScreen from '../screens/Customer/InvoiceScreen';
import ServiceHistoryScreen from '../screens/Customer/ServiceHistoryScreen';
import FinancialHubScreen from '../screens/Customer/FinancialHubScreen';
import LegalProgressScreen from '../screens/Customer/LegalProgressScreen';
import AppointmentBookingScreen from '../screens/Customer/Appointment/AppointmentBookingScreen';
import FinanceContractScreen from '../screens/Customer/FinanceContract/FinanceContractScreen';

import GlobalSettingsModal from '../components/GlobalSettingsModal';
import { navigationRef } from './RootNavigation';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CustomerTabs() {
  const activeColors = useActiveColors();
  const { themeMode } = useGlobalState();
  const systemScheme = useColorScheme();
  const _isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom > 0 ? insets.bottom : 20;
  const barHeight = 55 + bottomInset;
  const paddingBottom = insets.bottom > 0 ? insets.bottom - 4 : 10;

  const tabBg = activeColors.background;
  const tabActiveText = Theme.staticColors.primary;
  const tabInactiveText = activeColors.subtext;
  const tabBorderTop = activeColors.border;

  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: tabBg,
        borderTopWidth: 1,
        borderTopColor: tabBorderTop,
        height: barHeight,
        paddingBottom: paddingBottom,
        paddingTop: 10,
        elevation: 0,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      },
      tabBarActiveTintColor: tabActiveText,
      tabBarInactiveTintColor: tabInactiveText,
    }}>
      <Tab.Screen name="Hub" component={HomeScreen} options={{ tabBarIcon: ({color}) => <LayoutGrid color={color} size={22} />, tabBarLabel: 'Trang chủ' }} />
      <Tab.Screen name="Catalog" component={CatalogScreen} options={{ tabBarIcon: ({color}) => <Package color={color} size={22} />, tabBarLabel: 'Sản phẩm' }} />
      <Tab.Screen name="MyVehicles" component={MyVehiclesScreen} options={{ tabBarIcon: ({color}) => <Motorbike color={color} size={22} />, tabBarLabel: 'Xe của tôi' }} />
      <Tab.Screen name="Notification" component={NotificationScreen} options={{ tabBarIcon: ({color}) => <Bell color={color} size={22} />, tabBarLabel: 'Thông báo' }} />
      <Tab.Screen name="Support" component={SupportScreen} options={{ tabBarIcon: ({color}) => <LifeBuoy color={color} size={22} />, tabBarLabel: 'Hỗ trợ' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({color}) => <User color={color} size={22} />, tabBarLabel: 'Cá nhân' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const profileStr = await AsyncStorage.getItem('@AEM_Customer_Profile');
        if (token && profileStr) {
          setInitialRoute('CustomerHome');
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setInitialRoute('Login');
      }
    };
    checkAuthStatus();
  }, []);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E31B23" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false, animation: Platform.OS === 'web' ? 'none' : 'slide_from_right' }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="CustomerHome" component={CustomerTabs} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="MyVehicles" component={MyVehiclesScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
        <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
        <Stack.Screen name="MyVehicleDetail" component={MyVehicleDetailScreen} />
        <Stack.Screen name="AIChat" component={AIChatScreen} />
        <Stack.Screen name="QRScan" component={QRScanScreen} />
        <Stack.Screen name="SavedNews" component={SavedNewsScreen} />
        <Stack.Screen name="ProductList" component={ProductListScreen} />
        <Stack.Screen name="ContactStaff" component={ContactStaffScreen} />
        <Stack.Screen name="HomeDetail" component={HomeDetailScreen} />
        <Stack.Screen name="InvoiceScreen" component={InvoiceScreen} />
        <Stack.Screen name="ServiceHistory" component={ServiceHistoryScreen} />
        <Stack.Screen name="FinancialHub" component={FinancialHubScreen} />
        <Stack.Screen name="LegalProgress" component={LegalProgressScreen} />
        <Stack.Screen name="AppointmentBooking" component={AppointmentBookingScreen} />
        <Stack.Screen name="FinanceContract" component={FinanceContractScreen} />
      </Stack.Navigator>
      <GlobalSettingsModal />
    </NavigationContainer>
  );
}
