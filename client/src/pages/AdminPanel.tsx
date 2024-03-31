import Wrapper from "../assets/wrappers/AdminPanel"
import { BsCartCheckFill } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";
import { MdAddToPhotos } from "react-icons/md";
import { FaSitemap } from "react-icons/fa6";
import { FaUserCog } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { MdProductionQuantityLimits } from "react-icons/md";
import { MdSpatialTracking } from "react-icons/md";
import { MdOutlineContactSupport } from "react-icons/md";





function AdminPanel() {
    return (
        <Wrapper>
            <div className="bg-white shadow-md h-[100vh] px-5 w-[300px]">
                <div className="px-12 py-3 font-bold text-[20px] mb-5 pt-5 text-center">Admin</div>
                <div className="pl-5 flex flex-col gap-8 border-b-[1px] pb-5 border-[#e0e0e0]">
                    <div className="text-[12.6px] text-[#000000a9] flex gap-3"><MdDashboard/> Dashboard</div>
                    <div className="text-[12.6px] text-[#000000a9] flex gap-3"><BsCartCheckFill/> Manage Orders</div>
                    <div className="text-[12.6px] text-[#000000a9] flex gap-3"><MdAddToPhotos/> Add Product</div>
                    <div className="text-[12.6px] text-[#000000a9] flex gap-3"><FaSitemap/>Manage Item</div>
                    <div className="text-[12.6px] text-[#000000a9] flex gap-3"><FaUserCog/>All Users</div>
                </div>
                <div className="pl-5 flex flex-col gap-8 mt-7">
                    <div className="text-[12.6px] text-[#000000a9] flex gap-3"><FaHome/> Home</div>
                    <div className="text-[12.6px] text-[#000000a9] flex gap-3"><MdProductionQuantityLimits/>Product</div>
                    <div className="text-[12.6px] text-[#000000a9] flex gap-3"><MdSpatialTracking/> Order Tracking</div>
                    <div className="text-[12.6px] text-[#000000a9] flex gap-3"><MdOutlineContactSupport/> Customer Support</div>
                </div>
            </div>
            <div className="bg-white m-8 w-[100%] h-[100%] shadow-md rounded-md p-7">
                <div>Dashboard</div>
            </div>
        </Wrapper>
    )
}

export default AdminPanel
