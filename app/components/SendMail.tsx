import qs from 'qs';
import {Linking} from 'react-native';
import {useToast} from 'react-native-toast-notifications';

interface IMailProps {
  to: string;
  subject: string;
  body: string;
  options: {cc: string; bcc: string};
}
/**
 * let mailtoString = "mailto:nemecek@support.com".addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)
let mailtoUrl = URL(string: mailtoString!)!
if UIApplication.shared.canOpenURL(mailtoUrl) {
        UIApplication.shared.open(mailtoUrl, options: [:])
}

 */
export default async function SendMail(props: IMailProps) {
  const {subject, body, options, to} = props;
  // const toast = useToast();
  // const {cc, bcc} = options;
  let url = `mailto:${to}`;
  // const query = qs.stringify({
  //   subject: subject,
  //   body: body,
  //   cc: cc,
  //   bcc: bcc,
  // });
  // if (query.length) {
  //   url += `?${query}`;
  // }
  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    // return toast.show('Invalid Link', {type: 'danger'});
    return console.error('Doesnt work');
  }
  return Linking.openURL(url);
}
