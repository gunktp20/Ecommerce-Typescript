import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface IProp {
  products: {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    img: string;
  }[];
}

function SimpleSlider(props: IProp) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  };
  //   return (
  //     <div className="w-[100%] bg-red-500">
  //       <Slider {...settings} className="">
  //         {props.products &&
  //           props.products.map((product) => {
  //             return (
  //               <div className="w-[100px] bg-blue-500">
  //                 <img
  //                   src={product.img}
  //                   className="w-[50px] h-[50px] object-cover"
  //                 ></img>
  //               </div>
  //             );
  //           })}
  //       </Slider>
  //     </div>
  //   );

  return (
    <div className="flex items-center justify-center w-[100%] bg-blue-500 relative">
      <div className="w-[90%] ">
        <Slider {...settings}>
          {props.products.length > 0 &&
            props.products.map((product) => {
              return (
                <div className="h-[200px] w-[100px] pb-[2rem] relative bg-red-500 ml-5 mr-5" key={product.id}>
                  <img className="post-img" alt="" />
                  <div className="post-img-dark"></div>
                  <div className="post-detail-section">
                    <div className="post-title">{product.title}</div>
                    <div className="post-desr">{product.price}</div>
                  </div>
                </div>
              );
            })}
        </Slider>
      </div>
    </div>
  );
}

export default SimpleSlider;
