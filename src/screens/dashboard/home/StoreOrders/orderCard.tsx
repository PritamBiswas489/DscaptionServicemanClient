import appColors from '@src/theme/appColors';
import React from 'react';

import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useValues } from '../../../../../App';
import { StoreOrderInterface } from '@src/interfaces/store/order.interface';
import { convertToTitleCase, datetimeArr } from '@src/config/utility';
import { maleDefault, shopDefault } from '@src/utils/images';
import { getDistanceFromLatLonInKm } from '@src/utils/functions';
import { useSelector } from 'react-redux';
import { RootState } from '@src/store';
import { getTimeDifference } from '@src/config/utility';
const statusColor: Record<'delivered' | 'refunded', string> = {
    delivered: appColors.success,
    refunded: appColors.error,
};
function isValidOrderStatus(status: string): status is keyof typeof statusColor {
    return status in statusColor;
}

//order card 
const OrderCard = ({ item, navigateToViewMapPage, acceptOrder, ignoreOrder }: { item: any, navigateToViewMapPage:(item:any)=>void,acceptOrder:(value:any)=>void,ignoreOrder:(value:any)=>void }) => {
    const {latitude,longitude} = useSelector((state: RootState)=>state.currentLocation)

    const { isDark, t, currSymbol } = useValues();
    const tt = datetimeArr(item.created_at)
    return <View style={[styles.container,{backgroundColor:isDark ? appColors.darkCardBg : appColors.white  }]}>
        <View style={styles.header}>
          {item?.store_logo_full_url ? <Image source={{uri:item?.store_logo_full_url}} style={styles.icon} /> : <Image source={shopDefault} style={styles.icon} />}   
            <View style={styles.headerText}>
               <Text style={[styles.restaurantName,{color: appColors.primary}]}>#{item?.id}</Text>
                <Text style={[styles.restaurantName,{color: isDark ? appColors.white : appColors.darkText}]}>{item?.store_name}</Text>
                <Text style={styles.itemText}>{item?.details_count} {t('newDeveloper.item')}</Text>
                <Text style={[styles.locationText,{color: isDark ? appColors.darkSubText : appColors.darkText}]}>{item?.store_address}</Text>
            </View>
            <Text style={styles.timeText}>{getTimeDifference(item?.created_at)} {t('newDeveloper.ago')}</Text>
        </View>
        <View style={styles.infoRow}>
            <Text style={styles.distanceText}>{getDistanceFromLatLonInKm(latitude,longitude,item?.store_lat,item?.store_lng).toFixed(2)} km {t('newDeveloper.awayfromyou')}</Text>
        </View>
        <View style={styles.deliveryInfo}>
        {item?.customer?.image_full_url ? <Image source={{uri:item?.customer?.image_full_url}} style={styles.icon} /> :  <Image source={maleDefault} style={styles.avatar} />}   
           
            <View>
                <Text style={[styles.deliveryText,{color: isDark ? appColors.white : appColors.darkText}]}>{t('newDeveloper.Deliverto')}</Text>
                <Text style={[styles.addressText,{color: isDark ? appColors.darkSubText : appColors.darkText}]}>{item?.delivery_address?.address}</Text>
            </View>
            <TouchableOpacity onPress={()=>navigateToViewMapPage(item)} style={styles.mapButton}>
                <Text style={styles.mapButtonText}>{t('newDeveloper.Viewonmap')}</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.footer}>
            <Text style={styles.priceText}>{currSymbol} {item?.delivery_charge}</Text>
            <Text style={styles.paymentText}>{convertToTitleCase(item?.payment_method.replaceAll('_',' ')) }</Text>
            <View style={styles.actionButtons}>
                {/* <TouchableOpacity onPress={()=>ignoreOrder(item?.id)} style={styles.ignoreButton}>
                    <Text style={styles.ignoreText}>{t('newDeveloper.Ignore')}</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={()=>acceptOrder(item?.id)}  style={styles.acceptButton}>
                    <Text style={styles.acceptText}>{t('newDeveloper.Accept')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        padding: 15,
        margin: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icon: {
        width: 40,
        height: 40,
    },
    headerText: {
        flex: 1,
        marginLeft: 10,
    },
    restaurantName: {
        fontWeight: 'bold',
        fontSize: 16,
        
    },
    itemText: {
        color: appColors.primary,
    },
    locationText: {
        color: 'gray',
    },
    timeText: {
        color: appColors.primary,
    },
    infoRow: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: appColors.lightOrange,
        borderRadius: 5,
    },
    distanceText: {
        color: appColors.darkText,
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    deliveryText: {
        fontWeight: 'bold',
        color: 'black'
    },
    addressText: {
        color: 'gray',
    },
    mapButton: {
        backgroundColor: appColors.assigned,
        
        padding: 5,
        borderRadius: 5,
        marginLeft: 'auto',
    },
    mapButtonText: {
        color: appColors.black,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    priceText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: appColors.primary
    },
    paymentText: {
        backgroundColor: appColors.lightGreen,
        color:appColors.black,
        padding: 5,
        borderRadius: 5,
        marginLeft: 10,
    },
    actionButtons: {
        flexDirection: 'row',
        marginLeft: 'auto',
    },
    ignoreButton: {
        backgroundColor: appColors.lightRed,
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    ignoreText: {
        color: '#000',
    },
    acceptButton: {
        backgroundColor: appColors.lightGreen,
        padding: 10,
        borderRadius: 5,
    },
    acceptText: {
        color: '#000',
    },
});
export default OrderCard;
