import { TouchableOpacity, View, Alert, StyleSheet, RefreshControl, ActivityIndicator, FlatList } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import React, { useEffect, useState, useReducer } from 'react';
import { GlobalStyle } from '@style/styles';
import { Notification, Search, BookingFilterIcon, AddItemIcon } from '@utils/icons';
import Header from '@commonComponents/header';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from 'src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import appColors from '@theme/appColors';
import { useValues } from '../../../../../App';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';
import Icon from 'react-native-vector-icons/FontAwesome';
import OrderCard from './orderCard';
import GradientBtn from '@src/commonComponents/gradientBtn';
import {  getServiceManLatestOrders, serviceManAcceptOrder, getServiceManCurrentOrders } from '@src/services/store/order.service';
import HomeNoFataFound from '@src/commonComponents/homeNoDataFound';
import SkeletonLoader from '@src/commonComponents/SkeletonLoader';
import ViewMapModal from './viewMap';
import Spinner from 'react-native-loading-spinner-overlay';
//ORDER STATE
interface OrderState {
    orders: any[];
    
}
//INITIAL STATE
const initialState: OrderState = {
    orders: [],
    
}
//ACTION
type Action =
    | { type: 'SET_ORDERS'; payload: typeof initialState.orders }
    | { type: 'RESET_ALL' };
;
//REDUCER
const reducer = (state: OrderState, action: Action): OrderState => {
    switch (action.type) {
        case 'SET_ORDERS':
            return { ...state, orders: action.payload };
        case 'RESET_ALL':
            return {
                ...initialState
            };
        default:
            return state;
    }
}

interface Response {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}
type routeProps = NativeStackNavigationProp<RootStackParamList>;


//Store Order Listing view
export default function StoreRunningOrders() {
    const { isDark, t } = useValues();
    const dispatch = useDispatch()
    const [refreshing, setRefreshing] = React.useState(false);
    const [isFirstTimeLoading,setIsFirstTimeLoading] =  useState(true)
    const [ORDER_STATE, ORDER_DISPATCH] = useReducer(reducer, initialState);
   
    const {latitude:myCurrentLat,longitude:myCurrentLng} = useSelector((state: RootState)=>state.currentLocation)
    const [showViewOnMap,setShowViewOnMap]=  useState(false)
    const [selectedItem,setSelectedItem] = useState(null)
    const [loaderSpinner,setLoaderSpinner] = useState(false)
     
    //drag screen refresh page
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        reset()
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);


    const { navigate } = useNavigation<routeProps>();

    //navigate order details page
    const navigateToOrderDetailsPage = (OrderId: number) => {
        
        navigate('StoreOrderDetails',{OrderId:String(OrderId)});
    }
    //load view map page 
    const navigateToViewMapPage = (item:any)=>{
        setSelectedItem(item)
        setShowViewOnMap(true)
    }
    //hide map
    const hideMap = ()=>{
        setSelectedItem(null)
        setShowViewOnMap(false)
    }

    //accept order
    const acceptOrder = (orderId:any)=>{
         if(orderId){
            Alert.alert(
                t('newDeveloper.ConfirmAction'), // Title of the alert
                t('newDeveloper.acceptOrderConfirmation'), // Message of the alert
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel", // Styles the button as a "Cancel" type
                  },
                  {
                    text: "Confirm",
                    onPress: async() => {
                        setLoaderSpinner(true)
                        await serviceManAcceptOrder(orderId)
                        setLoaderSpinner(false)
                        reset()
                        hideMap()
                    },
                  },
                ],
                { cancelable: false } // Disables closing the alert by tapping outside
              );
               
         }
    }
    //ignore order
    const ignoreOrder = (orderId:any)=>{
        if(orderId){
            Alert.alert(
                t('newDeveloper.ConfirmAction'), // Title of the alert
                t('newDeveloper.ignoreOrderConfirmation'), // Message of the alert
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel", // Styles the button as a "Cancel" type
                  },
                  {
                    text: "Confirm",
                    onPress: () => {
                        console.log({orderId})
                    },
                  },
                ],
                { cancelable: false } // Disables closing the alert by tapping outside
              );
        }

    }


    //load order onload process
    const loadOrderOnload = async () => {
        const [currentOrders] = await Promise.all([getServiceManCurrentOrders()])
        ORDER_DISPATCH({ type: 'SET_ORDERS', payload: currentOrders?.data })
        setIsFirstTimeLoading(false)
    }

    useEffect(() => {
      if(isFirstTimeLoading){
        loadOrderOnload()
      }  
    },[isFirstTimeLoading])

    const reset = ()=>{
      setIsFirstTimeLoading(true)
    }


    useEffect(() => {
        const interval = setInterval(async () => {
            if(!isFirstTimeLoading){
                setRefreshing(true);
                // await loadOrderOnload()
                setRefreshing(false);
            }
        }, 100000);  

        return () => clearInterval(interval);
      }, []);

    

    return (
        <View style={[styles.container, { backgroundColor: isDark ? appColors.darkCardBg : appColors.white }]}>
            <Header
                showBackArrow={false}
                title={'newDeveloper.RunningOrders'}
                content={''}
            />
             
             
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    GlobalStyle.contentContainerStyle,
                ]}
                style={[
                    GlobalStyle.mainView, { backgroundColor: isDark ? appColors.darkTheme : appColors.white, },
                ]}
            >
                  {isFirstTimeLoading && <SkeletonLoader />}  
                {!isFirstTimeLoading && ORDER_STATE.orders.length === 0 && <HomeNoFataFound message={t('newDeveloper.Nodatafound')}/>} 

                {!isFirstTimeLoading && ORDER_STATE.orders.length > 0 &&
                <FlatList
                    data={ORDER_STATE.orders}
                    renderItem={({ item }) => {
                        return <TouchableOpacity onPress={()=>{navigateToOrderDetailsPage(item.id)}}><OrderCard item={item} /></TouchableOpacity>
                    }}
                    keyExtractor={(item:any) => String(item?.id)}
                />
                 }  
                <View style={GlobalStyle.blankView} />
            </ScrollView>
            <Spinner
                visible={loaderSpinner}
                textContent={'Processing.....'}
                textStyle={{ color: '#FFF' }}
            />
           {showViewOnMap && selectedItem && <ViewMapModal acceptOrder={acceptOrder} ignoreOrder={ignoreOrder} dmcurloc={{lat:Number(myCurrentLat),lng:Number(myCurrentLng)}} selectedItem={selectedItem} hideMap={hideMap} />} 
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fixedFilter: {
        top: 0,
        width: '100%',
        zIndex: 1,

        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3
    },
});


