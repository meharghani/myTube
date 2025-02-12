//import api from  './axiosApi'
import axios from "axios"
export const api =  axios.create({
    baseURL:import.meta.env.VITE_INTERNAL_API_PATH,
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})

export const login = async(data)=>{
    let response
    try {
        response = await api.post("/users/login",data)
        return response
    } catch (error) {
        return error
    }
}
export const registerUser = async(data)=>{
    let response
    try {
        response = await api.post("/user/register",data)
    } catch (error) {
        return error
    }
    return response
}
export const logout = async()=>{
    let response
    try {
        response = await api.post("/users/logout")
    } catch (error) {
        return error
    }
    return response
}
export const refreshToken = async()=>{
    let response
    try {
        response = await api.post("/users/refresh-token")
    } catch (error) {
        return error
    }
    return response
}
export const changePassword = async(data)=>{
    let response
    try {
        response = await api.post("/users/change-password",data)
    } catch (error) {
        return error
    }
    return response
}
export const getCurrentUser = async()=>{
    let response
    try {
        response = await api.post("/users/current-user")
    } catch (error) {
        return error
    }
    return response
}
export const updateUser = async(data)=>{
    let response
    try {
        response = await api.patch("/users/update-user",data)
    } catch (error) {
        return error
    }
    return response
}
export const updateAvatar = async(data)=>{
    let response
    try {
        response = await api.patch("/users/update-avatar",data)
    } catch (error) {
        return error
    }
    return response
}
export const userChannel = async(username)=>{
    let response
    try {
        response = await api.post(`/users/user-channel/:${username}`)
    } catch (error) {
        return error
    }
    return response
}
export const addVideoToWatchHistory = async(videoId)=>{
    let response
    try {
        response = await api.post(`/users/add-to-history/:${videoId}`)
    } catch (error) {
        return error
    }
    return response
}
export const watchHistory = async()=>{
    let response
    try {
        response = await api.post(`/users/history`)
    } catch (error) {
        return error
    }
    return response
}