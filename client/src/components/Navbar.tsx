import { IoPerson } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hook";
import { BsCart4 } from "react-icons/bs";
import axios from "axios";
import { useEffect, useState } from "react";

function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [carts, setCarts] = useState<[]>([]);
 

  const fetchAllCarts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/cart/${user.email}`
      );
      console.log(data);
      setCarts(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAllCarts();
  }, []);

  return (
    <div className="flex items-center pt-1 pb-1 pl-[10%] pr-[10%] sm:pl-0 sm:pr-0 bg-[#fff]">
      <div className="w-[100%] flex justify-between items-center">
        <div className="flex items-center">
          <a className="btn btn-ghost text-xl">MAT</a>
          <input
            className="bg-[#f1f1f1] rounded-[100px] w-[250px] h-[33px] text-[11px] pl-5 sm:w-[200px] sm:h-[35px] sm:text-[11.3px] items-center"
            placeholder="คุณต้องการค้นหาสิ่งใด"
          ></input>
        </div>

        <div className="flex gap-7 items-center">
          <div
            onClick={() => {
              navigate("/cart");
            }}
            className="relative"
          >
            <BsCart4 className="text-[26px] cursor-pointer" />
            <div
              className={`${
                carts.length > 0 ? "flex" : "hidden"
              } bg-[#df7e0d] rounded-[100%] text-white text-center absolute cursor-pointer top-[-3px] right-[-10px] w-[20px] h-[20px] text-[11px] p-1 flex items-center justify-center`}
            >
              {carts.length}
            </div>
          </div>
          {user ? (
            <div className="flex items-center gap-2 text-sm">
              {user.name}{" "}
              <img
                src={user.profileURL}
                className="object-fit rounded-[100%] w-[35px] h-[35px] cursor-pointer"
              ></img>
            </div>
          ) : (
            <Link to="/login" className="flex gap-3 text-[12px] items-center">
              <IoPerson className="text-[20px]" /> เข้าสู่ระบบ / สมัครสมาชิก
            </Link>
          )}
        </div>

        {/* <div
            className="text-[26px] relative"
            onClick={() => {
              navigate("/cart");
            }}
          >
            <BsCart4 />
            <div className="bg-[#df7e0d] right-[-11px] top-[-5px] absolute w-[5px] h-[5px] rounded-[100%] flex items-center justify-center p-[10px] text-white text-[11.6px]">
              1
            </div>
          </div>
          {user ? (
            <div className="">
              {user.name}{" "}
              <img
                src={user.photoURL}
                className="object-fit rounded-[100%] w-[35px] h-[35px]"
              ></img>
            </div>
          ) : (
            <Link to="/login">
              <IoPerson className="text-[20px]" /> เข้าสู่ระบบ / สมัครสมาชิก
            </Link>
          )} */}

        {/* <div
                className="text-[26px] relative"
                onClick={() => {
                  navigate("/cart");
                }}
              >
                <BsCart4 />
                <div className="bg-[#df7e0d] right-[1px] top-[3px] absolute w-[5px] h-[5px] rounded-[100%] flex items-center justify-center p-[10px] text-white text-[11.6px]">
                  1
                </div>
              </div>
              {user ? (
                <div className="">
                  {user.name}{" "}
                  <img
                    src={user.photoURL}
                    className="object-fit rounded-[100%] w-[35px] h-[35px]"
                  ></img>
                </div>
              ) : (
                <Link to="/login">
                  <IoPerson className="text-[20px]" /> เข้าสู่ระบบ / สมัครสมาชิก
                </Link>
              )} */}
      </div>
    </div>
  );
}

export default Navbar;
