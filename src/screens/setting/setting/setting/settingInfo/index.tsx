import { View, Image, Text } from 'react-native';
import React from 'react';
import { customer1 } from '@utils/images';
import { styles } from './styles';
import { Email } from '@utils/icons';
import appColors from '@theme/appColors';
import { GlobalStyle } from '@style/styles';
import { AvailableBalance } from './avialableBalance';
import { useValues } from '../../../../../../App';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';
import { getMediaUrl } from '@src/config/utility';

export function SettingInfo() {
  const { isDark, t } = useValues();
  const { user } = useSelector((state: RootState) => state.serviceManAccountData)
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {user.profile_image && <View
          style={[
            styles.imageView,
            { backgroundColor: isDark ? appColors.darkCardBg : appColors.white },
          ]}>
          <Image source={{ uri: `${getMediaUrl()}/serviceman/profile/${user.profile_image}` }} style={styles.imageStyle} />
        </View>}
        <View style={styles.textView}>
          <Text
            style={[
              styles.name,
              { color: isDark ? appColors.white : appColors.darkText },
            ]}>
            {`${user.first_name} ${user.last_name}`}
          </Text>
        </View>
      </View>
      <View
        style={[
          GlobalStyle.horizontalLine,
          {
            marginTop: 0,
            borderColor: isDark ? appColors.darkBorder : appColors.border,
          },
        ]}></View>
      <AvailableBalance />
    </View>
  );
}
