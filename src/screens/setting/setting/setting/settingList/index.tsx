import {View, FlatList} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {settingData, serviceMenSettingData} from './data/data';
import RenderItem from './renderItem';
import {useValues} from '../../../../../../App';

export function SettingList() {
  const {isDeliveryManLogin} = useValues();
  return (
    <View style={[styles.container]}>
      <FlatList
       
        data={isDeliveryManLogin ? serviceMenSettingData : settingData}
        renderItem={({item,index}) => (
          <RenderItem key={index}  item={item} />
        )}
      />
    </View>
  );
}
