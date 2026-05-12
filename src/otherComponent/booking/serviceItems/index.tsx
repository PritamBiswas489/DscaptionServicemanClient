import { View, Text, Image } from 'react-native';
import React from 'react';
import { styles } from './styles';
import { useValues } from '../../../../App';
import { ServiceItemsProps } from './types';
import appColors from '@theme/appColors';
import { getMediaUrl } from '@src/config/utility';
import { capitalizeFirstLetter } from '@src/config/utility';

const statusColor: Record<'pending' | 'accepted' | 'ongoing' | 'completed' | 'canceled', string> = {
  pending: appColors.pending,
  accepted: appColors.accepted,
  ongoing: appColors.primary,
  completed: appColors.success,
  canceled: appColors.error,
};

function isValidBookingStatus(status: string): status is keyof typeof statusColor {
  return status in statusColor;
}

export function ServiceItems({
  item,
  imageStyle,
  priceStyle,
  textStyle,
}: ServiceItemsProps) {
  const { currSymbol, currValue, isDark, t } = useValues();

  let backgroundColor = appColors.primary;

  if (isValidBookingStatus(item.bookingStatus)) {
    backgroundColor = statusColor[item.bookingStatus];
  }
  const bookingStatusText = isValidBookingStatus(item.bookingStatus) ? t(item.bookingStatus) : 'Unknown';
    
  return (
    <View style={styles.rowContainer}>
      <View style={styles.row}>
        <View>
          <View style={styles.containerStyle}>
            {item.readableId && (
              <View style={styles.row}>
                <Text style={styles.bookId}><Text style={{color: isDark ? appColors.white : appColors.darkText,}}>{t('newDeveloper.BookingId')}:</Text> #{t(item.readableId)}</Text>
              </View>
            )}
            {item.totalBookingAmount!==0 ? (
              <View style={[styles.row, { alignItems: 'flex-end' }]}>
                <Text style={[styles.price, priceStyle]}>
                <Text style={{color: isDark ? appColors.white : appColors.darkText,}}>{t('newDeveloper.Amount')}:</Text> {currSymbol}
                  <Text>{(item.totalBookingAmount)}</Text>
                </Text>
              </View>
            ): ''}
          </View>
        </View>
      </View>
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <Text style={styles.status}>{capitalizeFirstLetter(bookingStatusText)}</Text>
      </View>
    </View>
  );
}
