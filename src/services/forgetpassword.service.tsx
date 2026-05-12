import api from "@src/config/frontApi.config";
import API_PROCESS from "@src/config/frontApiMultipart.config";

interface Response {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}

export const  serviceMenSendingOtp = async (phoneNumber:string): Promise<Response>=>{
    try {
        const response = await api.post(`/serviceman/forgot-password`,{"phone_or_email":phoneNumber});
        return response;
    } catch (error: any) {
        return error.response;
    }
}
export const serviceForgetPasswordOtpVerification = async(phone:string,otp:string): Promise<Response>=>{
    try {
        const response = await api.post(`/serviceman/otp-verification`,{phone_or_email:phone,otp});
        return response;
    } catch (error: any) {
        return error.response;
    }
}


//phone_or_email
export const getForgetpasswordOtp = async (formData: {identity:string,identity_type:string}): Promise<Response> => {
    try {
        const response = await api.post(`/user/forget-password/send-otp`,formData);
        return response;
    } catch (error: any) {
        return error.response;
    }
}
//phone_or_email otp

export const resetPassword = async(formData:{identity:string,identity_type:string,otp:string,
    password:string,
    confirm_password:string,
    _method:string
  }): Promise<Response> => {
	try {
		const response = await api.post(`/user/forget-password/reset`,formData);
		return response;
	} catch (error:any) {
		return error.response;
	}
}


export const resetPasswordNew = async(formData:FormData): Promise<Response> => {
	 
    try {
		const response = await API_PROCESS.post(`/serviceman/reset-password`,formData);
		return response;
	} catch (error:any) {
		return error.response;
	}
}