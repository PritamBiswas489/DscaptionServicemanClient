import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ServiceMenConfigInterface } from "@src/interfaces/servicemen/config.serviceman.interface";


const initialConfig: ServiceMenConfigInterface = {
  currency_symbol_position: '',
  serviceman_can_cancel_booking: 0,
  serviceman_can_edit_booking: 0,
  business_name: '',
  logo: '',
  favicon: '',
  country_code: '',
  business_address: '',
  business_phone: '',
  business_email: '',
  base_url: '',
  currency_decimal_point: '',
  currency_code: '',
  currency_symbol: '',
  about_us: '',
  privacy_policy: '',
  terms_and_conditions: '',
  refund_policy: '',
  cancellation_policy: '',
  default_location: {
    default: {
      lat: '',
      lon: ''
    }
  },
  sms_verification: 0,
  image_base_url: '',
  pagination_limit: 0,
  time_format: '',
  footer_text: '',
  min_versions: null,
  phone_verification: 0,
  email_verification: 0,
  forget_password_verification_method: '',
  otp_resend_time: 0,
  booking_otp_verification: 0,
  service_complete_photo_evidence: 0,
  booking_additional_charge: 0,
  additional_charge_label_name: '',
  additional_charge_fee_amount: 0,
  system_language: [],
  instant_booking: 0,
  schedule_booking: 0,
  schedule_booking_time_restriction: 0,
  advanced_booking: {
    advanced_booking_restriction_value: 0,
    advanced_booking_restriction_type: ''
  }
};;

const initialState: ServiceMenConfigInterface = initialConfig

const serviceManConfigAppSlice = createSlice({
  name: "serviceManConfigApp",
  initialState: initialState,
  reducers: {
    setData(state: any, action: PayloadAction<ServiceMenConfigInterface>) {
      return action.payload
    },
    resetState(state: ServiceMenConfigInterface) {
      return initialState;
    },
  },
});

export const serviceManConfigAppActions = serviceManConfigAppSlice.actions;
export default serviceManConfigAppSlice; 