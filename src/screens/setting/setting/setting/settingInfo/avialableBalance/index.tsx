import { View, Text, Alert } from 'react-native';
import React from 'react';
import { styles } from './styles';
import LinearGradient from 'react-native-linear-gradient';
import appColors from '@theme/appColors';
import { GlobalStyle } from '@style/styles';
import { useValues } from '../../../../../../../App';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';
import { calculateDaysDifference, formatNumberWithAbbreviation } from '@src/config/utility';
 

export function AvailableBalance() {
  const {  t } = useValues();
  const { created_at, completed_bookings_count, bookings_count } = useSelector((state: RootState) => state.serviceManAccountData)
   
  return ( 
    <View style={styles.containerStyle}>
      <LinearGradient
        colors={[appColors.gradientBtn, appColors.primary]}
        style={styles.linearGradient}
        start={{ x: 1, y: 0.2 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{t('newDeveloper.TotalAssignBooking')}</Text>
          <Text style={styles.textStyle}>{formatNumberWithAbbreviation(bookings_count)}</Text>
        </View>

        <View style={[GlobalStyle.verticalLine, styles.verticalLine]} />

        <View style={styles.itemContainer}>
          <Text style={styles.title}>{t('newDeveloper.BookingServed')}</Text>
          <View style={styles.row}>
            <Text style={styles.price}>{formatNumberWithAbbreviation(completed_bookings_count)}</Text>
          </View>
        </View>

        <View style={[GlobalStyle.verticalLine, styles.verticalLine]} />

        <View style={styles.itemContainer}>
          <Text style={styles.title}>{t('newDeveloper.DaysSinceJoined')}</Text>
          <View style={styles.row}>
            <Text style={styles.price}>{calculateDaysDifference(created_at)}</Text>
          </View>
        </View>

      </LinearGradient>
    </View>
  );
}
