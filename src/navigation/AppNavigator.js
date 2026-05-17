import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutGrid, Car, User, LifeBuoy, Bike, Bell } from 'lucide-react-native';
import { Theme } from '../theme/Theme';
import { useGlobalState } from '../context/GlobalState';

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


// Admin Screens
import DashboardScreen from '../screens/Admin/DashboardScreen';
import AdminProfileScreen from '../screens/Admin/AdminProfileScreen';
import AppointmentManageScreen from '../screens/Admin/AppointmentManageScreen';
import InventoryScreen from '../screens/Admin/InventoryScreen';
import CashFlowScreen from '../screens/Admin/CashFlowScreen';
import LeadScreen from '../screens/Admin/LeadScreen';
import SupportHubScreen from '../screens/Admin/SupportHubScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CustomerTabs() {
  const { themeMode } = useGlobalState();
  const systemScheme = useColorScheme();
  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  const tabBg = isDark ? '#111827' : '#FFFFFF';
  const tabActiveText = Theme.colors.primary;
  const tabInactiveText = isDark ? '#64748B' : '#94A3B8';
  const tabBorderTop = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { 
        backgroundColor: tabBg, 
        borderTopWidth: 1, 
        borderTopColor: tabBorderTop,
        height: 85, 
        paddingBottom: 25,
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
        tabBarLabel: 'The Hub'
      }} />
      <Tab.Screen name="Catalog" component={CatalogScreen} options={{
        tabBarIcon: ({color}) => <Bike color={color} size={22} />,
        tabBarLabel: 'Catalog'
      }} />
      <Tab.Screen name="MyVehicles" component={MyVehiclesScreen} options={{
        tabBarIcon: ({color}) => <Car color={color} size={22} />,
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

export default function AppNavigator() {
  return (
    <NavigationContainer>
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
        
        {/* Admin Stack */}
        <Stack.Screen name="AdminHome" component={DashboardScreen} />
        <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
        <Stack.Screen name="AdminAppointments" component={AppointmentManageScreen} />
        <Stack.Screen name="AdminInventory" component={InventoryScreen} />
        <Stack.Screen name="CashFlow" component={CashFlowScreen} />
        <Stack.Screen name="AdminLeads" component={LeadScreen} />
        <Stack.Screen name="SupportHub" component={SupportHubScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}