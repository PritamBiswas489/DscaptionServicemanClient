import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TopCardInterface, BookingInterface, BookingStatInterface } from "@src/interfaces/servicemen/home.data.interface"; 

interface HomeDataStateInterface {
     topCard:TopCardInterface,
     RecentBookings:BookingInterface[],
     refreshHomeData:boolean,
}

interface SetDataPayload {
    field: keyof HomeDataStateInterface;
    data:  any;
}

const initialState: HomeDataStateInterface = {
    topCard:{
        total_bookings: 0,
        ongoing_bookings: 0,
        completed_bookings: 0,
        canceled_bookings: 0,
    },
    RecentBookings:[],
    refreshHomeData:true
};

const serviceManHomeDataSlice = createSlice({
    name: "ServiceManhomeDataState",
    initialState: initialState,
    reducers: {
        setData(state: any, action: PayloadAction<SetDataPayload>) {
            state[action.payload.field] = action.payload.data;
        },
        resetState(state: HomeDataStateInterface) {
            return initialState;
        },
    }
})


export const serviceManHomeDataActions = serviceManHomeDataSlice.actions;
export default serviceManHomeDataSlice;