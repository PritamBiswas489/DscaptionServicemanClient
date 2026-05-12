import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MyTabBar} from './myTabBar';
import {
  HomeIcon,
  WalletIcon,
  BookingIcon,
  SettingIcon,
  ActiveSetting,
  ActiveHomeIcon,
  ActiveWallet,
  ActiveBooking,
  Plus,
  Services,
  MenuIcon,
  ActiveMenuIcon
} from '@utils/icons';
import appColors from '../theme/appColors';
import {Home, Wallet, Setting, Booking, ServiceList, MoreMenus} from '../screens/index';
import {View,Text} from 'react-native';
import CartModal from '@otherComponent/cartModal';
import {windowHeight} from '@theme/appConstant';
import Spinner from 'react-native-loading-spinner-overlay';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';
import { serviceManHomeDataActions } from '@src/store/redux/serviceman/service-man-home-data.redux';
import { bookingSearchFieldActions } from '@src/store/redux/booking-search-field';

const Tab = createBottomTabNavigator();

export function BottomTab() {
  const [selected, setSelected] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [processingSpinner, setProcessingLoader] = useState(false)
   const dispatch = useDispatch()
  const tabData = [
    {
      name: 'bottomTab.home',
      activeIcon: <ActiveHomeIcon />,
      tabBarIcon: <HomeIcon color={appColors.lightText} />,
    },
    {
      name: 'bottomTab.booking',
      activeIcon: <ActiveBooking />,
      tabBarIcon: <BookingIcon />,
    },
    {
      name: 'newDeveloper.History',
      activeIcon: <ActiveBooking />,
      tabBarIcon: <BookingIcon />,
    },
    {
      name: 'newDeveloper.moreMenuText',
      activeIcon: <ActiveMenuIcon />,
      tabBarIcon: <MenuIcon />,
    },
  ];

  const onPress = (key: number) => {
    if(key === 0 ){
     
          dispatch(serviceManHomeDataActions.setData({field:'refreshHomeData',data:true})) //refresh home data
      }
      if(key === 1 ){
        
           dispatch(bookingSearchFieldActions.setData({field:'selectedStatus',data:'accepted'})) //selected status
      }
      if(key === 2 ){
        
           dispatch(bookingSearchFieldActions.setData({field:'selectedStatus',data:'all'})) //all status
      }
      setSelected(key); 
  };

  return (
    <View style={{flex: 1}}>
      <View style={{paddingBottom: windowHeight(9), flex: 1}}>
        {selected == 0 ? (
          <Home />
        ) : selected == 1 ? (
          <Booking type="BOOKING" />
        ) : selected == 2 ? (
          <Booking type="HISTORY" />
        ) : (
          <MoreMenus />
        )}
      </View>
      <MyTabBar onPress={onPress} selected={selected} tabData={tabData} />
      <CartModal
        setModalVisible={setModalVisible}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
      /> 
       <Spinner
        visible={processingSpinner}
        textContent={'Processing.....'}
        textStyle={{ color: '#FFF' }}
      />
    </View>
  );
}
