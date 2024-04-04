import React, { useEffect, useRef, useState } from "react";
import Wrapper from "../../assets/wrappers/AdminPanel";
import { MdAddToPhotos } from "react-icons/md";
import { FaSitemap } from "react-icons/fa6";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { getAllProduct } from "../../features/product/productSlice";
import { SnackBar } from "../../components";
import { useAppSelector } from "../../app/hook";

function ManageProduct() {
  const axiosPrivate = useAxiosPrivate();
  const productEndRef = useRef<null | HTMLDivElement>(null);
  const [allProduct, setAllProduct] = useState<
    | {
        _id: string;
        img: string;
        category: string;
        name: string;
        price: string;
        description: string;
      }[]
    | []
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage, setPostsPerPage] = useState<number>(10);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentProducts = allProduct.slice(indexOfFirstPost, indexOfLastPost);
  const getItemsInCart = async () => {
    try {
      const { data } = await axiosPrivate.get(`/product/`);
      console.log("data", data);
      setAllProduct(data);
    } catch (err) {
      console.log(err);
    }
  };
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    getItemsInCart();
  }, []);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    productEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [currentPage]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<"info" | "success" | "error">(
    "error"
  );

  const handleDelete = (id: string) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-confirm ",
        cancelButton: "btn btn-cancel",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        text: "You want to delete this product!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteProductById(id);
          return;
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          return;
        }
      });
  };
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
  const [snackBarText, setSnackBarText] = useState<string>("");
  const [snackBarType, setSnackBarType] = useState<
    "error" | "success" | "info" | "warning"
  >("error");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useAppSelector((state) => state.auth);
  const deleteProductById = async (productID: string) => {
    try {
      const { data } = await axiosPrivate.delete("/product/" + productID, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(data);
      setShowAlert(true);
      setAlertType("error");
      setAlertText("Deleted 1 record");
      setIsLoading(false);
      await getItemsInCart();
    } catch (err) {
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
            <MdAddToPhotos /> Add Product
          </button>
        </div>
      </div>
      <div className="bg-white m-12 w-[100%] h-[100%] shadow-md rounded-md p-12 ml-[22rem]">
        <div className="overflow-auto rounded-lg shadow block sm:shadow-none">
          <table className="w-full">
            <thead className="border-b-2 border-gray-200 sm:hidden bg-primary-900 text-white ">
              <tr>
                <th className=" w-[10%]  py-3 text-center text-sm font-semibold tracking-wide ">
                  #
                </th>
                <th className=" w-[10%]  py-3 text-center text-sm font-semibold tracking-wide ">
                  Product
                </th>
                <th className="w-[40%]  py-3 text-center text-sm font-semibold tracking-wide ">
                  Item name
                </th>
                <th className="w-[20%] py-3 text-center text-sm font-semibold tracking-wide ">
                  Category
                </th>
                <th className=" w-[10%]  py-3 text-center text-sm font-semibold tracking-wide ">
                  Price per unit
                </th>
                <th className=" w-[20%]  py-3 text-center text-sm font-semibold tracking-wide ">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {currentProducts.length > 0 &&
                currentProducts.map((product, index) => {
                  return (
                    <tr
                      key={index}
                      className="sm:flex sm:flex-col sm:my-5 sm:border-[1px] sm:rounded-lg sm:shadow-md overflow-hidden  sm:hover:bg-[#fff] transition ease-in delay-10"
                    >
                      <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                        {index + 1}
                      </td>
                      <td className="cursor-pointer p-3 text-sm text-[#878787] flex justify-center whitespace-nowrap text-center sm:text-start sm:bg-[#1966fb] sm:text-white">
                        <img
                          src={product?.img}
                          className="w-[80px] h-[80px] object-cover"
                        ></img>
                      </td>
                      <td className="p-[40px] text-[12px] text-[#878787] whitespace-nowrap text-left sm:text-start">
                        {product?.name}
                      </td>
                      <td className="p-3 text-[12px] text-[#878787] whitespace-nowrap text-center sm:text-start">
                        {product?.category}
                      </td>
                      <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                        {product?.price}
                      </td>
                      <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                        <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                          Action
                        </div>
                        <div className="flex justify-center sm:justify-start">
                          <button
                            onClick={() => {
                              navigate("/admin/product/" + product._id);
                            }}
                            className="mr-6 text-[#2E7D32]"
                          >
                            Edit
                          </button>
                          <button
                            className="text-[#dc3546]"
                            onClick={() => {
                              handleDelete(product?._id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="mb-10 mt-5">
          <Pagination
            id="pagination1"
            postsPerPage={postsPerPage}
            totalPosts={allProduct.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </Wrapper>
  );
}

export default ManageProduct;
