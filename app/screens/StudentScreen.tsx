import CheckBox from '@react-native-community/checkbox';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {RouteProp, useIsFocused, useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScaledSheet} from 'react-native-size-matters';
import {BackButton, CustomButton, Heading} from '../components/Core';
import {StudentCard} from '../components/StudentCard';
import {Navigation, RootStackParamList} from '../constants/types';
import {theme} from '../theme';

interface IStudentProps extends Navigation {
  route: RouteProp<RootStackParamList, 'Student'>;
}
export default function StudentScreen(props: IStudentProps) {
  const [loader, setloader] = useState(true);
  const [mailList, setmailList] = useState<string[]>([]);
  const [searchInput, setsearchInput] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [studentsList, setstudentsList] =
    useState<FirebaseFirestoreTypes.DocumentData[]>();
  const [studentsData, setstudentsData] =
    useState<FirebaseFirestoreTypes.DocumentData[]>();
  //Third Party Hooks
  const {colors} = useTheme();
  const isFocused = useIsFocused();
  const {status} = props.route.params;

  useEffect(() => {
    getAllStudents();
  }, [isFocused]);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const handleSearch = () => {
    if (searchInput !== '') {
      const searchResult = studentsList?.filter(student =>
        student.Name.toLowerCase().includes(searchInput.toLowerCase()),
      );
      setstudentsData(searchResult);
    } else {
      setstudentsData(studentsList);
    }
  };

  const getAllStudents = async () => {
    setloader(true);
    const querySnapshot = await firestore().collection('students').get();
    let result: any = [];
    querySnapshot.forEach(querydocumentSnapshot => {
      const data = {
        id: querydocumentSnapshot.id,
        isSelected: false,
        ...querydocumentSnapshot.data(),
      };
      result.push(data);
    });
    setstudentsList(result);
    setstudentsData(result);
    setloader(false);
  };

  const handleMail = () => {
    const mailListResult = mailList.join(',');
    Linking.openURL('mailto:' + mailListResult.toString());
    // SendMail({
    //   to: mailListResult,
    //   subject: '',
    //   body: '',
    //   options: {
    //     cc: '',
    //     bcc: '',
    //   },
    // });
  };

  const handleSingleCheckBox = (
    newValue: boolean,
    student: FirebaseFirestoreTypes.DocumentData,
  ) => {
    console.log(newValue, student.isSelected);
    if (newValue && !mailList.includes(student.Email)) {
      setmailList(prev => [...prev, student.Email]);
      student.isSelected = true;
    } else {
      let result = mailList.filter(item => item !== student.Email);
      setmailList(result);
      student.isSelected = false;
    }
  };

  const NotFound = () => {
    return (
      <View style={styles.notFoundView}>
        <Image
          style={styles.notFound}
          source={require('../assets/NotFound.png')}
        />
        <Text style={styles.notFoundText}>Nothing Found</Text>
      </View>
    );
  };

  if (loader) {
    return (
      <View style={styles.loaderScreen}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView nestedScrollEnabled={true} style={styles.homeView}>
        <View style={{marginTop: '5%'}}>
          <BackButton onPress={() => props.navigation.goBack()} />
        </View>
        <Heading label="All Students" style={styles.heading} />
        <View style={styles.searchView}>
          <Image
            source={require('../assets/Search.png')}
            style={styles.searchImage}
          />
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            placeholderTextColor={colors.text}
            onChangeText={setsearchInput}
          />
        </View>
        {status !== 'add' && studentsList?.length !== 0 && (
          <View style={styles.flexBetween}>
            <CheckBox
              onValueChange={newValue => {
                setToggleCheckBox(newValue);
                if (newValue) {
                  let filteredResult = studentsList?.filter(
                    student => student.Email !== null,
                  );
                  let result = filteredResult?.map(student => student.Email);
                  if (result) {
                    setmailList(result);
                    let selectionResult = studentsList?.map(student => ({
                      ...student,
                      isSelected: true,
                    }));
                    setstudentsData(selectionResult);
                  }
                } else {
                  setmailList([]);
                  let selectionResult = studentsList?.map(student => ({
                    ...student,
                    isSelected: false,
                  }));
                  setstudentsData(selectionResult);
                }
              }}
              value={toggleCheckBox}
              boxType="square"
              style={styles.checkBox}
              tintColors={{
                true: theme.colors.button,
                false: theme.colors.tint,
              }}
              tintColor={theme.colors.tint}
              onCheckColor={theme.colors.button}
              onTintColor={theme.colors.button}
            />
            <Text style={styles.headline}>Select All</Text>
          </View>
        )}
        <ScrollView nestedScrollEnabled={true} style={styles.studentView}>
          {studentsList?.length !== 0 && studentsData !== undefined ? (
            studentsData?.map((student, index) => {
              return (
                <View
                  style={[styles.flexBetween, styles.studentCardView]}
                  key={index}>
                  {status !== 'add' && (
                    <CheckBox
                      value={student.isSelected}
                      onValueChange={newValue =>
                        handleSingleCheckBox(newValue, student)
                      }
                      boxType="square"
                      style={styles.checkBox}
                      tintColors={{
                        true: theme.colors.button,
                        false: theme.colors.tint,
                      }}
                      tintColor={theme.colors.tint}
                      onCheckColor={theme.colors.button}
                      onTintColor={theme.colors.button}
                    />
                  )}
                  <StudentCard
                    name={student.Name}
                    subtitle={student['Roll No']}
                    value={
                      student.Attendence_in_percent
                        ? student.Attendence_in_percent + '%'
                        : 'N / A'
                    }
                    onPress={() =>
                      status !== 'add'
                        ? handleSingleCheckBox(!student.isSelected, student)
                        : props.navigation.navigate('Profile', {
                            student,
                          })
                    }
                  />
                </View>
              );
            })
          ) : (
            <NotFound />
          )}
        </ScrollView>
      </ScrollView>
      {status !== 'add' && studentsList?.length !== 0 && (
        <View style={styles.buttonView}>
          <CustomButton label="Send" onPress={handleMail} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  heading: {
    textAlign: 'left',
  },
  homeView: {
    paddingHorizontal: '5%',
  },
  searchView: {
    backgroundColor: theme.colors.gray1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
  },
  searchImage: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
    marginHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.tint,
    fontFamily: theme.typography.regular,
    fontSize: '18@ms',
    width: '100%',
    paddingVertical: '15@vs',
  },
  studentView: {
    marginTop: '5@vs',
  },
  flexBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
  },
  headline: {
    fontFamily: theme.typography.regular,
    fontSize: '15@ms',
  },
  loaderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  notFound: {
    width: '100%',
    height: '200@vs',
  },
  notFoundText: {
    textAlign: 'center',
    fontSize: '25@s',
    fontFamily: theme.typography.black,
  },
  studentCardView: {
    alignItems: 'center',
    marginTop: 0,
  },
  checkBox: {
    width: '25@ms',
    height: '25@ms',
    marginRight: '5@ms',
    // borderWidth: 2,
  },
  buttonView: {
    // borderWidth: 1,
    position: 'absolute',
    width: '95%',
    bottom: '5%',
    left: '5%',
  },
  notFoundView: {
    // borderWidth: 1,
    marginTop: '40%',
  },
});
