import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutGrid, Car, User, ShieldCheck, LifeBuoy } from 'lucide-react-native';
import { Theme } from '../theme/Theme';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/Customer/HomeScreen';
import CatalogScreen from '../screens/Customer/CatalogScreen';
import BookingScreen from '../screens/Customer/BookingScreen';
import MyVehiclesScreen from '../screens/Customer/MyVehiclesScreen';
import SupportScreen from '../screens/Customer/SupportScreen';
import ProfileScreen from '../screens/Customer/ProfileScreen';
import NotificationScreen from '../screens/Customer/NotificationScreen';
import ProfileEditScreen from '../screens/Customer/ProfileEditScreen';
import VehicleDetailScreen from '../screens/Customer/VehicleDetailScreen';
import AIChatScreen from '../screens/Customer/AIChatScreen';
import QRScanScreen from '../screens/Customer/QRScanScreen';
import SavedNewsScreen from '../screens/Customer/SavedNewsScreen';

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
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { 
        backgroundColor: Theme.colors.card, 
        borderTopWidth: 0, 
        height: 85, 
        paddingBottom: 25,
        paddingTop: 10,
        elevation: 0,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      },
      tabBarActiveTintColor: Theme.colors.primary,
      tabBarInactiveTintColor: Theme.colors.subtext,
    }}>
      <Tab.Screen name="Hub" component={HomeScreen} options={{
        tabBarIcon: ({color}) => <LayoutGrid color={color} size={24} />,
        tabBarLabel: 'The Hub'
      }} />
      <Tab.Screen name="Catalog" component={CatalogScreen} options={{
        tabBarIcon: ({color}) => <Car color={color} size={24} />,
        tabBarLabel: 'Catalog'
      }} />
      <Tab.Screen name="Booking" component={BookingScreen} options={{
        tabBarIcon: ({color}) => <ShieldCheck color={color} size={24} />,
        tabBarLabel: 'Đặt lịch'
      }} />
      <Tab.Screen name="Support" component={SupportScreen} options={{
        tabBarIcon: ({color}) => <LifeBuoy color={color} size={24} />,
        tabBarLabel: 'Hỗ trợ'
      }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        tabBarIcon: ({color}) => <User color={color} size={24} />,
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
        <Stack.Screen name="AIChat" component={AIChatScreen} />
        <Stack.Screen name="QRScan" component={QRScanScreen} />
        <Stack.Screen name="SavedNews" component={SavedNewsScreen} />
        
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