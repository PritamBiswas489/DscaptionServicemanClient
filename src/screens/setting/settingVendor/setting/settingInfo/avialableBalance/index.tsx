import { View, Text } from 'react-native';
import React from 'react';
import { styles } from './styles';
import LinearGradient from 'react-native-linear-gradient';
import appColors from '@theme/appColors';
import { GlobalStyle } from '@style/styles';
import { useValues } from '../../../../../../../App';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';
import { calculateDaysDifference } from '@src/config/utility';
import { timeAgo } from '@src/config/utility';

//available balance function 
export function AvailableBalance() {
  const { isDeliveryManLogin, t } = useValues();
  const deliveryManProfileData = useSelector((state: RootState) => state['storeProfileData'])
  let totalOrder:number = 0, totalDaysJoined:string | null = '' 
  totalOrder = deliveryManProfileData.order_count
  totalDaysJoined = timeAgo(deliveryManProfileData.created_at)
   

  return (
    <View style={styles.containerStyle}>
      <LinearGradient
        colors={[appColors.gradientBtn, appColors.primary]}
        style={styles.linearGradient}
        start={{ x: 1, y: 0.2 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.itemContainer}>
          <View style={styles.row}>
             <Text style={styles.textStyle}>{totalDaysJoined.replace('ago','')}  </Text>
          </View>
          <Text style={styles.title}>{t('newDeveloper.SinceJoining')}</Text>
        </View>
        <View style={[GlobalStyle.verticalLine, styles.verticalLine]} />
        <View style={styles.itemContainer}>
          <View style={styles.row}>
            <Text style={styles.price}>{totalOrder}</Text>
          </View>
          <Text style={styles.title}>{t('newDeveloper.TotalOrder')}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}
