/**
 * Chef's Menu Manager
 * MAST5112 Portfolio of Evidence – Luthando Khumalo (ST10517026)
 *
 * App entry point: wraps the navigator in the shared providers.
 */
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FeedbackProvider } from './src/context/FeedbackContext';
import { MenuProvider } from './src/context/MenuContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <MenuProvider>
        <FeedbackProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </FeedbackProvider>
      </MenuProvider>
    </SafeAreaProvider>
  );
}
