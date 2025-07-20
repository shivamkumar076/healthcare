import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
 interface doctor{
    email:string,
    role:string,
    firstName:string,
    lastName:string,
    specialization:string,
    aboutdoctor:string,
    image:string,
    _id:string
 }
const initialState: doctor[] | null = null as doctor[] | null ;

const doctorSlice = createSlice({
    name:"doctor",
    initialState,
    reducers:{
        adddoctor: (state, action: PayloadAction<doctor []>)=> {
            return action.payload;
        }
    }
})
export const {adddoctor} = doctorSlice.actions
export default doctorSlice.reducer;