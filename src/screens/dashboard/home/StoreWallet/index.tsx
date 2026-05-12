import { Alert, RefreshControl, ScrollView, View, StyleSheet } from 'react-native';
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
import WithdrawBalance from './withdrawBalance';
import BalanceInfo from './balanceInfo';
import EarningsCard from './earningsCard';
import TransactionHistory from './transactionHistory';
import { getAuthUserService as storeAuthService } from '@src/services/store/auth.service';
import { storeProfileDataActions } from '@src/store/redux/store/store-profile-redux';
import { getWithdraws, getWalletPaymentList, deliveryBoywalletAdjustment, walletProvidedEarningList } from '@src/services/store/transaction.service';
import { WithdrawInterface } from '@src/interfaces/store/withdraw.interface';
import { PaymentInterface } from '@src/interfaces/store/payment.interface';
import { paymentSectionData } from '@src/config/utility';

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
export default function StoreWallet() {
  const navigation = useNavigation<ItemsProps>();
  const route = useRoute<EditCouponRouteProp>();
  const { isDark, t } = useValues();
  const dispatch = useDispatch()
  const [processingLoader, setProcessingLoader] = useState(false)
  const [refreshing, setRefreshing] = React.useState(false);
  const [withdrawList, setWithdrawList] = useState<any[]>([])
  const [paymentList, setPaymentList] = useState<any[]>([])

  const storeProfileData = useSelector((state: RootState) => state['storeProfileData'])

  //  useEffect(()=>{
  //     console.log(JSON.stringify(storeProfileData))
  //  },[storeProfileData])

  const profileReset = async () => {
    const responseuser = await storeAuthService()
    if (responseuser?.data?.id) {
      dispatch(storeProfileDataActions.setData(responseuser?.data))
    }
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([profileReset(), loadWithdraws(), loadTransactionPaymentList()])
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  //load withdraws list
  const loadWithdraws = async () => {
    const response: Response = await walletProvidedEarningList()
    console.log("========== Wallet provided earning list =================")
    console.log(response?.data)
    if (response?.data?.transactions && response?.data?.transactions.length > 0) {
      setWithdrawList(response?.data?.transactions)
    }
  }
  //load transaction payment list
  const loadTransactionPaymentList = async () => {
    const response: Response = await getWalletPaymentList()
    if (response?.data?.transactions && response?.data?.transactions.length > 0) {
      setPaymentList(response?.data?.transactions)
    }
  }
  const f = async () => {
    setProcessingLoader(true)
    await Promise.all([profileReset(), loadWithdraws(), loadTransactionPaymentList()])
    setProcessingLoader(false)

  }

  useEffect(() => {
    f()
  }, [])

  const adjustPayments = async () => {
    setProcessingLoader(true)
    const repsonse = await deliveryBoywalletAdjustment()
    //============= adjustment response ========================//
    console.log(repsonse?.data)
    await Promise.all([profileReset(), loadWithdraws(), loadTransactionPaymentList()])
    setProcessingLoader(false)
  }

  useEffect(() => {
    console.log({ withdrawList })
  }, [withdrawList])

  return (
    <>
      <View style={[styles.container, { backgroundColor: isDark ? appColors.darkCardBg : appColors.white }]}>
        <Header showBackArrow={false} title={'newDeveloper.StoreWallet'} />
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
          <View><WithdrawBalance adjustPayments={adjustPayments} /></View>
          <View><BalanceInfo /></View>
          <View><TransactionHistory withdrawList={withdrawList} paymentList={paymentList} /></View>
          <Spinner
            visible={processingLoader}
            textContent={'Processing.....'}
            textStyle={{ color: '#FFF' }}
          />
        </ScrollView>
      </View>



    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});
