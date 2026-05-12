import { Alert, RefreshControl, ScrollView, View, StyleSheet, Linking, Text, TouchableOpacity } from 'react-native';
 
import React, { useState, useEffect, useReducer } from 'react';
import { GlobalStyle } from '@style/styles';
import Header from '@commonComponents/header';
import { windowHeight, windowWidth } from '@theme/appConstant';
import { useValues } from '../../../../../App';
import appColors from '@theme/appColors';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'src/navigation/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import StoreStatus from './storeStatus';
import OrderStatusList from './statusList';
import OrderList from './orderList';
import CampaignFilter from './campaignFilter';
import { storeProfileDataActions } from '@src/store/redux/store/store-profile-redux';
import { getAuthUserService as storeAuthService } from '@src/services/store/auth.service';
import { updateStoreStatusProcess } from '@src/services/store/profile.service';
import { getCurrentOrders, getServiceManCurrentOrders } from '@src/services/store/order.service';
import { CurrentOrderInterface } from '@src/interfaces/store/currentOrder.interface';
import { saveVendorFcmTokenProcess } from '@src/services/store/profile.service';
import { storeHomeOrderActions } from '@src/store/redux/store/store-home-order';
import { clearValue, getValue } from '@src/utils/localstorage';
import { PermissionsAndroid, Platform } from 'react-native';
import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';
import NonCancelableAlert from '@src/commonComponents/nonCancelableAlert';
import { NativeModules } from 'react-native';
import { currentLocationActions } from '@src/store/redux/store/current-location-redux';
import OrdersSummary from '@src/commonComponents/ordersSummary';
import SwitchContainer from '@src/otherComponent/switchContainer';
import OrderCard from '../StoreRunningOrders/orderCard';



interface Response {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

 
 
 

 

//Add new banner
type ItemsProps = NativeStackNavigationProp<RootStackParamList>;
type EditCouponRouteProp = RouteProp<RootStackParamList, 'EditVendorCoupon'>;
// Store wallet
export default function StoreHome() {
  const navigation = useNavigation<ItemsProps>();
  const route = useRoute<EditCouponRouteProp>();
  const { isDark, t } = useValues();
  const dispatch = useDispatch()
   

  const [processingLoader, setProcessingLoader] = useState(false)
  const [refreshing, setRefreshing] = React.useState(false);
  const [cancelableAlert,showNonCancelableAlert] =  useState(false);
  const [runningOrder,setRunningOrder] =  useState<any>(null)
  //profile reset 
  const profileReset = async () => {
    const responseuser = await storeAuthService()
    if (responseuser?.data?.id) {
      dispatch(storeProfileDataActions.setData(responseuser?.data))
    }
  }
   
  //check save fcm token
  const checkSaveFcmToken = async () =>{
     const fcmTokenStorage = await getValue('fcmTokenStorage')
     console.log({fcmTokenStorage})
     if(fcmTokenStorage){
          const formData = new FormData()
          formData.append('fcm_token',fcmTokenStorage)
          const response:Response =  await saveVendorFcmTokenProcess(formData)
          console.log(response?.data)
          clearValue('fcmTokenStorage')
     }
  }
  //Update user fcm token 
  useEffect(()=>{
      checkSaveFcmToken()
  },[])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    profileReset()
    loadOrderOnload() 
    dispatch(storeHomeOrderActions.setData({field:'refreshOrders','data':true}))
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);


  const updateStoreStatus = async () => {
    await updateStoreStatusProcess()
    profileReset()
  }

  //navigate to order details page
  const navigateToOrderDetailsPage = (OrderId: number) => {
    navigation.navigate('StoreOrderDetails', { OrderId: String(OrderId) });
  }


  const checkLocationPermission = async ()=>{
        const granted = await PermissionsAndroid.check(
                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        const backgroundGranted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        );
         
        if(granted && backgroundGranted){
          showNonCancelableAlert(false)
          dispatch(currentLocationActions.setData({'field':'canStartTracking','data':true}))
        }
  }
   

  const requestLocationPermission = async () => {
    
    try {
      if (Platform.OS === 'android') {
        
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
  
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          const backgroundGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
          );
          if (backgroundGranted !== PermissionsAndroid.RESULTS.GRANTED) {
            showNonCancelableAlert(true);
          }
        } else {
          showNonCancelableAlert(true);
        }
      } else {
        const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
        if (result === RESULTS.GRANTED) {
          showNonCancelableAlert(true);
        } else {
          showNonCancelableAlert(true);
        }
      }
    } catch (err) {
      console.warn(err);
      showNonCancelableAlert(true);
    }
  };

  useEffect(()=>{
     
    requestLocationPermission()
  },[])

   const [isOnline, setOnline] = useState(false);
    const profileData = useSelector(
        (state: RootState) => state['storeProfileData']
      );
  
    useEffect(()=>{
      setOnline(Boolean(profileData.active))
    },[profileData])

  const toggleSwitch = () =>{
    setOnline(previousState => !previousState);
    updateStoreStatus()
  } 

  const loadOrderOnload = async () => {
          const [currentOrders] = await Promise.all([getServiceManCurrentOrders()])
          if(currentOrders?.data.length > 0){
            setRunningOrder(currentOrders?.data?.[0])
          }
  }

  useEffect(() => {
        loadOrderOnload() 
  },[])


   
  

  return (
    <>
      <View style={[styles.container, { backgroundColor: isDark ? appColors.darkCardBg : appColors.white }]}>
        <Header showBackArrow={false} title={'newDeveloper.DorkarDeliveryBoy'} />
         <View style={[styles.statusContainer,{backgroundColor:isDark ? appColors.darkTheme : appColors.white  }]}>
                <Text style={[styles.statusText,{color: isDark ? appColors.white : appColors.darkText,}]}>{t('newDeveloper.Online')}</Text>
                 <SwitchContainer toggleDarkSwitch={toggleSwitch} switchOn={isOnline} />
        </View>
        {runningOrder && <View style={{alignItems:'flex-end',marginHorizontal:10}}><TouchableOpacity style={{marginTop:10, padding:4,backgroundColor:appColors.primary, borderRadius:4}} onPress={()=>{ navigation.navigate('StoreRunningOrders') }}><Text style={{color:appColors.white}}>{t('newDeveloper.Viewallrunningorders')}</Text></TouchableOpacity></View>  }
        {runningOrder && <TouchableOpacity style={{marginTop:10}} onPress={()=>{navigateToOrderDetailsPage(runningOrder.id)}}><OrderCard item={runningOrder} /></TouchableOpacity>}
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            GlobalStyle.contentContainerStyle,
          ]}
          style={[
            GlobalStyle.mainView,
            {
              backgroundColor: isDark ? appColors.darkTheme : appColors.white,
              marginTop: 10
            },
          ]}
        >
           <View><StoreStatus updateStoreStatus={updateStoreStatus} /></View>
          <View><OrdersSummary/></View>
          <Spinner
            visible={processingLoader}
            textContent={'Processing.....'}
            textStyle={{ color: '#FFF' }}
          />
        </ScrollView>
       
      </View>


    {cancelableAlert && <NonCancelableAlert checkLocationPermission={checkLocationPermission}   message={t('newDeveloper.MapLocationError')}/>} 
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
    paddingLeft: 16,
    marginTop:10
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

});
