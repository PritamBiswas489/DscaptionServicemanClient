interface Coordinates {
    latitude: string;
    longitude: string;
  }
  
  interface Provider {
    id: string;
    user_id: string;
    company_name: string;
    company_phone: string;
    company_address: string;
    company_email: string;
    logo: string;
    contact_person_name: string;
    contact_person_phone: string;
    contact_person_email: string;
    order_count: number;
    service_man_count: number;
    service_capacity_per_day: number;
    rating_count: number;
    avg_rating: number;
    commission_status: number;
    commission_percentage: number;
    is_active: number;
    created_at: string;
    updated_at: string;
    is_approved: number;
    zone_id: string;
    coordinates: Coordinates;
    is_suspended: number;
    deleted_at: string | null;
    service_availability: number;
  }
  
  interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    profile_image: string;
    fcm_token: string;
    user_type: string;
    created_at: string;
    updated_at: string;
    current_language_key: string;
    provider?: Provider | null;
  }
  
  interface ChannelUser {
    id: string;
    channel_id: string;
    user_id: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    is_read: number;
    user: User;
  }
  
  export interface ProviderChannelsInterface {
    id: string;
    reference_id: string | null;
    reference_type: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    channel_users_count: number;
    last_message_sent_user: string;
    last_sent_message: string;
    last_sent_attachment_type: string | null;
    last_sent_files_count: number;
    channel_users: ChannelUser[];
  }