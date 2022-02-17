import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScaledSheet} from 'react-native-size-matters';
import {Heading} from '../components/Core';
import {StudentCard} from '../components/StudentCard';
import {HomeProps} from '../constants/types';
import {theme} from '../theme';

export default function HomeScreen(props: HomeProps) {
  const [studentsList, setstudentsList] =
    useState<FirebaseFirestoreTypes.DocumentData[]>();
  const [loader, setloader] = useState(true);
  const [studentsLength, setstudentsLength] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    getAllStudents();
  }, [isFocused]);

  const getAllStudents = async () => {
    setloader(true);
    const lengthSnapshot = await firestore().collection('students').get();
    setstudentsLength(lengthSnapshot.size);
    const querySnapshot = await firestore()
      .collection('students')
      .limit(10)
      .orderBy('Attendence_in_percent', 'desc')
      .get();
    let result: any = [];
    querySnapshot.forEach(querydocumentSnapshot => {
      const data = {
        id: querydocumentSnapshot.id,
        ...querydocumentSnapshot.data(),
      };
      result.push(data);
    });
    setstudentsList(result);
    setloader(false);
  };

  if (loader) {
    return (
      <View style={styles.loaderScreen}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log(studentsList?.length);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.homeView} nestedScrollEnabled={true}>
        <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
          <Image style={styles.image} source={require('../assets/Menu.png')} />
        </TouchableOpacity>
        <Heading label="Home" style={styles.heading} />
        {/* Card */}
        <View style={styles.cardBox}>
          <Text style={styles.subtitle}>Last Updated: 5 days Ago</Text>
          <View style={styles.flexBetween}>
            <View>
              <Text style={styles.cardHeading}>Total Students</Text>
              <Text style={styles.cardHeading2}>
                {studentsLength} Students Found
              </Text>
            </View>
            <Image
              source={{uri: 'https://source.unsplash.com/500x500/?professor'}}
              style={styles.avatar}
            />
          </View>
        </View>
        {/* Students */}
        <ScrollView nestedScrollEnabled={true}>
          <View style={styles.flexBetween}>
            <Text style={styles.headline}>All Students</Text>
            <Text
              onPress={() =>
                props.navigation.navigate('Student', {status: 'add'})
              }
              style={styles.headline}>
              See All
            </Text>
          </View>
          {studentsList?.length !== 0 && studentsList !== undefined ? (
            studentsList?.map((student, index) => (
              <StudentCard
                key={index}
                name={student.Name}
                subtitle={student['Roll No']}
                value={
                  student.Attendence_in_percent
                    ? student.Attendence_in_percent + '%'
                    : 'N / A'
                }
                onPress={() =>
                  props.navigation.navigate('Profile', {
                    student,
                  })
                }
              />
            ))
          ) : (
            <>
              <Image
                style={styles.notFound}
                source={require('../assets/NotFound.png')}
              />
              <Text style={styles.notFoundText}>Nothing Found</Text>
            </>
          )}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  homeView: {
    paddingHorizontal: '5%',
  },
  heading: {textAlign: 'auto'},
  cardBox: {
    backgroundColor: theme.colors.tint,
    minHeight: '80@vs',
    borderTopLeftRadius: 28,
    borderBottomRightRadius: 28,
    padding: '5%',
    position: 'relative',
  },
  subtitle: {
    color: theme.colors.gray1,
    fontFamily: theme.typography.regular,
    padding: '2%',
    marginBottom: 10,
    textAlign: 'right',
  },
  cardHeading: {
    color: 'white',
    padding: '10@ms',
    fontFamily: theme.typography.bold,
    fontSize: '16@ms',
    backgroundColor: theme.colors.button,
    // width: '100%',
  },
  cardHeading2: {
    color: theme.colors.gray1,
    padding: '10@ms',
    fontFamily: theme.typography.bold,
    backgroundColor: '#424141',
    marginVertical: 10,
    width: '100%',
  },
  flexBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
  },
  headline: {
    fontFamily: theme.typography.regular,
    fontSize: '15@ms',
    color: theme.colors.tint,
  },
  loaderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  avatar: {
    width: '95@vs',
    height: '95@vs',
    borderRadius: 50,
    // padding: '50@ms',
    resizeMode: 'cover',
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
  image: {
    marginTop: '5%',
  },
});
