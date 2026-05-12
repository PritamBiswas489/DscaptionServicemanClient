import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {dashBoardData} from './data';
import {GlobalStyle} from '@style/styles';
import {useValues} from '../../../../../../App';
import {RootStackParamList} from 'src/navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import appColors from '@theme/appColors';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/store';
import {Services, AllBooking, MoneyReceive} from '@utils/icons';
import {Float} from 'react-native/Libraries/Types/CodegenTypes';
import { formatNumberWithAbbreviation } from '@src/config/utility';

export type dashBoardType = {
  icon: React.ReactNode;
  name: string;
  totalService?: number;
  price?: Float;
  
  darkIcon: React.ReactNode;
};

type navigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ServiceMenDashBoard() {
  const {currSymbol, currValue, isDark,t} = useValues();
  const {navigate} = useNavigation<navigationProp>();

   const {topCard} = useSelector((state: RootState)=>state.serviceManHomeData)

  const dashBoardData: Array<dashBoardType> = [
    {
      icon: <Services />,
      name: 'newDeveloper.TotalAssignedBooking',
      totalService: formatNumberWithAbbreviation(topCard.total_bookings),
      darkIcon: <Services color={appColors.white} />,
    },
    {
      icon: <Services />,
      name: 'newDeveloper.OngoingBooking',
      totalService: formatNumberWithAbbreviation(topCard.ongoing_bookings),
      darkIcon: <Services color={appColors.white} />,
    },
    
    
  ];

  const dashBoardData2: Array<dashBoardType> = [
    {
      icon: <Services />,
      name: 'newDeveloper.TotalCompletedBooking',
      totalService: formatNumberWithAbbreviation(topCard.completed_bookings),
      darkIcon: <Services color={appColors.white} />,
    },
    {
      icon: <Services />,
      name: 'newDeveloper.TotalCancelledBooking',
      totalService: formatNumberWithAbbreviation(topCard.canceled_bookings),
      darkIcon: <Services color={appColors.white} />,
    },
    
    
  ];


  return (
    <>
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? appColors.darkCard : appColors.boxBg,
          borderColor: isDark ? appColors.darkBorder : appColors.border,
        },
      ]}>
      {dashBoardData.map((item, index) => (
        <TouchableOpacity key={`dashboardpanel-${index}`}>
          <View
          
            style={[
              styles.iconContainer,
              {
                backgroundColor: isDark ? appColors.darkText : appColors.white,
                borderColor: isDark ? appColors.darkBorder : appColors.border,
              },
            ]}>
            {isDark ? item.darkIcon : item.icon}
          </View>
          <View style={styles.rowView}>
            <View>
              <Text
                style={[
                  styles.textStyle,
                  {color: isDark ? appColors.white : appColors.lightText},
                ]}>
                {t(item.name)}
              </Text>
               
                <Text style={styles.totalService}>{item?.totalService}</Text>
               
            </View>
            {index === dashBoardData.length - 1 ? (
              <View style={styles.vertical} />
            ) : (
              <View
                style={[
                  GlobalStyle.verticalLine,
                  styles.verticalLine,
                  {
                    borderColor: isDark
                      ? appColors.darkSubText
                      : appColors.border,
                  },
                ]}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
      
    </View>
    <View
    style={[
      styles.container,
      {
        backgroundColor: isDark ? appColors.darkCard : appColors.boxBg,
        borderColor: isDark ? appColors.darkBorder : appColors.border,
      },
    ]}>
    {dashBoardData2.map((item, index) => (
     <TouchableOpacity key={`dashboardpanelsecond-${index}`}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isDark ? appColors.darkText : appColors.white,
              borderColor: isDark ? appColors.darkBorder : appColors.border,
            },
          ]}>
          {isDark ? item.darkIcon : item.icon}
        </View>
        <View style={styles.rowView}>
          <View>
            <Text
              style={[
                styles.textStyle,
                {color: isDark ? appColors.white : appColors.lightText},
              ]}>
              {t(item.name)}
            </Text>
            <Text style={styles.totalService}>{item?.totalService}</Text>
          </View>
          {index === dashBoardData.length - 1 ? (
            <View style={styles.vertical} />
          ) : (
            <View
              style={[
                GlobalStyle.verticalLine,
                styles.verticalLine,
                {
                  borderColor: isDark
                    ? appColors.darkSubText
                    : appColors.border,
                },
              ]}
            />
          )}
        </View>
      </TouchableOpacity>
    ))}
    
  </View>
  </>
  );
}
