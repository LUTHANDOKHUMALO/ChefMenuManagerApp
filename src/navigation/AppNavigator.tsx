/**
 * Stack navigation between the three screens:
 * Home (menu list) -> Add / Edit Dish, and Home -> Menu Statistics.
 */
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { colors, fonts } from '../constants/theme';
import HomeScreen from '../screens/HomeScreen';
import MenuItemFormScreen from '../screens/MenuItemFormScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: fonts.serif, fontWeight: '400' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="MenuItemForm"
          component={MenuItemFormScreen}
          options={({ route }) => ({
            title: route.params?.itemId ? 'Edit dish' : 'Add new dish',
          })}
        />
        <Stack.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{ title: 'Menu overview' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
