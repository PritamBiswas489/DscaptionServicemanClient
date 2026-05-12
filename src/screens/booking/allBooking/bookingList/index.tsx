import {View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, {useState, useEffect} from 'react';
import {styles} from './styles';
import ItemView from './itemView';
import LocationView from './locationView';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'src/navigation/types';
import {BookingListTypes} from '@screens/booking/data/types';
import {MoreArrow, UpArrow} from '@utils/icons';
import {DashLine} from '@commonComponents/dashLIne';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';
import { bookingSearchFieldActions } from '@src/store/redux/booking-search-field';
import {  getServicemanBookings } from '@src/services/booking.service';
import { searchStatusArray } from '@src/config/utility';
import { SearchBookingInterface } from '@src/interfaces/searchBookingInterface';
import SkeletonLoader from '@src/commonComponents/SkeletonLoader'; 

import {
  NoteContainer,
  CustomerItems,
  ServiceManItems,
  ServiceItems,
} from '@otherComponent/index';
import {useValues} from '../../../../../App';
import appColors from '@theme/appColors';
import { BookingListingInterface } from '@src/interfaces/bookingListingInterface';
import NoDataFound from '@src/commonComponents/noDataFound';
import { windowHeight } from '@theme/appConstant';
import GradientBtn from '@commonComponents/gradientBtn';
import { noValue, wifi, notification } from '@utils/images';
import HomeNoFataFound from '@src/commonComponents/homeNoDataFound';

type routeProps = NativeStackNavigationProp<RootStackParamList>;

interface Response {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}
 


export default function BookingList({
  data,
  containerStyle,
  setCancelBookingModal,
  setAcceptBookingModal,
}: BookingListTypes) {

  const dispatch = useDispatch()
  const [categoriesId, setCategoriesId] = useState<string[]>([]);
  const [subCategoriesId, setSubCategoriesId] = useState<string[]>([]);
  const [clickLoadMore, setClickLoadMore] = useState(false)

 
  const {
    selectedStatus: selectedBookingStatus,
    refreshData:refreshDataRedux
  } = useSelector(
    (state: RootState) => state['bookingSearchField']
  );

   const statusArray = searchStatusArray()
   const currentStatusArray = statusArray.filter(element=>element.value === selectedBookingStatus)
    
   let searchRedux = useSelector(
    (state: RootState) => state[currentStatusArray[0].selector as keyof RootState] as SearchBookingInterface
  );  
  //search redux process
  const {
    data:searchData,
    limit:limitData, 
    offset:offsetData, 
    isFirstTimeLoading:firstTimeLoading, 
    isNoMoreData:noMoreData} = searchRedux 
  
  // handle get bookings ??????
  const handleGetBookings = async () => {
     
        const response: Response = await getServicemanBookings(limitData,offsetData,selectedBookingStatus);
        const bookingData = response?.data?.content?.data;

        if(bookingData.length > 0){
              const formattedData:BookingListingInterface[] = bookingData.map((bkData:any,bkIndex:number)=>{
              return {
                id:bkData?.id,
                readableId: bkData?.readable_id,
                bookingStatus: bkData?.booking_status,
                totalBookingAmount: bkData?.total_booking_amount,
                serviceSchedule:bkData?.service_schedule,
                createdAt:bkData?.created_at,
                isChecked: bkData?.is_checked,
                isGuest: bkData?.is_guest,
                isPaid: bkData?.is_paid,
                isVerified: bkData?.is_verified,
                subCategoryName: bkData?.sub_category?.name,
                subCategoryImage:bkData?.sub_category?.image,
                customerName: bkData?.customer?.first_name,
                customerEmail: bkData?.customer?.email,
                customerGender: bkData?.customer?.gender,
                customerProfileImage: bkData?.customer?.profile_image,
                serviceAddress:bkData?.service_address?.address,
                hasServiceMen: bkData?.serviceman?.id  ?  true : false, 
                servicemenName: bkData?.serviceman?.id ? bkData?.serviceman?.user?.first_name+ ' '+bkData?.serviceman?.user?.last_name : '',
                servicemenProfileImage: bkData?.serviceman?.id ? bkData?.serviceman?.user?.profile_image : '',
                servicemenGender: bkData?.serviceman?.id ? bkData?.serviceman?.user?.gender: '',
              }
           })
           const dtt = [...searchData]
           dispatch(currentStatusArray[0].actions.setData({field:'data',data:[...dtt,...formattedData]}))
        }
        dispatch(currentStatusArray[0].actions.setData({
          field: 'isNoMoreData',
          data: !response?.data?.content?.next_page_url
        }));
        setClickLoadMore(false);
        dispatch(currentStatusArray[0].actions.setData({
          field: 'isFirstTimeLoading',
          data: false
        }));
        dispatch(bookingSearchFieldActions.setData({field:'refreshData',data:false}))
  };

   
  useEffect(()=>{
    if(refreshDataRedux){
      dispatch(currentStatusArray[0].actions.resetState())
    }
  },[refreshDataRedux])


  //handle scroll processing
  const handleScrollProcessing = ()=>{
    if(noMoreData) { return }
     setClickLoadMore(true)
     dispatch(currentStatusArray[0].actions.setData({field:'offset',data:offsetData+1}))
  }

  useEffect(() => {
    
    if (firstTimeLoading || clickLoadMore) {
       
        handleGetBookings();
    }
  }, [selectedBookingStatus, offsetData, , firstTimeLoading, clickLoadMore]);


  const {navigate} = useNavigation<routeProps>();
  const [showMoreServiceMans, setShowMoreServiceMans] =
    useState<boolean>(false);

  const icon = showMoreServiceMans ? <UpArrow /> : <MoreArrow />;

  const {isDark, t} = useValues();

  const toggleShowMoreServiceMans = () => {
    setShowMoreServiceMans(!showMoreServiceMans);
  };

  const refreshData = ()=>{
    dispatch(currentStatusArray[0].actions.resetState())
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {firstTimeLoading && <SkeletonLoader />}

      {!firstTimeLoading && searchData.length === 0 && <HomeNoFataFound message={t('newDeveloper.Nodatafound')} />}
      
      {!firstTimeLoading && searchData.length > 0 &&
      <FlatList
        onEndReached={handleScrollProcessing}
        data={searchData}
        keyExtractor={(item)=>`booking-${item.id}`}
        renderItem={({item}) => (
          <View>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>{
                navigate('CompletedBooking',{id:item.id})
              } 
            }
              style={[
                styles.cardContainer,
                {
                  backgroundColor: isDark
                    ? appColors.darkTheme
                    : appColors.white,
                  borderColor: isDark ? appColors.darkBorder : appColors.border,
                },
              ]}>
              <View style={styles.serviceContainer}>
                <ServiceItems
                  imageStyle={styles.imageStyle}
                  item={item}
                  
                  priceStyle={{
                    ...styles.priceStyle,
                    color: isDark ? appColors.primary : appColors.darkText,
                  }}
                  textStyle={styles.textStyle}
                />
                <ItemView item={item} />
                {item.serviceAddress && (
                  <>
                    <LocationView item={item} />
                    <View
                      style={[
                        styles.lineView,
                        {
                          borderColor: isDark
                            ? appColors.darkBorder
                            : appColors.border,
                        },
                      ]}
                    />
                  </>
                )}
                 <View style={styles.innerContainer}>
                 <CustomerItems item={item} />
                </View>
              
              </View>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator}></View>}
      />}
      {clickLoadMore && <ActivityIndicator/>}
    </View>
  );
}
