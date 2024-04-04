import Wrapper from "../../assets/wrappers/Register";
import { validate } from "email-validator";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import LandingWallpaper from "../Landing/LandingWallpaper";
import BigNavbar from "../Landing/BigNavbar";
import SmallNavbar from "../Landing/SmallNavbar";
import { FaChevronLeft } from "react-icons/fa6";
import OtpInput from "react-otp-input";
import api from "../../services/api";
import { Oval } from "react-loader-spinner";
import { FaLock } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Alert } from "@mui/material";
import { setCredential } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

function Register() {
  const navigate = useNavigate();
  const authStorage = useAppSelector((state) => state.auth);
  if (authStorage.user || authStorage.token) {
    navigate("/");
  }
  const dispatch = useAppDispatch();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"info" | "success" | "error">(
    "error"
  );

  const [alertText, setAlertText] = useState<string>("");
  // validated states
  const [lowerValidated, setLowerValidated] = useState(false);
  const [upperValidated, setUpperValidated] = useState(false);
  const [numberValidated, setNumberValidated] = useState(false);
  const [specialValidated, setSpecialValidated] = useState(false);
  const [lengthValidated, setLengthValidated] = useState(false);
  //
  const [email, setEmail] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isNavlinksOpen, setIsNavlinksOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isFormattEmailValid, setIsFormattEmailValid] =
    useState<boolean>(false);

  const handleOTPChange = (otp: string) => setOtp(otp);
  const [otp, setOtp] = useState<string>("");

  const sendEmailOTP = async () => {
    if (!email) {
      setShowAlert(true);
      setAlertText("Please provide an e-mail");
      setAlertType("error");
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await api.get(`/auth/send-otp/${email}`);
      console.log(data);
      setIsLoading(false);
      setStep(2);
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

  const verifyOTP = async () => {
    setIsLoading(true);
    if (!email) {
      return;
    }
    if (!otp) {
      return;
    }
    try {
      const { data } = await api.post(`/auth/verify/${email}`, {
        OTP: otp,
      });
      setToken(data?.token);
      console.log(data);
      setIsLoading(false);
      setStep(3);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const handeChangePasssword = (password: string) => {
    const lower = new RegExp("(?=.*[a-z])");
    const upper = new RegExp("(?=.*[A-Z])");
    const number = new RegExp("(?=.*[0-9])");
    const special = new RegExp("(?=.*[!@#$%^&*])");
    const length = new RegExp("(?=.{8,})");
    if (lower.test(password)) {
      setLowerValidated(true);
    } else {
      setLowerValidated(false);
    }
    if (upper.test(password)) {
      setUpperValidated(true);
    } else {
      setUpperValidated(false);
    }
    if (number.test(password)) {
      setNumberValidated(true);
    } else {
      setNumberValidated(false);
    }
    if (special.test(password)) {
      setSpecialValidated(true);
    } else {
      setSpecialValidated(false);
    }
    if (length.test(password)) {
      setLengthValidated(true);
    } else {
      setLengthValidated(false);
    }
    setPassword(password);
  };

  const setDefaultPassword = async () => {
    setIsLoading(true);
    if (!password || !confirmPassword) {
      setShowAlert(true);
      setAlertText("Please provide an e-mail");
      setAlertType("error");
      return;
    }
    if (password !== confirmPassword) {
      setShowAlert(true);
      setAlertText("Please provide an e-mail");
      setAlertType("error");
      return;
    }
    try {
      const { data } = await api.put(`/user/password/`, {
        token,
        password,
      });
      console.log(data);
      dispatch(setCredential({ user: data?.user, token: data?.accessToken }));
      setIsLoading(false);
      return
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      return
    }
  };

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
      console.log(data);
      dispatch(setCredential({ user: data?.user, token: data?.accessToken }));
      navigate("/");
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <BigNavbar />
      <SmallNavbar
        isDrawerOpen={isNavlinksOpen}
        setIsDrawerOpen={setIsNavlinksOpen}
      />

      <div className="flex flex-col justify-center items-center">
        {/* Login Form Start*/}
        {step === 1 && (
          <div className="bg-white w-[540px] sm:w-[95%] rounded-xl p-8 absolute z-[2] top-[10rem]">
            <div className="flex flex-col">
              <div className="font-[400] text-[27px] text-gray-800">
                Welcome to Ecommerce
              </div>
              <div className="font-[300] text-[13.3px] text-gray-500">
                provide your information for create account
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
            <button
              onClick={sendEmailOTP}
              disabled={isLoading || !email || !validate(email)}
              className="bg-primary-500 flex justify-center disabled:bg-gray-300 items-center text-sm text-white w-[100%] h-[42px] rounded-lg mb-4"
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
                "Continue"
              )}
            </button>
            <div className="w-[100%] flex justify-end mb-4">
              <div className="flex text-[10.8px]">
                Already is a member ?{" "}
                <Link
                  to="/login"
                  className="pl-1 text-primary-500 hover:text-primary-600"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="flex relative justify-center items-center mb-10 mt-9">
              <div className="absolute bg-white z-[2] px-2 rounded-[100%] text-gray-600 text-sm">
                Or Social Media
              </div>
              <div className="bg-gray-300 absolute w-[80%] h-[1px]"></div>
            </div>
            <button className="border-[1px] h-[42px] mb-5 w-[100%] border-gray-300 rounded-lg flex items-center justify-center">
              <FcGoogle className="text-[23px]" />
              <div className="text-[12.8px] ml-2 ">Sign in with Google</div>
            </button>
            <div className="text-[12px]">
              registration of ecommerce you are considered{" "}
              <a className="text-primary-500 underline mr-2">
                Term and Condition
              </a>
              and <a className="text-primary-500 underline">Privacy Policy</a>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="bg-white w-[540px] sm:w-[95%] rounded-xl p-8 absolute z-[2] top-[10.5rem]">
            <button
              onClick={() => {
                setStep(1);
              }}
              className="text-gray-400 text-sm"
            >
              <FaChevronLeft />
            </button>
            <div className="flex flex-col">
              <div className="font-[400] text-[27px] text-gray-800 mt-5">
                Enter verification code
              </div>
              <div className="font-[300] text-[13.3px] text-gray-500">
                provide a password that was sent in e-mail
              </div>
            </div>
            <div className="text-primary-500 text-[13px] mt-2">{email}</div>
            <div className="w-[100%] flex justify-center items-center mt-7 mb-6">
              <OtpInput
                value={otp}
                onChange={handleOTPChange}
                numInputs={6}
                inputType="tel"
                containerStyle={{
                  width: "90%",
                  display: "flex",
                  gridGap: "8px",
                  justifyContent: "center",
                }}
                renderSeparator={<span></span>}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  width: "40px",
                  marginBottom: "10px",
                  height: "30px",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  backgroundColor: "transparent",
                  outline: "none",
                  borderBottom: "1px solid #db26359e ",
                }}
              />
            </div>
            <button
              disabled={isLoading || !otp || otp.length < 6}
              onClick={() => {
                verifyOTP();
              }}
              className="bg-primary-500 disabled:bg-gray-300 flex justify-center items-center text-sm text-white w-[100%] h-[42px] rounded-lg mb-6"
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
                "Submit"
              )}
            </button>
            <div className="text-[11.7px] text-center">
              Have not received your Password ?
              <button className="ml-3 text-primary-500"> Resend Again</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="bg-white w-[540px] sm:w-[95%] rounded-xl p-8 absolute z-[2] top-[8.5rem]">
            <button
              onClick={() => {
                setStep(2);
              }}
              className="text-gray-400 text-sm"
            >
              <FaChevronLeft />
            </button>
            <div className="flex flex-col">
              <div className="font-[400] text-[27px] text-gray-800 mt-5">
                Set Password
              </div>
              <div className="font-[300] text-[13.3px] text-gray-500">
                Set your password according with the conditions
              </div>
            </div>

            <div className="w-[100%] flex justify-center gap-5 sm:flex-col items-center mt-4 mb-1">
              <div className="relative mb-7 mt-6 sm:mb-0 sm:mt-0 sm:w-[100%]">
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
                  type="text"
                  id="input-group-1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 outline-1 text-[13px] focus:outline-primary-300 focus:outline-[1px] rounded-lg  block w-full ps-10 p-2.5 "
                  placeholder="password"
                  value={password}
                  name="password"
                  maxLength={25}
                  onChange={(e) => {
                    handeChangePasssword(e.target.value);
                  }}
                ></input>
                {/* <div className="absolute text-red-500 text-[11.4px] bottom-[-1.3rem]">
                * please provide your e-mail
              </div> */}
              </div>
              <div className="relative mb-7 mt-6 sm:mb-0 sm:mt-0 sm:w-[100%]">
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
                  type="text"
                  id="input-group-1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 outline-1 text-[13px] focus:outline-primary-300 focus:outline-[1px] rounded-lg  block w-full ps-10 p-2.5 "
                  placeholder="confirm password"
                  value={confirmPassword}
                  name="confirm_password"
                  maxLength={25}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                ></input>
                {/* <div className="absolute text-red-500 text-[11.4px] bottom-[-1.3rem]">
                * please provide your e-mail
              </div> */}
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-7 mt-5">
              <div className="flex text-[11.3px] text-gray-500 pl-3 items-center gap-4">
                <IoIosCheckmarkCircle
                  className={`text-[16px] ${
                    lowerValidated ? "text-primary-500" : "text-gray-400"
                  }`}
                />{" "}
                At least one lowercase letter
              </div>
              <div className="flex text-[11.3px] text-gray-500 pl-3 items-center gap-4">
                <IoIosCheckmarkCircle
                  className={`text-[16px] ${
                    upperValidated ? "text-primary-500" : "text-gray-400"
                  }`}
                />{" "}
                At least one uppercase letter
              </div>
              <div className="flex text-[11.3px] text-gray-500 pl-3 items-center gap-4">
                <IoIosCheckmarkCircle
                  className={`text-[16px] ${
                    numberValidated ? "text-primary-500" : "text-gray-400"
                  }`}
                />{" "}
                At least one number
              </div>
              <div className="flex text-[11.3px] text-gray-500 pl-3 items-center gap-4">
                <IoIosCheckmarkCircle
                  className={`text-[16px] ${
                    specialValidated ? "text-primary-500" : "text-gray-400"
                  }`}
                />{" "}
                At least one special character
              </div>
              <div className="flex text-[11.3px] text-gray-500 pl-3 items-center gap-4">
                <IoIosCheckmarkCircle
                  className={`text-[16px] ${
                    lengthValidated ? "text-primary-500" : "text-gray-400"
                  }`}
                />{" "}
                At least 8 characters
              </div>
            </div>
            <button
              disabled={
                isLoading ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword ||
                !lowerValidated ||
                !upperValidated ||
                !numberValidated ||
                !specialValidated ||
                !lengthValidated
              }
              onClick={setDefaultPassword}
              className="bg-primary-500 flex disabled:bg-gray-300 justify-center items-center text-sm text-white w-[100%] h-[42px] rounded-lg mb-6"
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
                "Submit"
              )}
            </button>

            <div className="text-[11.7px] text-center">
              Have not received your Password ?
              <button className="ml-3 text-primary-500"> Resend Agian</button>
            </div>
          </div>
        )}
      </div>
      <LandingWallpaper />
    </Wrapper>
  );
}

export default Register;
