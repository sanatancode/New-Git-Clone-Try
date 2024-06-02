import React, { useEffect, useState } from "react";
import { CgCloseR } from "react-icons/cg";
import { GoPersonAdd } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { MdAdd, MdCurrencyRupee } from "react-icons/md";
import { CiCircleRemove } from "react-icons/ci";

import DatePicker from "react-datepicker";
import { FaCalendarAlt } from 'react-icons/fa';
import "./Datepickers.css"
import "react-datepicker/dist/react-datepicker.css";
export const OrderModal = ({mode, closepros, tempdone }) => {
  const [seldate, setSeldate] = useState(new Date());
  const [selecteditem, setSelecteditem] = useState([]);
  const [listitem, setListitems] = useState([]);
  const [superlist,setSuperlist]= useState([])
  const [droplist, setDroplist] = useState(false);
  const [custlist, setCustlist] = useState([]);
  const [Invoice, setInvoice] = useState(null);
  const [ispaid, setIspaid] = useState(false)
  const [selectedcust, setSelectedcust] = useState(null);
  const [productselected, setProductselected] = useState(null);
  const [skusum, setSkusum]= useState({price: 0, quantity: 0})
  const makelist = async () => {
    const list = localStorage.getItem("Products");
    const custlist = localStorage.getItem("Customers");
    const listparse = await JSON.parse(list);
    const custparse = await JSON.parse(custlist);
    setListitems(listparse);
    setSuperlist(listparse)
    setCustlist(custparse);
  };
  useEffect(() => {
    makelist();
  }, []);
  // State to manage the open state of each item individually
  const [openItems, setOpenItems] = useState({});
  const [skus, setSkus] = useState({});

  const toggleOpen = (id) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [id]: !prevOpenItems[id],
    }));
  };

  useEffect(() => {
    let psum = 0;
    let qsum = 0
    selecteditem.forEach((item)=>{
      item.sku.forEach((mysku)=>{psum+=(skus[item.id][mysku.id].price*skus[item.id][mysku.id].quantity);
        qsum+=Number(skus[item.id][mysku.id].quantity)
      })
    })
    const newskusum = {price: psum, quantity: qsum}
    setSkusum(newskusum)
  
 
  }, [skus]);

  async function createsaleorder (){
    const deepCopy = (obj) => {
      return JSON.parse(JSON.stringify(obj));
    };
  
    const selectedsku = deepCopy(skus);
    const alldata =deepCopy(superlist);
    
    const skusarray = []
    selecteditem.forEach((item)=>{
      item.sku.forEach((mysku)=>{if(skus[item.id][mysku.id].price < 1 || skus[item.id][mysku.id].quantity < 1){

       
        delete selectedsku[item.id][mysku.id]

      }else{
        skusarray.push(selectedsku[item.id][mysku.id])
        alldata.forEach(user => {
          if (user.id === item.id) {
            user.sku.forEach(sku => {
              if (sku.id === mysku.id) {
                sku.quantity_in_inventory -= Number(skus[item.id][mysku.id].quantity);
              }
            });
          }
        });
      };
    
      })
    })

    if(Invoice && seldate && skusarray.length>0){
      const orderdata = {customer_id: selectedcust.customer, items : skusarray,paid: ispaid ? true : false,invoice_no: Invoice,invoice_date: seldate}
  
    
      if(ispaid){
        localStorage.setItem("Products", JSON.stringify(alldata))
      }
      if(localStorage.getItem("Orders")){
        const orderlist = localStorage.getItem("Orders")
        const listparse = await JSON.parse(orderlist);
        const newlist = [...listparse, orderdata]
     
        localStorage.setItem("Orders", JSON.stringify(newlist))
      }else{
        localStorage.setItem("Orders",JSON.stringify([orderdata]))
      }
      closepros()
    }
   
  }
  async function fetchtemp() {
    try {
      const response = await fetch(
        "https://react-flow-project-zeta.vercel.app/api/fetchtemplate",
        {
          method: "GET",
        }
      );
      const json = await response.json();
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    fetchtemp();
  }, []);




  const [addmodal, setAddmodal] = useState(null);
  const [newTemp, setNewTemp] = useState("");
  const [temptext, setTemptext] = useState("");

  const savetemp = async () => {
    const data = {
      name: newTemp,
      text: temptext,
    };
    try {
      const response = await fetch(
        "https://react-flow-project-zeta.vercel.app/api/savetemplate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const json = await response.json();
      if (json.status) {
        fetchtemp();
        setAddmodal(false);
        setNewTemp("");
        setTemptext("");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className={`bg-opacity-30 font-sans ${mode !== "dark" ? "text-gray-700":"text-gray-50"} overflow-y-scroll h-screen w-screen md:px-7 lg:px-28 xl:px-96 py-28  fixed z-[1000] flex items-center justify-center bg-black`}>
      <div className={`p-4 ${mode !== "dark" ? "bg-white":"bg-gray-600"} h-full w-full overflow-y-scroll overscroll-auto rounded-md`}>
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
            Sale Order Form
          </h1>

          <div className="grid grid-cols-4 gap-2 mr-2">
            <div className="col-span-3">
              <div className="font-bold font-sans my-1">
                Invoice Number{" "}
                <span className="text-red-500  align-text-top ">*</span>
              </div>
              <div className={`border w-full rounded-md px-4 py-2  bg-white shadow-inner ${mode !== "dark" ? "text-white ":"bg-gray-400 text-gray-100  "} `}>
                <input
                type="text"
                onChange={(e)=>{setInvoice(e.target.value)}}
                  placeholder="Enter Invoice Number"
                  className={`border-none  outline-none ${mode !== "dark" ? "text-black ":"bg-gray-400 text-gray-100  placeholder:text-gray-50 "} placeholder:text-gray-400  w-full `}
                />
              </div>
            </div>
            <div className=" z-[2000] flex flex-col h-full">
              <div className="font-bold font-sans my-1">
                Invoice Date
                <span className="text-red-500 align-text-top ">*</span>
              </div>
              <div className={`flex h-full justify-between items-center self-stretch border shadow-inner px-2 ${mode !== "dark" ? "text-white":"bg-gray-400 text-gray-100 "} bg-white rounded-md z-[2000]`}>
               <DatePicker    placeholderText="Select date" className={`w-32 border-none outline-none ${mode !== "dark" ? "text-black":"bg-gray-400 text-gray-100 "} `} selected={seldate} onChange={(date)=>{setSeldate(date)}}  dateFormat="dd/MM/YYYY"/>
               
              </div>
            </div>
          </div>
          <div className="my-4">
            <div className="font-bold font-sans my-1">
              Customer Name
              <span className="text-red-500  align-text-top ">*</span>
            </div>
            <select
              onChange={(e) => setSelectedcust(custlist.find((item)=>item.customer_profile.id === Number(e.target.value)))}
              className={`border w-full rounded-md px-4 py-2  ${mode !== "dark" ? "text-black ":"bg-gray-400 text-gray-100 "}  shadow-inner `}
            >
              <option value={null}>Select a option </option>
              {custlist.length !== 0 &&
                custlist.map((item) => (
                  <>
                    <option value={item.customer_profile.id}>
                      {item.customer_profile.name}
                    </option>
                  </>
                ))}
            </select>
          </div>

          <div className="relative w-full my-4">
            <div className="font-bold font-sans my-1">
              All Products{" "}
              <span className="text-red-500  align-text-top ">*</span>
            </div>
            <div className=" my-2   rounded-md">
              <div className={`border relative flex items-center   ${mode !== "dark" ? "bg-white text-black":"bg-gray-400 text-gray-100 "} shadow-inner  p-2 my-2`}>
                <div className="flex  space-x-2">
                  {selecteditem.map((item, index) => (
                    <span
                      key={index}
                      onClick={() => {
                        setListitems((prev) => [...prev, item]);
                        setSelecteditem((prev) => {
                          return prev.filter((itemlist) => itemlist !== item);
                        });
                        const remid = {...openItems};
                        delete remid[item.id]
                        const skuslist = {...skus};
                        delete skuslist[item.id]
                        setOpenItems(remid)
                        setSkus(skuslist)
                      
                      }}
                      className={` border flex rounded-md hover:bg-slate-200 cursor-pointer  justify-center items-center p-1 text-sm flex-nowrap space-x-2   ${mode !== "dark" ? "bg-slate-100":"bg-gray-100 text-blue-600 "}`}
                    >
                      <span className="text-nowrap">{item.name} </span>
                      <CiCircleRemove />
                    </span>
                  ))}
                </div>
                <p
                  onClick={() => {
                    setDroplist((prev) => !prev);
                  }}
                  className={` text-gray-400 ${mode !== "dark" ? "text-black ":"text-gray-100 "} cursor-pointer w-full text-left mx-2 `}
                >
                  Select Products from List
                </p>
                {selecteditem.length !== 0 && (
                  <div
                    onClick={() => {
                      setSkusum({price: 0, quantity:0})
                      setSkus({})
                      setOpenItems({})
                      setSelecteditem([]);
                      makelist();
                    }}
                    className="flex justify-center  cursor-pointer h-full items-center"
                  >
                    <CiCircleRemove size={23} />
                  </div>
                )}
                <button className="flex justify-center cursor-pointer ml-2  h-full items-center">
                  {droplist ? (
                    <div
                      onClick={() => {
                        setDroplist((prev) => !prev);
                      }}
                    >
                      <IoIosArrowDown />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setDroplist((prev) => !prev);
                      }}
                    >
                      <IoIosArrowUp />
                    </div>
                  )}
                </button>
                <div className={` border px-2 ${mode !== "dark" ? "bg-white text-black ":"bg-gray-600  "} border-blue-500 rounded-md absolute top-12  right-0 left-0  overflow-y-scroll  overflow-hidden  z-[200] max-h-40 `}>
                  {droplist &&
                    listitem.length > 0 &&
                    listitem.map((item, index) => (
                      <span
                        onClick={() => {
                          setDroplist((prev) => !prev);
                          setSelecteditem((prev) => [...prev, item]);
                          const initialOpenItems = {};
                            initialOpenItems[item.id] = false;
                          const newitems = {...openItems,...initialOpenItems};
                          setOpenItems(newitems);
                          const skuset = {...skus}
                          item.sku.forEach(skuitem=>{
                            if (!skuset[item.id]) {
                              skuset[item.id] = {}; // Initialize skuset[item.id] if it doesn't exist
                          }
                            skuset[item.id][skuitem.id] = {product_id: item.id, sku_id: skuitem.id, price: 0, quantity: 0}
                          })
                          setSkus(skuset)
                          setListitems((prev) =>
                            prev.filter((cont) => cont.name !== item.name)
                          );
                        }}
                        className={`w-full   block cursor-pointer my-2 rounded-md px-1  ${mode !== "dark" ? " hover:bg-gray-100 ":"  hover:bg-blue-500"}`}
                        key={index}
                      >
                        {item.name}
                      </span>
                    ))}
                </div>
              </div>
         
              {selecteditem.map((item, index) => {
              
                  return (
                    <>
                    <div  onClick={() => toggleOpen(item.id)} key={index} className="flex my-4  cursor-pointer p-2 drop-shadow-md rounded-md  items-center  bg-blue-50 text-blue-500 border border-blue-400 w-full justify-between ">
                      <span>{item.name}</span>
                      <div
              className="flex justify-center cursor-pointer ml-2 h-full items-center"
             
            >
              {!openItems[item.id] ? (
                <IoIosArrowDown />
              ) : (
                <IoIosArrowUp />
              )}
            </div>
                    </div>

                    {openItems[item.id] && item.sku.map((itemsk,index)=>{ 
              
                    return (
    
                    <div className="p-2   my-4 border shadow-inner rounded-md">
                      <div
                        key={index}
                        className="p-6 border-b-2 flex justify-between"
                      >
                        <div className="flex space-x-2">
                          <span>{index + 1}.</span>
                          <h2> SKU {itemsk.product}</h2>
                        </div>
                        <div className={`${mode !== "dark" ? "text-black ":"text-blue-600 "} bg-gray-50 rounded-full font-semibold  px-4 py-1 flex space-x-1 items-center justify-center `}>
                          Rate: <MdCurrencyRupee /> {itemsk.selling_price}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="">
                          <div className="font-bold font-sans my-1">
                            Selling Rate
                            <span className="text-red-500  align-text-top ">
                              *
                            </span>
                          </div>
                          <div className="border w-full rounded-md px-4 py-2  bg-white shadow-inner ">
                            <input
                             onChange={(e)=>{
                              const thisku = {...skus};
                              thisku[item.id][itemsk.id].price = e.target.value
                            setSkus(thisku)
                            }}
                            value={skus[item.id][itemsk.id].price}
                            min={itemsk.selling_price}
                            max={itemsk.max_retail_price}
                            
                              type="number"
                             
                              placeholder="Enter Selling Rate"
                              className={`border-none  outline-none ${mode !== "dark" ? "text-black ":"text-blue-600 "} placeholder:text-gray-400 w-full `}
                            />
                          </div>
                        </div>
                        <div className=" relative">
                          <div className="font-bold font-sans my-1">
                            Total Items
                            <span className="text-red-500  align-text-top ">
                              *
                            </span>
                          </div>
                          <div className="border w-full rounded-md px-4 py-2  bg-white shadow-inner ">
                            <input
                                onChange={(e)=>{
                                  const thisku = {...skus};
                                  thisku[item.id][itemsk.id].quantity = e.target.value
                                setSkus(thisku)
                                }}
                                value={skus[item.id][itemsk.id].quantity}
                            min='0'
                            max={itemsk.quantity_in_inventory }
                       
                            type="number"
                              placeholder="Enter quantitiy"
                              className={`border-none  outline-none ${mode !== "dark" ? "text-black ":"text-blue-600 "} placeholder:text-gray-400 w-full `}
                            />
                          </div>
                          <div className={`absolute ${mode !== "dark" ? "bg-green-300":"bg-green-700 text-gray-50 "} -bottom-4 right-0   font-semibold px-4 p-1 rounded-full`}>
                            <span>
                              {itemsk.quantity_in_inventory === 0
                                ? "No items Remaining"
                                : `${itemsk.quantity_in_inventory - skus[item.id][itemsk.id].quantity} Remaining`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>)})}
                    </>
                  );
                })}
            </div>
            
            {selecteditem.length>0 && (
              <>
              <div className="flex space-x-2 items-center my-4  justify-between">
                <div className="flex items-center justify-center space-x-2">
                <input id="status"    checked={ispaid}
          onChange={()=>{setIspaid(!ispaid);}} className="w-5 h-5" type="checkbox"/>
                <label htmlFor="status"  className=" text-lg font-semibold cursor-pointer">Is Paid?</label>
                </div>
                <div className="flex space-x-2 items-center justify-end">
                  <span className="text-blue-500 bg-blue-100 p-2 rounded-full font-semibold">Total Price :  {skusum.price}</span>
                  <span className="text-blue-500 bg-blue-100 p-2 rounded-full font-semibold">Total Items : {skusum.quantity}</span>
                </div>
              </div>
              <div className="flex justify-end items-center w-full ">
                <button
                  onClick={() => {
                    createsaleorder()
                    
                  }}
                  className=" bg-green-100 border-2 border-green-500 hover:bg-green-600 text-lg w-full text-green-500 font-semibold  hover:text-gray-50  py-2 px-2 rounded-full my-2"
                >
                  Create Sale Order
                </button>
              </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
