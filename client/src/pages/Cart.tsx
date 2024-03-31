import React, { useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/Cart";
import HeadRoom from "react-headroom";
import { Navbar, SnackBar } from "../components";
import axios from "axios";
import { useAppSelector } from "../app/hook";
import { FaRegTrashCan } from "react-icons/fa6";

function Cart() {
  const [carts, setCarts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
  const [snackBarText, setSnackBarText] = useState<string>("");
  const [snackBarType, setSnackBarType] = useState<
    "error" | "success" | "info" | "warning"
  >("error");

  const [timeoutIds, setTimeoutIds] = useState<any>([]);
  const clearAllTimeouts = () => {
    timeoutIds.forEach((timeoutId: any) => clearTimeout(timeoutId));
    setTimeoutIds([]); 
  };
  const clearAlert = () => {
    clearAllTimeouts();
    const newTimeoutId = setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);
    setTimeoutIds([newTimeoutId]);
  };

  const fetchAllCarts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/cart/${user.email}`
      );
      console.log(data);
      setCarts(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setShowSnackBar(true);
      setSnackBarType("error");
      setSnackBarText("Have an Error on server .Please try agian");
      clearAlert();
      setIsLoading(false);
    }
  };
  const deleteOrderInCart = async (productID: string,) => {
    setIsLoading(true);
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/cart/${productID}/${user.email}`,);
      console.log(data);
      setShowSnackBar(true);
      setSnackBarType("success");
      setSnackBarText("Deleted product in your Cart");
      setIsLoading(false);
      clearAlert();
      fetchAllCarts()
    } catch (err) {
      console.log(err);
      setShowSnackBar(true);
      setSnackBarType("error");
      setSnackBarText("Have an Error on server .Please try agian");
      clearAlert();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCarts();
  }, []);
  return (
    <Wrapper>
      <HeadRoom>
        <Navbar />
      </HeadRoom>
      <div className="w-[100%] flex justify-center">
        <table className="table-auto w-[100%] m-20 mb-1 rounded-md bg-white sm:bg-[#f7f7f7]">
          <thead className="sm:hidden">
            <tr className="">
              <th className="bg-[#df7e0d] py-3 w-[5%] text-white font-thin text-[12.9px]">
                #
              </th>
              <th className="bg-[#df7e0d] py-3 w-[17.5%] text-white font-thin text-[12.9px]">
                Image
              </th>
              <th className="bg-[#df7e0d] py-3 w-[32.5%] text-white font-thin text-[12.9px]">
                Name
              </th>
              <th className="bg-[#df7e0d] py-3 w-[10%] text-white font-thin text-[12.9px]">
                Quantity
              </th>
              <th className="bg-[#df7e0d] py-3 w-[12.5%] text-white font-thin text-[12.9px]">
                Price Per Unit
              </th>
              <th className="bg-[#df7e0d] py-3 w-[12.5%] text-white font-thin text-[12.9px]">
                Total Price
              </th>
              <th className="bg-[#df7e0d] py-3 w-[10%] text-white font-thin text-[12.9px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {carts.map((cart, index) => {
              return (
                <tr key={index} className="sm:flex sm:flex-col sm:border-[1px] sm:mb-10 sm:bg-white">
                  <td className="text-center py-3 border-b-[1px] border-[#00000015] text-sm sm:border-none">
                    {index + 1}
                  </td>
                  <td className="text-center py-3 border-b-[1px] border-[#00000015] text-sm sm:border-none flex justify-center items-center">
                    <img
                      src={cart.product.img}
                      className=" rounded-[100%] w-[60px] h-[60px] object-cover"
                    ></img>
                  </td>
                  <td className="text-center py-3 border-b-[1px] border-[#00000015] text-sm sm:border-none">
                    <div className="text-[11.3px] text-left pl-10">
                      {cart.product.name}
                    </div>
                  </td>
                  <td className="text-center py-3 border-b-[1px] border-[#00000015] text-sm sm:border-none">
                    <div className="flex justify-center gap-7">
                      <div className="text-[16px] bg-[#f2f2f2] flex justify-center items-center w-[18px]  h-[18px] rounded-md">
                        +
                      </div>
                      <div className="text-[16px]">{cart.quantity}</div>
                      <div className="text-[16px] bg-[#f2f2f2] flex justify-center items-center w-[18px]  h-[18px] rounded-md">
                        -
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-3 border-b-[1px] border-[#00000015] text-sm sm:border-none">
                    {cart.pricePerUnit}
                  </td>
                  <td className="text-center py-3 border-b-[1px] border-[#00000015] text-sm sm:border-none">
                    {cart.totalPrice}
                  </td>
                  <td className="text-center py-3 border-b-[1px] border-[#00000015] text-sm sm:border-none">
                    <div className="flex justify-center items-center">
                      <button onClick={() => {
                        deleteOrderInCart(cart.product._id)
                      }} className="hover:bg-[#0000001e] rounded-md w-[30px] h-[30px] flex justify-center items-center">
                        <FaRegTrashCan />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-10 ml-20 bg-white w-[400px] p-5 rounded-md border-[1px]">
        <div className="text-[16px] border-b-[1px] pb-2 font-bold">Order Summary</div>
        <div className="flex w-[100%] mt-4 item-center justify-between py-3">
          <div className="text-[12.5px]">
            Sub Total
          </div>
          <div className="text-[12.5px]">
          10.0f
          </div>
        </div>
        <div className="flex w-[100%] item-center justify-between py-3">
          <div className="text-[12.5px]">
            Estimated shipping
          </div>
          <div className="text-[12.5px]">
            rom 0.0
          </div>
        </div>
        <div className="flex w-[100%] justify-between py-3">
          <div className="text-[12.5px]">
            Estimated total
          </div>
          <div className="text-[12.5px]">
            10.0
          </div>
        </div>
        <button className="bg-[#df7e0d] text-white hover:shadow-lg transition-all text-[13.3px] w-[100%] py-3 rounded-md shadow-md mt-3">
        CHECK OUT NOW
      </button>
      </div>
    
      <SnackBar
        severity={snackBarType}
        showSnackBar={showSnackBar}
        snackBarText={snackBarText}
        setShowSnackBar={setShowSnackBar}
      />
    </Wrapper>
  );
}

export default Cart;
