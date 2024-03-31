
import { TbShoppingBagPlus } from "react-icons/tb";

interface IProp {
    productID:string
    title: string
    description: string
    price: number
    category: string
    img:string
    insertProductToCart:(productID:string,quantity:number)=>void
}

function Card(props: IProp) {
    return (
        <div className="flex flex-col  pb-3 justify-center items-center border-[#e7e7e7] rounded-lg border-[1px]">
            <div className="w-[200px] h-[200px]">
                <img src={props.img} className="w-[100%] h-[100%] object-cover"></img>
            </div>
            <div className="w-[100%]">
                <div className="pl-5 text-[14.5px]">{props.title}</div>
        
                {/* <div className="pl-5 text-[14px]">Description {props.description}</div> */}
                <div className="text-[12px] pl-5">Category {props.category}</div>
                <div className="flex justify-between pl-5 items-center pr-5 mt-2">
                    <div className="text-[#df7e0d]">{props.price}</div>
                    <div onClick={()=>{
                        props.insertProductToCart(props.productID,1)
                    }} className="text-[#0000005e] text-[20px] hover:bg-[#f2f2f2] w-[30px] h-[30px] flex justify-center items-center rounded-md"><TbShoppingBagPlus/></div>
                </div>
                
            </div>
        </div>
        // text-[#e10a0a]


    )
}

export default Card
