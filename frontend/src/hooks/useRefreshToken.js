import { api } from "../api/userApi"
import { refreshAccessToken } from "../store/userSlice"
import { useDispatch, useSelector } from "react-redux"
import { refreshToken } from "../api/userApi"

const useRefreshToken = () => {
    const accessToken = useSelector(state=> state.auth.accessToken)
    const dispatch = useDispatch()
    const refresh  = async()=>{
        const response = await api.post("/users/refresh-token",{
            withCredentials:true
        })
        dispatch(refreshAccessToken(response.data.data.accessToken))
        return response.data.accessToken
    }
    return refresh
}

export default useRefreshToken