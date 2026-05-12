import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ServicemanProfileInterface } from "@src/interfaces/servicemen/profile.info.interface";
//Serviceman profile interface
const initialState: ServicemanProfileInterface = {
  id: '',
  provider_id: '',
  user_id: '',
  created_at: '',
  updated_at: '',
  deleted_at: null,
  bookings_count: 0,
  completed_bookings_count: 0,
  user: {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    identification_number: '',
    identification_type: '',
    identification_image: [],
    date_of_birth: null,
    gender: '',
    profile_image: '',
    fcm_token: '',
    is_phone_verified: 0,
    is_email_verified: 0,
    phone_verified_at: null,
    email_verified_at: null,
    is_active: 0,
    user_type: '',
    remember_token: null,
    deleted_at: null,
    created_at: '',
    updated_at: '',
    wallet_balance: 0,
    loyalty_point: 0,
    ref_code: '',
    referred_by: null,
    login_hit_count: 0,
    is_temp_blocked: 0,
    temp_block_time: null,
    current_language_key: ''
  },
  provider: {
    id: '',
    zone_id: ''
  }
};

//service man account data
const serviceManAccountDataSlice = createSlice({
  name: "serviceManAccountData",
  initialState: initialState,
  reducers: {
    setData(state: any, action: PayloadAction<ServicemanProfileInterface>) {
      return action.payload
    },
    resetState(state: ServicemanProfileInterface) {
      return initialState;
    },
  },
});

export const serviceManAccountDataActions = serviceManAccountDataSlice.actions;
export default serviceManAccountDataSlice;
