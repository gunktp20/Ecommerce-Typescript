import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GrShop } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hook";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useUserInfo from "../hooks/useUserInfo";
import { MdOutlineDelete } from "react-icons/md";

const useItemsInCart = () => {
  const [itemsInCart, setItemsInCart] = useState<
    { product: { img: string; price: number; description: string } }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const { userInfo } = useUserInfo();

  const getItemsInCart = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/cart/${userInfo?.email}`);
      console.log("data", data);
      setItemsInCart(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getItemsInCart();
  }, []);

  return { itemsInCart, setItemsInCart };
};

const Example = () => {
  const navigate = useNavigate();
  const { itemsInCart } = useItemsInCart();
  return (
    <div className="flex justify-center ">
      <FlyoutLink href="#" FlyoutContent={PricingContent}>
        <div
          onClick={() => {
            navigate("/cart");
          }}
          className="relative "
        >
          <GrShop className="text-[20px] cursor-pointer" />
          <div
            className={`${
              itemsInCart.length > 0 ? "flex" : "hidden"
            } bg-primary-500 rounded-[100%] text-white text-center absolute cursor-pointer top-[-3px] right-[-10px] w-[20px] h-[20px] text-[11px] p-1 flex items-center justify-center`}
          >
            {itemsInCart.length}
          </div>
        </div>
      </FlyoutLink>
    </div>
  );
};

const FlyoutLink = ({
  children,
  href,
  FlyoutContent,
}: {
  children: React.ReactNode;
  href: string;
  FlyoutContent?: React.ElementType;
}) => {
  const [open, setOpen] = useState(true);

  const showFlyout = FlyoutContent && open;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative w-fit h-fit "
    >
      <a href={href} className="relative text-black text-[13.5px]">
        {children}
        <span
          style={{
            transform: showFlyout ? "scaleX(1)" : "scaleX(0)",
          }}
          className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left scale-x-0 rounded-full bg-primary-300 transition-transform duration-300 ease-out"
        />
      </a>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{ translateX: "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-1/2 top-12 bg-white text-black left-[-10rem]"
          >
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
            <FlyoutContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PricingContent = () => {
  const axiosPrivate = useAxiosPrivate();
  const [itemsInCart, setItemsInCart] = useState<
    { product: { img: string; price: number; description: string } }[]
  >([]);
  const { user } = useAppSelector((state) => state.auth);
  
  const getItemsInCart = async () => {
    try {
      const { data } = await axiosPrivate.get(`/cart/${user?.email}`);
      console.log("data", data);
      setItemsInCart(data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteOrderInCart = async (productID: string) => {
    try {
      await axiosPrivate.delete(
        `http://localhost:5000/cart/${productID}/${user.email}`
      );
      getItemsInCart();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getItemsInCart();
  }, []);
  let totalPrice = 0;
  return (
    <div className="w-[450px] bg-white p-6 shadow-xl border-[1px] rounded-lg">
      {/* <div className="mb-3 space-y-3">
        <h3 className="font-semibold">For Individuals</h3>
        <a href="#" className="block text-sm hover:underline">
          Introduction
        </a>
        <a href="#" className="block text-sm hover:underline">
          Pay as you go
        </a>
      </div>
      <div className="mb-6 space-y-3">
        <h3 className="font-semibold">For Companies</h3>
        <a href="#" className="block text-sm hover:underline">
          Startups
        </a>
        <a href="#" className="block text-sm hover:underline">
          SMBs
        </a>
        <a href="#" className="block text-sm hover:underline">
          Enterprise
        </a>
      </div> */}
      <div className="flex justify-between items-center border-b-[1px] pb-2 mb-1">
        <div className="text-gray-900 text-[15px]">Your cart</div>
        <div className="text-lg">X</div>
      </div>
      <div></div>
      <div className=" overflow-y-auto h-[400px] pr-5">
        {itemsInCart.length > 0 &&
          itemsInCart?.map((item, index) => {
            totalPrice = totalPrice + item?.totalPrice;
            return (
              <div key={index} className="flex justify-between">
                <img
                  src={item?.product?.img}
                  className="w-[70px] h-[70px] object-cover"
                ></img>
                <div className="flex flex-col items-start justify-center ">
                  <div className="text-[11.5px] truncate w-[220px] mb-3 text-gray-800">
                    {item?.product?.name}
                  </div>
                  <div className="text-[11.5px] text-primary-700">
                    x{item?.quantity}
                  </div>
                </div>
                <div className="flex flex-col  items-end ml-3  justify-center">
                  <button
                    className="text-primary-700 mb-3"
                    onClick={() => {
                      deleteOrderInCart(item?.product?._id);
                    }}
                  >
                    <MdOutlineDelete />
                  </button>
                  <div className="text-[11.5px] text-primary-700">
                    {item?.totalPrice}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className=" border-t-[1px] pt-5 flex justify-between text-[12px] mt-10 ">
        <div>Subtotal</div>
        <div className=" text-primary-500">{totalPrice}</div>
      </div>
      <div className="mt-4 flex justify-between mb- text-[12px]">
        <div>Shipping</div>
        <div>FREE</div>
      </div>
      <div className="mt-4 flex justify-between mb- text-[12px] underline font-bold">
        <div>Add Promo Code</div>
        <div></div>
      </div>
      <div className="mt-5 flex justify-between mb-4 text-[12px]">
        <div>Estimated Total</div>
        <div className="text-primary-500 font-bold">{totalPrice}</div>
      </div>
      <button className="w-full text-sm border-[2px] rounded-md border-primary-700 px-4 py-2 text-primary-700 font-semibold transition-colors hover:bg-neutral-950 hover:text-white">
        Checkout
      </button>
    </div>
  );
};

export default Example;
