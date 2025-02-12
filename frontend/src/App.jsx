import { Outlet } from "react-router-dom"
import Header from "./components/header/Header"
import { Sidebar } from "./components"
import { useState } from "react"
const App = ({children}) =>{
  const [menu, setMenu] = useState(false)
  const toggleMenu = ()=>{
    setMenu(!menu)
  }
  return(
    <>
    <Header toggleMenu={toggleMenu} />
    <div className="flex">
      <Sidebar menu={menu} />
      <Outlet />
    </div>
   
    </>
  )
}


export default App