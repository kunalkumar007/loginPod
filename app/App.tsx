/**
 * @format
 */
import React from 'react';
import 'react-native-gesture-handler';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {ToastProvider} from 'react-native-toast-notifications';
import {AppContext} from './AppContenxt';
import Navigation from './Navigation';

// Entry Component
const App = () => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AppContext.Provider value={{songId: null}}>
        <ToastProvider
          duration={1800}
          animationType="slide-in"
          offsetBottom={40}>
          <Navigation />
        </ToastProvider>
      </AppContext.Provider>
    </SafeAreaProvider>
  );
};

export default App;
