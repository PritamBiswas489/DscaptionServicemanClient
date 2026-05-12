import api from "@src/config/authApi.config.store";

interface Response {
	data: any;
	status: number;
	statusText: string;
	headers: any;
	config: any;
	request?: any;
}

export const updateProfileData = async (data:FormData): Promise<Response> => {
    try {
		const response = await api.post('/delivery-man/update-profile',data);
		return response;
	} catch (error:any) {
		return error.response;
	}
}

//update store status 
export const updateStoreStatusProcess = async (): Promise<Response> =>{
	const formData = new FormData()
	formData.append('updateStatus',1)
	try {
		const response = await api.post('/delivery-man/update-active-status',formData);
		return response;
	} catch (error:any) {
		return error.response;
	}
}
//===================================================================
 
//update vendor store data
export const updateVendorStoreData = async (data:FormData): Promise<Response> => {
    data.append('_method','PUT')
	try {
		const response = await api.post('/vendor/update-business-setup',data);
		return response;
	} catch (error:any) {
		return error.response;
	}
}


//update vendor fcm token process
export const saveVendorFcmTokenProcess = async (formData:FormData):Promise<Response> => { 
	formData.append('_method','PUT')
	try {
		const response = await api.post(`/delivery-man/update-fcm-token`,formData);
		console.log(response?.data)
		return response;
	} catch (error:any) {
		return error.response;
	}
}

export const recordLocationData  = async (formData:FormData):Promise<Response> => { 
	try {
		const response = await api.post(`/delivery-man/record-location-data`,formData);
		console.log(response?.data)
		return response;
	} catch (error:any) {
		return error.response;
	}


}

//list-record-location-data

export const listRecordLocationData = async ():Promise<Response> => { 
	try {
		const response = await api.get(`/delivery-man/list-record-location-data`);
		console.log(response?.data)
		return response;
	} catch (error:any) {
		return error.response;
	}
}
 

 