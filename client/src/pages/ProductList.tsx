import { Navbar, Card, SimpleSlider, Footer } from "../components";
import HeadRoom from "react-headroom";
import Wrapper from "../assets/wrappers/Landing";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Wallpaper from "../assets/images/furniture-ecommerce (1).jpg"

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { getAllProduct } from "../features/product/productSlice";

interface IProduct {
    _id: string
    name: string
    description: string
    price: number
    img: string
    category: string
}

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

function SampleNextArrow(props: {
    className?: string;
    style?: object;
    onClick?: () => void;
}) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "flex", justifyContent: "center", background: "#1f2937", borderRadius: "100%", width: "30px", height: "30px", alignItems: "center" }}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props: {
    className?: string;
    style?: object;
    onClick?: () => void;
}) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "flex", justifyContent: "center", background: "#1f2937", borderRadius: "100%", width: "30px", height: "30px", alignItems: "center" }}
            onClick={onClick}
        />
    );
}

function ProductList() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const { productList, isLoading } = useAppSelector(state => state.product)
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [search, setSearch] = useState<string>("")
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [postsPerPage, setPostsPerPage] = useState<number>(6)

    const filterByCategory = (selectedCategory: string) => {
        setSelectedCategory(selectedCategory)
    }


    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 3,
        nextArrow: <SamplePrevArrow />,
        prevArrow: <SampleNextArrow />,
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
        ]
    };

    useEffect(() => {
        dispatch(getAllProduct({
            category:selectedCategory,
            search:search,
        }))
        // if (selectedCategory) {
        //     const filteredProducts = productList?.filter((p) => {
        //         return p.category === selectedCategory;
        //     })
        //     setProductsList(filteredProducts)
        // }

    }, [selectedCategory])

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentProducts = productList.slice(indexOfFirstPost, indexOfLastPost)

    // console.log("product list",productsList)
    // console.log("currentProducts", currentProducts)

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }

    return (
        <Wrapper>
            <div className="bg-[#111111] w-[100%] flex justify-center text-[#fff] text-[12px] pt-2 pb-2 gap-[10rem]">
                <div>บริการผ่อนชำระ 0%</div>
                <div>จัดส่งเริ่มต้นที่ 99 บาท</div>
                <div>นโยบายเปลี่ยนคืนสินค้าใน 365 วัน</div>
            </div>
            <HeadRoom>
                <Navbar />
            </HeadRoom>

            <div className="flex justify-center mt-5">
                <div className="flex gap-12 w-[80%] border-b-1 border-[#000] border-b-[1px] pb-3 border-[#c7c7c7]">
                    <div className="text-[12px]">สินค้าทั้งหมด</div>
                    <div className="text-[12px]">ห้องต่างๆ</div>
                    <div className="text-[12px]">สินค้าราคาพิเศษ</div>
                </div>
            </div>
            <div className="w-[100%] flex justify-center ">
                <div className="w-[80%]">
                    <Slider {...settings}>
                        {category.map((d) => (
                            <div key={d.name} className="h-[300px] text-black rounded-xl" onClick={() => {
                                filterByCategory(d.name)
                            }}>
                                <div className="flex justify-center items-center rounded-t-xl">
                                    <img src={d.img} alt="" className="h-40 w-44 " />
                                </div>

                                <div className="text-[12px] flex flex-col items-center pt-2 justify-center gap-4">
                                    <div>{d.name}</div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
            <div className="w-[100%] justify-center flex flex-col">
                {isLoading && <div className="justify-center w-[100%] flex my-10"><div className="loader"></div></div>}
                <div className="w-[80%] m-auto grid grid-cols-3 gap-5 md:grid-cols-2 sm:grid-cols-1">

                    {currentProducts && currentProducts?.map((p) => {
                        return <Card title={p.name} description={p.description} price={p.price} category={p.category} img={p.img} />
                    })}
                </div>
            </div>
            <Pagination postsPerPage={postsPerPage} totalPosts={productList.length} paginate={paginate} />
            <Footer />
        </Wrapper>
    );
}

export default ProductList;
