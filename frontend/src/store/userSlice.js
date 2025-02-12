import {createSlice} from "@reduxjs/toolkit"


// const initialState = {
//     user:localStorage.getItem("userInfo")
//     ? JSON.parse(localStorage.getItem("userInfo"))
//     : "",
//     status:localStorage.getItem("userStatus") ? JSON.parse(localStorage.getItem("userStatus")):false
   

// }
const initialState = {
    // accessToken: localStorage.getItem("accessToken")
    // ? JSON.parse(localStorage.getItem("accessToken"))
    // : null,
    // user:localStorage.getItem("userInfo")
    //     ? JSON.parse(localStorage.getItem("userInfo"))
    //     : null,
    // isAuthenticated:localStorage.getItem("userStatus") ? JSON.parse(localStorage.getItem("userStatus")):false
    accessToken: null,
    user:null,
    isAuthenticated: false
}
export const userSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setUser:(state, action)=>{
            state.user = action.payload.user
            state.isAuthenticated = true,
            state.accessToken = action.payload.accessToken
        localStorage.setItem("userInfo",JSON.stringify(action.payload.user))
        localStorage.setItem("accessToken",JSON.stringify(action.payload.accessToken))
        localStorage.setItem("userStatus",JSON.stringify(state.isAuthenticated))
        },
        refreshAccessToken: (state, action) => {
            state.accessToken = action.payload;
            localStorage.setItem("accessToken",JSON.stringify(action.payload))
          },
          logoutUser: (state) => {
            state.accessToken = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("userInfo"),
            localStorage.removeItem("accessToken"),
            localStorage.removeItem("userStatus")
          },
      
        // resetUser:(state)=>{
        //     state.userInfo = "",
        //     localStorage.removeItem("userInfo"),
        //     state.status = false
        //     localStorage.removeItem("userStatus")
        // }
    }
})
export const {setUser, refreshAccessToken, logoutUser} = userSlice.actions
export default userSlice.reducer