import auth from '@react-native-firebase/auth';

/**
 * Get current User token from auth-firebase
 */
export async function authToken() {
  const result = await auth().currentUser?.getIdToken();
  return result;
}

/**
 * Handle if any Auth Error occurs
 */
export function authErrorhandler(code: string) {
  switch (code) {
    case 'auth/account-exists-with-different-credential':
      return 'there already exists an account with the email address asserted by the credential';
    case 'auth/invalid-credential':
      return 'the credential is malformed or has expired';
    case 'auth/operation-not-allowed':
      return 'the type of account corresponding to the credential is not enabled. Enable the account type in the Firebase Console, under the Auth tab';
    case 'auth/user-disabled':
      return 'the user corresponding to the given credential has been disabled';
    case 'auth/user-not-found':
      return 'there is no user corresponding to the given email';
    case 'auth/wrong-password':
      return 'the password is invalid for the given email, or if the account corresponding to the email does not have a password set';
    case 'auth/invalid-verification-code':
      return 'verification code of the credential is not valid';
    case 'auth/invalid-verification-id':
      return 'the verification ID of the credential is not valid';
    case 'auth/network-request-failed':
      return 'A network error has occurred, please try again';
    default:
      return 'Unexpected Error Occured';
  }
}
