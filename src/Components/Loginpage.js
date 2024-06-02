import React, { useState } from 'react'

const Loginpage = ({mode, logindone}) => {
    const [email,setEmail]= useState("")
    const [password,setPassword]= useState("");
    const [lerror,setLerror]=useState(false)
    function sumbitlogin(){
        setLerror(false)
        if(email=== "frontend@gmail.com" && password === "login"){
            logindone({success: true})
        }else{
            setLerror("Invalid Credentials")
        }
    }

  return (
    <div className={`h-screen flex items-center ${mode !== "dark" ? "bg-gradient-to-tr from-fuchsia-100 via-emerald-200 to-yellow-100":"bg-gradient-to-tr from-fuchsia-900 via-emerald-900 to-black"} justify-center w-screen`}>
        <div className='bg-white  px-12 py-12  shadow-md  flex flex-col rounded-md space-y-10' >
                <span className='font-semibold text-4xl leading-tight text-center'>Login</span>
                <div className="border w-full rounded-md px-4 py-2  bg-white shadow-inner ">
                <input
                type="text"
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
                  placeholder="Enter Your Email"
                  className="border-none  outline-none  placeholder:text-gray-400 w-full "
                />
              </div>
                <div className="border w-full rounded-md px-4 py-2  bg-white shadow-inner ">
                <input
                type="password"
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
                  placeholder="Enter Your Password"
                  className="border-none  outline-none  placeholder:text-gray-400 w-full "
                />
              </div>
              <div className='flex justify-center rounded-md'>

              <button onClick={()=>{
                sumbitlogin()
              }} className='bg-fuchsia-300 text-white cursor-pointer rounded-full  hover:bg-green-900 hover:text-white py-2 px-8 drop-shadow-md'>LOGIN</button>
              </div>
              {lerror && <span className='text-red-500 font-extralight'> {lerror}</span>}
        </div>
    </div>
  )
}

export default Loginpage