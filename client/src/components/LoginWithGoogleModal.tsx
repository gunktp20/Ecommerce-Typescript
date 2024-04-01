import { GoogleLogin, useGoogleLogin } from "react-google-login";
import api from "../services/api";
import { AxiosError } from "axios";
import { setCredential } from "../features/auth/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hook";

interface IProps {
  setShowAlert: (_: boolean) => void
  setAlertText: (_: string) => void
  setAlertType: (_: "error" | "success" | "info") => void
}

function LoginWithGoogle({ setShowAlert, setAlertText, setAlertType }: IProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const clientId =
    "58393219866-rgf9c2p16vop971javfn875ehtigi20k.apps.googleusercontent.com";
  const onSuccess = async (res) => {
    console.log("LOGIN SUCCESS ! Current user:", res.profileObj);
    console.log("res_tokenObj", res.tokenObj);
    try {
      const { data } = await api.post(`/auth/google-auth/`, {
        tokens: { ...res.tokenObj },
      });
      console.log(data)
      console.log("TRYING....... GET ACCESS TOKEN")
      setShowAlert(true);
      setAlertType("success");
      setAlertText("Logged In");
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

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Sign in with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={"single_host_origin"}
      isSignedIn={false}
      style={{
        borderRadius: "20px",
      }}
      className="w-[100%] flex justify-center items-center"
    >
      <div>d</div>
    </GoogleLogin>
  );
}

export default LoginWithGoogle;
