import React, { useEffect, useState } from "react";
import Wrapper from "../../assets/wrappers/AdminPanel";
import { MdAddToPhotos } from "react-icons/md";
import { FaSitemap } from "react-icons/fa6";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import FormRow from "./FormRow";
import { RiMenu2Fill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import FormSelect from "./FormSelect";
import axios, { AxiosError } from "axios";
import { SnackBar } from "../../components";
import { useAppSelector } from "../../app/hook";

function EditProduct() {
  const { productID } = useParams();
  const categoryList = [
    `ตู้เก็บของ`,
    `ชุดห้องนอน`,
    `เฟอร์นิเจอร์`,
    `ของตกเเต่งบ้าน`,
    `โคมไฟเเละหลอดไฟ`,
    `อุปกรณ์เครื่องครัว`,
    `สินค้าสำหรับห้องน้ำ`,
    `อุปกรณ์ซักรีดเเละทำความสะอาด`,
  ];
  interface IValue {
    _id?: string;
    img: string;
    name: string;
    price: number;
    description: string;
    category: string;
  }
  const axiosPrivate = useAxiosPrivate();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<"info" | "success" | "error">(
    "error"
  );
  const [values, setValues] = useState<IValue>({
    name: "",
    img: "",
    description: "",
    price: 0,
    category: "",
  });

  const [category, setCategory] = useState<string>("เฟอร์นิเจอร์");
  const getProductInfo = async () => {
    try {
      const { data } = await axiosPrivate.get(
        `http://localhost:5000/product/${productID}`
      );
      setValues(data);
      return;
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof AxiosError) {
        const msg =
          typeof err?.response?.data?.message === "object"
            ? err?.response?.data?.message[0]
            : err?.response?.data?.message;
        setShowAlert(true);
        setAlertType("error");
        setAlertText(msg);
        setIsLoading(false);
        return;
      }
    }
  };

  useEffect(() => {
    getProductInfo();
  }, []);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    const { name, description, img, price } = values;
    if (!name || !description || !category || !img || !price) {
      setShowAlert(true);
      setAlertType("error");
      setAlertText("Please provide all value");
      return;
    }
    await updateProduct({ ...values, category: category });
  };

  const { token } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updateProduct = async (productInfo: IValue) => {
    setIsLoading(true);
    try {
      const { data } = await axios.put(
        `http://localhost:5000/product/${productInfo?._id}`,
        productInfo,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(data);
      setShowAlert(true);
      setAlertType("success");
      setAlertText("Updated your product already");
      setIsLoading(false);
      return;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const msg =
          typeof err?.response?.data?.message === "object"
            ? err?.response?.data?.message[0]
            : err?.response?.data?.message;
        setShowAlert(true);
        setAlertType("error");
        setAlertText(msg);
        setIsLoading(false);
        return;
      }
    }
  };

  return (
    <Wrapper>
      {showAlert && (
        <div id="add-device-snackbar" className="block sm:hidden">
          <SnackBar
            severity={alertType}
            showSnackBar={showAlert}
            snackBarText={alertText}
            setShowSnackBar={setShowAlert}
          />
        </div>
      )}
      <div className="bg-white shadow-md h-[100vh] px-5 w-[300px] fixed left-0 top-0 mr-5">
        <div className="px-12 py-3 font-bold text-[20px] mb-5 pt-5 text-center">
          Admin
        </div>
        <div className="pl-5 flex flex-col gap-8 border-b-[1px] pb-5 border-[#e0e0e0]">
          <button
            onClick={() => {
              navigate("/admin");
            }}
            className="text-[12.6px] text-[#000000a9] flex gap-3 hover:text-primary-500"
          >
            <FaSitemap />
            Manage Product
          </button>
          <button
            onClick={() => {
              navigate("/admin/add-product");
            }}
            className="text-[12.6px] text-[#000000a9] flex gap-3 hover:text-primary-500"
          >
            <MdAddToPhotos /> Edit Product
          </button>
        </div>
      </div>
      <div className="bg-white m-12 w-[100%] h-[100%] shadow-md rounded-md p-12 ml-[22rem]">
        <div className="flex justify-between">
          <button
            onClick={() => {}}
            className="hidden p-1 w-fit h-fit relative sm:block text-[#8f8f8f] mb-6"
            id="small-open-sidebar-btn"
          >
            <RiMenu2Fill className="text-[23px]" />
          </button>
        </div>

        <div className="bg-white ">
          <div className=" w-[100%] flex flex-col">
            <div className="text-[18px] font-bold ">Edit Product</div>
          </div>
          <div className="flex gap-10 mt-9 sm:flex-col sm:gap-0">
            <div className="w-[100%]">
              <FormRow
                type="text"
                name="name"
                labelText="Product name"
                value={values.name}
                handleChange={handleChange}
                marginTop="mt-[0.2rem]"
              />
            </div>
            <div className="w-[100%]">
              <FormRow
                type="text"
                name="description"
                value={values.description}
                handleChange={handleChange}
                marginTop="mt-[0.2rem]"
              />
            </div>
          </div>
          <div className="flex gap-10 mt-1 sm:flex-col sm:gap-0">
            <div className="w-[100%]">
              <FormRow
                type="number"
                name="price"
                value={values.price}
                handleChange={handleChange}
                marginTop="mt-[0.2rem]"
              />
            </div>
            <div className="w-[100%]">
              <FormSelect
                name="Qos"
                labelText="Category"
                options={categoryList}
                setValue={setCategory}
                value={category}
                marginTop="mt-[0.2rem]"
              />
            </div>
          </div>
          <div className="flex gap-10 mt-1 sm:flex-col sm:gap-0">
            <div className="w-[400px]">
              <FormRow
                type="text"
                name="img"
                value={values.img}
                labelText="product image"
                handleChange={handleChange}
                marginTop="mt-[0.2rem]"
              />
            </div>
          </div>

          <button
            onClick={onSubmit}
            className="w-[360px] py-2 rounded-md sm:w-[100%] bg-primary-500 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </Wrapper>
  );
}

export default EditProduct;
