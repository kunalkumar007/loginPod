import * as React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {theme} from '../theme';

interface StudentCardProps extends TouchableOpacityProps {
  uri: string | undefined;
  name: string;
  subtitle: string;
  value: string;
  showImage: boolean;
}

export function StudentCard(props: Partial<StudentCardProps>) {
  const {
    uri = 'https://source.unsplash.com/500x500/?man',
    name,
    subtitle,
    value,
    showImage = true,
  } = props;

  return (
    <TouchableOpacity {...props} style={styles.studentCard}>
      <View style={styles.studentCardLeftView}>
        {showImage && (
          <Image
            source={{uri: uri}}
            style={styles.studentAvatar}
            resizeMode="cover"
          />
        )}
        <View style={styles.studentTextView}>
          <Text style={styles.studentName}>{name}</Text>
          {subtitle && <Text style={styles.studentSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.studentAttendence}>
        <Text style={[styles.studentAttendence]}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = ScaledSheet.create({
  studentCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15@s',
    borderRadius: 8,
    marginTop: 10,
    flex: 1,
  },
  studentCardLeftView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatar: {
    height: '40@vs',
    width: '50@ms',
    borderRadius: 50,
    marginRight: '13@ms',
  },
  studentTextView: {},
  studentName: {
    fontFamily: theme.typography.regular,
    fontSize: '15@ms',
    width: '150@ms',
    // borderWidth: 1,
  },
  studentSubtitle: {
    fontFamily: theme.typography.regular,
    fontSize: '9@ms',
    color: theme.colors.tint,
    width: '150@ms',
    marginTop: 5,
  },
  studentAttendence: {
    backgroundColor: theme.colors.tint,
    color: theme.colors.background,
    padding: '3@ms',
    borderRadius: 8,
    fontSize: '15@ms',
    fontFamily: theme.typography.medium,
  },
});
