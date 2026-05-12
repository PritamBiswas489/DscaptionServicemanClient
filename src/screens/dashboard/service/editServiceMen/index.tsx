import { Text, ScrollView, Alert } from 'react-native';
import React from 'react';
import { useState, useEffect } from 'react';
import { GlobalStyle } from '@style/styles';
import Header from '@commonComponents/header';
import ProfileSection from './profileSection';
import InputView from './inputView';
import GradientBtn from '@commonComponents/gradientBtn';
import { windowHeight } from '@theme/appConstant';
import { RootStackParamList } from 'src/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useValues } from '../../../../../App';
import appColors from '@theme/appColors';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import SkeletonLoader from '@src/commonComponents/SkeletonLoader';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ServiceMenDetailsInterface } from '@src/interfaces/serviceMenDetailsInterface';
import NoDataFound from '@src/commonComponents/noDataFound';
import { noValue, wifi, notification } from '@utils/images';
import { getMediaUrl } from '@src/config/utility';
import { updateProfileData } from '@src/services/profile.service';
import { getAuthUserService } from '@src/services/auth.service';
import { serviceManAccountDataActions } from '@src/store/redux/serviceman/service-man-account-data.redux';

interface Response {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}
type EditServiceMenRouteProp = RouteProp<RootStackParamList, 'EditServiceMen'>;
export function EditServiceMen() {
  const dispatch = useDispatch()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDark, t } = useValues()
  const route = useRoute<EditServiceMenRouteProp>();
  const serviceManAccountData = useSelector((state: RootState) => state.serviceManAccountData)
  
  const [detailServiceMenDetails, setDetailsServiceMenDetails] = useState<ServiceMenDetailsInterface>()
  
  const [password, setPassword] = useState('')
  const [identityImageOne, setIdentityImageOne] = useState('')
  const [identityImageTwo, setIndentityImageTwo] = useState('')
  const [updatedIdentityImageOne, setUpdatedIdentityImageOne] = useState('')
  const [updatedIdentityImageTwo, setUpdatedIdentityImageTwo] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [updatedProfileImage, setUpdatedProfileImage] = useState('')
  const [isUpdateLoader, setUpdateLoader] = useState<boolean>(false);


  //Service Men Details Handle
  

  useEffect(() => {
    const d = {
      id: serviceManAccountData.id,
      user_id: serviceManAccountData.user_id,
      provider_id: serviceManAccountData.provider_id,
      first_name: serviceManAccountData.user.first_name,
      last_name: serviceManAccountData.user.last_name,
      email: serviceManAccountData.user.email,
      phone: serviceManAccountData.user.phone,
      identification_number: serviceManAccountData.user.identification_number,
      identification_type: serviceManAccountData.user.identification_type,
      identification_image: serviceManAccountData?.user?.identification_image || [],
      gender: serviceManAccountData.user.gender,
      profile_image: serviceManAccountData.user.profile_image,
      created_at: serviceManAccountData.created_at,
    }
    setDetailsServiceMenDetails(d)  
  }, [])

  

  useEffect(() => {
    let imageOne = '';
    let imageTwo = '';
    if (detailServiceMenDetails?.identification_image && detailServiceMenDetails.identification_image.length > 0) {
      detailServiceMenDetails?.identification_image.forEach((imageValue, imageIndex) => {
        if (imageIndex === 0) {
          imageOne = `${getMediaUrl()}/serviceman/identity/${imageValue}`
        }
        if (imageIndex === 1) {
          imageTwo = `${getMediaUrl()}/serviceman/identity/${imageValue}`
        }
      })
      setIdentityImageOne(imageOne)
      setIndentityImageTwo(imageTwo)
    }
    let profileImg = ''
    if (detailServiceMenDetails?.profile_image !== '') {
      profileImg = `${getMediaUrl()}/serviceman/profile/${detailServiceMenDetails?.profile_image}`
    }
     
    setProfileImage(profileImg)
  }, [detailServiceMenDetails])


  //========== update details service men =========================//
  const updateDetailsServiceMen = async () => {
    const formData = new FormData()
    formData.append('first_name', detailServiceMenDetails?.first_name)
    formData.append('last_name', detailServiceMenDetails?.last_name)
    formData.append('email', detailServiceMenDetails?.email)
    if (password !== '') {
      formData.append('password', password)
    }
    if (updatedProfileImage !== '') {
        formData.append('profile_image', {
          uri:  updatedProfileImage,
          name: 'profileImage.jpg', 
          type: 'image/jpeg',
        });
    }
    
    setUpdateLoader(true)
    const response:Response = await updateProfileData(formData) 
    if (response?.data?.response_code === 'default_update_200') {
          const responseuser = await getAuthUserService()
          if (responseuser?.data?.response_code === 'default_200' && responseuser?.data?.content?.id) {
            dispatch(serviceManAccountDataActions.setData(responseuser?.data?.content))
          }
          Toast.show({
            type: 'success',
            text1: 'SUCCESS',
            text2: response?.data?.message,
          });
    }else{
          Toast.show({
              type: 'error',
              text1: 'ERROR',
              text2: response?.data?.message || t('newDeveloper.processFailed'),
          });
    }
    setUpdateLoader(false)
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[GlobalStyle.mainView, { backgroundColor: isDark ? appColors.darkCard : appColors.white }]}
      contentContainerStyle={{ paddingBottom: windowHeight(3) }}>
      <Header showBackArrow={true} title="newDeveloper.EditProfile" />

        <>
          <ProfileSection
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            setUpdatedProfileImage={setUpdatedProfileImage}
          />

          {detailServiceMenDetails &&  <InputView
            detailServiceMenDetails={detailServiceMenDetails}
            password={password}
            identityImageOne={identityImageOne}
            identityImageTwo={identityImageTwo}
            setIdentityImageOne={setIdentityImageOne}
            setIndentityImageTwo={setIndentityImageTwo}
            setDetailsServiceMenDetails={setDetailsServiceMenDetails}
            setPassword={setPassword}
            setUpdatedIdentityImageOne={setUpdatedIdentityImageOne}
            setUpdatedIdentityImageTwo={setUpdatedIdentityImageTwo}

          />}
         
          <GradientBtn
            label={'newDeveloper.update'}
            onPress={updateDetailsServiceMen}
          />

        </> 


      
     
      <Spinner
        visible={isUpdateLoader}
        textContent={'Updating.....'}
        textStyle={{ color: '#FFF' }}
      />
    </ScrollView>
  );
}
