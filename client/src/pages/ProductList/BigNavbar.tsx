import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hook";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { IoPersonCircle } from "react-icons/io5";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import Cart from "../../components/FlyoutLink";

function BigNavbar({ setSearch , search}: { setSearch: (_: string) => void ; search:string}) {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState<{ profileURL: string } | null>({
    profileURL: "",
  }); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();

  const getUserInfo = async () => {
    try {
      const { data } = await axiosPrivate.get(`/user/info`);
      console.log(data);
      setUserInfo(data?.userInfo);
    } catch (err) {
      console.log(err);
    }
  };
  const [carts, setCarts] = useState<[]>([]);
  const getItemsInCart = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/cart/${user.email}`);
      console.log(data);
      setCarts(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getUserInfo();
      getItemsInCart();
    }
  }, []);
  return (
    <div className="flex w-[100%] z-[1] justify-center py-4 sm:hidden mt-3">
      <div className="w-[75%] flex  justify-between items-center md:w-[82%] ">
        <div className="flex w-[70%]">
          <div className="bg-white border-[1px] border-[#0000009d] hover:border-primary-300 items-center px-2 flex py-3 rounded-[100px]">
            <FaSearch className="text-gray-800 mr-2 ml-2" />
            <input
              className=" focus:outline-none text-[12.4px] w-[300px] pl-3 "
              placeholder="Find what you looking for"
              value={search}
              onChange={(e)=>{
                setSearch(e.target.value)
              }}
            ></input>
            <button className=" border-l-[1px] flex text-[12.4px] text-gray-700 pl-4 ml-3 items-center border-l-gray-400">
              Category <MdOutlineArrowDropDown />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-40 text-gray-900 md:gap-16 select-none">
          {user ? (
            <div className="w-max flex gap-16 items-center">
              <Cart />
              <div>
                {userInfo?.profileURL ? (
                  <img
                    src={userInfo?.profileURL}
                    className="w-[38px] h-[38px] object-cover rounded-lg"
                  ></img>
                ) : (
                  <IoPersonCircle className="w-[38px] h-[38px] object-cover rounded-lg" />
                )}
              </div>
            </div>
          ) : (
            <div className="text-white text-[14.5px] flex items-center h-[42px] px-10">
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className="border-r-[1px] text-white border-r-gray-300 pr-4 mr-4"
              >
                Sign In
              </button>{" "}
              <button
                onClick={() => {
                  navigate("/register");
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BigNavbar;
