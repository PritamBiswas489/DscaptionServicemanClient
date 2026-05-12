import api from "@src/config/authApi.config";

interface Response {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}

export const getServicemanBookings = async (limit:number,offset:number,booking_status:string): Promise<Response> => {
    try {
        const response = await api.get(`/serviceman/booking/list?limit=${limit}&offset=${offset}&booking_status=${booking_status}`);
        return response;
    } catch (error: any) {
        return error.response;
    }
}
export const getServicemanBookingDetails = async (bookingId:string):Promise<Response>=>{
    try {
        const response = await api.get(`/serviceman/booking/detail/${bookingId}`);
        return response;
    } catch (error: any) {
        return error.response;
    }
}

//update booking status
export const updateBookingStatus = async (bookingId:string,data:FormData):Promise<Response>=>{
    data.append('_method','PUT')
    try {
		const response = await api.post(`/serviceman/booking/status-update/${bookingId}`,data);
		return response;
	} catch (error:any) {
		return error.response;
	}
}

export const updatePaymentStatus = async (bookingId:string,data:FormData):Promise<Response>=>{
    data.append('_method','PUT')
    try {
		const response = await api.post(`/serviceman/booking/payment-status-update/${bookingId}`,data);
		return response;
	} catch (error:any) {
		return error.response;
	}

}

export const sendOtpNotification = async (bookingId:string): Promise<Response> => {
     
    try {
		const response = await api.get(`/serviceman/booking/opt/notification-send`,{params:{
            booking_id : bookingId
        }});
		return response;
	} catch (error:any) {
		return error.response;
	}

}

export const updateBooking = async (formData: FormData): Promise<Response> => {
    formData.append('_method','PUT')
    try {
		const response = await api.post(`/serviceman/booking/service/edit/update-booking`,formData);
		return response;
	} catch (error:any) {
		return error.response;
	}
}

// =============================================================================================================================//

export const getBookings = async (formData: FormData): Promise<Response> => {
    try {
        const response = await api.post(`/provider/booking`,formData);
        return response;
    } catch (error: any) {
        return error.response;
    }
}
//get booking details
export const getBookingDetails = async (bookingId:string):Promise<Response>=>{
    try {
        const response = await api.get(`/provider/booking/${bookingId}`);
        return response;
    } catch (error: any) {
        return error.response;
    }
}



export const assignServiceMan = async (bookingId:string, formData:FormData): Promise<Response> => {
    formData.append('_method','PUT')
    try {
		const response = await api.post(`/provider/booking/assign-serviceman/${bookingId}`,formData);
		return response;
	} catch (error:any) {
		return error.response;
	}
}

export const updateScheduleDate = async (bookingId:string, formData:FormData): Promise<Response> => {
    formData.append('_method','PUT')
    try {
		const response = await api.post(`/provider/booking/schedule-update/${bookingId}`,formData);
		return response;
	} catch (error:any) {
		return error.response;
	}
}



 