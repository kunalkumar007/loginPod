import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {Alert, BackHandler, Image, Linking, Text, View} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
  isInProgress,
  types,
} from 'react-native-document-picker';
import * as RNFS from 'react-native-fs';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScaledSheet} from 'react-native-size-matters';
import {useToast} from 'react-native-toast-notifications';
import {BackButton, CustomButton} from '../components/Core';
import {HomeProps} from '../constants/types';
import {theme} from '../theme';
import arrToObject from '../utils/array-to-json';
// Static Nodejs Modules
const Papa = require('papaparse');

const UploadScreen = (props: HomeProps) => {
  const [loader, setloader] = useState(false);
  // Toast
  const toast = useToast();

  useEffect(() => {
    const backhandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return backhandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backAction = () => {
    Alert.alert(
      'Hold on!',
      'uploading is in progress. Are you sure you want to go back?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => props.navigation.goBack()},
      ],
    );
    return true;
  };

  // handles Parsing of CSV to JSON
  const Parser = async (result: DocumentPickerResponse) => {
    if (result) {
      const file = await RNFS.readFile(result.uri);
      // Trim all extra spaces
      let trimFile = file.replace(/,,/g, '');
      // Parse CSV File
      const {data} = Papa.parse(trimFile);
      // Convert CSV to JSOn
      const JsonResponse = arrToObject(data);

      if (JsonResponse) {
        setloader(true);
        Promise.all(
          JsonResponse.map(item => {
            return firestore().collection('students').add(item);
          }),
        ).then(() => {
          setloader(false);
          toast.show('Loading Completed', {type: 'success'});
        });
      }
    }
  };

  // Handles Document Error
  const handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      toast.show('Cancelled 😟', {type: 'warning'});
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      toast.show(
        'multiple pickers were opened, only the last will be considered',
        {type: 'warning'},
      );
    } else {
      toast.show('Something went Wrong 😕', {type: 'danger'});
    }
  };
  const url =
    'https://res.cloudinary.com/kunal-img/raw/upload/v1642175020/LoginPod/3rdSemData_hlajyv.csv';

  const handleDemoFile = async () => {
    await Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerView}>
        <View style={styles.backButtonView}>
          <BackButton
            onPress={() => (loader ? backAction() : props.navigation.goBack())}
          />
        </View>
        <Text style={styles.headerText}>Upload</Text>
      </View>
      {loader ? (
        <View style={styles.homeView}>
          <Image
            source={require('../assets/Loading.png')}
            style={styles.image}
          />
          <CustomButton
            style={styles.uploadBtn}
            label="Uploading . . ."
            disabled={true}
            onPress={handleDemoFile}
          />
        </View>
      ) : (
        <View style={styles.homeView}>
          <Image
            source={require('../assets/UploadScreen.png')}
            style={styles.image}
          />
          <CustomButton
            style={styles.uploadBtn}
            label="Download Demo File"
            onPress={handleDemoFile}
          />
          <CustomButton
            label="Upload"
            disabled={loader}
            style={styles.uploadBtn}
            onPress={async () => {
              try {
                const pickerResult = await DocumentPicker.pickSingle({
                  presentationStyle: 'fullScreen',
                  copyTo: 'cachesDirectory',
                  type: types.csv,
                });
                Parser(pickerResult);
              } catch (e) {
                handleError(e);
              }
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default UploadScreen;

const styles = ScaledSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  homeView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
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
  },
  uploadBtn: {
    marginTop: '5%',
    width: '100%',
  },
  image: {
    resizeMode: 'center',
    // flex: 1,
    width: '100%',
    height: '250@vs',
    // borderWidth: 1,
  },
});
