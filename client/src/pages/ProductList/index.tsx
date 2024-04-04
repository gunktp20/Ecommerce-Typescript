import { useEffect, useRef, useState } from "react";
import Wrapper from "../../assets/wrappers/ProductList";
import BigNavbar from "./BigNavbar";
import SmallNavbar from "./SmallNavbar";
import { AxiosError } from "axios";
import { axiosPrivate } from "../../services/api";
import Slider from "react-slick";
import { Card, SnackBar } from "../../components";
import Pagination from "../../components/Pagination";
import { GrShop } from "react-icons/gr";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { getAllProduct } from "../../features/product/productSlice";

function ProductList() {
  const [isNavlinksOpen, setIsNavlinksOpen] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<"info" | "success" | "error">(
    "error"
  );
  const { productList } = useAppSelector((state) => state.product);
  const { user } = useAppSelector((state) => state.auth);

  const [timeoutIds, setTimeoutIds] = useState<(typeof setTimeout)[]>([]);
  // Function to clear all running timeouts
  const clearAllTimeouts = () => {
    timeoutIds.forEach((timeoutId: typeof setTimeout) =>
      clearTimeout(timeoutId)
    );
    setTimeoutIds([]); // Clear the timeout IDs from state
  };
  // Function to set a new timeout
  const clearAlert = () => {
    clearAllTimeouts(); // Clear existing timeouts before setting a new one
    const newTimeoutId = setTimeout(() => {
      // Your timeout function logic here
      setShowSnackBar(false);
    }, 3000);
    setTimeoutIds([newTimeoutId]); // Store the new timeout ID in state
  };

  const category = [
    {
      name: `ตู้เก็บของ`,
      img: `https://www.indexlivingmall.com/_next/image?url=https%3A%2F%2Fmedia.indexlivingmall.com%2Fmedia%2Fcatalog%2Fcategory%2FOrganization%2Fdrawer-and-shelf.png&w=128&q=75`,
      review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    },
    {
      name: `ชุดห้องนอน`,
      img: `https://www.indexlivingmall.com/_next/image?url=https%3A%2F%2Fmedia.indexlivingmall.com%2Fmedia%2Fcatalog%2Fproduct%2F1%2F7%2F170129736_c_LUXU-VELVET_GY.jpg&w=1920&q=75`,
      review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    },
    {
      name: `เฟอร์นิเจอร์`,
      img: `https://www.indexlivingmall.com/_next/image?url=https%3A%2F%2Fmedia.indexlivingmall.com%2Fmedia%2Fcatalog%2Fcategory%2FSofa-7.png&w=256&q=75`,
      review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    },
    {
      name: `ของตกเเต่งบ้าน`,
      img: `https://www.indexlivingmall.com/_next/image?url=https%3A%2F%2Fmedia.indexlivingmall.com%2Fmedia%2Fcatalog%2Fproduct%2Fcache%2F29b3f741dcafc528943c644b5c704259%2F1%2F7%2F170113729_1567052578724oGBx_2.jpg&w=1920&q=75`,
      review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    },
    {
      name: `โคมไฟเเละหลอดไฟ`,
      img: `https://www.indexlivingmall.com/_next/image?url=https%3A%2F%2Fmedia.indexlivingmall.com%2Fmedia%2Fcatalog%2Fproduct%2Fcache%2F29b3f741dcafc528943c644b5c704259%2F1%2F7%2F170097648_f_paribosta_bk_1_.jpg&w=1920&q=75`,
      review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    },
    {
      name: `อุปกรณ์เครื่องครัว`,
      img: `https://www.indexlivingmall.com/_next/image?url=https%3A%2F%2Fmedia.indexlivingmall.com%2Fmedia%2Fcatalog%2Fproduct%2F1%2F7%2F170118801_op1_Paradox_SV.JPG&w=1920&q=75`,
      review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    },
    {
      name: `สินค้าสำหรับห้องน้ำ`,
      img: `https://cdn.homepro.co.th/ART_IMAGE/10/260/1026083/447x447/21082023_1026083$Imagec1.jpg`,
      review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    },
    {
      name: `อุปกรณ์ซักรีดเเละทำความสะอาด`,
      img: `https://www.indexlivingmall.com/_next/image?url=https%3A%2F%2Fmedia.indexlivingmall.com%2Fmedia%2Fcatalog%2Fproduct%2F1%2F7%2F170116659_op1_MANNO_BE.jpg&w=1920&q=75`,
      review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    },
  ];
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
  const [postsPerPage, setPostsPerPage] = useState<number>(15);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentProducts = productList.slice(indexOfFirstPost, indexOfLastPost);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const getAllProduct = async () => {
  //   try {
  //     const { data } = await axiosPrivate.get("/product/");
  //     console.log(data);
  //     setAllProduct(data);
  //   } catch (err: unknown) {
  //     if (err instanceof AxiosError) {
  //       const msg =
  //         typeof err?.response?.data?.msg === "object"
  //           ? err?.response?.data?.msg[0]
  //           : err?.response?.data?.msg;
  //       setShowAlert(true);
  //       setAlertType("error");
  //       setAlertText(msg);
  //       setIsLoading(false);
  //       return;
  //     }
  //   }
  // };

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
    ],
  };
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const productEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    productEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [currentPage]);
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
  const [snackBarText, setSnackBarText] = useState<string>("");
  const [snackBarType, setSnackBarType] = useState<
    "error" | "success" | "info" | "warning"
  >("error");

  const insertProductToCart = async (productID: string, quantity: number) => {
    setIsLoading(true);
    try {
      await axiosPrivate.post(`http://localhost:5000/cart`, {
        productID: productID,
        email: user?.email,
        quantity: quantity,
      });
      setIsLoading(false);
      setShowSnackBar(true);
      setSnackBarType("success");
      setSnackBarText("Added product in your Cart");
      clearAlert();
      setIsLoading(false);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const msg =
          typeof err?.response?.data?.message === "object"
            ? err?.response?.data?.message[0]
            : err?.response?.data?.message;
        setShowSnackBar(true);
        setSnackBarType("error");
        setSnackBarText(msg);
        clearAlert();
        setIsLoading(false);
      }
    }
  };
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const filterByCategory = (selectedCategory: string) => {
    setSelectedCategory(selectedCategory);
  };
  const [search, setSearch] = useState<string>("");
  useEffect(() => {
    dispatch(
      getAllProduct({
        category: selectedCategory,
        search: search,
      })
    );
  }, [selectedCategory,search]);

  return (
    <Wrapper className="">
      {showSnackBar && (
        <div id="add-device-snackbar" className="block sm:hidden">
          <SnackBar
            severity={snackBarType}
            showSnackBar={showSnackBar}
            snackBarText={snackBarText}
            setShowSnackBar={setShowSnackBar}
          />
        </div>
      )}
      <div className="bg-[#111111] w-[100%] flex sm:hidden justify-center text-[#fff] text-[12px] pt-2 pb-2 gap-[10rem]">
        <div>0% installment payment service</div>
        <div>Delivery starts at 99 baht</div>
        <div>365 day return policy</div>
      </div>
      <BigNavbar setSearch={setSearch} search={search}/>
      <SmallNavbar
        isDrawerOpen={isNavlinksOpen}
        setIsDrawerOpen={setIsNavlinksOpen}
      />

      <div className="w-[100%] flex justify-center">
        <div className="w-[80%]">
          <Slider {...settings}>
            {category.map((d) => (
              <div
                key={d.name}
                className="h-[110px] text-black rounded-xl"
                onClick={() => {
                  filterByCategory(d.name);
                }}
              >
                <div className="flex justify-center items-center rounded-t-xl">
                  <img src={d.img} alt="" className="h-28 w-28 " />
                </div>

                <div className="text-[12px] flex flex-col items-center pt-2 justify-center gap-4">
                  <div>{d.name}</div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <div className="flex justify-center mt-20">
        <div className="flex gap-12 w-[80%] border-b-1 border-[#000] border-b-[1px] pb-3 border-[#c7c7c7]">
          <div className="text-[12px]">สินค้าทั้งหมด</div>
          <div className="text-[12px]">ห้องต่างๆ</div>
          <div className="text-[12px]">สินค้าราคาพิเศษ</div>
        </div>
      </div>
      <div className="flex w-[100%] justify-center mt-10 items-center">
        <div className="w-[80%] grid grid-cols-5 gap-10 justify-top lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {currentProducts &&
            currentProducts.map((product, index) => {
              return (
                <div
                  key={index}
                  className=" flex flex-col items-center relative"
                >
                  <GrShop
                    onClick={() => {
                      insertProductToCart(product?._id, 1);
                    }}
                    className="absolute right-0 text-gray-300 hover:text-primary-400 text-lg cursor-pointer"
                  />
                  <img
                    src={product?.img}
                    className="w-[155px] h-[155px] object-cover"
                  ></img>
                  <div className="flex flex-col px-3 w-[100%] mt-5 ">
                    <div className="text-[12px] mb-4  w-fit px-3 rounded-sm text-primary-600 py-[2px]">
                      {product?.category}
                    </div>
                    <div className="text-[14.7px]">{product?.name}</div>
                    <div className="text-primary-400 mt-2 text-sm font-bold">
                      {product?.price}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <Pagination
        id="pagination"
        postsPerPage={postsPerPage}
        totalPosts={productList.length}
        paginate={paginate}
        currentPage={currentPage}
      />

      <div ref={productEndRef} />
      <div className="bg-[#111111] w-[100%] flex flex-col mt-20 justify-center items-center pt-10 pb-10">
        <div className=" flex w-[70%] justify-between pb-10 sm:flex-col sm: sm:items-center">
          <div className="flex flex-col w-[200px] sm:w-[300px] sm:mb-5">
            <div className=" text-[19px] text-white mb-5 font-bold">WR</div>
            <div className="text-[12.5px] text-[#fff]">
              Nakhon Pathom Rajabhat University 85 Malaiman Road, Muang
              District, Nakhon Pathom 73000. 0 3426 1048 0 3410 9300.
              saraban@npru.ac.th
            </div>
          </div>
          <div className="flex flex-col w-[200px] sm:w-[300px] sm:mb-5">
            <div className=" text-[19px] text-white mb-5 font-bold">
              Services
            </div>
            <div className="text-[12.5px] mb-3 text-[#fff] w-[200px]">
              Website Designing
            </div>
            <div className="text-[12.5px] mb-3 text-[#fff] w-[200px]">
              Website Development
            </div>
          </div>
          <div className="flex flex-col w-[200px] sm:w-[300px]">
            <div className=" text-[19px] text-white mb-5 font-bold">
              Languages
            </div>
            <div className="text-[12.5px] mb-3 text-[#fff] w-[200px]">
              English
            </div>
          </div>
        </div>

        <div className="bg-white w-[90%] h-[1px]"></div>
        <div className="flex w-[70%] justify-center text-[#ccc] text-[12px] mt-3">
          Non Copyrighted © 2022 Design and upload by rich technologies
        </div>
      </div>
    </Wrapper>
  );
}

export default ProductList;
