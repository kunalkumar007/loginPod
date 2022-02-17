import firebase, {ReactNativeFirebase} from '@react-native-firebase/app';
import {Platform} from 'react-native';

// Your secondary Firebase project credentials for Android...
export const androidCredentials: ReactNativeFirebase.FirebaseAppOptions = {
  clientId:
    '319620515547-pue4jeltglk9a91p713ph6kfffcaebd9.apps.googleusercontent.com',
  appId: '1:319620515547:android:a1ddc5c8a6ca8365baeefe',
  apiKey: 'AIzaSyD3Z-WOYAqP-dq1vCQJossKUAj8jJty79Q',
  storageBucket: 'loginpod-c20f5.appspot.com',
  projectId: 'loginpod-c20f5',
  databaseURL: 'http://loginpod-c20f5.firebaseio.com',
};

// Your secondary Firebase project credentials for iOS...
const iosCredentials = {
  clientId: '',
  appId: '',
  apiKey: '',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: '',
  projectId: '',
};

// Select the relevant credentials
export const credentials = Platform.select({
  android: androidCredentials,
});

export const config = {
  name: 'PRIMARY_APP',
};
