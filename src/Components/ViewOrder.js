import React, { useEffect, useState } from 'react'
import { CgCloseR } from 'react-icons/cg';

const ViewOrder = ({mode, closepros, viewmodal}) => {

    const [custlist, setCustlist] = useState([]);
    const [custname, setCustname] = useState(null)
    const [orderdate, setOrderDate] = useState(null)
   
  const makelist = async () => {

      const custlist = localStorage.getItem("Customers");
   
      const custparse = await JSON.parse(custlist);

      setCustlist(custparse);
      const custname = custparse.find((itemc)=> itemc.customer === viewmodal.customer_id)
      setCustname(custname);
      const invdate = new Date(viewmodal.invoice_date)
          const date = `${invdate.getDate()}/${invdate.getMonth()+1}/${invdate.getFullYear()}`
          setOrderDate(date)
    };
    useEffect(() => {
        console.log(viewmodal)
      makelist();
    }, []);
  return (
    <div className={`bg-opacity-30 font-sans ${mode !== "dark" ? "text-gray-700":"text-gray-50"} overflow-y-scroll h-screen w-screen md:px-7 lg:px-28 xl:px-96 py-28  fixed z-[1000] flex items-center justify-center bg-black`}>
      {custname && orderdate && <div className={`p-4 ${mode !== "dark" ? "bg-white":"bg-gray-600"} h-full w-full overflow-y-scroll overscroll-auto rounded-md`}>
        <div
          onClick={() => {
            closepros();
          }}
          className="border-b   w-full flex justify-end my-2 underline-offset-2 cursor-pointer "
        >
          <CgCloseR size={32} />
        </div>
        <div>
          <h1
            className={`font-bold  mx-auto w-fit px-4 py-2 rounded-full text-lg
            ${mode !== "dark" ? "bg-blue-100 text-blue-500":"bg-blue-600"} `}
          >
            Sale Order 
          </h1>

          <div className="grid grid-cols-4 gap-2 mr-2">
            <div className="col-span-3">
              <div className="font-bold font-sans my-1">
                Invoice Number{" "}
           
              </div>
              <div className=" w-full rounded-md py-2   ">
                <span>{viewmodal.invoice_no}</span>
              
              </div>
            </div>
            <div className=" z-[2000] flex flex-col h-full">
              <div className="font-bold font-sans my-1">
                Invoice Date
                
              </div>
              <div className="w-full rounded-md py-2 ">
               <span>{orderdate}</span>
               
              </div>
            </div>
          </div>
          <div className="my-4">
            <div className="font-bold font-sans my-1">
              Customer Name
          
            </div>
            <span>{custname.customer_profile.name}</span>
          </div>

        </div>
        <h1 className='font-bold mb-2 text-lg'>Items Purchased</h1>
        <div className='grid grid-cols-4 gap-2 '>
        {viewmodal.items.map((item,index)=><div key={index} className={`p-4 ${mode !== "dark" ? "bg-gradient-to-r from-fuchsia-100 via-amber-50 to-white":"bg-gradient-to-r from-fuchsia-700 via-amber-700 to-gray-500 text-white"} rounded-md flex-row  `}>
          <h3 className='font-extrabold leading-tight'>SKU {item.sku_id}</h3>
          <p className='font-light' >Price - {Number(item.price)}</p>
          <p className='font-light' >Quantity - {Number(item.quantity)}</p>
</div>)}
        </div>
       
      </div>}
    </div>
  )
}

export default ViewOrder