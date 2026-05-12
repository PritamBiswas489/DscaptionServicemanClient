import api from "../config/authApi.config";

interface Response {
	data: any;
	status: number;
	statusText: string;
	headers: any;
	config: any;
	request?: any;
  }

export const getAuthTokenCheck =   async (): Promise<Response> => {
	try {
		const response = await api.get('/auth/verify-token');
		return response;
	} catch (error:any) {
		return error.response;
	}
	
}
export const getAuthUserService =  async (): Promise<Response> => {
	try {
		const response = await api.get('/serviceman/info');
		return response;
	} catch (error:any) {
		return error.response;
	}
};

export const deleteProviderOwnAccount = async(): Promise<Response> => {
	try {
		const response = await api.delete('/provider/delete');
		return response;
	} catch (error:any) {
		return error.response;
	}

}
 
