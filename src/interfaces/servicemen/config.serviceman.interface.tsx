interface DefaultLocation {
    lat: string;
    lon: string;
  }
  
  interface SystemLanguage {
    id: number;
    direction: string;
    code: string;
    status: number;
    default: boolean;
  }
  
  interface AdvancedBooking {
    advanced_booking_restriction_value: number;
    advanced_booking_restriction_type: string;
  }
  
 export interface ServiceMenConfigInterface {
    currency_symbol_position: string;
    serviceman_can_cancel_booking: number;
    serviceman_can_edit_booking: number;
    business_name: string;
    logo: string;
    favicon: string;
    country_code: string;
    business_address: string;
    business_phone: string;
    business_email: string;
    base_url: string;
    currency_decimal_point: string;
    currency_code: string;
    currency_symbol: string;
    about_us: string;
    privacy_policy: string;
    terms_and_conditions: string;
    refund_policy: string;
    cancellation_policy: string;
    default_location: {
      default: DefaultLocation;
    };
    sms_verification: number;
    image_base_url: string;
    pagination_limit: number;
    time_format: string;
    footer_text: string;
    min_versions: any;
    phone_verification: number;
    email_verification: number;
    forget_password_verification_method: string;
    otp_resend_time: number;
    booking_otp_verification: number;
    service_complete_photo_evidence: number;
    booking_additional_charge: number;
    additional_charge_label_name: string;
    additional_charge_fee_amount: number;
    system_language: SystemLanguage[];
    instant_booking: number;
    schedule_booking: number;
    schedule_booking_time_restriction: number;
    advanced_booking: AdvancedBooking;
  }
  