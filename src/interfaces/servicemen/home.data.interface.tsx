export interface TopCardInterface {
    total_bookings: number;
    ongoing_bookings: number;
    completed_bookings: number;
    canceled_bookings: number;
  }
  
  interface BookingDetail {
    id: number;
    booking_id: string;
    service_id: string;
    service_name: string;
    variant_key: string;
    service_cost: number;
    quantity: number;
    discount_amount: number;
    tax_amount: number;
    total_cost: number;
    created_at: string;
    updated_at: string;
    campaign_discount_amount: number;
    overall_coupon_discount_amount: number;
    service: {
      id: string;
      name: string;
      thumbnail: string;
      translations: Array<{
        id: number;
        translationable_type: string;
        translationable_id: string;
        locale: string;
        key: string;
        value: string;
      }>;
    };
  }
  
export interface BookingInterface {
    id: string;
    readable_id: number;
    customer_id: string;
    provider_id: string;
    zone_id: string;
    booking_status: string;
    is_paid: number;
    payment_method: string;
    transaction_id: string;
    total_booking_amount: number;
    total_tax_amount: number;
    total_discount_amount: number;
    service_schedule: string;
    service_address_id: string;
    created_at: string;
    updated_at: string;
    category_id: string;
    sub_category_id: string;
    serviceman_id: string;
    total_campaign_discount_amount: number;
    total_coupon_discount_amount: number;
    coupon_code: string | null;
    is_checked: number;
    additional_charge: number;
    additional_tax_amount: number;
    additional_discount_amount: number;
    additional_campaign_discount_amount: number;
    removed_coupon_amount: string;
    evidence_photos: string | null;
    booking_otp: string;
    is_guest: number;
    is_verified: number;
    extra_fee: number;
    total_referral_discount_amount: number;
    detail: BookingDetail[];
  }
  
 export interface BookingStatInterface {
    id: string;
    readable_id: number;
    customer_id: string;
    provider_id: string;
    zone_id: string;
    booking_status: string;
    is_paid: number;
    payment_method: string;
    transaction_id: string;
    total_booking_amount: number;
    total_tax_amount: number;
    total_discount_amount: number;
    service_schedule: string;
    service_address_id: string;
    created_at: string;
    updated_at: string;
    category_id: string;
    sub_category_id: string;
    serviceman_id: string;
    total_campaign_discount_amount: number;
    total_coupon_discount_amount: number;
    coupon_code: string | null;
    is_checked: number;
    additional_charge: number;
    additional_tax_amount: number;
    additional_discount_amount: number;
    additional_campaign_discount_amount: number;
    removed_coupon_amount: string;
    evidence_photos: string | null;
    booking_otp: string;
    is_guest: number;
    is_verified: number;
    extra_fee: number;
    total_referral_discount_amount: number;
  }
  
  export interface HomeDataInterface {
    top_cards: TopCardInterface;
    booking_stats: BookingStatInterface[];
    bookings: BookingInterface[];
  }
  