import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutGrid, Car, User, LifeBuoy, Motorbike, Package, Bell, BarChart2, Calendar, Users, Truck, MessageSquare } from 'lucide-react-native';
import { Theme, useActiveColors } from '../theme/Theme';
import { useGlobalState } from '../context/GlobalState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LoginScreen from '../screens/LoginScreen';
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


// Admin Screens
import DashboardScreen from '../screens/Admin/DashboardScreen';
import AdminProfileScreen from '../screens/Admin/AdminProfileScreen';
import AppointmentManageScreen from '../screens/Admin/AppointmentManageScreen';
import InventoryScreen from '../screens/Admin/InventoryScreen';
import CashFlowScreen from '../screens/Admin/CashFlowScreen';
import LeadScreen from '../screens/Admin/LeadScreen';
import SupportHubScreen from '../screens/Admin/SupportHubScreen';
import OrderManageScreen from '../screens/Admin/OrderManageScreen';
import HubScreen from '../screens/Admin/HubScreen';
import GlobalSettingsModal from '../components/GlobalSettingsModal';
import { navigationRef } from './RootNavigation';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CustomerTabs() {
  const activeColors = useActiveColors();
  const { themeMode } = useGlobalState();
  const systemScheme = useColorScheme();
  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
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
      <Tab.Screen name="Hub" component={HomeScreen} options={{
        tabBarIcon: ({color}) => <LayoutGrid color={color} size={22} />,
        tabBarLabel: 'Trang chủ'
      }} />
      <Tab.Screen name="Catalog" component={CatalogScreen} options={{
        tabBarIcon: ({color}) => <Package color={color} size={22} />,
        tabBarLabel: 'Sản phẩm'
      }} />
      <Tab.Screen name="MyVehicles" component={MyVehiclesScreen} options={{
        tabBarIcon: ({color}) => <Motorbike color={color} size={22} />,
        tabBarLabel: 'Xe của tôi'
      }} />

      <Tab.Screen name="Notification" component={NotificationScreen} options={{
        tabBarIcon: ({color}) => <Bell color={color} size={22} />,
        tabBarLabel: 'Thông báo'
      }} />
      <Tab.Screen name="Support" component={SupportScreen} options={{
        tabBarIcon: ({color}) => <LifeBuoy color={color} size={22} />,
        tabBarLabel: 'Hỗ trợ'
      }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        tabBarIcon: ({color}) => <User color={color} size={22} />,
        tabBarLabel: 'Cá nhân'
      }} />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  const activeColors = useActiveColors();
  const { themeMode } = useGlobalState();
  const systemScheme = useColorScheme();
  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
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
        paddingTop: 8,
        elevation: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: isDark ? 0.4 : 0.2,
        shadowRadius: 8,
      },
      tabBarActiveTintColor: tabActiveText,
      tabBarInactiveTintColor: tabInactiveText,
    }}>
      <Tab.Screen name="AdminDashboard" component={DashboardScreen} options={{
        tabBarIcon: ({color}) => <BarChart2 color={color} size={24} />,
        tabBarLabel: 'Tổng quan'
      }} />
      <Tab.Screen name="AdminAppointments" component={AppointmentManageScreen} options={{
        tabBarIcon: ({color}) => <Calendar color={color} size={24} />,
        tabBarLabel: 'Lịch hẹn',
        tabBarBadge: 2, // Red notification badge
        tabBarBadgeStyle: { backgroundColor: Theme.staticColors.error, color: Theme.staticColors.secondary, fontSize: 10, fontWeight: 'bold' }
      }} />
      <Tab.Screen name="AdminOrders" component={OrderManageScreen} options={{
        tabBarIcon: ({color}) => <Truck color={color} size={24} />,
        tabBarLabel: 'Đơn hàng'
      }} />
      <Tab.Screen name="AdminLeads" component={LeadScreen} options={{
        tabBarIcon: ({color}) => <Users color={color} size={24} />,
        tabBarLabel: 'Khách hàng'
      }} />
      <Tab.Screen name="AdminHub" component={HubScreen} options={{
        tabBarIcon: ({color}) => <LayoutGrid color={color} size={24} />,
        tabBarLabel: 'Tiện ích'
      }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
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


        {/* Admin Stack */}
        <Stack.Screen name="AdminHome" component={AdminTabs} />
        <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
        <Stack.Screen name="AdminAppointments" component={AppointmentManageScreen} />
        <Stack.Screen name="AdminInventory" component={InventoryScreen} />
        <Stack.Screen name="CashFlow" component={CashFlowScreen} />
        <Stack.Screen name="AdminLeads" component={LeadScreen} />
        <Stack.Screen name="SupportHub" component={SupportHubScreen} />
        <Stack.Screen name="AdminOrders" component={OrderManageScreen} />
      </Stack.Navigator>
      <GlobalSettingsModal />
    </NavigationContainer>
  );
}

