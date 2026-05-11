import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { 
  LayoutGrid, 
  Car, 
  User, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  PackageSearch,
  LifeBuoy,
  CalendarCheck
} from 'lucide-react-native';

// --- IMPORT THEME ---
import { Theme } from '../theme/Theme';


// --- IMPORT SCREENS ---
import LoginScreen from '../screens/LoginScreen';

// Khách hàng (Customer)
import HomeScreen from '../screens/Customer/HomeScreen';
import CatalogScreen from '../screens/Customer/CatalogScreen';
import MyVehiclesScreen from '../screens/Customer/MyVehiclesScreen';
import ProfileScreen from '../screens/Customer/ProfileScreen';
import BookingScreen from '../screens/Customer/BookingScreen';
import LegalProgressScreen from '../screens/Customer/LegalProgressScreen';
import SupportScreen from '../screens/Customer/SupportScreen';
import VehicleDetailScreen from '../screens/Customer/VehicleDetailScreen';
import NotificationScreen from '../screens/Customer/NotificationScreen';
import InvoiceScreen from '../screens/Customer/InvoiceScreen';
import ServiceHistoryScreen from '../screens/Customer/ServiceHistoryScreen';
import AIChatScreen from '../screens/Customer/AIChatScreen';
import ContactStaffScreen from '../screens/Customer/ContactStaffScreen';
import ProfileEditScreen from '../screens/Customer/ProfileEditScreen';
import SuccessScreen from '../screens/Shared/SuccessScreen';

// Quản trị (Admin)
import DashboardScreen from '../screens/Admin/DashboardScreen';
import LeadScreen from '../screens/Admin/LeadScreen';
import InventoryScreen from '../screens/Admin/InventoryScreen';
import AppointmentManageScreen from '../screens/Admin/AppointmentManageScreen';
import CashFlowScreen from '../screens/Admin/CashFlowScreen';
import SupportHubScreen from '../screens/Admin/SupportHubScreen';
import AdminProfileScreen from '../screens/Admin/AdminProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- 1. LUỒNG TABS KHÁCH HÀNG (CUSTOMER TABS) ---
function CustomerTabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { 
        backgroundColor: Theme.colors.card, 
        borderTopWidth: 0, 
        height: 75, 
        paddingBottom: 15,
        paddingTop: 10,
        elevation: 0,
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
      <Tab.Screen name="MyVehicles" component={MyVehiclesScreen} options={{
        tabBarIcon: ({color}) => <ShieldCheck color={color} size={24} />,
        tabBarLabel: 'Xe của tôi'
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

// --- 2. LUỒNG TABS QUẢN TRỊ (ADMIN TABS) ---
function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { 
        backgroundColor: Theme.colors.card, 
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
        height: 75,
        paddingBottom: 15,
        paddingTop: 10,
        elevation: 0,
      },
      tabBarActiveTintColor: Theme.colors.secondary,
      tabBarInactiveTintColor: Theme.colors.subtext,
    }}>
      <Tab.Screen name="AdminDash" component={DashboardScreen} options={{
        tabBarIcon: ({color}) => <BarChart3 color={color} size={24} />,
        tabBarLabel: 'Dashboard'
      }} />
      <Tab.Screen name="AdminLeads" component={LeadScreen} options={{
        tabBarIcon: ({color}) => <Users color={color} size={24} />,
        tabBarLabel: 'Khách hàng'
      }} />
      <Tab.Screen name="AdminAppointments" component={AppointmentManageScreen} options={{
        tabBarIcon: ({color}) => <CalendarCheck color={color} size={24} />,
        tabBarLabel: 'Lịch hẹn'
      }} />
      <Tab.Screen name="AdminInventory" component={InventoryScreen} options={{
        tabBarIcon: ({color}) => <PackageSearch color={color} size={24} />,
        tabBarLabel: 'Kho xe'
      }} />
    </Tab.Navigator>
  );
}

// --- 3. ĐIỀU HƯỚNG TỔNG (ROOT NAVIGATOR) ---
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right' 
      }}>
        {/* Màn hình Đăng nhập */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Các luồng chính sau Login */}
        <Stack.Screen name="CustomerHome" component={CustomerTabs} />
        <Stack.Screen name="AdminHome" component={AdminTabs} />

        {/* Màn hình tác vụ phụ Admin */}
        <Stack.Screen 
          name="SupportHub" 
          component={SupportHubScreen} 
          options={{ 
            headerShown: true, 
            title: 'Hỗ trợ & Phản hồi', 
            headerTintColor: '#fff', 
            headerStyle: { backgroundColor: Theme.colors.background },
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
        <Stack.Screen 
          name="CashFlow" 
          component={CashFlowScreen} 
          options={{ 
            headerShown: true, 
            title: 'Dòng tiền hệ thống', 
            headerTintColor: '#fff', 
            headerStyle: { backgroundColor: Theme.colors.background },
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
        <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
        
        {/* Màn hình tác vụ phụ Khách hàng (Sẽ ẩn thanh Tabs khi mở) */}
        <Stack.Screen 
          name="Booking" 
          component={BookingScreen} 
          options={{ 
            headerShown: true, 
            title: 'Đặt lịch bảo trì', 
            headerTintColor: '#fff', 
            headerStyle: { backgroundColor: Theme.colors.background },
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />

        <Stack.Screen 
          name="LegalProgress" 
          component={LegalProgressScreen} 
          options={{ 
            headerShown: true, 
            title: 'Tiến độ pháp lý', 
            headerTintColor: '#fff', 
            headerStyle: { backgroundColor: Theme.colors.background },
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
        <Stack.Screen 
          name="VehicleDetail" 
          component={VehicleDetailScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Notification" 
          component={NotificationScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Invoice" 
          component={InvoiceScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ServiceHistory" 
          component={ServiceHistoryScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AIChat" 
          component={AIChatScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ContactStaff" 
          component={ContactStaffScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ProfileEdit" 
          component={ProfileEditScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="Success" component={SuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}