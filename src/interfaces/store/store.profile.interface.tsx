interface IdentityImage {
    img: string;
    storage: string;
  }
  
  interface Storage {
    id: number;
    data_type: string;
    data_id: string;
    key: string;
    value: string;
    created_at: string;
    updated_at: string;
  }
  
 export interface StoreProfileInterface {
    id: number;
    f_name: string;
    l_name: string;
    phone: string;
    email: string;
    identity_number: string;
    identity_type: string;
    identity_image: IdentityImage[];
    image: string;
    fcm_token: string;
    zone_id: number;
    created_at: string;
    updated_at: string;
    status: boolean;
    active: number;
    earning: number;
    current_orders: number;
    type: string;
    store_id: number | null;
    application_status: string;
    order_count: number;
    assigned_order_count: number;
    vehicle_id: number;
    avg_rating: number;
    rating_count: number;
    todays_order_count: number;
    this_week_order_count: number;
    member_since_days: number;
    todays_earning: number;
    this_week_earning: number;
    this_month_earning: number;
    cash_in_hands: number;
    balance: number;
    total_withdrawn: number;
    total_earning: number;
    withdraw_able_balance: number;
    Payable_Balance: number;
    adjust_able: boolean;
    show_pay_now_button: boolean;
    over_flow_warning: boolean;
    over_flow_block_warning: boolean;
    image_full_url: string;
    identity_image_full_url: string[];
    storage: Storage[];
  }
  