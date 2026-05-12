import appColors from '@src/theme/appColors';
import React, { useEffect, useState } from 'react';
import { GlobalStyle } from '@style/styles';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Linking } from 'react-native';
import { useValues } from '../../../../../App';
import Header from '@commonComponents/header';
import SwipeButton from './SwipeButton';
import { cancelOrderProcess, changeStatusToDeliveredProcessing, changeStatusToHandover, changeStatusToPickupProcessing, confirmOrderProcess, getCurrentOrderDetails, getOrderProductList, processingOrderProcess, serviceMenSendCustomerOtp, updateOrderPaymentPaid } from '@src/services/store/order.service';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@src/navigation/types';
import Toast from 'react-native-toast-message';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SkeletonLoader from '@src/commonComponents/SkeletonLoader';
import { datetimeArr, convertToTitleCase } from '@src/config/utility';
import { DashLine } from '@src/commonComponents';
import RNPrint from 'react-native-print';
import { storeHomeOrderActions } from '@src/store/redux/store/store-home-order';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';
import { Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import CancellationModal from '@src/commonComponents/cancellationModal';
import ProcessingModal from '@src/commonComponents/processingModal';
import ServiceProofImageOptions from '@src/otherComponent/ServiceProofImageOptions';
import CommonModal from '@src/commonComponents/commonModal';
import UploadCompletedImage from '@src/commonComponents/formStatusChangePanel/uploadCompletedImage';
import CompleteServiceOtpPanel from '@src/otherComponent/completeServiceOtpPanel';
import CompleteOrderOtpPanel from '@src/otherComponent/completeOrderOtpPanel';
import { windowHeight, windowWidth } from '@src/theme/appConstant';
import OrderAmountModal from '@src/commonComponents/orderAmountModal';


interface Response {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}
type OrderDetailsRouteProp = RouteProp<RootStackParamList, 'StoreOrderDetails'>;
type ItemsProps = NativeStackNavigationProp<RootStackParamList>;
//store order details
const StoreOrderDetails = () => {
    const { isDark, t, currSymbol } = useValues();
    const dispatch = useDispatch()
    const route = useRoute<OrderDetailsRouteProp>();
    const navigation = useNavigation<ItemsProps>();
    const OrderId = route?.params?.OrderId
    const [orderMainDetails, setOrderMainDetails] = useState<any>({}); //order main details
    const [orderProductItemList, setOrderProductItemList] = useState<any[]>([])
    const [showSkeletonLoader, setShowSkeletonloader] = useState(true)
    const [ordertime, setOrdertime] = useState<any>({})
    const [totalItemPrice, setTotalItemPrice] = useState<number | string>(0) //total item price
    const [processingLoader, setProcessingLoader] = useState(false)

    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [reason, setReason] = useState<string>('')


    const [processingModalVisible, setProcessingModalVisible] = useState<boolean>(false)
    const [processingTime, setProcessingTime] = useState<string>('')



    const [selectedCompletedImages, setSeletedCompletedImages] = useState<string[]>([])
    const [showServiceProofUploadOptions, setServiceProofUploadOption] = useState(false)
    const [showServiceProofOtp, setServiceProofOtp] = useState(false)
    const [booking_otp, setBookingOtp] = useState<string>('')

    const [modalImage,setmodalImage] = useState<string>('')
    const [showImageProofModal, setImageProofModal] = useState<boolean>(false);
    const [showOrderAmountModal,setShowOrderAmountModal] = useState<boolean>(false);

    //load current order details and item list
    const loadCurrentOrderDetails = async () => {

        const [orderDetails, orderProductList] = await Promise.all([
            getCurrentOrderDetails(OrderId), getOrderProductList(OrderId),
        ])
        
        setShowSkeletonloader(false)
        if (!orderDetails?.data?.id) {
            Toast.show({
                type: 'error',
                text1: 'ERROR',
                text2: t('newDeveloper.OrderDetailsNotFound'),
            });
            navigation.goBack()
            return
        }
        // console.log(orderDetails?.data?.order_proof_full_url)


        // console.log("===========================================================")
        // console.log(JSON.stringify(orderMainDetails))


        setOrderMainDetails(orderDetails?.data) //order main details
        if (orderDetails?.data?.created_at) {
            setOrdertime(datetimeArr(orderDetails?.data?.created_at))
        }
        if (orderProductList?.data && orderProductList?.data?.length > 0) {
            const totalItem = orderProductList?.data.reduce((accumulator: number, currentValue: any) => accumulator + currentValue?.price, 0);
            setTotalItemPrice(totalItem)
        }
        setOrderProductItemList(orderProductList?.data) //order product list

    }
    useEffect(() => {
        loadCurrentOrderDetails()
    }, [OrderId])

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadCurrentOrderDetails()
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const makePhoneCall = (phoneno: string | number) => {
        const phoneNumber = `tel:${phoneno}`; // Replace with the desired phone number
        Linking.openURL(phoneNumber).catch(err =>
            console.error('Failed to make a call:', err)
        );
    };
    //print order invoice
    const printOrderInvoice = async () => {
        const html = `
         <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice</title>
</head>
<body style="font-family: Arial, sans-serif; font-size: 14px; margin: 0; padding: 20px; line-height: 1.4;">
  <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 15px;">
     
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
      <div>
        <strong>${'newDeveloper.OrderID'}:</strong> #${orderMainDetails?.id}<br>
        <small>${ordertime?.day} ${ordertime?.month} ${ordertime?.year}  ${ordertime?.hours}:${ordertime?.minutes} ${ordertime?.ampm}</small>
      </div>
      <div style="text-align: right;">
        <strong>${convertToTitleCase(orderMainDetails?.payment_method)}</strong>
      </div>
    </div>

    <!-- Order Details -->
    <div style="margin-top: 10px;">
      <strong>${t(`newDeveloper.${orderMainDetails.order_type}`)}:</strong> ${convertToTitleCase(orderMainDetails?.order_status)}<br>
       
    </div>

     
    ${orderProductItemList.length > 0 && orderProductItemList.map((item: any, index: number) => {
            return `<div style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
      <strong>${t('newDeveloper.Item')}:</strong> ${index + 1}<br>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr>
          <td style="padding: 5px; border: 1px solid #ddd; text-align: left;">${item?.item_details?.name}</td>
          <td style="padding: 5px; border: 1px solid #ddd; text-align: right;">X ${item?.quantity}</td>
          <td style="padding: 5px; border: 1px solid #ddd; text-align: right;">${currSymbol} ${item?.item_details?.price}</td>
        </tr>
      </table>
    </div>`

        })
            }
    

    
    <div style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
      <strong>${t('newDeveloper.CustomerDetails')}:</strong><br>
      ${orderMainDetails?.delivery_address?.contact_person_name}<br>
      ${orderMainDetails?.delivery_address?.address}<br>
    </div>

    <div style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr>
          <td style="padding: 5px; text-align: left;">${t('newDeveloper.ItemPrice')}</td>
          <td style="padding: 5px; text-align: right;">${currSymbol}${totalItemPrice}</td>
        </tr>   
        <tr>
          <td style="padding: 5px; text-align: left;">${t('newDeveloper.Discount')}</td>
          <td style="padding: 5px; text-align: right;">(-) ${currSymbol}${orderMainDetails?.store_discount_amount}</td>
        </tr>
         ${orderMainDetails?.coupon_discount_amount > 0 ? `<tr>
            <td style="padding: 5px; text-align: left;">${t('newDeveloper.Coupondiscount')}</td>
            <td style="padding: 5px; text-align: right;">(-) ${currSymbol}${orderMainDetails?.coupon_discount_amount}</td>
          </tr>`: ''}

        
          ${orderMainDetails?.ref_bonus_amount > 0 ? `<tr>
          <td style="padding: 5px; text-align: left;">${t('newDeveloper.Referraldiscount')}</td>
          <td style="padding: 5px; text-align: right;">(-) ${currSymbol}${orderMainDetails?.ref_bonus_amount}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 5px; text-align: left;">${t('newDeveloper.VatTax')}</td>
          <td style="padding: 5px; text-align: right;">(+) ${currSymbol}${orderMainDetails?.total_tax_amount}</td>
        </tr>
         <tr>
          <td style="padding: 5px; text-align: left;">${t('newDeveloper.DeliveryManTips')}</td>
          <td style="padding: 5px; text-align: right;">(+) ${currSymbol}${orderMainDetails?.dm_tips}</td>
        </tr>
        <tr>
          <td style="padding: 5px; text-align: left;">${t('newDeveloper.PlatformCharge')}</td>
          <td style="padding: 5px; text-align: right;">(+) ${currSymbol}${orderMainDetails?.additional_charge}</td>
        </tr>
        <tr>
          <td style="padding: 5px; text-align: left;">${t('newDeveloper.DeliveryFee')}</td>
          <td style="padding: 5px; text-align: right;">(+) ${currSymbol}${orderMainDetails?.delivery_charge}</td>
        </tr>
        <tr>
          <td style="padding: 5px; text-align: left;">${t('newDeveloper.Extrapackaging')}</td>
          <td style="padding: 5px; text-align: right;">(+)  ${currSymbol}${orderMainDetails?.extra_packaging_amount}</td>
        </tr>
      </table>
    </div>
    <div style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px; text-align: right;">
      <strong>${t('newDeveloper.TotalAmount')}: ${currSymbol}${orderMainDetails?.order_amount}</strong>
    </div>
  </div>
</body>
</html>

        `;

        try {
            await RNPrint.print({
                html,
            });
        } catch (error) {
            console.error('Error generating or printing PDF:', error);
        }
    };
    const refreshHomeOrders = () => {
        dispatch(storeHomeOrderActions.setData({ field: 'refreshOrders', 'data': true }))
    }
    //confirm order processing 
    const confirmOrderProcessing = async () => {
        const response: Response = await confirmOrderProcess(orderMainDetails.id)
        if (response?.data?.errors) {
            Toast.show({
                type: 'error',
                text1: 'ERROR',
                text2: response?.data?.errors[0]?.message,
            });
        } else {
            if (response?.data?.message) {
                Toast.show({
                    type: 'success',
                    text1: 'ERROR',
                    text2: response?.data?.message,
                });
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'ERROR',
                    text2: 'Process successfully done',
                });
            }
        }
        refreshHomeOrders()
        loadCurrentOrderDetails()
        setReason(''); // Clear textarea
        setProcessingLoader(false)
    }
    const confirmOrder = () => {
        Alert.alert(
            'Confirmation', // Title of the alert
            t('newDeveloper.ConfirmOrderAlertMessage'), // Message
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel', // iOS styling for "cancel"
                },
                {
                    text: 'Confirm',
                    onPress: () => confirmOrderProcessing(),
                },
            ],
            { cancelable: false } // Disallows dismissal by tapping outside
        );
    }
    const cancelOrder = () => {
        setModalVisible(true)
        // loadCurrentOrderDetails();
    }
    //Cancel Order Process
    const CancelOrderProcess = async () => {
        if (reason.trim() === '') { return }
        setProcessingLoader(true)
        const response: Response = await cancelOrderProcess(orderMainDetails.id, reason)
        if (response?.data?.errors) {
            Toast.show({
                type: 'error',
                text1: 'ERROR',
                text2: response?.data?.errors[0]?.message,
            });
        } else {
            if (response?.data?.message) {
                Toast.show({
                    type: 'success',
                    text1: 'ERROR',
                    text2: response?.data?.message,
                });
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'ERROR',
                    text2: 'Process successfully done',
                });
            }
        }
        refreshHomeOrders()
        loadCurrentOrderDetails()
        setModalVisible(false); // Close modal after submission
        setReason(''); // Clear textarea
        setProcessingLoader(false)
    }

    const changeStatusToModalOpen = () => {
        setProcessingModalVisible(true)
    }

    //change status to processing time
    const processingStatusChange = async () => {

        if (processingTime.trim() === '') { return; }
        setProcessingLoader(true)
        const response: Response = await processingOrderProcess(orderMainDetails.id, processingTime)
        if (response?.data?.errors) {
            Toast.show({
                type: 'error',
                text1: 'ERROR',
                text2: response?.data?.errors[0]?.message,
            });
        } else {
            if (response?.data?.message) {
                Toast.show({
                    type: 'success',
                    text1: 'SUCCESS',
                    text2: response?.data?.message,
                });
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'SUCCESS',
                    text2: 'Process successfully done',
                });
            }
        }
        refreshHomeOrders()
        loadCurrentOrderDetails()
        setProcessingModalVisible(false); // Close modal after submission
        setProcessingTime(''); // Clear textarea
        setProcessingLoader(false)

    }
    const handOverProcessing = async () => {
        setProcessingLoader(true)

        const response: Response = await changeStatusToHandover(orderMainDetails.id)
        if (response?.data?.errors) {
            Toast.show({
                type: 'error',
                text1: 'ERROR',
                text2: response?.data?.errors[0]?.message,
            });
        } else {
            if (response?.data?.message) {
                Toast.show({
                    type: 'success',
                    text1: 'SUCCESS',
                    text2: response?.data?.message,
                });
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'SUCCESS',
                    text2: 'Process successfully done',
                });
            }
        }
        refreshHomeOrders()
        loadCurrentOrderDetails()
        setProcessingModalVisible(false); // Close modal after submission
        setProcessingTime(''); // Clear textarea
        setProcessingLoader(false)
    }
    //Handover processing
    const handoverProcessing = () => {
        Alert.alert(
            'Confirmation', // Title of the alert
            t('newDeveloper.HandOverOrderAlertMessage'), // Message
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel', // iOS styling for "cancel"
                },
                {
                    text: 'Confirm',
                    onPress: () => handOverProcessing(),
                },
            ],
            { cancelable: false } // Disallows dismissal by tapping outside
        );
    }

    const redirectToDeliverManChat = (id: number | string | null, name: string | null) => {
        if (id) {
            navigation.navigate('StoreChatMessages', { delivery_man_id: id, name })
        }
    }
    const redirectToCustomerChatPanel = (id: number | string | null, name: string | null) => {
        if (id) {

            navigation.navigate('StoreChatMessages', { user_id: id, name })
        }
    }

    const redirectToVendorChatPanel = (id: number | string | null, name: string | null) => {

        if (id) {
            navigation.navigate('StoreChatMessages', { vendor_id: id, name })
        }
    }

    //change status to pickup
    const changeStatusToPickup = async () => {
        setProcessingLoader(true)
        await changeStatusToPickupProcessing(orderMainDetails?.id)
        loadCurrentOrderDetails()
        setProcessingLoader(false)
    }

    const deleteUploadServiceProofImage = (selectedindex: number) => {
        const updatedImage = selectedCompletedImages.filter((ele, eleIndex) => selectedindex !== eleIndex)
        setSeletedCompletedImages([...updatedImage])
    }

    const handleModalServiceProofOtpModal = () => {
        setServiceProofOtp(!showServiceProofOtp)
    }




    const checkBookingOtp = async (value: string) => {
        setProcessingLoader(true)
        const formData = new FormData()
        formData.append('order_id', orderMainDetails?.id)
        formData.append('otp', value)
        formData.append('status', 'delivered')
        if (selectedCompletedImages) {
            selectedCompletedImages.forEach((imageFile) => {
                formData.append('order_proof[]', {
                    uri: imageFile,
                    name: 'order_proof.jpg',
                    type: 'image/jpeg',
                });
            })
        }

        const response: Response = await changeStatusToDeliveredProcessing(formData)
        if (response?.data?.errors) {
            Toast.show({
                type: 'error',
                text1: 'ERROR',
                text2: response?.data?.errors[0]?.message,
            });
            setProcessingLoader(false)
        } else {
            Toast.show({
                type: 'success',
                text1: 'SUCCESS',
                text2: response?.data?.message,
            });
            loadCurrentOrderDetails()
            setProcessingLoader(false)
            if(orderMainDetails?.payment_method === 'cash_on_delivery'){
                setShowOrderAmountModal(true)
            }
        }

    }
    //change payment status
    const changePaymentStatus = async ()=>{
           setProcessingLoader(true)
           await updateOrderPaymentPaid(orderMainDetails?.id)
           setProcessingLoader(false)
           setShowOrderAmountModal(false)
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? appColors.darkTheme : appColors.white, }]}>
            <Header showBackArrow={true} title={'newDeveloper.OrderDetails'} />
            {showSkeletonLoader && <SkeletonLoader />}
            {!showSkeletonLoader && <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    GlobalStyle.contentContainerStyle,
                ]}
                style={[
                    GlobalStyle.mainView,
                    {
                        backgroundColor: isDark ? appColors.darkTheme : appColors.white,
                        marginTop: 20
                    },
                ]}
            >
                <View style={[styles.headerContainer]}>
                    <Text style={[styles.orderId, { color: isDark ? appColors.white : appColors.darkText, }]}>{t('newDeveloper.OrderID')}: #{orderMainDetails?.id}</Text>
                    <Text style={[styles.dateTime, { color: isDark ? appColors.white : appColors.darkText, }]}> {ordertime?.day} {ordertime?.month} {ordertime?.year}  {ordertime?.hours}:{ordertime?.minutes} {ordertime?.ampm}</Text>
                </View>
                {/* Delivery Info */}
                <View style={[styles.deliveryContainer, { backgroundColor: isDark ? appColors.darkCardBg : appColors.white }]}>
                    <Text style={[styles.deliveryLabel, { color: appColors.primary }]}>{orderMainDetails?.order_type && t(`newDeveloper.${orderMainDetails.order_type}`)}</Text>
                    <Text style={[styles.cashOnDelivery, { color: appColors.primary }]}>{orderMainDetails?.payment_method && convertToTitleCase(orderMainDetails?.payment_method)}</Text>
                </View>
                {/* Item Details */}
                {orderProductItemList.length > 0 && orderProductItemList.map((item: any, index: number) => {
                    return <View key={`${item?.item_details?.id}-${index}-item`} style={[styles.itemContainer, { backgroundColor: isDark ? appColors.darkCardBg : appColors.white }]}>
                        <View style={[styles.itemHeader]}>
                            <Text style={[styles.itemLabel, { color: isDark ? appColors.white : appColors.darkText, }]}>{t('newDeveloper.Item')}: {index + 1}</Text>
                            <Text style={[styles.processing]}>{convertToTitleCase(orderMainDetails?.order_status)}</Text>
                        </View>

                        <View style={[styles.itemDetails, { backgroundColor: isDark ? appColors.darkCardBg : appColors.white }]}>
                            {item?.image_full_url ? <Image
                                source={{ uri: item?.image_full_url }} // Replace with actual image URL
                                style={[styles.itemImage]}
                            /> : <Image
                                source={{ uri: 'https://via.placeholder.com/60' }} // Replace with actual image URL
                                style={[styles.itemImage]}
                            />}
                            <View style={[styles.itemInfo]}>
                                <Text style={[styles.itemName, { color: isDark ? appColors.white : appColors.darkText, }]}>{item?.item_details?.name} X {item?.quantity}</Text>
                                <Text style={[styles.itemPrice, { color: isDark ? appColors.white : appColors.darkText, }]}>{currSymbol}{item?.item_details?.price}</Text>
                                {item.variation.length > 0 && <Text style={[styles.itemVariation, { color: isDark ? appColors.white : appColors.darkText, }]}>{t('newDeveloper.Variations')}: {item.variation.map((item: any) => item?.type).join(", ")}</Text>}
                            </View>
                        </View>
                    </View>

                })}

                {/* Store details */}

                <View style={[styles.customerContainer, { backgroundColor: isDark ? appColors.darkCardBg : appColors.white }]}>
                    <Text style={[styles.customerLabel, { color: appColors.primary }]}>{t('newDeveloper.StoreDetails')}</Text>

                    <View style={[styles.customerDetails]}>

                        <View>
                            <Text style={[styles.customerName, { color: isDark ? appColors.white : appColors.darkText, }]}>{orderMainDetails?.store_name}</Text>
                            <Text style={[styles.customerAddress, { color: isDark ? appColors.white : appColors.darkText, }]}>{orderMainDetails?.store_address}</Text>
                        </View>
                        <TouchableOpacity onPress={() => redirectToVendorChatPanel(orderMainDetails?.store_id, `${orderMainDetails?.store_name}`)} style={[styles.chatButton]}>
                            <Text style={[styles.chatText]}>{t('newDeveloper.Chat')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {

                            const phoneNumber = `tel:${orderMainDetails?.store_phone}`; // Replace with the phone number you want to call
                            Linking.canOpenURL(phoneNumber)
                                .then((supported) => {
                                    if (!supported) {
                                        Alert.alert("Error", "Phone calls are not supported on this device");
                                    } else {
                                        return Linking.openURL(phoneNumber);
                                    }
                                })
                                .catch((err) => console.error("An error occurred", err));

                        }} style={[styles.callButton]}>
                            <Text style={[styles.chatText]}>{t('newDeveloper.Call')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${orderMainDetails?.store_lat},${orderMainDetails?.store_lng}&travelmode=driving`;
                            Linking.openURL(url).catch(err => console.error('An error occurred', err));
                        }} style={[styles.directionButton]}>
                            <Text style={[styles.chatText]}>{t('newDeveloper.direction')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                {/* Customer Details */}
                {orderMainDetails?.delivery_address?.contact_person_name && <View style={[styles.customerContainer, { backgroundColor: isDark ? appColors.darkCardBg : appColors.white }]}>
                    <Text style={[styles.customerLabel, { color: appColors.primary }]}>{t('newDeveloper.CustomerDetails')}</Text>

                    <View style={[styles.customerDetails]}>

                        <View>
                            <Text style={[styles.customerName, { color: isDark ? appColors.white : appColors.darkText, }]}>{orderMainDetails?.delivery_address?.contact_person_name}</Text>
                            <Text style={[styles.customerAddress, { color: isDark ? appColors.white : appColors.darkText, }]}>{orderMainDetails?.delivery_address?.address}</Text>
                        </View>
                        <TouchableOpacity onPress={() => redirectToCustomerChatPanel(orderMainDetails?.customer?.id, `${orderMainDetails?.customer?.f_name} ${orderMainDetails?.customer?.l_name}`)} style={[styles.chatButton]}>
                            <Text style={[styles.chatText]}>{t('newDeveloper.Chat')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {

                            const phoneNumber = `tel:${orderMainDetails?.delivery_address?.contact_person_number}`; // Replace with the phone number you want to call
                            Linking.canOpenURL(phoneNumber)
                                .then((supported) => {
                                    if (!supported) {
                                        Alert.alert("Error", "Phone calls are not supported on this device");
                                    } else {
                                        return Linking.openURL(phoneNumber);
                                    }
                                })
                                .catch((err) => console.error("An error occurred", err));

                        }} style={[styles.callButton]}>
                            <Text style={[styles.chatText]}>{t('newDeveloper.Call')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${orderMainDetails?.delivery_address?.latitude},${orderMainDetails?.delivery_address?.longitude}&travelmode=driving`;
                            Linking.openURL(url).catch(err => console.error('An error occurred', err));
                        }} style={[styles.directionButton]}>
                            <Text style={[styles.chatText]}>{t('newDeveloper.direction')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>}

                {/* Pricing Details */}
                <View style={[styles.pricingContainer, { backgroundColor: isDark ? appColors.darkCardBg : appColors.white }]}>
                    <View style={[styles.priceRow]}><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>{t('newDeveloper.ItemPrice')}</Text><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>{currSymbol}{totalItemPrice}</Text></View>
                    <View style={[styles.priceRow]}><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>{t('newDeveloper.Discount')}</Text><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>(-) {currSymbol}{orderMainDetails?.store_discount_amount}</Text></View>
                    {orderMainDetails?.coupon_discount_amount > 0 && <View style={[styles.priceRow]}><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>{t('newDeveloper.Coupondiscount')}</Text><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>(-) {currSymbol}{orderMainDetails?.coupon_discount_amount}</Text></View>}
                    {orderMainDetails?.ref_bonus_amount > 0 && <View style={[styles.priceRow]}><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>{t('newDeveloper.Referraldiscount')}</Text><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>(-) {currSymbol}{orderMainDetails?.ref_bonus_amount}</Text></View>}
                    <View style={[styles.priceRow]}><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>{t('newDeveloper.VatTax')}</Text><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>(+) {currSymbol}{orderMainDetails?.total_tax_amount}</Text></View>
                    <View style={[styles.priceRow]}><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>{t('newDeveloper.DeliveryManTips')}</Text><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>(+) {currSymbol}{orderMainDetails?.dm_tips}</Text></View>
                    <View style={[styles.priceRow]}><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>{t('newDeveloper.PlatformCharge')}</Text><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>(+) {currSymbol}{orderMainDetails?.additional_charge}</Text></View>
                    <View style={[styles.priceRow]}><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>{t('newDeveloper.DeliveryFee')}</Text><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>(+) {currSymbol}{orderMainDetails?.delivery_charge}</Text></View>
                    <View style={[styles.priceRow]}><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>{t('newDeveloper.Extrapackaging')}</Text><Text style={{ color: isDark ? appColors.white : appColors.darkText, }}>(+)  {currSymbol}{orderMainDetails?.extra_packaging_amount}</Text></View>
                    <View style={[styles.totalRow]}><Text style={{ color: appColors.primary, fontSize: 16, fontWeight: 'bold' }}>{t('newDeveloper.TotalAmount')}</Text><Text style={{ color: appColors.primary, fontSize: 16, fontWeight: 'bold' }}>{currSymbol}{orderMainDetails?.order_amount}</Text></View>
                </View>
                {/* Actions */}



                <View style={[styles.actionContainer]}>


                    {orderMainDetails?.order_status && !['picked_up', 'delivered', 'handover', 'canceled'].includes(orderMainDetails?.order_status) && <View style={[styles.printButton]}>
                        <Text style={[styles.printText]}>{t('newDeveloper.Orderwaitingforprocess')}</Text>
                    </View>}

                    {orderMainDetails?.order_status && orderMainDetails?.order_status === 'handover' &&
                        <SwipeButton btnText={t('newDeveloper.swipeToPickup')} onSwipeComplete={changeStatusToPickup} />
                    }

                    {
                        orderMainDetails?.order_status && orderMainDetails?.order_status === 'picked_up' &&
                        <UploadCompletedImage
                            selectedCompletedImages={selectedCompletedImages}
                            setServiceProofUploadOption={setServiceProofUploadOption}
                            deleteUploadServiceProofImage={deleteUploadServiceProofImage}
                        />
                    }


                    {orderMainDetails?.order_status && orderMainDetails?.order_status === 'picked_up' &&
                        <TouchableOpacity style={[styles.printButton]} onPress={handleModalServiceProofOtpModal}><Text style={[styles.printText]}>Complete Order</Text></TouchableOpacity>
                    }
                </View>
                <Spinner
                    visible={processingLoader}
                    textContent={'Processing.....'}
                    textStyle={{ color: '#FFF' }}
                />


{orderMainDetails?.order_proof_full_url && orderMainDetails.order_proof_full_url.length > 0 && <><View style={[
        styles.icontainer,
        {
          backgroundColor: isDark ? appColors.darkTheme : appColors.white,
          borderColor: isDark ? appColors.darkBorder : appColors.border,
        },
        ]}>
        <Text style={{ color: isDark ? appColors.white : appColors.darkText, fontWeight: 'bold', marginBottom: 10 }}>{t('booking.proof')}</Text>
        {orderMainDetails.order_proof_full_url.map((evphoto:string,index:number) => {
          return (<TouchableOpacity key={`evphoto${index}`} onPress={() => {
            if(evphoto){
              setmodalImage(`${evphoto}`)
              setImageProofModal(true)
            }
          }}><View
            style={[
              styles.imageContainer,
              { borderColor: isDark ? appColors.darkBorder : appColors.border },
            ]}>
              <Image source={{ uri: `${evphoto}` }} style={styles.image} />
            </View></TouchableOpacity>)

        })}
      </View>

      </>
      }

            </ScrollView>}


            {orderMainDetails?.order_status && orderMainDetails?.order_status === 'picked_up' && <CommonModal
                modal={<ServiceProofImageOptions addServiceProofImages={(image: string) => {
                    setSeletedCompletedImages(prev => [...prev, image])
                }} setShowModal={setServiceProofUploadOption} />}
                showModal={showServiceProofUploadOptions}
                visibleModal={() => {
                    setServiceProofUploadOption(!showServiceProofUploadOptions);
                }}
            />
            }


            {orderMainDetails?.order_status && orderMainDetails?.order_status === 'picked_up' && <CommonModal
                modal={<CompleteOrderOtpPanel
                    handleSendOtpForConfirmation={async () => {
                        setProcessingLoader(true)
                        const response: Response = await serviceMenSendCustomerOtp(orderMainDetails?.id)
                        setProcessingLoader(false)

                    }}
                    setShowModal={setServiceProofOtp}
                    setBookingOtp={(value) => { checkBookingOtp(value) }}
                />}
                showModal={showServiceProofOtp}
                visibleModal={() => {
                    setServiceProofOtp(!showServiceProofOtp)
                }}
            />}

             <CommonModal modal={
                      <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => { setImageProofModal(false) }}>
                          <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                       {modalImage && <Image source={{ uri: modalImage }} style={styles.modalImage} />} 
                      </View>
            
                    }
                      showModal={showImageProofModal}
                      visibleModal={() => { }}
                    />

            <CancellationModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                reason={reason}
                setReason={setReason}
                CancelOrderProcess={CancelOrderProcess}
            />

            <ProcessingModal
                modalVisible={processingModalVisible}
                setModalVisible={setProcessingModalVisible}
                processingTime={processingTime}
                setProcessingTime={setProcessingTime}
                processingStatusChange={processingStatusChange}
            />
           {showOrderAmountModal && <OrderAmountModal changePaymentStatus={changePaymentStatus} orderMainDetails={orderMainDetails}/>} 

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateTime: {
        fontSize: 14,
        color: '#555',
    },
    deliveryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        padding: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    deliveryLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    cashOnDelivery: {
        fontSize: 14,
        color: '#28a745',
    },
    itemContainer: {
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    itemLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    processing: {
        fontSize: 14,
        color: '#ffc107',
    },
    itemDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 16,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 14,
        color: '#555',
    },
    itemVariation: {
        fontSize: 12,
        color: '#777',
    },
    customerContainer: {

        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    customerLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    customerDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,

        marginRight: 16,
    },
    customerName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    customerAddress: {
        fontSize: 12,
        color: '#777',
    },
    chatButton: {
        marginLeft: 'auto',
        backgroundColor: appColors.primary,
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 8,
        position: 'absolute',
        right: 0,
        bottom: 30
    },
    callButton: {
        marginLeft: 'auto',
        backgroundColor: appColors.success,
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 8,
        position: 'absolute',
        right: 60,
        bottom: 30
    },
    directionButton: {
        marginLeft: 'auto',
        backgroundColor: appColors.pending,
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 8,
        position: 'absolute',
        right: 120,
        bottom: 30
    },
    chatText: {
        color: '#fff',
        fontSize: 12,
    },
    pricingContainer: {
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 8,
        fontWeight: 'bold',
    },
    actionContainer: {
        alignItems: 'center',
    },

    printButton: {
        backgroundColor: appColors.primary,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 25,
        width: '100%',
        marginTop: 10,

    },
    printText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    btncontainer: {
        flexDirection: 'row', // Arrange buttons side by side
        justifyContent: 'space-between', // Add space between buttons
        padding: 10,
    },
    button: {
        flex: 1, // Each button takes equal width

        padding: 15,
        marginHorizontal: 5, // Space between buttons
        borderRadius: 5,
        alignItems: 'center', // Center text horizontally
    },
    buttonOne: {
        backgroundColor: appColors.error,
    },
    buttonTwo: {
        backgroundColor: appColors.success,
    },
    buttonLeft: {
        marginRight: 5, // Optional for better spacing
    },

    buttonRight: {
        marginLeft: 5, // Optional for better spacing
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
     image: {
        height: windowWidth(20),
        width: windowWidth(20),
        resizeMode: 'contain',
        borderRadius: windowWidth(2),
      },
     icontainer:{
         
        borderWidth: 1,
        borderRadius: windowHeight(1.8),
        paddingHorizontal: windowWidth(2),
        paddingVertical: windowHeight(1),
        marginHorizontal:windowWidth(5),
      },
      imageContainer: {
        height: windowWidth(17),
        width: windowWidth(17),
        borderColor: appColors.border,
        // borderWidth: 1,
        borderRadius: windowWidth(3),
        alignItems: 'center',
        justifyContent: 'center',
        margin:10
      },
      closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
      },
      closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
      },
      modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dim background
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalImage: {
        width: '90%', // Adjust as needed
        height: '70%', // Adjust as needed
        borderRadius: 10,
      },
});

export default StoreOrderDetails;