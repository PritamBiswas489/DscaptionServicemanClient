import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface currentlocationInterface {
    latitude : any | null,
    longitude : any | null,
    location: string,
    canStartTracking:boolean
}

const initialState: currentlocationInterface = {
    latitude: null,
    longitude :  null,
    location: '',
    canStartTracking:false
 };

 interface SetDataPayload {
    field: keyof currentlocationInterface;
    data: string | boolean | any;
 }

 const currentLocationSlice = createSlice({
     name: "currentLocation",
     initialState: initialState,
     reducers: {
         setData(state: any, action: PayloadAction<SetDataPayload>) {
             state[action.payload.field] = action.payload.data;
         },
         resetState(state: currentlocationInterface) {
             return initialState;
         },  
     },
 })

 
 export const currentLocationActions = currentLocationSlice.actions;
 export default currentLocationSlice
 