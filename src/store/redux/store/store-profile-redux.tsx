import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StoreProfileInterface } from "@src/interfaces/store/store.profile.interface";

const initialState: StoreProfileInterface = {
    id: 0,
    f_name: '',
    l_name: '',
    phone: '',
    email: '',
    identity_number: '',
    identity_type: '',
    identity_image: [],
    image: '',
    fcm_token: '',
    zone_id: 0,
    created_at: '',
    updated_at: '',
    status: false,
    active: 0,
    earning: 0,
    current_orders: 0,
    type: '',
    store_id: null,
    application_status: '',
    order_count: 0,
    assigned_order_count: 0,
    vehicle_id: 0,
    avg_rating: 0,
    rating_count: 0,
    todays_order_count: 0,
    this_week_order_count: 0,
    member_since_days: 0,
    todays_earning: 0,
    this_week_earning: 0,
    this_month_earning: 0,
    cash_in_hands: 0,
    balance: 0,
    total_withdrawn: 0,
    total_earning: 0,
    withdraw_able_balance: 0,
    Payable_Balance: 0,
    adjust_able: false,
    show_pay_now_button: false,
    over_flow_warning: false,
    over_flow_block_warning: false,
    image_full_url: '',
    identity_image_full_url: [],
    storage: [],
};

const storeProfileDataSlice = createSlice({
    name: "storeProfileData",
    initialState: initialState,
    reducers: {
      setData(state:any, action: PayloadAction<StoreProfileInterface>) {
        return action.payload
      },
      resetState(state: StoreProfileInterface) {
        return initialState;
      },
    },
  });
  
  export const storeProfileDataActions = storeProfileDataSlice.actions;
  export default storeProfileDataSlice;
