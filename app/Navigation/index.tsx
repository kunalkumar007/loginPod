// React navigation imports
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import DrawerContent from '../components/DrawerContent';
import {RootStackParamList} from '../constants/types';
import useColorScheme from '../hooks/useColorScheme';
// Screen for navigation imports
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import MessageScreen from '../screens/MessageScreen';
import ProfileScreen from '../screens/ProfileScreen';
import StudentScreen from '../screens/StudentScreen';
import UploadScreen from '../screens/UploadScreen';
import RNBootSplash from 'react-native-bootsplash';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName="DrawerHome">
      <Drawer.Screen name="DrawerHome" component={HomeScreen} />
      <Drawer.Screen name="Student" component={StudentScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Message" component={MessageScreen} />
      <Drawer.Screen name="Upload" component={UploadScreen} />
    </Drawer.Navigator>
  );
};

function Navigation() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer
      theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
      onReady={() => RNBootSplash.hide()}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
