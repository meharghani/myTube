import {Container, Input, Button} from "../index"
import {FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMagnifyingGlass,
  faMicrophone,
  faBars,
  faPlus,
  faUser,
  faVideo
} from '@fortawesome/free-solid-svg-icons'
import {faBell}  from  "@fortawesome/free-regular-svg-icons"
import {faYoutube} from "@fortawesome/free-brands-svg-icons"
import { useState } from "react"
const Header = ({toggleMenu}) => {
  return (
    <Container>
        <div className="flex justify-between px-4 h-[10vh] items-center w-full">
            <div className="flex gap-7 w-[25%]">
            <div className="py-1 text-2xl hover:cursor-pointer" onClick={toggleMenu}><FontAwesomeIcon icon={faBars} /></div>
            <div className="font-extrabold font-mono text-3xl text-red-600 py-1 hover:cursor-pointer">
              <FontAwesomeIcon icon={faYoutube} />
              <span className="text-blue-600">My</span>Tube</div>
            </div>
            <div className="flex w-[50%]">
           
                <div className="rounded-full justify-center bg-white flex border border-gray-500 w-full">
                <div className="w-16 text-center p-3"> <FontAwesomeIcon icon={faMagnifyingGlass} /></div>
                  <input placeholder="Search"  className='rounded-lg px-3 text-black outline-blue-300 bg-white focus:bg-gray-50 duration-200 w-[100%] rounded-r-none'/>
                <div className="w-20 mx-auto text-center p-3 bg-slate-200 rounded-r-full hover:cursor-pointer"> <FontAwesomeIcon icon={faMagnifyingGlass} /></div>
                </div>
                <div className="px-4 py-3 rounded-full bg-slate-200 ml-2 hover:cursor-pointer"><FontAwesomeIcon icon={faMicrophone} /></div>
            </div>
            <div className="flex gap-6">
                <div><Button className="py-1 flex gap-2 items-center rounded-3xl" bgColor="bg-slate-200" textColor="text-black"><FontAwesomeIcon icon={faPlus} /><span>Create</span></Button></div>
                <div className="text-2xl py-1 relative hover:cursor-pointer"><FontAwesomeIcon icon={faBell} /><span className="bg-red-600 text-xs text-white rounded-full px-1 absolute left-3">9+</span></div>
                <div className="text-2xl bg-slate-200 rounded-full px-2 hover:cursor-pointer"><FontAwesomeIcon icon={faUser} /></div>
            </div>
        </div>
    </Container>
  )
}

export default Header