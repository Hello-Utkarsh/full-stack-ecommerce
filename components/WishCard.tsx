import { productQuantity } from '@/states/state';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import 'material-icons/iconfont/filled.css';
import StarRatings from 'react-star-ratings'
import { useRecoilState } from 'recoil';

const WishCartCard = (props) => {
    const [rating, setrating] = useState(1);
    const [quantityArray, setQuantityArray] = useRecoilState(productQuantity)
    const [quantity, setquan] = useState(1)
    const [name, setName] = useState('')
    const data = props.data
    const checkDel = props.checkDel
    const wishlistId = props.wishlistId
    const router = useRouter()
    const Cookies = require('js-cookie')

    const moveToCart = async () => {
        const key = process.env.NEXT_PUBLIC_API_SECRET;
        const cookie = Cookies.get("token") || "";
        if (!cookie) {
            return router.push('/shop/login')
        }
        const userData = await fetch("http://localhost:3000/api/mid-auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cookie, key }),
        });
        const id = await userData.json()

        const cart = await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: data.product_id, userId: id, quantity: quantity })
        })
        const res = await cart.json()
        if (res.message == 'success') {
            alert('Successfully added to cart')
        } else {
            console.log("undefined yahan se aaraha ha")
            alert(res.message)
        }

    }

    useEffect(() => {
        if (window.matchMedia('(max-width: 450px)').matches) {
            if (data.name.length > 12) {
                data.name = data.name.slice(0, 10) + '...'
                setName(data.name)
            }
        } else {
            setName(data.name)
        }
    }, [data.name])

    const delWish = async () => {
        const response = await fetch('/api/wishlist', {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ wishlistId })
        })
        const resJson = await response.json()

        checkDel(wishlistId)
    }

    return (
        <div className='w-[48%] h-fit my-2 flex items-center max-sm:w-11/12'>
            <Image width={500} height={500} className='w-[40%] -ml-3' src="https://pngimg.com/uploads/macbook/macbook_PNG9.png" alt="" />
            <div className='w-[60%]'>
                <span className='flex w-full justify-between'>
                    <h2 className='font-semibold text-lg text-start w-10/12 max-md:text-base'>{name}</h2>
                    <span onClick={delWish} className="material-icons mr-2 cursor-pointer text-black" style={{ fontSize: '24px' }}>
                        delete_outline
                    </span>
                </span>
                <span className='flex w-full justify-between mt-1 max-[900px]:flex-col max-[900px]:justify-start max-[900px]:mt-2'>
                    <StarRatings
                        starEmptyColor='#241834'
                        rating={rating}
                        starRatedColor="#513388"
                        numberOfStars={5}
                        name='rating'
                        starHoverColor='#513388'
                        starDimension='20px'
                        starSpacing='1px'
                    />
                    <div className='flex w-24 mt-2 rounded-2xl items-center text-2xl justify-around bg-[#d4d2d8] text-[#241834] border-2 border-black max-[900px]:mt-2 max-[550px]:w-20 max-[550px]:text-xl max-[400px]:w-16 max-[400px]:text-base'>
                        <button onClick={() => { if (quantity > 1) { setquan((oldquan) => oldquan - 1) } }}>-</button>
                        <p>{quantity}</p>
                        <button onClick={() => setquan((oldquan) => oldquan + 1)}>+</button>
                    </div>
                </span>
                <span className='flex w-full justify-between mt-3'>
                    <p onClick={moveToCart} className='underline cursor-pointer'>Move to {props.list}</p>
                    <p className='font-semibold mr-3'>Total</p>
                </span>
            </div>
        </div>
    )
}

export default WishCartCard
