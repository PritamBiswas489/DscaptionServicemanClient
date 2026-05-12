import appColors from '@src/theme/appColors';
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Image } from 'react-native';
import { useValues } from '../../../../../App';
import { StoreOrderInterface } from '@src/interfaces/store/order.interface';
import { datetimeArr } from '@src/config/utility';
import { maleDefault, shopDefault } from '@src/utils/images';

const statusColor: Record<'delivered' | 'refunded', string> = {
    delivered: appColors.success,
    refunded: appColors.error,
};
function isValidOrderStatus(status: string): status is keyof typeof statusColor {
    return status in statusColor;
 }
  
//order card 
const OrderCard = ({ item }: { item: any }) => {
    const { isDark, t } = useValues();
    const tt = datetimeArr(item?.created_at)
    //map view redirect
    const mapViewRedirect = () =>{
        const url = `https://www.google.com/maps/dir/?api=1&destination=${item?.store_lat},${item?.store_lng}&travelmode=driving`;
        Linking.openURL(url).catch(err => console.error('An error occurred', err)); 
    }
    return <View style={styles.orderContainer}>
         {item?.store_logo_full_url ? <Image source={{uri:item?.store_logo_full_url}} style={styles.icon} /> : <Image source={shopDefault} style={styles.icon} />}   
        <View style={styles.orderInfo}>
            <Text style={[styles.orderId, { color: isDark ? appColors.white : appColors.darkText }]}>Order ID: {item?.id}</Text>
            <Text style={[styles.orderType, { color: appColors.primary }]}>{item?.store_name}</Text>
            <Text style={[styles.orderDate, { color: isDark ? appColors.darkSubText : appColors.darkText }]}>{tt.day} {tt.month} {tt.year} {tt.hours} {tt.minutes} {tt.ampm}</Text>
        </View>
        <View style={[styles.statusButton, { backgroundColor: appColors.primary }]}>
            <Text style={[styles.statusText, { color: appColors.white }]}>{t(`newDeveloper.${item.order_status}`)}</Text>
        </View>
    </View>
};

const styles = StyleSheet.create({
    orderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    orderInfo: {
        flexDirection: 'column',
        flex: 1,
    },
    orderId: {
        fontWeight: 'bold',
    },
    orderDate: {

    },
    orderType: {

    },
    icon: {
        width: 50,
        height: 50,
    },
    statusButton: {
        borderRadius: 4,
        paddingVertical: 1,
        paddingHorizontal: 8,
        height: 25
    },
    statusText: {
        fontWeight: 'bold',
    },
});

export default OrderCard;
