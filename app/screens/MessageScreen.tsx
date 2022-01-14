import React from 'react';
import {ScrollView, Text, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScaledSheet} from 'react-native-size-matters';
import {BackButton, CustomButton} from '../components/Core';
import {HomeProps} from '../constants/types';
import {theme} from '../theme';

export default function MessageScreen(props: HomeProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.homeView}>
        {/* Header */}
        <View style={styles.headerView}>
          <View style={styles.backButtonView}>
            <BackButton onPress={() => props.navigation.goBack()} />
          </View>
          <Text style={styles.headerText}>Compose</Text>
        </View>
        <View style={styles.subjectView}>
          <Text style={styles.subjectText}>Subject</Text>
          <TextInput
            multiline={true}
            placeholder="Enter New Message"
            placeholderTextColor={theme.colors.tint}
            style={styles.subjectInput}
          />
        </View>
        <ScrollView style={styles.messageComposeView}>
          <TextInput
            multiline={true}
            style={styles.messageComposeInput}
            placeholder="Compose Message here"
            placeholderTextColor={theme.colors.tint}
          />
        </ScrollView>
        <CustomButton style={styles.sendButton} label="Send" />
      </View>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  homeView: {
    paddingHorizontal: '2%',
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: theme.colors.tint,
  },
  subjectView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 0.2,
    marginTop: '20@vs',
  },
  subjectText: {
    padding: '5@vs',
    fontFamily: theme.typography.regular,
    fontSize: '15@ms',
    color: theme.colors.tint,
  },
  subjectInput: {
    // borderWidth: 1,
    padding: '8@vs',
    flex: 1,
    fontFamily: theme.typography.regular,
    color: theme.colors.tint,
    fontSize: '15@ms',
  },
  messageComposeView: {
    // borderWidth: 1,
    height: '75%',
  },
  messageComposeInput: {
    height: '500@vs',
    fontFamily: theme.typography.regular,
    fontSize: '16@ms',
    marginTop: '2%',
  },
  sendButton: {
    marginTop: '2%',
  },
});
