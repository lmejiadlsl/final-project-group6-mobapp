import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import UserDashboard from '../screens/user/UserDashboard';
import PetAdoptionManager from '../screens/retailer/ManagePetsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screen
const PlaceholderScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f4ff' }}>
    <Text>Coming Soon!</Text>
  </View>
);

// Admin Dashboard placeholder
const AdminDashboard = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f4ff' }}>
    <Text>Admin Dashboard</Text>
  </View>
);

// Stack for Buyer
const UserHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#f6f4ff' } }}>
    <Stack.Screen name="UserDashboard" component={UserDashboard} />
  </Stack.Navigator>
);

// Tab Navigator for Buyer
const UserTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Favorites') {
          iconName = focused ? 'heart' : 'heart-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else {
          iconName = 'help-circle-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#5D3FD3',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
    })}
  >
    <Tab.Screen name="Home" component={UserHomeStack} />
    <Tab.Screen name="Favorites" component={PlaceholderScreen} options={{ tabBarBadge: 3 }} />
    <Tab.Screen name="Profile" component={PlaceholderScreen} />
  </Tab.Navigator>
);

// Stack for Seller - Now directly showing the PetAdoptionManager without tabs
const SellerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#f6f4ff' } }}>
    <Stack.Screen name="ManagePets" component={PetAdoptionManager} />
  </Stack.Navigator>
);

// Stack for Admin
const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#f6f4ff' } }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
  </Stack.Navigator>
);

type AppNavigatorProps = {
  route?: {
    params?: {
      role: 'buyer' | 'seller' | 'admin';
    }
  }
};

const AppNavigator = ({ route }: AppNavigatorProps) => {
  const role = route?.params?.role || 'buyer';
  
  React.useEffect(() => {
    console.log('AppNavigator role:', role);
  }, [role]);

  switch (role) {
    case 'seller':
      return <SellerStack />; // Now returning just the Stack without tabs
    case 'admin':
      return <AdminStack />;
    case 'buyer':
    default:
      return <UserTabs />;
  }
};

export default AppNavigator;