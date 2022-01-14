import {useTheme} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {theme} from '../theme';

interface IButtonProps extends TouchableOpacityProps {
  label?: string;
}

interface IHeadingProps extends TextProps {
  label: string;
}

type BackButtonProps = {
  onPress: () => void;
};

export function CustomTextInput(props: TextInputProps) {
  const {placeholder, style, ...others} = props;
  const {colors} = useTheme();

  return (
    <TextInput
      {...others}
      placeholder={placeholder}
      style={[styles.textInput, style]}
      placeholderTextColor={colors.text}
    />
  );
}

export function CustomButton(props: IButtonProps) {
  const {label = 'Log In', ...other} = props;
  return (
    <TouchableOpacity {...other} style={[styles.buttonBox, props.style]}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Heading(props: IHeadingProps) {
  return <Text style={[styles.heading, props.style]}>{props.label}</Text>;
}

export function BackButton(props: BackButtonProps) {
  return (
    <View style={styles.backView}>
      <Image source={require('../assets/Back.png')} style={styles.backImage} />
      <Text onPress={props.onPress} style={styles.backText}>
        Go Back
      </Text>
    </View>
  );
}

const styles = ScaledSheet.create({
  textInput: {
    backgroundColor: theme.colors.gray1,
    padding: '20@ms',
    marginHorizontal: '5%',
    marginVertical: '2%',
    borderRadius: 8,
    fontSize: '17@ms',
  },
  // Button
  buttonBox: {
    paddingHorizontal: '20@ms',
    paddingVertical: '15@vs',
    backgroundColor: theme.colors.button,
    marginHorizontal: '5%',
    borderRadius: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: '20@ms',
    fontFamily: theme.typography.medium,
  },
  // Heading
  heading: {
    fontFamily: theme.typography.headingBold,
    color: theme.colors.tint,
    fontSize: '40@ms',
    textAlign: 'center',
  },
  backView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backImage: {
    resizeMode: 'cover',
    width: 20,
    height: 20,
  },
  backText: {
    fontFamily: theme.typography.regular,
    fontSize: '20@ms',
    color: theme.colors.tint,
  },
});
