import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { NavLink } from "react-router-dom";
import { RiMenu3Line } from "react-icons/ri";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { LuUserCheck2 } from "react-icons/lu";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<JSX.Element>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface INavDialog {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (active: boolean) => void;
}

export default function SmallNavbar(props: INavDialog) {
  const { isDrawerOpen, setIsDrawerOpen } = props;

  const handleClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="">
      <button
        onClick={() => {
          setIsDrawerOpen(!isDrawerOpen);
        }}
        className="hidden sm:flex z-[2] absolute top-0  w-[100%] justify-end pr-7 pt-5 text-white text-2xl "
      >
        <RiMenu3Line />
      </button>
      <Dialog
        open={isDrawerOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        className=" hidden sm:block"
        fullScreen
        sx={{ height: "max-content" }}
        id="small-navbar-dialog"
      >
        <DialogContent className="bg-[#3f3f3f]">
          <DialogContentText
            className="relative"
            component={"div"}
            variant={"body2"}
          >
            {/* <div
              onClick={handleClose}
              className="cursor-pointer absolute top-2 right-3 text-[21px]"
              id="close-navlink-dialog"
            >
              X
            </div> */}
            <NavLink
              to="/"
              key={1}
              id="overview-navlink-dialog"
              onClick={() => {}}
              className={({ isActive }) =>
                `flex pl-10 p-5 items-center text-[14px] text-gray-300 rounded-lg ${
                  isActive ? "bg-[#303030]" : "bg-none"
                }`
              }
            >
              <IoHomeOutline className="mr-3 text-[16px]" />
              Home
            </NavLink>

            <NavLink
              to="/dashboard-list"
              key={2}
              id="dashboard-navlink-dialog"
              onClick={() => {}}
              className={({ isActive }) =>
                `flex pl-10 p-5 items-center text-[14px] text-gray-300 rounded-lg ${
                  isActive ? "bg-[#303030]" : "bg-none"
                }`
              }
            >
              <IoMdInformationCircleOutline className="mr-3 text-[16px]" />
              About
            </NavLink>

            <NavLink
              to="/device-list"
              key={3}
              id="device-navlink-dialog"
              onClick={() => {}}
              className={({ isActive }) =>
                `flex pl-10 p-5 items-center text-[14px] text-gray-300 rounded-lg ${
                  isActive ? "bg-[#303030]" : "bg-none"
                }`
              }
            >
              <IoChatbubbleEllipsesOutline className="mr-3 text-[16px]" />
              Contract
            </NavLink>
            <NavLink
              to="/login"
              key={4}
              id="device-navlink-dialog"
              onClick={() => {}}
              className={({ isActive }) =>
                `flex pl-10 p-5 items-center text-[14px] text-gray-300 rounded-lg ${
                  isActive ? "bg-[#303030]" : "bg-none"
                }`
              }
            >
              <LuUserCheck2 className="mr-3 text-[16px]" />
              Sign In / Sign Up
            </NavLink>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
