/**
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {AppContext} from './AppContenxt';
import Navigation from './Navigation';
import {ToastProvider} from 'react-native-toast-notifications';

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
