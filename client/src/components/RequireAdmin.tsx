import { Navigate, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hook";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "../pages/ProductList";

interface IProp {
  children: string | JSX.Element;
}

const RequireAdmin = ({ children }: IProp) => {
  const { token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const verifyIsAdmin = async () => {
    try {
      await axios.get(
        "http://localhost:5000/auth/checkIsAdmin",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return;
    } catch (err) {
      return navigate("/home");
    }
  };

  useEffect(() => {
    verifyIsAdmin();
  }, []);

  return children;
};

export default RequireAdmin;
