import { Link, useNavigate, useLocation } from "react-router-dom"
import {Button, Container, Input} from "../components"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import {useFormik} from "formik"
import loginSchema from "../schemas/loginSchema" 
import {login} from "../api/userApi"
import {setUser} from "../store/userSlice"
import axios from "axios"
import { api } from "../api/userApi"



const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const from  = location.state?.from?.pathname || "/"
  const isAuth = useSelector((state)=>state.auth.isAuthenticated)
  const [error, setError] = useState("")
  useEffect(()=>{
    if(isAuth){
      navigate(from, {replace: true})
    }
  },[navigate, isAuth])
  const {values, touched, handleBlur, handleChange, errors} = useFormik({
    initialValues:{
      identifier:"",
      password:""
    },
    
    validationSchema: loginSchema
  })
  
  const handleLogin = async()=>{

   try {
     const data = values.identifier.includes("@")
     ? { email: values.identifier, password: values.password }
     : { username: values.identifier, password: values.password };
     const response = await api.post("/users/login",data)
     
      console.log(response)
     if(response.status === 200){
     dispatch(setUser(response?.data?.data))
       navigate(from,{replace:true})
     }
   } catch (error) {
    if(error.code === "ERR_BAD_REQUEST"){ 
      setError(error.response.data.message)  
    } else{
      setError(error.message)
    }
   
   }
      
  
  }
  return (
   <div className="bg-[#F0F4F9]">
   <Container className="min-h-screen flex flex-col justify-center items-center">
     <div className="w-2/3 h-[60vh] bg-white rounded-xl flex">
      <div className="p-5 w-1/2 h-full">
        <div className="w-24 h-24"><img src="https://cdn.iconscout.com/icon/free/png-256/free-google-logo-icon-download-in-svg-png-gif-file-formats--technology-brand-social-media-company-logos-pack-icons-6297223.png?f=webp&w=256" /></div>
        <h1 className="px-5 text-[24px] font-bold">Sign In</h1>
        <h3 className="px-5 text-[16px] pt-2 font-sans">to continue to YouTube</h3>
      </div>
      <div className="w-1/2 p-5 h-full flex flex-col justify-center">
        <Input 
        placeholder="Email or Username" 
        label="Email or Usename" 
        value={values.identifier}
        name="identifier"
        onBlur={handleBlur}
        onChange={handleChange}
        />
        {errors.identifier && touched.identifier ? (<p className="text-red-600">{errors.identifier}</p>):""}
        <Input 
        placeholder="Password" 
        label="Password" 
        type="password" 
        value={values.password}
        name="password"
        onBlur={handleBlur}
        onChange={handleChange}
        />
        {errors.password && touched.password ? (<p className="text-red-600">{errors.password}</p>):""}
        <p className="pt-1 text-blue-700"><Link to={"/"}> Forget Password?</Link> </p>
        <div className="w-full mt-5 px-10 gap-5 flex justify-end">
        <Link to={"/"}><Button bgColor="bg-white" textColor="text-blue-700" className="hover:bg-gray-100">Create account</Button></Link>
        <Button 
        className="" 
        onClick={handleLogin}
        disabled={
          !values.identifier ||
          !values.password ||
          errors.identifier ||
          errors.password
        }
        >Login</Button>
      
        </div>
        { error ? (<p className="text-red-600 mt-5">{error}</p>):""}
      </div>
     </div>
   </Container>
   </div>
  )
}

export default Login