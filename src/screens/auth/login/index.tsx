import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import HeaderComponent from '@otherComponent/auth/header';
import { styles } from './styles';
import TextInputComponent from '@otherComponent/auth/textInput';
import PasswordInputComponent from '@otherComponent/auth/passwordInput';
import { Call } from '@src/utils/icons';
import { Password } from '@assets/icons/auth/passwords';
import appColors from '@theme/appColors';
import GradientBtn from '@commonComponents/gradientBtn';
import AuthBg from '@otherComponent/auth/authBg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'src/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { InputType } from '@otherComponent/auth/textInput/types';
import OptionalModal from '@otherComponent/auth/optionalModal';
import { useValues } from '../../../../App';
import { clearServiceMenCredential } from '@utils/functions';
import { setValue } from '@utils/localstorage';
import Spinner from 'react-native-loading-spinner-overlay';
import { loginService } from '@src/services/login.service';
import { loginService as storeLoginService } from '@src/services/store/login.service';
import Toast from 'react-native-toast-message';
import { setAuthTokens } from '@src/config/auth';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';
import { getAuthUserService } from '@src/services/auth.service';
import { getAuthUserService as storeAuthService } from '@src/services/store/auth.service';
import { serviceManAccountDataActions } from '@src/store/redux/serviceman/service-man-account-data.redux';
import { useDispatch } from 'react-redux';
import { storeProfileDataActions } from '@src/store/redux/store/store-profile-redux';
import PhoneTextInput from '@otherComponent/auth/phoneTextInput';
import { windowWidth } from '@src/theme/appConstant';
import { getProviderConfig } from '@src/services/settings.service';
import { serviceManConfigAppActions } from '@src/store/redux/serviceman/service-man-config-redux';
interface LoginResponse {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

type loginProps = NativeStackNavigationProp<RootStackParamList>;
const Login = ({ route }: any) => {
  const navigation = useNavigation<loginProps>();
  const [errors, setErrors] = useState({ phone: '', password: '' });
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loginPhoneCountryCode,setPhoneCountryCode] = useState('IN')
  const [loginPhoneDialCode,setPhoneDialCode] = useState('91')  
  // const [form, setForm] = useState({phone: 'pritam.biswas489@gmail.com', password: 'Pritam123@#'});
  const [selectOptionModal, setOptionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()

  const serviceProviderData = useSelector((state: RootState) => state['serviceProviderAccountData'])

  if (serviceProviderData?.id !== '') {
    navigation.navigate('BottomTab');
  }


  const {
    isDark,
    isDeliveryManLogin,
    setIsDeliveryManLogin,
    setIsFreeLancerLogin,
    t,
    loggedInUserType,
    setLoggedInUserType
  } = useValues();

  const onChange = ({ name, value }: { name: string; value: string }) => {
    setForm({ ...form, [name]: value });
    if (value !== '') {
      setErrors(prev => {
        return { ...prev, [name]: null };
      });
    }
  };

  useEffect(() => {

    route?.params?.deliveryMenLogin
      ? setIsDeliveryManLogin(true)
      : setIsDeliveryManLogin(false);
  }, []);


  useEffect(() => {
    if (isDeliveryManLogin) {
      // setForm({ ...form, ['phone']: 'fashion1@gmail.com', ['password']: '@Dorkar1234' });
    //  setForm({ ...form, ['phone']: 'foodstore1@gmail.com', ['password']: '@Dorkar1234' });
     setForm({ ...form, ['phone']: '8111111111', ['password']: '@Dboy1234' });
    //  setForm({ ...form, ['phone']: 'Munmun2020@gmail.com', ['password']: '@Kolkata1234' });
      // setForm({ ...form, ['phone']: 'medicine1@gmail.com', ['password']: '@Dorkar1234' });
    } else {
      setForm({ ...form, ['phone']: '9830990065', ['password']: 'Pritam123' });
    }
  }, [isDeliveryManLogin])


  //handle login here
  const handleLogin = () => {
    const reg =  /^\d{10}$/;
    let error = false
    if (!form.phone) {
      error = true
      setErrors(prev => {
        return { ...prev, phone: t('newDeveloper.registerPhoneError') };
      });
    }
    if (!reg.test(form.phone)) {
      error = true
      setErrors(prev => {
        return { ...prev, phone: t('newDeveloper.registerPhoneError') };
      });
    }
    if (!form.password) {
      error = true
      setErrors(prev => {
        return { ...prev, password: t('error.password') };
      });
    }
    if(!error) {
      isDeliveryManLogin ? handleDeliveryManLoginHandle() : handleServiceManLoginHandle()
    }
  };
  //handle deliveryman login
  const handleDeliveryManLoginHandle = async () => {
    setIsLoading(true)
    const data: { phone: string, password: string } = {
      phone: `+${loginPhoneDialCode}${form.phone}`,
      password: form.password,
    };
    
        const response: LoginResponse = await storeLoginService(data);
         
        if (response?.data?.errors) {
            Toast.show({
              type: 'error',
              text1: 'ERROR',
              text2: response?.data?.errors[0]?.message,
            });
            setIsLoading(false)
        } else if (response?.data?.token) {
          
              await setAuthTokens(response?.data?.token, null);
              const responseuser = await storeAuthService()

              if(
                responseuser?.data?.errors && 
                responseuser?.data?.errors[0]?.code === 'auth-001'){
                  navigation.replace('AuthNavigation');
                  return
              }
              if (responseuser?.data?.id) {
                      Toast.show({
                        type: 'success',
                        text1: 'SUCCESS',
                        text2: t('newDeveloper.successfullyLoggedIn'),
                      });
                      dispatch(storeProfileDataActions.setData(responseuser?.data))
                      setIsLoading(false)
                      setValue('loggedInUserType', 'Seller')
                      setLoggedInUserType('Seller')
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'BottomTabSeller' }],
                      });
              } else {
                    Toast.show({
                      type: 'error',
                      text1: 'ERROR',
                      text2: t('newDeveloper.errorLoggedIn'),
                    });
              }
        } else {
          Toast.show({
            type: 'error',
            text1: 'ERROR',
            text2: t('newDeveloper.errorLoggedIn'),
          });
          setIsLoading(false)
        }

       
      



  }
  //handle service man login handle 
  const handleServiceManLoginHandle = async () => {
    setIsLoading(true)
    const data: { phone: string, password: string } = {
      phone: `+${loginPhoneDialCode}${form.phone}`,
      password: form.password,
    };
    const response: LoginResponse = await loginService(data);
    if (response?.data?.response_code === 'auth_login_200') {

  
      if (response?.data?.content?.is_active !== 1) {

        Toast.show({
          type: 'error',
          text1: 'ERROR',
          text2: t('newDeveloper.accountDectivate'),
        });
        setIsLoading(false)
      } else {
       
        await setAuthTokens(response?.data?.content?.token, null);
        //Set User Profile Info
        const responseuser = await getAuthUserService()
        if (responseuser?.data?.response_code === 'default_200' && responseuser?.data?.content?.id) {
          dispatch(serviceManAccountDataActions.setData(responseuser?.data?.content))
          //retrieve service config data
          const responseProviderConfig = await getProviderConfig();
          if (responseProviderConfig?.data?.content?.business_name) {
              dispatch(serviceManConfigAppActions.setData(responseProviderConfig?.data?.content))
          }
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: response?.data?.message,
          });
          setIsDeliveryManLogin(false);
          setIsLoading(false)
          setIsFreeLancerLogin(true);
          setValue('loggedInUserType', 'Provider')
          setLoggedInUserType('Provider')
          navigation.reset({
            index: 0,
            routes: [{ name: 'BottomTab' }],
          });
        } else {
          setIsLoading(false)
          Toast.show({
            type: 'error',
            text1: 'ERROR',
            text2: t('newDeveloper.loginFailed'),
          });

        }
      }
    } else {
      setIsLoading(false)
      Toast.show({
        type: 'error',
        text1: 'ERROR',
        text2: t('newDeveloper.loginFailed'),
      });
    }
  }







  return (
    <>
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        style={[
          styles.container,
          { backgroundColor: isDark ? appColors.darkText : appColors.background },
        ]}>
        <View>
          <AuthBg
            authContent={
              <View style={styles.paddingBottom}>
                <HeaderComponent
                  showBack={false}
                  authTitle={'introSlider.signIn'}
                  content={
                    !isDeliveryManLogin
                      ? 'auth.providerLogin'
                      : 'auth.serviceManLogin'
                  }
                />
                



<PhoneTextInput
                                phoneContent={<>
                                  <TextInputComponent
                                    textContainerStyle={{ width: windowWidth(45) }}
                                    placeholder={t('auth.phoneNumber')}
                                    keyboardType="number-pad"
                                    value={form.phone}
                                    onChangeText={value => {
                                      onChange({ name: 'phone', value });
                                    }}
                                    error={errors.phone} />
                                </>}
                                phoneCountryCode={loginPhoneCountryCode}
                                setPhoneCountryCode={function (value: string): void {
                                  setPhoneCountryCode(value)
                                }}
                                phoneDialCode={loginPhoneDialCode}
                                setPhoneDialCode={function (value: string): void {
                                  setPhoneDialCode(value)
                                }} />


                <PasswordInputComponent
                  inputType={InputType.PASSWORD}
                  placeholder={t('introSlider.passwordPlaceholder')}
                  Icon={
                    <Password
                      color={
                        form.password
                          ? isDark
                            ? appColors.lightText
                            : appColors.darkText
                          : appColors.lightText
                      }
                    />
                  }
                  onChangeText={value => {
                    onChange({ name: 'password', value });
                  }}
                  value={form.password}
                  error={errors.password}
                />
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>{
                    !isDeliveryManLogin
                    ? navigation.navigate('ForgotPassword')
                    : navigation.navigate('StoreForgotPassword')

                  } }
                  style={styles.forgotView}>
                  <Text style={styles.forgotText}>
                    {t('auth.forgotPassword')}
                  </Text>
                </TouchableOpacity>

                <GradientBtn
                  label="introSlider.loginNow"
                  onPress={handleLogin}
                  gotoScreen={
                    !isDeliveryManLogin ? () => setOptionModal(true) : undefined
                  }
                />
              </View>
            }
          />
        </View>
        <View
          style={isDeliveryManLogin ? styles.buttonView : styles.buttonContainer}
        />
        <GradientBtn
          color={isDark ? appColors.darkTheme : appColors.white}
          label={
            isDeliveryManLogin ? 'auth.providerLogin' : 'auth.serviceManLogin'
          }
          onPress={() => setIsDeliveryManLogin(!isDeliveryManLogin)}
          additionalStyle={styles.buttonStyle}
          labelColor={appColors.primary}
          labelTextStyle={styles.labelText}
        />

        {/* selectOptionModal  modal */}
        <OptionalModal
          visible={selectOptionModal}
          onClose={() => setOptionModal(false)}
          providerLogin={true}
          setOptionModal={setOptionModal}
        />
        <Spinner
          visible={isLoading}
          textContent={t('newDeveloper.spinnerTextOne')}
          textStyle={{ color: '#FFF' }}
        />
      </ScrollView>

    </>
  );
}

export default Login;
