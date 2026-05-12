import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useValues } from '../../../App';
import appColors from '@src/theme/appColors';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';

const OrdersSummary = () => {
    const {t,isDark,currSymbol} = useValues()
    const profileData = useSelector(
          (state: RootState) => state['storeProfileData']
    );
    
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={[styles.headerText,{color: isDark ? appColors.white : appColors.darkText,}]}>{t('newDeveloper.Orders')}</Text>

      {/* Stats Grid */}
      <View style={styles.gridContainer}>
        {/* Today's Orders */}
        <View style={[styles.card, { backgroundColor: '#3CBAB2' }]}>
          <Text style={styles.numberText}>{profileData.todays_order_count}</Text>
          <Text style={styles.labelText}>{t('newDeveloper.TodayOrder')}</Text>
        </View>
        {/* This Week's Orders */}
        <View style={[styles.card, { backgroundColor: '#F44336' }]}>
          <Text style={styles.numberText}>{profileData.this_week_order_count}</Text>
          <Text style={styles.labelText}>{t('newDeveloper.ThisWeekOrders')}</Text>
        </View>
      </View>
      <View style={styles.gridContainer}>
        {/* Total Orders */}
        <View style={[styles.card, { backgroundColor: '#4CAF50', flex: 1 }]}>
          <Text style={styles.numberText}>{profileData.order_count}</Text>
          <Text style={styles.labelText}>{t('newDeveloper.TotalOrders')}</Text>
        </View>
      </View>

      {/* Cash in Hand */}
      <View style={styles.cashCard}>
        <Text style={styles.cashAmount}>{currSymbol} {profileData.cash_in_hands}</Text>
        <Text style={styles.cashLabel}>{t('newDeveloper.CashInYourHand')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  card: {
    width: '48%',
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  numberText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  labelText: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 4,
  },
  cashCard: {
    backgroundColor: '#F1F1F1',
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  cashLabel: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});

export default OrdersSummary;
