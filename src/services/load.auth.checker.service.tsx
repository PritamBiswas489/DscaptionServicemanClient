import { getAuthTokenCheck } from "./auth.service";

interface Response {
    data: any;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
}
export const loadAuthCheckService = async (navigation:any) =>{
     const response:Response = await getAuthTokenCheck()
     console.log("================== auth check ============================")
     console.log(response.data)
}