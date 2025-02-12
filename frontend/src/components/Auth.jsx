import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {useNavigate} from "react-router-dom"


const Protected = ({children, authentication = true})=>{
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector((state)=>state.auth.isAuthenticated)
    
    useEffect(()=>{
        if(authentication && authStatus!==authentication){
            navigate("/login")
        }else if(!authentication && authStatus !== authentication ){
            navigate("/")
        }
        setLoader(false)

    },[authStatus, navigate, authentication])
    return loader ? <div>Loading......</div> : <>{children}</>
 }

 export default Protected