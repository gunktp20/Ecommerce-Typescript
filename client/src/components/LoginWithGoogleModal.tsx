import { GoogleLogin } from "react-google-login";
import api from "../services/api";

function LoginWithGoogle() {
  const clientId =
    "58393219866-rgf9c2p16vop971javfn875ehtigi20k.apps.googleusercontent.com";
  const onSuccess = async (res) => {
    console.log("LOGIN SUCCESS ! Current user:", res.profileObj);
    console.log("res_tokenObj", res.tokenObj);
    try {
      const { data } = await api.post(`/auth/google-auth/`, {
        tokens: { ...res.tokenObj },
      });
      console.log(data);
      // navigateCB(data.url);
    } catch (err) {
      console.log(err);
      // setIsLoading(false);
    }
  };
  const onFailure = (res) => {
    console.log("LOGIN FAILED! res:", res);
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Sign in with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
        className="w-[100%] rounded-md flex justify-center items-center"
      />
    </div>
  );
}

export default LoginWithGoogle;
