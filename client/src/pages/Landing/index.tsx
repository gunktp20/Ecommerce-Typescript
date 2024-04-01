import { useState } from "react";
import Wrapper from "../../assets/wrappers/Landing";
import BigNavbar from "./BigNavbar";
import LandingWallpaper from "./LandingWallpaper";
import SmallNavbar from "./SmallNavbar";

function Landing() {

  const [isNavlinksOpen, setIsNavlinksOpen] = useState<boolean>(false);

  return (
    <Wrapper>
      <BigNavbar/>

      <SmallNavbar
        isDrawerOpen={isNavlinksOpen}
        setIsDrawerOpen={setIsNavlinksOpen}
      />
      <div className="z-[1] w-[100%] flex justify-center mt-[12rem] sm:mt-[12.3rem]">
        <div className="w-[80%] flex justify-center flex-col items-center z-[1]">
          <div className="text-[45px] text-white select-none">
            {" "}
            Discover Awesome Funiture
          </div>
          <div className="w-[570px] text-gray-200 mt-3 font-thin text-sm sm:w-[98%] select-none">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
            perferendis excepturi velit impedit neque obcaecati facilis
            molestiae doloribus consequatur nemo.
          </div>
          <button className=" mt-6 py-4 px-9 rounded-[100px] bg-[#DB2636] hover:bg-[#B71A2A] transition-all font-normal text-left text-white">
            LET'S START
          </button>
        </div>
      </div>

      <LandingWallpaper />
      {/* <div className="h-[200px] justify-center flex z-[3]">
        <div className="w-[80%] flex justify-center flex-col items-center ">
          <div className="text-[45px] text-white">
            {" "}
            Discover Awesome Funiture
          </div>
          <div className="w-[570px] text-gray-200 mt-3 font-thin text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
            perferendis excepturi velit impedit neque obcaecati facilis
            molestiae doloribus consequatur nemo.
          </div>
            <button className=" mt-6 py-4 px-9 rounded-[100px] bg-[#DB2636] hover:bg-[#B71A2A] transition-all font-normal text-left text-white">
              LET'S START
            </button>
        </div>
      </div>
      <div className="w-[100%] absolute top-0 h-[100%]">
        <div className="bg-[#0000009d] absolute w-[100%] h-[100%] z-[1]"></div>
        <img
          src={Wallpaper2}
          className="object-cover absolute  w-[100%] h-[100%] object-right-bottom"
        ></img>
      </div>  */}
    </Wrapper>
  );
}

export default Landing;
