import api from "@src/config/authApi.config.store";
interface Response {
	data: any;
	status: number;
	statusText: string;
	headers: any;
	config: any;
	request?: any;
}
//======================================================================//
//wallet adjustment
export const deliveryBoywalletAdjustment = async(): Promise<Response> => {
	const formData = new FormData()
	formData.append('adjustment',1)
	try {
		const response = await api.post('/delivery-man/make-wallet-adjustment',formData);
		return response;
	} catch (error:any) {
		return error.response;
	}
}

export const walletProvidedEarningList = async(): Promise<Response> => {
	try {
		const response = await api.get(`/delivery-man/wallet-provided-earning-list?limit=${200}`);
		return response;
	} catch (error:any) {
		return error.response;
	}

}

export const getWalletPaymentList = async(): Promise<Response> => {
    try {
		const response = await api.get(`/delivery-man/wallet-payment-list?limit=${100}`);
		return response;
	} catch (error:any) {
		return error.response;
	}

}


//=====================================================================//
export const getWithdraws = async(): Promise<Response> => {
	try {
		const response = await api.get('/vendor/get-withdraw-list');
		return response;
	} catch (error:any) {
		return error.response;
	}
}
 

