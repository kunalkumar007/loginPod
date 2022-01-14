import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {
  DrawerNavigationProp,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

// Here We are merging different Stack which is root stack and Drawer Stack which can be found here,
// https://reactnavigation.org/docs/typescript#nesting-navigators
// ----------------------------------
// Use this Props when we dont need Routes else use Navigation if route is needed
// ----------------------------------
export type HomeProps = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList>,
  DrawerScreenProps<DrawerParamList>
>;

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Student: {status: string};
  Profile: {student: FirebaseFirestoreTypes.DocumentData};
};

export type DrawerParamList = {
  DrawerHome: undefined;
};

export interface Navigation {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<RootStackParamList>,
    DrawerNavigationProp<DrawerParamList>
  >;
}
