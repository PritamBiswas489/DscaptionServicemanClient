export interface ThemeContextType {
  currSymbol: string;
  currValue: number;
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
  notificationSound: boolean;
  setNotificationSound: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrValue: React.Dispatch<React.SetStateAction<number>>;
  setCurrSymbol: React.Dispatch<React.SetStateAction<string>>;
  isDeliveryManLogin: boolean;
  setIsDeliveryManLogin: React.Dispatch<React.SetStateAction<boolean>>;
  isFreelancerLogin: boolean;
  setIsFreeLancerLogin: React.Dispatch<React.SetStateAction<boolean>>;
  loggedInUserType: string;
  setLoggedInUserType: React.Dispatch<React.SetStateAction<string>>;
  t:any
}
