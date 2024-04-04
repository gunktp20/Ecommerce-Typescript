import Wrapper from "../assets/wrappers/AdminPanel";
import { MdAddToPhotos } from "react-icons/md";
import { FaSitemap } from "react-icons/fa6";

function AdminPanel() {
  return (
    <Wrapper>
      <div className="bg-white shadow-md h-[100vh] px-5 w-[300px]">
        <div className="px-12 py-3 font-bold text-[20px] mb-5 pt-5 text-center">
          Admin
        </div>
        <div className="pl-5 flex flex-col gap-8 border-b-[1px] pb-5 border-[#e0e0e0]">
          <button
            onClick={() => {}}
            className="text-[12.6px] text-[#000000a9] flex gap-3 hover:text-primary-500"
          >
            <FaSitemap />
            Manage Product
          </button>
          <button
            onClick={() => {}}
            className="text-[12.6px] text-[#000000a9] flex gap-3 hover:text-primary-500"
          >
            <MdAddToPhotos /> Add Product
          </button>
        </div>
      </div>
      <div className="bg-white m-8 w-[100%] h-[100%] shadow-md rounded-md p-7">
        <div>Dashboard</div>
      </div>
    </Wrapper>
  );
}

export default AdminPanel;
