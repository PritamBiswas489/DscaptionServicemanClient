import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loadAuthCheckService } from '@src/services/load.auth.checker.service';


const AuthTokenChecker = () => {
    const navigation = useNavigation();
  
    useEffect(() => {
      const intervalId = setInterval(() => loadAuthCheckService(navigation), 3000); // Check every 30 seconds
  
      return () => clearInterval(intervalId); // Clean up on unmount
    }, [navigation]);
  
    return null;
  };
  
  export default AuthTokenChecker;