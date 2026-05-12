import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useValues } from '../../../App';
import appColors from '@src/theme/appColors';

const NonCancelableAlert = ({message,  checkLocationPermission}:{message:string, checkLocationPermission:()=>void}) => {
  const [visible, setVisible] = useState(true); // Control modal visibility
  const {t,isDark} = useValues()
  
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={() => { /* Do nothing to prevent dismissal */ }}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{t('newDeveloper.LocationPermissionError')}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={{marginTop:20}} onPress={()=> {  Linking.openSettings(); }}><Text style={{color:'red'}}>{t('newDeveloper.Openpermission')}</Text></TouchableOpacity>
          <TouchableOpacity style={{marginTop:20}}  onPress={checkLocationPermission}><Text style={{color:appColors.primary}}>{t('newDeveloper.Checkpermissionagain')}</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NonCancelableAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'black'
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color:'black'
  },
});
