interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    identification_number: string;
    identification_type: string;
    identification_image: string[];
    date_of_birth: string | null;
    gender: string;
    profile_image: string;
    fcm_token: string;
    is_phone_verified: number;
    is_email_verified: number;
    phone_verified_at: string | null;
    email_verified_at: string | null;
    is_active: number;
    user_type: string;
    remember_token: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    wallet_balance: number;
    loyalty_point: number;
    ref_code: string;
    referred_by: string | null;
    login_hit_count: number;
    is_temp_blocked: number;
    temp_block_time: string | null;
    current_language_key: string;
  }
  
  interface Provider {
    id: string;
    zone_id: string;
  }
  
 export interface ServicemanProfileInterface {
    id: string;
    provider_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    bookings_count: number;
    completed_bookings_count: number;
    user: User;
    provider: Provider;
  }
  
   