import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import UserDashboard from '../screens/user/UserDashboard';
import ProfileScreen from '../screens/user/AccountSettings'; // Import the new ProfileScreen
import PetAdoptionManager from '../screens/retailer/ManagePetsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Enhanced Placeholder screens with better UI
const FavoritesScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f4ff' }}>
    <Ionicons name="heart" size={64} color="#5D3FD3" />
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 16 }}>Your Favorites</Text>
    <Text style={{ fontSize: 16, color: '#666', marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }}>
      Save pets you're interested in and they'll appear here
    </Text>
  </View>
);

const ApplicationsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f4ff' }}>
    <Ionicons name="document-text" size={64} color="#5D3FD3" />
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 16 }}>My Applications</Text>
    <Text style={{ fontSize: 16, color: '#666', marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }}>
      Track the status of your pet adoption applications
    </Text>
  </View>
);

const MessagesScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f4ff' }}>
    <Ionicons name="chatbubbles" size={64} color="#5D3FD3" />
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 16 }}>Messages</Text>
    <Text style={{ fontSize: 16, color: '#666', marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }}>
      Chat with shelters about your adoption applications
    </Text>
  </View>
);

// Admin Dashboard placeholder
const AdminDashboard = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f4ff' }}>
    <Ionicons name="shield-checkmark" size={64} color="#5D3FD3" />
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 16 }}>Admin Dashboard</Text>
    <Text style={{ fontSize: 16, color: '#666', marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }}>
      Manage users, shelters, and platform settings
    </Text>
  </View>
);

// Stack for User Home (includes pet details, adoption forms, etc.)
const UserHomeStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false, 
      cardStyle: { backgroundColor: '#f6f4ff' },
      cardStyleInterpolator: ({ current, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        };
      },
    }}
  >
    <Stack.Screen name="UserDashboard" component={UserDashboard} />
    <Stack.Screen name="Applications" component={ApplicationsScreen} />
  </Stack.Navigator>
);

// Stack for Favorites
const FavoritesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#f6f4ff' } }}>
    <Stack.Screen name="FavoritesList" component={FavoritesScreen} />
  </Stack.Navigator>
);

// Stack for Messages
const MessagesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#f6f4ff' } }}>
    <Stack.Screen name="MessagesList" component={MessagesScreen} />
  </Stack.Navigator>
);

// Stack for Profile - Now using the actual ProfileScreen
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#f6f4ff' } }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
  </Stack.Navigator>
);

// Enhanced Tab Navigator for Users with better icons and badges
const UserTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Favorites':
            iconName = focused ? 'heart' : 'heart-outline';
            break;
          case 'Messages':
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'help-circle-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#5D3FD3',
      tabBarInactiveTintColor: '#8E8E93',
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 0,
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        height: 85,
        paddingBottom: 10,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
      },
      tabBarItemStyle: {
        paddingTop: 5,
      },
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={UserHomeStack}
      options={{
        tabBarLabel: 'Home',
      }}
    />
    <Tab.Screen 
      name="Favorites" 
      component={FavoritesStack}
      options={{ 
        tabBarLabel: 'Favorites',
        tabBarBadge: 3,
        tabBarBadgeStyle: {
          backgroundColor: '#FF6B6B',
          color: '#fff',
          fontSize: 10,
          fontWeight: 'bold',
        }
      }} 
    />
    <Tab.Screen 
      name="Messages" 
      component={MessagesStack}
      options={{ 
        tabBarLabel: 'Messages',
        tabBarBadge: 2,
        tabBarBadgeStyle: {
          backgroundColor: '#4ECDC4',
          color: '#fff',
          fontSize: 10,
          fontWeight: 'bold',
        }
      }} 
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileStack}
      options={{
        tabBarLabel: 'Profile',
      }}
    />
  </Tab.Navigator>
);

// Enhanced Seller Stack with better navigation
const SellerStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false, 
      cardStyle: { backgroundColor: '#f6f4ff' },
      cardStyleInterpolator: ({ current, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        };
      },
    }}
  >
    <Stack.Screen 
      name="ManagePets" 
      component={PetAdoptionManager}
      options={{
        title: 'Manage Pets',
      }}
    />
  </Stack.Navigator>
);

// Enhanced Admin Stack
const AdminStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false, 
      cardStyle: { backgroundColor: '#f6f4ff' },
      cardStyleInterpolator: ({ current, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        };
      },
    }}
  >
    <Stack.Screen 
      name="AdminDashboard" 
      component={AdminDashboard}
      options={{
        title: 'Admin Dashboard',
      }}
    />
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
      return <SellerStack />;
    case 'admin':
      return <AdminStack />;
    case 'buyer':
    default:
      return <UserTabs />;
  }
};

export default AppNavigator;