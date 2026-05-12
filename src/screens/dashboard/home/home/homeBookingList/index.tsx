import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, ListRenderItem, TouchableOpacity, Alert } from 'react-native';
import { useValues } from '../../../../../../App';
import appColors from '@src/theme/appColors';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';
import { BookingInterface } from '@src/interfaces/servicemen/home.data.interface';
import { convertToTitleCase, datetimeArr, getMediaUrl } from '@src/config/utility';
import { windowHeight } from '@src/theme/appConstant';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'src/navigation/types';
import { useNavigation } from '@react-navigation/native';

type routeProps = NativeStackNavigationProp<RootStackParamList>;

const BookingItem: React.FC<{ item: BookingInterface, isDark: boolean }> = ({ item, isDark }) => {
  const {navigate} = useNavigation<routeProps>();
  const date_array = datetimeArr(item.created_at)
  return <TouchableOpacity onPress={()=>navigate('CompletedBooking',{id:item.id})}><View style={[styles.bookingItem, { backgroundColor: isDark ? appColors.darkTheme : appColors.boxBg }]}>
    {item?.detail?.[0]?.service?.thumbnail && <Image source={{ uri: `${getMediaUrl()}/service/${item?.detail?.[0]?.service?.thumbnail}` }} style={styles.image} />}
    <View style={styles.details}>
      <Text style={[styles.bookingText, { color: isDark ? appColors.white : appColors.darkText, }]}>Booking# {item.readable_id}</Text>
      <Text style={[styles.dateText, { color: isDark ? appColors.darkSubText : appColors.darkText, }]}>{date_array.day} {date_array.month}, {date_array.year} {date_array.hours}:{date_array.minutes} {date_array.ampm}</Text>
    </View>
    <View style={styles.statusContainer}>
      <Text style={styles.statusText}>{convertToTitleCase(item.booking_status)}</Text>
    </View>
  </View></TouchableOpacity>
};
// Recent booking activities
const RecentBookingActivities: React.FC = () => {
  const { isDark, isDeliveryManLogin, t, loggedInUserType } = useValues();
  const renderItem: ListRenderItem<BookingInterface> = ({ item }) => <BookingItem key={item.id} item={item} isDark={isDark} />;
  const { RecentBookings } = useSelector((state: RootState) => state.serviceManHomeData)
  return (
    <View style={[styles.container, { backgroundColor: isDark ? appColors.darkCardBg : appColors.white , marginBottom:windowHeight(5)}]}>
      <Text style={[styles.headerText, { color: isDark ? appColors.white : appColors.darkText, }]}>{t('newDeveloper.RecentBookingActivities')}</Text>
      <FlatList
        data={RecentBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  bookingText: {
    color: '#fff',
    fontSize: 16,
  },
  dateText: {
    color: '#ccc',
    fontSize: 14,
  },
  statusContainer: {
    backgroundColor: appColors.primary,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusText: {
    fontSize: 14,
  },
});

export default RecentBookingActivities;
