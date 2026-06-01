import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';

import Header from '@commonComponents/header';
import appColors from '@theme/appColors';
import { useValues } from '../../../../App';
import Spinner from 'react-native-loading-spinner-overlay';
import { earningTransactionList } from '@src/services/store/transaction.service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function MyEarning() {
  const { isDark, t, currSymbol } = useValues();

  const [refreshing, setRefreshing] = useState(false);
  const [processingLoader, setProcessingLoader] = useState(false);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});

  const [offset, setOffset] = useState(1);
  const [limit] = useState(10);
  const [totalSize, setTotalSize] = useState(0);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getTransactions(1, true);
  }, []);

  const getTransactions = async (
    currentOffset = 1,
    reset = false,
  ) => {
    try {
      setProcessingLoader(true);

      const response = await earningTransactionList(
        limit,
        currentOffset,
      );

      // console.log('response', response?.data);

      if (response?.data) {
        const data = response.data;

        setSummary(data?.summary || {});
        setTotalSize(data?.total_size || 0);

        if (reset) {
          setTransactions(data?.transactions || []);
        } else {
          setTransactions(prev => [
            ...prev,
            ...(data?.transactions || []),
          ]);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setProcessingLoader(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setOffset(1);
    getTransactions(1, true);
  }, []);

  const loadMore = () => {
    if (transactions.length < totalSize) {
      const nextOffset = offset + 1;
      setOffset(nextOffset);
      getTransactions(nextOffset);
    }
  };

  const openDetails = (item: any) => {
    console.log('Selected Item', item);
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => openDetails(item)}
        style={[
          styles.listCard,
          {
            backgroundColor: isDark
              ? appColors.darkCardBg
              : appColors.white,
          },
        ]}
      >
        <View>
          <Text style={styles.price}>
            {currSymbol} {item?.total_earning}
          </Text>

          <Text
            style={[
              styles.orderId,
              {
                color: isDark
                  ? appColors.white
                  : appColors.darkText,
              },
            ]}
          >
            Order #{item?.order_id}
          </Text>

          <Text style={styles.type}>Delivery Fee</Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.date}>{item?.date}</Text>

          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={appColors.primary}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? appColors.darkTheme
            : appColors.white,
        },
      ]}
    >
      <Header
        showBackArrow={false}
        title={'newDeveloper.MyEarning'}
      />

      {/* Summary Cards */}
      <View style={styles.cardContainer}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark
                ? appColors.darkCardBg
                : appColors.white,
            },
          ]}
        >
          <Text style={styles.amount}>
            {currSymbol} {summary?.total_earning || 0}
          </Text>

          <Text
            style={[
              styles.label,
              {
                color: isDark
                  ? appColors.white
                  : appColors.darkText,
              },
            ]}
          >
            {t('newDeveloper.Totalearning')}
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark
                ? appColors.darkCardBg
                : appColors.white,
            },
          ]}
        >
          <Text style={styles.amount}>
            {currSymbol} {summary?.delivery_earning || 0}
          </Text>

          <Text
            style={[
              styles.label,
              {
                color: isDark
                  ? appColors.white
                  : appColors.darkText,
              },
            ]}
          >
            {t('newDeveloper.DeliveryFreeEarning')}
          </Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No Transactions Found</Text>
        )}
      />

      {/* Details Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark
                  ? appColors.darkCardBg
                  : appColors.white,
              },
            ]}
          >
            <Text style={styles.modalTitle}>
              Earning Details
            </Text>

            <Text style={styles.modalAmount}>
              {currSymbol} {selectedItem?.total_earning}
            </Text>

            <Text style={styles.modalText}>
              Order ID: #{selectedItem?.order_id}
            </Text>

            <Text style={styles.modalText}>
              {selectedItem?.date}
            </Text>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>
                Delivery Fee
              </Text>

              <Text style={styles.rowValue}>
                {currSymbol}{' '}
                {selectedItem?.delivery_fee_earned}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>
                Delivery Tips
              </Text>

              <Text style={styles.rowValue}>
                {currSymbol} {selectedItem?.delivery_tips}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.totalText}>Total</Text>

              <Text style={styles.totalText}>
                {currSymbol} {selectedItem?.total_earning}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Spinner
        visible={processingLoader}
        textContent={'Processing.....'}
        textStyle={{ color: '#FFF' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 10,
  },

  card: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },

  amount: {
    fontSize: 18,
    color: appColors.primary,
    fontWeight: 'bold',
  },

  label: {
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },

  listCard: {
    marginHorizontal: 15,
    marginTop: 12,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    color: appColors.primary,
  },

  orderId: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: '500',
  },

  type: {
    fontSize: 13,
    color: '#777',
    marginTop: 3,
  },

  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 15,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
  },

  modalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: appColors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },

  modalText: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 5,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  rowLabel: {
    fontSize: 15,
    color: '#777',
  },

  rowValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#777',
  },

  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 18,
  },

  totalText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#777',
  },

  closeBtn: {
    marginTop: 25,
    backgroundColor: appColors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  closeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});