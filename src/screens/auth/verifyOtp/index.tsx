import React, { useState } from 'react';
import { View } from 'react-native';
import AuthBg from '@otherComponent/auth/authBg';
import HeaderComponent from '@otherComponent/auth/header';
import OTPTextInput from 'react-native-otp-textinput';
import GradientBtn from '@commonComponents/gradientBtn';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'src/navigation/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import { useValues } from '../../../../App';
import appColors from '@theme/appColors';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';
import Toast from 'react-native-toast-message';
import { forgetPasswordAction } from '@src/store/redux/forgetpassword-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { serviceForgetPasswordOtpVerification } from '@src/services/forgetpassword.service';

type otpProps = NativeStackNavigationProp<RootStackParamList>;
type otpRouteProps = RouteProp<RootStackParamList, 'VerifyOtp'>;

interface Response {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}


const VerifyOtp = () => {
  const inputCount = 4;
  const dispatch = useDispatch()
  const { navigate } = useNavigation<otpProps>();
  const { params } = useRoute<otpRouteProps>();
  const { isDark, t } = useValues();
  const [enteredOtp, setEnteredOtp] = useState('')
  const [processingSpinner, setprocessingSpinner] = useState<boolean>(false);

  const {
    email: forgetPasswordEmail,
    phoneCountryCode: forgetPasswordPhoneCountryCode,
    phoneDialCode: forgetPasswordPhoneDialCode,
    phone: forgerPasswordPhone,
    identity_type: forgetPasswordIdentityType,
  } = useSelector((state: RootState) => state['forgetPassword'])


  // console.log({responseOtp})

  const onOtpClick = async () => {
    setprocessingSpinner(true)
    if (enteredOtp.length < 4) {
      Toast.show({
        type: 'error',
        text1: 'error',
        text2: t('newDeveloper.OtpMinLengthErrorForgetPassword'),
      });
      return
    }
    const phoneNumber = `+${forgetPasswordPhoneDialCode}${forgerPasswordPhone}`
    const response: Response = await serviceForgetPasswordOtpVerification(phoneNumber, enteredOtp)
    if (response?.data?.response_code === 'default_verified_200') {
            setprocessingSpinner(false)
            Toast.show({
              type: 'success',
              text1: 'success',
              text2: response?.data?.message,
            });
            dispatch(forgetPasswordAction.setData({ field: 'enteredOtp', data: enteredOtp }))
            navigate('ResetPassword');
    } else {
            setprocessingSpinner(false)
            Toast.show({
              type: 'error',
              text1: 'error',
              text2: response?.data?.message,
            });
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? appColors.darkText : appColors.background },
      ]}>
      <AuthBg
        authContent={
          <View style={styles.paddingBottom}>
            <HeaderComponent
              showBack={true}
              authTitle={'auth.verifyOtp'}
              content={'auth.verificationCode'}
            />
            <View style={styles.margin}>
              <OTPTextInput
                inputCount={inputCount}
                handleTextChange={setEnteredOtp}
                textInputStyle={{
                  color: isDark ? appColors.white : appColors.darkText,
                  ...styles.otpTextInput,

                  backgroundColor: isDark
                    ? appColors.darkText
                    : appColors.textInput,
                }}
              />
            </View>
            <View style={styles.blankView}></View>
            <GradientBtn
              label={t('auth.verifySignIn')}
              onPress={onOtpClick}
              authText={'auth.resendCode'}
              gotoScreen={() => navigate('ForgotPassword')}
            />
          </View>
        }
      />
      <Spinner
        visible={processingSpinner}
        textContent={'Processing.....'}
        textStyle={{ color: '#FFF' }}
      />
    </View>
  );
}
export default VerifyOtp;
