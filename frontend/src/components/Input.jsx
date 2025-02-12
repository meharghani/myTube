import { forwardRef, useId } from "react"


const Input = ({
    label, type="text", className = "" ,...props
},ref)=>{
    const id = useId()
    return(
        <div className="w-full">
            {label && (<label htmlFor={id} className="inline-block mb-1 pl-1">{label}</label>)}
            <input 
                type={type}
                className={`px-3 py-3 rounded-lg bg-white text-black outline-blue-500 focus:bg-gray-50 duration-200 border border-gray-500 w-full ${className}`}
                ref={ref}
                {...props}
                id={id}
            />
        </div>
    )
}

export default forwardRef(Input)