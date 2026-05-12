import api from "@src/config/authApi.config.store";
interface Response {
	data: any;
	status: number;
	statusText: string;
	headers: any;
	config: any;
	request?: any;
}

export const getServiceManLatestOrders = async()=>{
	try {
		const response = await api.get(`/delivery-man/latest-orders`);
		return response;
	} catch (error:any) {
		return error.response;
	}
}

export const getServiceManCurrentOrders = async()=>{
	try {
		const response = await api.get(`delivery-man/current-orders`);
		return response;
	} catch (error:any) {
		return error.response;
	}

}




export const serviceManAcceptOrder = async (orderid:any): Promise<Response> =>{
     
    const formData = new FormData()
	formData.append('_method','PUT')
	formData.append('order_id',orderid)
	 
	try {
		const response = await api.post(`/delivery-man/accept-order`,formData);
		console.log(response?.data)
		return response;
	} catch (error:any) {
		return error.response;
	}
}

//get order details
export const getOrderProductList = async(orderId:string | number): Promise<Response> =>{
	try {
		const response = await api.get(`/delivery-man/order-details?order_id=${orderId}`);
		return response;
	} catch (error:any) {
		return error.response;
	}
}
//get current order details
export const getCurrentOrderDetails = async(orderId:string | number): Promise<Response> =>{
	try {
		const response = await api.get(`/delivery-man/order?order_id=${orderId}`);
		return response;
	} catch (error:any) {
		return error.response;
	}

}

export const changeStatusToPickupProcessing = async (orderid:string | number): Promise<Response> =>{
	const formData = new FormData()
	formData.append('_method','PUT')
	formData.append('order_id',orderid)
	formData.append('status','picked_up')

	try {
		const response = await api.post(`/delivery-man/update-order-status`,formData);
		return response;
	} catch (error:any) {
		return error.response;
	}

}

export const changeStatusToDeliveredProcessing = async (formData:FormData): Promise<Response> =>{
	formData.append('_method','PUT')

	try {
		const response = await api.post(`/delivery-man/update-order-status`,formData);
		return response;
	} catch (error:any) {
		return error.response;
	}
}


export const serviceMenSendCustomerOtp = async (orderid:string | number): Promise<Response> =>{
	const formData = new FormData()
	formData.append('_method','PUT')
	formData.append('order_id',orderid)
    
	try {
		const response = await api.post(`/delivery-man/send-order-otp`,formData);
		 
		return response;
	} catch (error:any) {
		return error.response;
	}
}
export const getCompleteOrders = async(limit:number,offset:number): Promise<Response> => { //all,refunded,delivered
	try {
		const response = await api.get(`/delivery-man/all-orders?limit=${limit}&offset=${offset}`);
		return response;
	} catch (error:any) {
		return error.response;
	}
}
export const updateOrderPaymentPaid =  async (orderid:string | number): Promise<Response> =>{
	const formData = new FormData()
	formData.append('_method','PUT')
	formData.append('order_id',orderid)
	formData.append('status','paid')

	try {
		const response = await api.post(`/delivery-man/update-payment-status`,formData);
		console.log(response?.data)
		return response;
	} catch (error:any) {
		return error.response;
	}
}
//===================================================//
//get All Orders

//get all orders
export const getAllOrders = async(): Promise<Response> =>{
    try {
		const response = await api.get(`/vendor/all-orders`);
		return response;
	} catch (error:any) {
		return error.response;
	}
}
//get current orders
export const getCurrentOrders = async(): Promise<Response> =>{
	try {
		const response = await api.get(`/vendor/current-orders`);
		return response;
	} catch (error:any) {
		return error.response;
	}
}



//cancel order process
export const cancelOrderProcess= async (orderid:string | number,reason:string): Promise<Response> =>{
     
    const formData = new FormData()
	formData.append('_method','PUT')
	formData.append('order_id',orderid)
	formData.append('reason',reason)
	formData.append('status','canceled')

	try {
		const response = await api.post(`/vendor/update-order-status`,formData);
		console.log(response?.data)
		return response;
	} catch (error:any) {
		return error.response;
	}
}
//confirm order process
export const confirmOrderProcess = async (orderid:string | number): Promise<Response> =>{
	const formData = new FormData()
	formData.append('_method','PUT')
	formData.append('order_id',orderid)
	formData.append('status','confirmed')
	try {
		const response = await api.post(`/vendor/update-order-status`,formData);
		console.log(response?.data)
		return response;
	} catch (error:any) {
		return error.response;
	}

}

export const processingOrderProcess= async (orderid:string | number,processingTime:string): Promise<Response> =>{
     
    const formData = new FormData()
	formData.append('_method','PUT')
	formData.append('order_id',orderid)
	formData.append('processing_time',processingTime)
	formData.append('status','processing')

	 

	try {
		const response = await api.post(`/vendor/update-order-status`,formData);
		console.log(response?.data)
		return response;
	} catch (error:any) {
		return error.response;
	}
}

export const changeStatusToHandover = async (orderid:string | number): Promise<Response> =>{
	const formData = new FormData()
	formData.append('_method','PUT')
	formData.append('order_id',orderid)
	formData.append('status','handover')

	console.log(formData)

	try {
		const response = await api.post(`/vendor/update-order-status`,formData);
		console.log(response?.data)
		return response;
	} catch (error:any) {
		return error.response;
	}

}