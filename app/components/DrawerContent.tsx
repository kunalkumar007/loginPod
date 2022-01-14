import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import React from 'react';
import {Image} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import drawerData from '../config/drawerData';
import {theme} from '../theme';
import auth from '@react-native-firebase/auth';

export default function DrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView style={styles.screen} {...props}>
      {drawerData.map((item, index) => (
        <DrawerItem
          key={index}
          label={item.label}
          onPress={() => {
            console.log(item);
            if (item.label === 'Message') {
              props.navigation.navigate(item.navigate, {
                status: 'select',
              });
            } else if (item.label === 'Students') {
              props.navigation.navigate(item.navigate, {
                status: 'add',
              });
            } else {
              props.navigation.navigate(item.navigate);
            }
          }}
          icon={() => (
            <Image
              style={styles.drawerItemIcon}
              source={item.icon}
              resizeMode="cover"
            />
          )}
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
        />
      ))}
      <DrawerItem
        label={'Logout'}
        onPress={async () => {
          await auth().signOut();
          props.navigation.navigate('Login');
        }}
        icon={() => (
          <Image
            style={styles.drawerItemIcon}
            source={require('../assets/Logout.png')}
            resizeMode="cover"
          />
        )}
        style={styles.logout}
        labelStyle={styles.drawerItemLabel}
      />
    </DrawerContentScrollView>
  );
}

const styles = ScaledSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
  },
  drawerContentScrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  drawerItemLabel: {
    fontFamily: theme.typography.regular,
    fontSize: '18@ms',
    color: theme.colors.tint,
  },
  drawerItem: {
    // borderWidth: 0.12,
  },
  drawerItemIcon: {
    width: 25,
    height: 25,
  },
  logout: {
    // borderWidth: 2,
    marginTop: '350@vs',
  },
});
