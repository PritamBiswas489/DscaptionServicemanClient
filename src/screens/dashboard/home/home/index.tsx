import { ScrollView } from 'react-native-virtualized-view';
import React, { useEffect, useState } from 'react';
import { Chat, Notification } from '@utils/icons';
import Header from '@commonComponents/header';
import { GlobalStyle } from '@style/styles';
import StaticsDetail from '../staticsDetail';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import appColors from '@theme/appColors';
import { useValues } from '../../../../../App';
import { ServiceMenDashBoard } from '@screens/dashboard/serviceMan/home';
import { Alert, RefreshControl, TouchableOpacity } from 'react-native';
import SkeletonLoader from '@src/commonComponents/SkeletonLoader';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';
import HomeNoFataFound from '@src/commonComponents/homeNoDataFound';
 
import { Platform } from 'react-native';
import { saveFcmTokenProcess } from '@src/services/profile.service';
import { getAuthUserService } from '@src/services/auth.service';
import { Text } from 'react-native';
 
import { serviceManAccountDataActions } from '@src/store/redux/serviceman/service-man-account-data.redux';
import RecentBookingActivities from './homeBookingList';
import { homeTopCardData, homeBookingStat, homeRecentBookings,  } from '@src/services/home.service';
import { serviceManHomeDataActions } from '@src/store/redux/serviceman/service-man-home-data.redux';
import { getPagesContent } from '@src/services/settings.service';
import { contentPagesActions } from '@src/store/redux/content-pages-redux';
import { clearValue, getValue } from '@src/utils/localstorage';


type navigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Response {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

export function Home() {
  const { navigate,replace } = useNavigation<navigationProp>();
  const { isDark, isDeliveryManLogin, t, loggedInUserType } = useValues();
  
  const [needSkeletonLoader,setNeedSkeletonLoader] =  useState(true)
  const [refreshing, setRefreshing] = React.useState(false);

  const {refreshHomeData} = useSelector((state: RootState)=>state.serviceManHomeData)
  const {fetched:contentFetched} = useSelector((state: RootState)=>state.contentPages)

 
  const dispatch = useDispatch()

  const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        setNeedSkeletonLoader(false)
        loadDashboardHomeData()
        const responseuser = await getAuthUserService()
        if (responseuser?.data?.response_code === 'default_200' && responseuser?.data?.content?.id) {
          dispatch(serviceManAccountDataActions.setData(responseuser?.data?.content))
        }else{
          replace('IntroSlider');
        }
        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
  }, []);

  const fetchContents = async()=>{
    const contentConfig = await getPagesContent()
        if (contentConfig?.data?.content) {
          Object.keys(contentConfig?.data?.content).forEach((key: string) => {
            // console.log(contentConfig?.data?.content[key]?.value)
            if (key === 'about_us') {
              dispatch(contentPagesActions.setData({ 'field': 'about_us', data: contentConfig?.data?.content[key]?.value }))
            }
            if (key === 'terms_and_conditions') {
              dispatch(contentPagesActions.setData({ 'field': 'terms_and_conditions', data: contentConfig?.data?.content[key]?.value }))
            }
            if (key === 'refund_policy') {
              dispatch(contentPagesActions.setData({ 'field': 'refund_policy', data: contentConfig?.data?.content[key]?.value }))
            }
            if (key === 'return_policy') {
              dispatch(contentPagesActions.setData({ 'field': 'return_policy', data: contentConfig?.data?.content[key]?.value }))
            }
            if (key === 'cancellation_policy') {
              dispatch(contentPagesActions.setData({ 'field': 'cancellation_policy', data: contentConfig?.data?.content[key]?.value }))
            }
            if (key === 'privacy_policy') {
              dispatch(contentPagesActions.setData({ 'field': 'privacy_policy', data: contentConfig?.data?.content[key]?.value }))
            }
          })
          dispatch(contentPagesActions.setData({ 'field': 'fetched', data: true }))
        }
  }

  useEffect(()=>{
    if(!contentFetched){
      fetchContents()
    }
  },[contentFetched])

  
  const checkSaveFcmToken = async () =>{
    const fcmTokenStorage = await getValue('fcmTokenStorage')
    if(fcmTokenStorage){
         const formData = new FormData()
         formData.append('fcm_token',fcmTokenStorage)
         const response:Response =  await saveFcmTokenProcess(formData)
         console.log(response?.data)
         clearValue('fcmTokenStorage')
    }

 }



   useEffect(()=>{
        checkSaveFcmToken()
    },[])
 
  

  // load home page date
  const loadDashboardHomeData = async ()=>{
      const [topCardData,recentBookings] = await Promise.all([homeTopCardData(),homeRecentBookings()]) 
      // console.log("========== top card data ====================")
      // console.log(JSON.stringify(topCardData?.data?.content?.[0]?.top_cards))  
      // console.log("========== recent booking data ====================")
      // console.log(JSON.stringify(recentBookings?.data?.content?.[0]?.bookings))  
      dispatch(serviceManHomeDataActions.setData({field:'topCard',data:topCardData?.data?.content?.[0]?.top_cards}))
      dispatch(serviceManHomeDataActions.setData({field:'RecentBookings',data:recentBookings?.data?.content?.[0]?.bookings}))
      dispatch(serviceManHomeDataActions.setData({field:'refreshHomeData',data:false}))
  }

  useEffect(()=>{
    if(refreshHomeData){
      loadDashboardHomeData()
      setNeedSkeletonLoader(false)
    }else{
      setNeedSkeletonLoader(false)
    }
  },[refreshHomeData])

  return (
    <ScrollView
      style={[
        GlobalStyle.mainView,
        { backgroundColor: isDark ? appColors.darkTheme : appColors.white },
         
      ]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}>
      {needSkeletonLoader && <SkeletonLoader />}
      {!needSkeletonLoader && <>
        <Header
          showBackArrow={false}
          title={'bottomTab.home'}
          trailIcon={
            <Chat color={isDark ? appColors.white : appColors.darkText} />
          }
          gotoScreen={() => navigate('ChatHistory')}
          trailIcon1={
            <Notification color={isDark ? appColors.white : appColors.darkText} />
          }
          onTrailIcon={() => navigate('Notification')}
        />
        {/* <TouchableOpacity onPress={()=>onDisplayNotification('testing title','testing body')}><Text>Click test notification</Text></TouchableOpacity> */}
         
        {/* servicemen dashboard task statistics */}
        <ServiceMenDashBoard />
        {/* statistics graph */}
        <StaticsDetail />
        {/* Recent booking activites */}
        <RecentBookingActivities/>

         
        
      </>}

    </ScrollView>
  );
}
