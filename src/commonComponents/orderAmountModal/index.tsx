import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // or `react-native-vector-icons/MaterialIcons`
import appColors from '@src/theme/appColors';
import { useValues } from '../../../App';

const OrderAmountModal = ({orderMainDetails,changePaymentStatus}:{orderMainDetails:any,changePaymentStatus:()=>void}) => {
    const {t,isDark, currSymbol} =  useValues()
    
    return (
        <Modal transparent={true} visible={true} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Icon or Image */}
                    <Icon name="paper-plane" size={50} color={appColors.primary} style={styles.icon} />

                    {/* Message */}
                    <Text style={styles.title}>{t('newDeveloper.CollectMoneyFromCustomer')}</Text>
                    <Text style={styles.amount}>
                    {t('newDeveloper.OrderAmount')}: <Text style={styles.amountValue}>{currSymbol}{orderMainDetails?.order_amount}</Text>
                    </Text>

                    {/* Button */}
                    <TouchableOpacity style={styles.okButton} onPress={changePaymentStatus}>
                        <Text style={styles.okButtonText}>{t('newDeveloper.ok')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
        marginBottom: 10,
    },
    amount: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    amountValue: {
        color: appColors.primary,
        fontWeight: 'bold',
    },
    okButton: {
        backgroundColor: appColors.primary,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 5,
    },
    okButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OrderAmountModal;
