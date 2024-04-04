import React from "react";

interface IProp {
  postsPerPage: number;
  totalPosts: number;
  paginate: (pageNumber: number) => void;
  id: string;
  currentPage: number;
}

function Pagination({
  postsPerPage,
  totalPosts,
  paginate,
  id,
  currentPage,
}: IProp) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div id={id}>
      <ul className="pagination flex gap-1 w-[100%] justify-center mt-10 ">
        <button
          onClick={() => {
            if (currentPage === 1) {
              return;
            }
            paginate(currentPage - 1);
          }}
          className=" px-4 rounded-md hover:text-primary-500 transition-all"
        >
          {"<"}
        </button>
        <div className="flex w-max justify-right gap-4 border-[1px] border-gray-100 rounded-md px-2 items-center">
          {pageNumbers.map((number) => {
            return (
              <li
                onClick={() => {
                  paginate(number);
                }}
                key={number}
                className={`${
                  number === currentPage
                    ? "text-primary-500  bg-primary-50"
                    : "text-gray-500"
                } my-1 cursor-pointer text-sm page-item  rounded-md border-[#dadada] w-[35px] flex items-center justify-center  transition-all h-[35px] hover:bg-gray-100`}
              >
                <a className="page-link">{number}</a>
              </li>
            );
          })}
        </div>
        <button
          onClick={() => {
            if (currentPage === Math.ceil(totalPosts / postsPerPage)) {
              return;
            }
            paginate(currentPage + 1);
          }}
          className=" px-4 rounded-md hover:text-primary-500 transition-all"
        >
          {">"}
        </button>
      </ul>
    </div>
  );
}

export default Pagination;
