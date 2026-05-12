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
import OrderFilterCard from '@src/screens/dashboard/home/StoreOrders/orderFilterCard';
import StatusCard from '@src/screens/dashboard/home/StoreOrders/statusCard';
import GradientBtn from '@src/commonComponents/gradientBtn';
import { getAllOrders, getCompleteOrders } from '@src/services/store/order.service';
import { StoreOrderInterface } from '@src/interfaces/store/order.interface';
import { storeProfileDataActions } from '@src/store/redux/store/store-profile-redux';
import { getAuthUserService as storeAuthService } from '@src/services/store/auth.service';
import HomeNoFataFound from '@src/commonComponents/homeNoDataFound';
import SkeletonLoader from '@src/commonComponents/SkeletonLoader';
//ORDER STATE
interface OrderState {
    limit: number;
    offset: number;
    orders: StoreOrderInterface[];
    
}
//INITIAL STATE
const initialState: OrderState = {
    limit: 30,
    offset: 1,
    orders: [],
    
}
//ACTION
type Action =
    | { type: 'SET_LIMIT'; payload: typeof initialState.limit }
    | { type: 'SET_OFFSET'; payload: typeof initialState.offset }
    | { type: 'SET_ORDERS'; payload: typeof initialState.orders }
    | { type: 'RESET_ALL' };
;
//REDUCER
const reducer = (state: OrderState, action: Action): OrderState => {
    switch (action.type) {
        case 'SET_LIMIT':
            return { ...state, limit: action.payload };
        case 'SET_OFFSET':
            return { ...state, offset: action.payload };
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
export default function StoreCompletedOrders() {
    const { isDark, t } = useValues();
    const dispatch = useDispatch()
    const [refreshing, setRefreshing] = React.useState(false);
    const [scrollPaging, setScrollPaging] = useState(false)
    const [noMoreData,setNoMoreData] = useState(false)
    const [isFirstTimeLoading,setIsFirstTimeLoading] =  useState(true)
    const [ORDER_STATE, ORDER_DISPATCH] = useReducer(reducer, initialState);
   
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

    //load order onload
    const loadOrderOnload = async () => {
         
        const [completedOrder] = await Promise.all([getCompleteOrders(ORDER_STATE.limit, ORDER_STATE.offset)])
        if(completedOrder?.data?.orders && completedOrder?.data?.orders.length > 0){
            const cloneOrders = [...ORDER_STATE.orders, ...completedOrder?.data?.orders];
            ORDER_DISPATCH({ type: 'SET_ORDERS', payload: cloneOrders })
            ORDER_DISPATCH({ type: 'SET_OFFSET', payload: ORDER_STATE.offset+1 })
        }else{
            setNoMoreData(true)
        }
        setIsFirstTimeLoading(false)
        setScrollPaging(false);
    }

    useEffect(() => {
      if((isFirstTimeLoading || scrollPaging) && !noMoreData){
        loadOrderOnload()
      }  
    },[isFirstTimeLoading,scrollPaging])

    const reset = ()=>{
            setNoMoreData(false)
            setIsFirstTimeLoading(true)
            ORDER_DISPATCH({ type: 'SET_ORDERS', payload: [] });
            ORDER_DISPATCH({ type: 'SET_OFFSET', payload: 1 });
    }
   
    //handle scroll processing
    const handleScrollProcessing = () => {
        if (noMoreData){ return; }
        setScrollPaging(true)
    }

     
    return (
        <View style={[styles.container, { backgroundColor: isDark ? appColors.darkCardBg : appColors.white }]}>
            <Header
                showBackArrow={false}
                title={'newDeveloper.MyOrders'}
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
                    onEndReached={handleScrollProcessing}
                    data={ORDER_STATE.orders}
                    renderItem={({ item }) => {
                        return <TouchableOpacity onPress={()=>{navigateToOrderDetailsPage(item.id)}}><OrderCard item={item} /></TouchableOpacity>
                    }}
                    keyExtractor={(item:StoreOrderInterface) => String(item.id)}
                />
                 }  
                <View style={GlobalStyle.blankView} />
            </ScrollView>
            {scrollPaging && <ActivityIndicator />}
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


