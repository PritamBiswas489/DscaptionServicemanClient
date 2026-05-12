import {View, Text, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {styles} from './styles';
import GridButton from '@commonComponents/gridButton';
import {RootStackParamList} from 'src/navigation/types';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import appColors from '@theme/appColors';
import {useValues} from '../../../../../App';

type routeProps = NativeStackNavigationProp<RootStackParamList>;

export default function ContentData({
  setOptionModal,
}: {
  setOptionModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {navigate} = useNavigation<routeProps>();
  const {isDark,t} = useValues();
   
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('introSlider.loginApp')}</Text>
      <GridButton
        label1="newDeveloper.servicemanlogin"
        
        onButtonClick={() => {
          navigate('Login',{deliveryMenLogin:true});
        }}
        label="newDeveloper.deliveryManLogin"
        onButton1Click={() => {
          navigate('Login');
          // navigate('Login');
        }}
        buttonStyle={styles.buttonStyle}
        buttonTextStyle={styles.buttonText}
        btn1Color={isDark ? appColors.darkTheme : appColors.white}
        buttonContainerStyle={styles.buttonContainer}
        button1TextStyle={styles.button1TextStyle}
      />
    </View>
  );
}
