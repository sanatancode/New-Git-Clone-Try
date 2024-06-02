import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import Mainpage from './Components/Maincompo';
import { useEffect, useState } from 'react';
import Loginpage from './Components/Loginpage';
function App() {
  const [loginstatus,setLoginstatus] = useState(false)
  const [mode,setMode] = useState("white")
  function changemode (){
      const m = localStorage.getItem('mode')
      setMode(m)
  }
  useEffect(() => {
    changemode()
  }, [])
  function setmode(m){
    localStorage.setItem("mode",m);
    setMode(m)
  } 
  
  return (
    <>
      <div className=" fixed top-2 left-2 border rounded-md border-gray-400">
      <select value={mode} className={`rounded-md p-2 ${mode !=="dark" ? "bg-gray-100": "bg-black text-white"} `} onChange={(e)=>{setmode(e.target.value)}}>
        <option value="light" className=" bg-white text-black">Light Mode</option>
        <option value="dark" className=" bg-black text-white">Dark Mode</option>

      </select>
    </div>
    {!loginstatus && <Loginpage mode={mode} logindone={(item)=>{if(item.success){
      setLoginstatus(true)
    }}}/>}

    {loginstatus && <Mainpage mode={mode}/>}
    </>
  );
}

export default App;
