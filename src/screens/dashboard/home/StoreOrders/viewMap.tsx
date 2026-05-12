import appColors from '@src/theme/appColors';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useValues } from '../../../../../App';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { customer_marker, delivery_man_marker, marker_store, restaurant_marker } from '@src/utils/images';
import { getDistanceFromLatLonInKm } from '@src/utils/functions';
import { convertToTitleCase, getTimeDifference } from '@src/config/utility';
const ViewMapModal = ({hideMap, selectedItem, dmcurloc,acceptOrder, ignoreOrder}:{hideMap:()=>void, selectedItem:any, dmcurloc:{lat:number,lng:number},acceptOrder:(value:any)=>void,ignoreOrder:(value:any)=>void}) => {
    // console.log(`============================ ${JSON.stringify(selectedItem)} ================================`)
    console.log(`======================= ${JSON.stringify(dmcurloc)}========================================`)
     
    const { isDark, t, currSymbol } = useValues();
    // Dummy coordinates
    const customerLocation = {
        latitude: Number(selectedItem?.delivery_address?.latitude), // Replace with real coordinates
        longitude: Number(selectedItem?.delivery_address?.longitude),
    };

    const storeLocation = {
        latitude: Number(selectedItem?.store_lat), // Replace with real coordinates
        longitude: Number(selectedItem?.store_lng),
    };

    console.log(`======================= ${JSON.stringify({storeLocation,customerLocation})}========================================`)
    const markerIcon = selectedItem?.module?.module_type === 'food' ? restaurant_marker : customer_marker

    const distanceResturantAndDeliveryBoy = getDistanceFromLatLonInKm(storeLocation.latitude,storeLocation.longitude,dmcurloc.lat,dmcurloc.lng)
    const distanceResturantAndCustomer = getDistanceFromLatLonInKm(storeLocation.latitude,storeLocation.longitude,customerLocation.latitude,customerLocation.longitude)
    console.log(`======================= ${JSON.stringify({distanceResturantAndDeliveryBoy,distanceResturantAndCustomer})}========================================`)

    return (

        <Modal visible={true} transparent animationType="slide">
            <View style={[styles.modalContainer, { backgroundColor: isDark ? appColors.darkCardBg : appColors.white }]}>
            <View style={styles.headerContainer}>
          <Text style={[styles.header,{color:isDark ? appColors.white : appColors.darkText}]}>{t('newDeveloper.OrderLocation')}</Text>
          <TouchableOpacity onPress={hideMap} style={styles.closeButton}>
            <Icon name="close" size={24} color={isDark ? appColors.white : appColors.darkText} /> 
          </TouchableOpacity>
        </View>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: (customerLocation.latitude + storeLocation.latitude) / 2,
                        longitude: (customerLocation.longitude + storeLocation.longitude) / 2,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    {/* Customer Marker */}
                    <Marker
                        coordinate={customerLocation}
                        title={selectedItem?.delivery_address?.contact_person_name}
                        description={selectedItem?.delivery_address?.address}

                    >
                        <Image
                            source={customer_marker}  
                            style={{ width: 40, height: 40 }}  
                        />
                    </Marker>
                    {/* Store Marker */}
                    <Marker
                        coordinate={storeLocation}
                        title={selectedItem?.store_name}
                        description={selectedItem?.store_address}


                    >
                        <Image
                            source={markerIcon} // Replace with your image path
                            style={{ width: 40, height: 40 }} // Set custom size here
                        />

                    </Marker>
                </MapView>
                <View style={styles.infoContainer}>
                    <Text style={[styles.infoText,{color:appColors.primary}]}>{getTimeDifference(selectedItem?.created_at)} {t('newDeveloper.ago')}</Text>
                    <Text style={[styles.infoText,{color:isDark ? appColors.white : appColors.darkText}]}>
                    {t('newDeveloper.distanceTextOne')}: <Text style={styles.bold}>{distanceResturantAndDeliveryBoy.toFixed(2)} Km Approx</Text>
                    </Text>
                    <Text style={[styles.infoText,{color:isDark ? appColors.white : appColors.darkText}]}>
                    {t('newDeveloper.distanceTextTwo')}: <Text style={styles.bold}>{distanceResturantAndCustomer.toFixed(2)} km Approx</Text>
                    </Text>
                    <Text style={[styles.infoText,{color:appColors.primary}]}>{currSymbol} {selectedItem?.delivery_charge} <Text style={styles.bold}>({convertToTitleCase(selectedItem?.payment_method.replaceAll('_',' ')) })</Text></Text>
                    <View style={styles.buttonContainer}>
                        {/* <TouchableOpacity style={styles.buttonIgnore} onPress={() => ignoreOrder(selectedItem?.id)}>
                            <Text style={styles.buttonText}>{t('newDeveloper.Ignore')}</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.buttonAccept} onPress={() => acceptOrder(selectedItem?.id)}>
                            <Text style={styles.buttonText}>{t('newDeveloper.Accept')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,

        borderRadius: 10,
        margin: 20,
        padding: 10,
        justifyContent: 'space-between',
        elevation: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    closeButton: {
        padding: 8,
        borderRadius: 16,
      },
    map: {
        flex: 2,
        borderRadius: 10,
        
         
    },
    infoContainer: {
        flex: 1,
        padding: 10,
    },
    infoText: {
        fontSize: 16,
        marginVertical: 5,
         
    },
    bold: {
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    buttonIgnore: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        width: 100,
        alignItems: 'center',
    },
    buttonAccept: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        width: 100,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ViewMapModal;
