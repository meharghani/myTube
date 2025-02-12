import React, { useEffect, useState } from 'react'
import {getCurrentUser} from "../api/userApi"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../store/userSlice'


const User = () => {
    
    const [user, setUser] = useState([])
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate();
    const location = useLocation()
    const dispatch = useDispatch()
    useEffect(()=>{
      let ismounted = true
      const controller = new AbortController();
      const getUers =  async() =>{
        try {
          const response = await axiosPrivate.post("/users/current-user", 
            {
              signal: controller.signal
            }
          );
          console.log(response.data)
          ismounted && setUser(response?.data?.data)
        } catch (err) {
          console.error(err)
          dispatch(logoutUser())
          navigate("/login",{state: {from: location},replace:true})

        }
      }
      getUers()
      return ()=>{
        ismounted = false,
        controller.abort()
      }
       
    },[])
  return (
    <div>{user?.email}

    </div>
  )
}

export default User