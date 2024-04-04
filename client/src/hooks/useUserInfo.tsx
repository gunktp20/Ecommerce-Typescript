import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useUserInfo = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{
    email: string;
    profileURL: string;
  } | null>({
    email: "",
    profileURL: "",
  });
  const axiosPrivate = useAxiosPrivate();

  const getUserInfo = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/user/info`);
      console.log(data);
      setUserInfo(data?.userInfo);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return { userInfo, isLoading };
};

export default useUserInfo;
