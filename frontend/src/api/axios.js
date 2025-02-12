import axios from "axios";

export default axios.create({
    baseURL:import.meta.env.VITE_INTERNAL_API_PATH,
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})
export const axiosPrivate = axios.create({
    baseURL:import.meta.env.VITE_INTERNAL_API_PATH,
    headers:{ 'Content-Type': 'application/json'},
    withCredentials:true
})