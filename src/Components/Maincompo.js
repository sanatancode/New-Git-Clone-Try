import React, { useEffect, useState } from "react";
import { SmallAddIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import { RxPerson } from "react-icons/rx";
import { MdCurrencyRupee } from "react-icons/md";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { Box, Button, ButtonGroup, Flex, SimpleGrid, Spacer, Text } from "@chakra-ui/react";
import { OrderModal } from "./OrderModal";
import { customers } from "./Clearer";
import { EditModal } from "./EditModal";
import ViewOrder from "./ViewOrder";

const Mainpage = ({mode}) => {
  const [modal, setModal] = useState(false);
  const [editmodal, setEditmodal] = useState(false);
  const [viewmodal, setViewmodal] = useState(false);
  const [custlist, setCustlist] = useState([]);
  const [superlist,setSuperlist]= useState([]);

  const [orders,setOrders]= useState([])
  const [type, setType] =  useState("Active");
const makelist = async () => {
    const list = localStorage.getItem("Products");
    const custlist = localStorage.getItem("Customers");
    const orderlist = localStorage.getItem("Orders");
    const listparse = await JSON.parse(list);
    const custparse = await JSON.parse(custlist);
    const ordersl = await JSON.parse(orderlist)
    setSuperlist(listparse)
    setCustlist(custparse);
    if(ordersl){

      setOrders(ordersl)
    }
  };
  useEffect(() => {
    makelist();
  }, []);

 
  return (
    <>
    {modal && <OrderModal mode={mode} closepros={()=>{setModal(false); makelist()}} />}
    {editmodal && <EditModal closepros={()=>{setEditmodal(false); makelist()}} mode={mode} editorder={editmodal}  />}
    {viewmodal && <ViewOrder closepros={()=>{setViewmodal(false)}} mode={mode} viewmodal={viewmodal}/>}
    <div className={` ${mode !== "dark" ? "bg-gray-50":"bg-gradient-to-tr from-black via-fuchsia-950 to-green-900 "}  w-full h-screen py-16 px-2`}>
  
    <div className={`mx-auto ${mode !== "dark" ? "bg-white":"bg-gray-600"}  p-4 rounded-md`}>
      <div className="flex justify-between">
        <div className="flex gap-1">
          <button onClick={()=>{setType("Active")}} className={`w-32 whitespace-normal break-words  ${type !== "Active" ? ` text-white ${mode !== "dark" ? "bg-blue-500":"bg-black text-white"}`:`text-blue-500 ${mode !== "dark" ? "bg-blue-100":"bg-gray-200 text-black"}`} py-2 px-4 rounded-md`}>Active Sale Order</button>
          <button onClick={()=>{setType("Completed")}} className={`w-32 whitespace-normal break-words  ${type !== "Completed" ? ` text-white ${mode !== "dark" ? "bg-blue-500":"bg-black text-white"}`:`text-blue-500 ${mode !== "dark" ? "bg-blue-100":"bg-gray-200 text-black"}`} py-2 px-4 rounded-md`}>Completed Sale Orders</button>
        </div>
        <button onClick={()=>{setModal((prev)=>!prev)}} className={`flex items-center ${mode !== "dark" ? "bg-blue-500 ":"bg-gray-600 border rounded-md shadow-sm"}  text-white py-2 px-4 rounded-md`}>
          <SmallAddIcon/>
          Sale Order
        </button>
      </div>
      <div className="mt-16">
        <div className={`grid grid-cols-5 ${mode !== "dark" ? "bg-teal-50 ":"bg-slate-950 text-white"}`}>
          <div className="border p-1.5 text-center font-bold">S. No</div>
          <div className="border p-1.5 text-center font-bold">Customer Name</div>
          <div className="border p-1.5 text-center font-bold">Price (Rs.)</div>
          <div className="border p-1.5 text-center font-bold">Last Modified</div>
          <div className="border p-1.5 text-center font-bold">Edit/View</div>
        </div>
        {orders.length>0 &&  orders.filter((item)=>{
          const ptype = item.paid ? "Completed": "Active";
       
          return ptype === type
        }).map((item,index)=>{
          const custname = custlist.find((itemc)=> itemc.customer === item.customer_id)
          let price = 0
          item.items.forEach((iteme)=>{
              price+= Number(iteme.price)
          })
          const invdate = new Date(item.invoice_date)
          const date = `${invdate.getDate()}/${invdate.getMonth()+1}/${invdate.getFullYear()}`
          return (<>
        <div key={index} className={`grid grid-cols-5 my-1 ${mode !== "dark" ? "bg-gray-50":"bg-slate-900 rounded-md text-green-100 "} py-1`}>
          <div className="p-1.5 text-center">{index+1}</div>
          <div className="p-1.5 text-center flex justify-center items-center">
            <div className="bg-teal-200 p-1 text-white rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
            </div>
            <span className="mx-1">{custname.customer_profile.name}</span>
            <span className="bg-blue-100  rounded-md p-1 text-gray-700 font-semibold" >{custname.customer_profile.id}</span>
          </div>
          <div className="p-1.5 text-center flex justify-center items-center">
            <MdCurrencyRupee/>
            {price}
          </div>
          <div className="p-1.5 text-center">{date}</div>
          <div className="p-1.5 text-center flex justify-center items-center">
           <BiDotsHorizontalRounded onClick={()=>{
            if(item.paid){
              setViewmodal(orders[index])
            }else{
              setEditmodal(orders[index])

            }
           }} className="cursor-pointer"/>
          </div>
        </div></>)})}
    
      </div>
    </div>
  </div>
  </>
  );
};

export default Mainpage;
