import api from "@src/config/frontApi.config.store";
import API_PROCESS from "@src/config/frontApiMultipart.config.store";

interface Response {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}

export const getForgetpasswordOtp = async (formData: {phone:string}): Promise<Response> => {
    try {
        const response = await api.post(`/auth/delivery-man/forgot-password`,formData);
        return response;
    } catch (error: any) {
        return error.response;
    }
}

export const verifyToken = async (formData: {phone:string,reset_token:string}): Promise<Response> => {
    try {
        const response = await api.post(`/auth/delivery-man/verify-token`,formData);
        return response;
    } catch (error: any) {
        return error.response;
    }

}

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
		const response = await API_PROCESS.post(`/auth/delivery-man/reset-password`,formData);
		return response;
	} catch (error:any) {
		return error.response;
	}
}