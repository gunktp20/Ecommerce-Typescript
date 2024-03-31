import React from 'react'

interface IProp {
    postsPerPage: number
    totalPosts: number
    paginate: (pageNumber: number) => void
}

function Pagination({ postsPerPage, totalPosts, paginate }: IProp) {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <div>
            <ul className='pagination flex gap-5 w-[100%] justify-center mt-5'>
                {pageNumbers.map(number => (
                    <li onClick={() => {
                        paginate(number)
                    }} key={number} className='cursor-pointer page-item border-[1px] rounded-lg border-[#dadada] w-[30px] flex items-center justify-center h-[30px]'>
                        <a className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Pagination
