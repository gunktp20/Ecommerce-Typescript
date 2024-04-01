import Wrapper from "../../assets/wrappers/Register";
import { validate } from "email-validator";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import LandingWallpaper from "../Landing/LandingWallpaper";
import BigNavbar from "../Landing/BigNavbar";
import SmallNavbar from "../Landing/SmallNavbar";
import api from "../../services/api";
import { Oval } from "react-loader-spinner";
import { Alert } from "@mui/material";
import { setCredential } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { Link, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { AxiosError } from "axios";
import LoginWithGoogleModal from "../../components/LoginWithGoogleModal";
import { gapi } from "gapi-script";
import { useGoogleLogin } from "react-google-login";

function SetUpUser() {
  const navigate = useNavigate();
  const authStorage = useAppSelector(state => state.auth)
  if (authStorage.user || authStorage.token) {
    navigate("/")
  }
  const dispatch = useAppDispatch();

  const onSuccess = async (res) => {
    console.log("LOGIN SUCCESS ! Current user:", res.profileObj);
    console.log("res_tokenObj", res.tokenObj);
    try {
      const { data } = await api.post(`/auth/google-auth/`, {
        tokens: { ...res.tokenObj },
      });
      setIsLoading(false);
      dispatch(setCredential({ user: data?.user, token: data?.accessToken }));
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const msg =
          typeof err?.response?.data?.msg === "object"
            ? err?.response?.data?.msg[0]
            : err?.response?.data?.msg;
        setShowAlert(true);
        setAlertType("error");
        setAlertText(msg);
        setIsLoading(false);
        return;
      }
    }
  };
  const onFailure = (res) => {
    console.log("LOGIN FAILED! res:", res);
  };

  const clientId = "58393219866-rgf9c2p16vop971javfn875ehtigi20k.apps.googleusercontent.com";
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"info" | "success" | "error">(
    "error"
  );
  const { signIn, loaded } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    cookiePolicy: "single_host_origin",
    isSignedIn: false,
  })


  // function navigateCB(url: string) {
  //   // window.location.href = url;
  //   window.open(url);
  // }

  function start() {
    gapi.client.init({
      clientId: clientId,
      scope: "",
    });
  }

  useEffect(() => {
    // if (authStorage.user) {
    //   setTimeout(() => {
    //     navigate("/");
    //   });
    // }

    gapi.load("client:auth2", start);
  }, []);

  const [alertText, setAlertText] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [isNavlinksOpen, setIsNavlinksOpen] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isFormattEmailValid, setIsFormattEmailValid] =
    useState<boolean>(false);

  const login = async () => {
    if (!email || !password) {
      setShowAlert(true);
      setAlertText("Please provide an e-mail");
      setAlertType("error");
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await api.post(`/auth/login/`, {
        email,
        password,
      });
      dispatch(setCredential({ user: data?.user, token: data?.accessToken }));
      setIsLoading(false);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const msg =
          typeof err?.response?.data?.msg === "object"
            ? err?.response?.data?.msg[0]
            : err?.response?.data?.msg;
        setShowAlert(true);
        setAlertType("error");
        setAlertText(msg);
        setIsLoading(false);
        return;
      }
    }
  };

  // const loginWithGoogle = async () => {
  //   try {
  //     const { data } = await api.post(`/auth/google-auth/`);
  //     console.log(data);
  //     setIsLoading(false);
  //     navigateCB(data.url);
  //   } catch (err) {
  //     console.log(err);
  //     setIsLoading(false);
  //   }
  // };


  return (
    <Wrapper>
      <BigNavbar />
      <SmallNavbar
        isDrawerOpen={isNavlinksOpen}
        setIsDrawerOpen={setIsNavlinksOpen}
      />

      <div className="flex flex-col justify-center items-center">
        {/* Login Form Start*/}
        <div className="bg-white w-[540px] sm:w-[95%] rounded-xl p-8 absolute z-[2] top-[7.5rem]">
          <div className="flex flex-col">
            <div className="font-[400] text-[27px] text-gray-800">
              Welcome back
            </div>
            {/* <LoginWithGoogleModal setShowAlert={setShowAlert} setAlertText={setAlertText} setAlertType={setAlertType} /> */}
            <div className="font-[300] text-[13.3px] text-gray-500">
              Log in to the member side for tracking your status of orders
            </div>
          </div>
          {showAlert && alertType && (
            <div className="">
              <Alert
                severity={alertType}
                sx={{
                  fontSize: "11.8px",
                  alignItems: "center",
                  marginTop: "2rem",
                  marginBottom: "2rem",
                }}
              >
                {alertText}
              </Alert>
            </div>
          )}
          <div className="relative mb-8 mt-6">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 16"
              >
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
              </svg>
            </div>
            <input
              type="text"
              id="input-group-1"
              className="bg-gray-50 border border-gray-300 text-gray-900 outline-1 text-[13px] focus:outline-primary-300 focus:outline-[1px] rounded-lg  block w-full ps-10 p-2.5 "
              placeholder="ecommerce.co@gmail.com"
              value={email}
              name="email"
              onChange={(e) => {
                if (validate(e.target.value)) {
                  setIsFormattEmailValid(true);
                } else {
                  setIsFormattEmailValid(false);
                }
                setEmail(e.target.value);
              }}
            ></input>
            <div className="absolute text-red-500 text-[11.4px] bottom-[-1.3rem]">
              {isFormattEmailValid ? "" : "* please provide a valid e-mail"}
            </div>
          </div>
          <div className="relative mt-6 mb-4  items-center flex">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 16"
              >
                <FaLock />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="input-group-1"
              className="bg-gray-50 border border-gray-300 text-gray-900 outline-1 text-[13px] focus:outline-primary-300 focus:outline-[1px] rounded-lg  block w-full ps-10 p-2.5 "
              placeholder="password"
              value={password}
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
            <button
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              className="cursor-pointer hover:text-primary-200 absolute right-3 text-gray-500 text-[17px]"
            >
              {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
            </button>

            {/* <div className="absolute text-red-500 text-[11.4px] bottom-[-1.3rem]">
                {isFormattEmailValid ? "" : "* please provide a valid e-mail"}
              </div> */}

          </div>
          <div className="flex w-[100%] justify-end mb-3">
            <Link to="/forget-pass" className="text-[10.5px] font-bold text-primary-600 hover:text-primary-700">Forget Password ?</Link>
          </div>
          <button
            onClick={login}
            disabled={isLoading || !email || !password || !validate(email)}
            className="bg-primary-500 flex justify-center disabled:bg-gray-300 items-center text-sm text-white w-[100%] h-[42px] rounded-lg mb-3"
          >
            {isLoading ? (
              <Oval
                visible={true}
                height="30px"
                width="30px"
                color="#7a7a7a96"
                secondaryColor="#7a7a7a96"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                strokeWidthSecondary={3}
                strokeWidth={3}
                wrapperClass=""
              />
            ) : (
              "Sign In"
            )}
          </button>
          <div className="flex item w-[100%] justify-end mb-6" >
            <div className="text-[10.8px]">Not a member yet ? <Link to="/register" className="text-primary-600 hover:text-primary-600">Sign Up</Link></div>
          </div>
          <div className="flex relative justify-center items-center mb-10 mt-9">
            <div className="absolute bg-white z-[2] px-2 rounded-[100%] text-gray-600 text-sm">
              OR
            </div>
            <div className="bg-gray-300 absolute w-[80%] h-[1px]"></div>
          </div>
          <button
            onClick={signIn}
            className="border-[1px] h-[42px] mb-5 w-[100%] border-gray-300 rounded-lg flex items-center justify-center"
          >
            <FcGoogle className="text-[23px]" />
            <div className="text-[12.8px] ml-2 ">Sign in with Google</div>
          </button>
          {/* <div className="text-[12px]">
              registration of ecommerce you are considered{" "}
              <a className="text-primary-500 underline mr-2">
                Term and Condition
              </a>
              and <a className="text-primary-500 underline">Privacy Policy</a>
            </div> */}
        </div>
      </div>
      <LandingWallpaper />
    </Wrapper>
  );
}

export default SetUpUser;
