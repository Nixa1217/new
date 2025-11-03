import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuthStore } from '../store/authStore';

import AuthStack from './AuthStack';
import CompassScreen from '../screens/CompassScreen';
import VisionBoardScreen from '../screens/VisionBoardScreen';
import FrequenciesScreen from '../screens/FrequenciesScreen';
import VaultScreen from '../screens/VaultScreen';
import IdentityPortalScreen from '../screens/IdentityPortalScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DailyJournalScreen from '../screens/DailyJournalScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerShown: false,
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';

          if (route.name === 'Compass') {
            iconName = 'home';
          } else if (route.name === 'VisionBoard') {
            iconName = 'star';
          } else if (route.name === 'Frequencies') {
            iconName = 'waveform';
          } else if (route.name === 'Vault') {
            iconName = 'treasure-chest';
          } else if (route.name === 'IdentityPortal') {
            iconName = 'eye';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#D4AF77',
        tabBarInactiveTintColor: '#C4A57B',
        tabBarStyle: {
          backgroundColor: '#F0EEE6',
          borderTopColor: '#E8D5C4',
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Compass" component={CompassScreen} />
      <Tab.Screen name="VisionBoard" component={VisionBoardScreen} />
      <Tab.Screen name="Frequencies" component={FrequenciesScreen} />
      <Tab.Screen name="Vault" component={VaultScreen} />
      <Tab.Screen name="IdentityPortal" component={IdentityPortalScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  React.useEffect(() => {
    useAuthStore.getState().initializeAuth();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="DailyJournal" component={DailyJournalScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
