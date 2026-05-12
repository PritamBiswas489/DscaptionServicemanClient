import appColors from '@src/theme/appColors';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure you have react-native-vector-icons installed
import { useValues } from '../../../../../App';
import { getIndianPriceFormat } from '@src/config/utility';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';

interface Response {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}
const WithdrawBalance: React.FC<{adjustPayments:()=>void}> = ({adjustPayments}) => {
  const { isDark, t, currSymbol } = useValues();
  const {Payable_Balance,adjust_able, show_pay_now_button} = useSelector((state: RootState)=>state['storeProfileData'])
  
  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Icon name="account-balance-wallet" size={40} color="#fff" />
        <View style={styles.textContainer}>
          <Text style={styles.label}>{t('newDeveloper.PayableBalance')}</Text>
          <Text style={styles.amount}>{currSymbol} {getIndianPriceFormat(Payable_Balance)}</Text>
        </View>
      </View>
      <View style={{flexDirection:'column'}}>
      {adjust_able &&  <TouchableOpacity onPress={adjustPayments} style={[styles.adjustnowButton]}>
        <Text style={styles.adjustnowButtonText}>{t('newDeveloper.AdjustPayments')}</Text>
      </TouchableOpacity>}
      <TouchableOpacity style={styles.withdrawButton} onPress={()=>Alert.alert(t('newDeveloper.paymentErrorMessage'))}>
        <Text style={styles.withdrawButtonText}>{t('newDeveloper.PayNow')}</Text>
      </TouchableOpacity> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: appColors.primary,
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 16,
  },
  label: {
    color: '#fff',
    fontSize: 14,
  },
  amount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  withdrawButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  withdrawButtonText: {
    color:appColors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign:'center'
  },

  adjustnowButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom:5
  },
  adjustnowButtonText: {
    color:appColors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign:'center'
  },
});

export default WithdrawBalance;
