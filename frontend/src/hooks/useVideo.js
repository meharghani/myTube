import axios from "../api/axios"
const useVideo = () =>{
    const videosData = async() =>{
        
        const response = await axios.get("/video/all")
        return response.data.data
    }
    return videosData
}

export default useVideo