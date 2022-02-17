import auth from '@react-native-firebase/auth';
import {useIsFocused} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScaledSheet} from 'react-native-size-matters';
import {useToast} from 'react-native-toast-notifications';
import {CustomButton, CustomTextInput, Heading} from '../components/Core';
import {authErrorhandler, authToken} from '../config/auth';
import {RootStackParamList} from '../constants/types';
import {theme} from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen(props: Props) {
  // Auth States
  const [email, setemail] = useState('kunal.kumar@acem.edu.in');
  const [password, setpassword] = useState('abcd1234');
  //  all hooks
  const toast = useToast();
  const isFocused = useIsFocused();
  // Navigate if token exists
  useEffect(() => {
    authToken().then(response => {
      if (response) {
        props.navigation.navigate('Home');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  // Handler function for Login
  const submitHandler = async () => {
    try {
      let toastID = toast.show('Loading . . .');
      // Signs a user in with a custom token.
      await auth().signInWithEmailAndPassword(email, password);

      toast.update(toastID, 'Log In Success', {type: 'success'});

      props.navigation.navigate('Home');
    } catch (error: any) {
      console.log('error', error);

      const message: string = authErrorhandler(error.code);

      toast.show(message, {type: 'danger'});
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Heading label="Log In" />
      <View style={styles.textInputView}>
        <CustomTextInput
          placeholder="Email"
          onChangeText={text => setemail(text)}
          defaultValue={email}
        />
        <CustomTextInput
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={text => setpassword(text)}
          defaultValue={password}
        />
      </View>
      <View style={styles.buttonView}>
        <CustomButton onPress={submitHandler} />
      </View>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  textInputView: {
    marginTop: '10%',
  },
  buttonView: {
    position: 'absolute',
    bottom: '5%',
    width: '100%',
  },
});
