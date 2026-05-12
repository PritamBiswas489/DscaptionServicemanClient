import { View, FlatList, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { styles } from './styles';
import RenderItem from './renderItem';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';
import { useValues } from '../../../../App';
import { bookingSearchFieldActions } from '@src/store/redux/booking-search-field';
import { searchStatusArray } from '@src/config/utility';
import { CountObjInterface } from '@src/interfaces/countObjInterface';
import appColors from '@src/theme/appColors';
interface Response {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

export default function StatusFilter({ bookingListType } : {bookingListType:string}) {
   
  const flatListRef = useRef<FlatList>(null);
  const dispatch = useDispatch()
  const { t, isDark } = useValues()
  
  const {
    selectedStatus: selectedSubCategory,
    accepted,
    canceled,
    completed,
    ongoing,
    pending,
    all
  } = useSelector(
    (state: RootState) => state['bookingSearchField']
  );
  let statusList = searchStatusArray()
  if(bookingListType === 'BOOKING'){
    statusList = statusList.filter(status => ['accepted', 'ongoing'].includes(status.value));
  }else{
    statusList = statusList.filter(status => ['all','completed','canceled'].includes(status.value));
  }
  const setSubCategory = (value:string) =>{
      dispatch(bookingSearchFieldActions.setData({field:'selectedStatus',data:value}))
     dispatch(bookingSearchFieldActions.setData({field:'refreshData',data:true}))
  }
   
  return (
    <View>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={[
          styles.mainContainer,
          {backgroundColor:isDark ? appColors.darkCardBg : appColors.white  }
        ]}
        data={statusList}
        keyExtractor={item=>item.value}
        renderItem={({ index, item }) => {
          return (
            <RenderItem
              selectedCategory={selectedSubCategory}
              setCategory={setSubCategory}
              item={item}
              index={index}
              flatListRef={flatListRef}
            />
          );
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
