import {useClipboard} from '@react-native-clipboard/clipboard';
import firestore from '@react-native-firebase/firestore';
import {RouteProp, useIsFocused, useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {
  BackButton,
  CustomButton,
  CustomTextInput,
  Heading,
} from '../components/Core';
import {StudentCard} from '../components/StudentCard';
import {Navigation, RootStackParamList} from '../constants/types';
import {theme} from '../theme';
import Modal from 'react-native-modal';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useToast} from 'react-native-toast-notifications';

interface IProfileProps extends Navigation {
  route: RouteProp<RootStackParamList, 'Profile'>;
}

export default function ProfileScreen(props: IProfileProps) {
  const [data, setString] = useClipboard();
  const [loader, setloader] = useState(true);
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const [student, setstudent] = useState(props.route.params.student);

  const {colors} = useTheme();
  const toast = useToast();

  useEffect(() => {
    if (props.route.params.student) {
      setstudent(props.route.params.student);
      setloader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useIsFocused()]);

  const handlestudent = (newState: string, value: string) =>
    setstudent({...student, [newState]: value});
  /**
   * Clipboard Toast Handler
   */
  function notifyMessage(msg: string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied to Clipboard', msg);
    }
  }

  console.log('profile', props.route.params.student, student);
  /**
   * Updates Document in Firebase Store
   */
  const handleEdit = () => {
    setbuttonLoader(true);
    firestore()
      .collection('students')
      .doc(student.id)
      .set(student)
      .then(Response => {
        toast.show('Updated Successfully', {type: 'success'});
        console.log('result', Response);
        setshowModal(false);
        setbuttonLoader(false);
      })
      .catch(err => {
        console.error(err);
        toast.show('Error Occured', {type: 'danger'});
        setbuttonLoader(false);
      });
  };

  const backAction = () => {
    Alert.alert(
      'Hold on!',
      'updating is in progress. Are you sure you want to go back?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => setshowModal(false)},
      ],
    );
    return true;
  };

  if (loader) {
    return (
      <View style={styles.loaderScreen}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.homeView}>
        {/* Header */}
        <View style={styles.headerView}>
          <View style={styles.backButtonView}>
            <BackButton onPress={() => props.navigation.goBack()} />
          </View>
          <Text style={styles.headerText}>Profile</Text>
          <TouchableOpacity onPress={() => setshowModal(true)}>
            <Image
              style={styles.editIcon}
              source={require('../assets/EditWhite90.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.avatar}>
          <Image
            style={styles.image}
            source={{uri: 'https://source.unsplash.com/500x500/?student'}}
          />
        </View>
      </View>
      <ScrollView style={styles.mainView}>
        <Text style={styles.nameHeading}>{student.Name}</Text>
        <Text style={styles.nameMail}>{student.Email}</Text>
        <Text style={[styles.nameMail, styles.nameAddress]}>
          {student.Address}
        </Text>
        <View style={styles.cardView}>
          <StudentCard
            onPressOut={() => notifyMessage(data)}
            onLongPress={() =>
              setString(`Total Attendence: ${student.Attendence_in_percent}%`)
            }
            showImage={false}
            name="Total Attendence"
            value={
              student.Attendence_in_percent
                ? student.Attendence_in_percent + '%'
                : 'N / A'
            }
          />
          <StudentCard
            showImage={false}
            onPressOut={() => notifyMessage(data)}
            onLongPress={() => setString(`Phone Number: +91${student.Phone}`)}
            name="Phone Number"
            value={'+91 ' + student.Phone}
          />
          <StudentCard
            showImage={false}
            onPressOut={() => notifyMessage(data)}
            onLongPress={() =>
              setString(`Student Roll No: ${student['Roll No']}`)
            }
            name="College Roll No"
            value={student['Roll No']}
          />
        </View>
      </ScrollView>
      {/* Edit Student Modal */}
      <Modal
        isVisible={showModal}
        onBackdropPress={() => {
          if (buttonLoader) {
            backAction();
          } else {
            setshowModal(false);
          }
        }}>
        <View style={styles.editModalView}>
          <ScrollView>
            <Heading label="Edit Student" />
            <CustomTextInput
              placeholder="Student Name"
              placeholderTextColor={colors.text}
              onChangeText={text => handlestudent('Name', text)}
              defaultValue={student.Name}
            />
            <CustomTextInput
              placeholder="College Email"
              placeholderTextColor={colors.text}
              onChangeText={text => handlestudent('Email', text)}
              defaultValue={student.Email}
            />
            <CustomTextInput
              placeholder="College Roll No."
              placeholderTextColor={colors.text}
              onChangeText={text => handlestudent('Roll No', text)}
              defaultValue={student['Roll No']}
              keyboardType="numeric"
            />
            <CustomTextInput
              placeholder="Phone Number"
              placeholderTextColor={colors.text}
              onChangeText={text => handlestudent('Phone', text)}
              defaultValue={student.Phone}
              keyboardType="phone-pad"
            />
            <CustomTextInput
              placeholder="Attendence (%)"
              placeholderTextColor={colors.text}
              onChangeText={text =>
                handlestudent('Attendence_in_percent', text)
              }
              defaultValue={student.Attendence_in_percent}
              keyboardType="numeric"
            />
            <CustomTextInput
              placeholder="Address"
              placeholderTextColor={colors.text}
              multiline
              onChangeText={text => handlestudent('Address', text)}
              defaultValue={student.Address}
            />
            <CustomButton
              label={buttonLoader ? 'Updating . . .' : 'Update'}
              onPress={handleEdit}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = ScaledSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  homeView: {
    backgroundColor: theme.colors.tint,
    position: 'relative',
    paddingHorizontal: '5%',
    height: '35%',
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? '25@vs' : StatusBar.currentHeight,
  },
  backButtonView: {
    backgroundColor: theme.colors.gray1,
    borderRadius: 18,
  },
  headerText: {
    flex: 1,
    fontFamily: theme.typography.regular,
    fontSize: '30@ms',
    marginLeft: '5%',
    color: 'white',
  },
  avatar: {
    position: 'absolute',
    bottom: '-30%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '5%',
    // left: '30%',
  },
  editIcon: {
    // borderWidth: 1,
    width: '25@ms',
    height: '25@vs',
    padding: '15@ms',
    resizeMode: 'contain',
  },
  image: {
    width: '150@vs',
    height: '150@vs',
    resizeMode: 'cover',
    borderRadius: 500,
    borderWidth: 5,
    borderColor: theme.colors.gray1,
  },
  mainView: {
    marginTop: '25%',
    paddingHorizontal: '5%',
  },
  nameHeading: {
    fontFamily: theme.typography.headingBold,
    fontSize: '20@ms',
    textAlign: 'center',
    color: theme.colors.tint,
  },
  nameMail: {
    fontFamily: theme.typography.regular,
    fontSize: '13@s',
    color: theme.colors.tint,
    textAlign: 'center',
  },
  nameAddress: {
    marginTop: '2%',
    fontSize: '10@s',
    width: '100%',
  },
  cardView: {
    marginTop: '8%',
  },
  editModalView: {
    backgroundColor: 'white',
    paddingBottom: 20,
    maxHeight: '85%',
  },
  loaderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
