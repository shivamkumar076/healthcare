import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
 interface User{
    email:string,
    role:string,
    firstName:string,
    lastName:string,
    token:string
    _id:string,
}
const initialState: User | null = null as User |null ;

const authSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        adduser: (state, action: PayloadAction<User>):User => {
            return action.payload;
        },
        removeUser:()=>{
            return null
        }
    }
})
export const {adduser,removeUser} = authSlice.actions
export default authSlice.reducer;