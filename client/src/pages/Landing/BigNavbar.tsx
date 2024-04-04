import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hook";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function BigNavbar() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState<{ profileURL: string } | null>({
    profileURL: "",
  });
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
  useEffect(() => {
    if (user) {
      getUserInfo();
    }
  }, []);
  return (
    <div className="flex w-[100%] z-[1] justify-center py-6 sm:hidden ">
      <div className="w-[75%] flex justify-between items-center md:w-[82%]">
        <div className="text-white text-[25px] font-[500]"></div>
        <div className="flex items-center gap-28 text-white md:gap-16 select-none">
          <div className="text-[13.5px] cursor-pointer">Home</div>
          <div className="text-[13.5px] cursor-pointer">About</div>
          <div className="text-[13.5px] cursor-pointer">Contract</div>
          {user ? (
            <div className="w-[40px] h-[40px]">
              <img
                src={userInfo?.profileURL}
                className="object-cover rounded-lg"
              ></img>
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
