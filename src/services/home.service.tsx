import api from "../config/authApi.config";
 
  
//home top card data
export const homeTopCardData = async () =>{
    try {
		const response = await api.get(`/serviceman/dashboard?sections=top_cards`);
		return response;
	} catch (error:any) {
		return error.response;
	}
}
//home top booking stat
export const homeBookingStat = async () =>{
	try {
		const response = await api.get(`/serviceman/dashboard?sections=booking_stats`);
		return response;
	} catch (error:any) {
		return error.response;
	}
}

//home recent booking
export const homeRecentBookings = async () =>{
	try {
		const response = await api.get(`/serviceman/dashboard?sections=recent_bookings`);
		return response;
	} catch (error:any) {
		return error.response;
	}
}

export const homeStaticGraphData = async(staticUrl:string)=>{
    try {
		const response = await api.get(staticUrl);
		return response;
	} catch (error:any) {
		return error.response;
	}

}