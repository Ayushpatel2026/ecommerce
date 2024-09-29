import React, {useRef} from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import {TiDeleteOutline} from 'react-icons/ti';
import { useStateContext } from '../context/StateContext';
import {toast} from 'react-hot-toast';
import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';
import { useRouter } from 'next/router';

import buttonStyles from '../styles/buttons.module.css';
import cartStyles from './styles/cart.module.css';
import quantityStyles from '../styles/quantity.module.css';


const Cart = () => {
    const cartRef = useRef();
    const {totalPrice, onRemove, totalQuantities, toggleCartItemQuantity, cartItems, setShowCart, user} = useStateContext();
    const router = useRouter()

    const handleCheckout = async () => {

        // if the user is not logged in, show a toast message and redirect to login page
        if (!user) {
            toast.error('Please login to continue');
            return setTimeout(() => {
                setShowCart(false);
                router.push('/login');
            }, 2000);
        }

        // get the Stripe instance
        const stripe = await getStripe();

        // send the cart items to the backend and wait for the response
        // the backend will take our cart items and create a checkout session using the Stripe API
        const response = await fetch('/api/stripe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({cartItems, email: user.email}),
        });

        if (response.statusCode === 500) return;

        // once response comes back, go to the checkout page generated by Stripe
        const data = await response.json();
        toast.loading('Redirecting to checkout...');
        stripe.redirectToCheckout({sessionId: data.id});
    }

    return(
        <div className={cartStyles.cartWrapper} ref={cartRef}>
            <div className={cartStyles.cartContainer}>
                <button type="button"
                    className={cartStyles.cartHeading}
                    onClick={() => setShowCart(false)}
                >
                    <AiOutlineLeft/>
                    <span className={cartStyles.heading}>Your Cart</span>
                    <span className={cartStyles.cartNumItems}>({totalQuantities} items)</span>
                </button>
                {cartItems.length < 1 && (
                    <div className={cartStyles.emptyCart}>
                        <AiOutlineShopping size={150}/>
                        <h3>Your shopping bag is empty</h3>
                        <Link href="/">
                            <button type="button" 
                            onClick={() => setShowCart(false)}
                            className={buttonStyles.btn}
                            >
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                )}

                <div className={cartStyles.productContainer}>
                    {cartItems.length >= 1 && cartItems.map((item) => {
                        return (
                            <div className={cartStyles.product} key={item._id}>
                                <img src={urlFor(item?.image[0])} className={cartStyles.cartProductImage}/>
                                <div>
                                    <div className={`${cartStyles.flex} ${cartStyles.top}`}>
                                        <h5>{item.name}</h5>
                                        <h4>${item.price}</h4>
                                    </div>
                                    <div className={`${cartStyles.flex} ${cartStyles.bottom}`}>
                                        <div>
                                            <p className={quantityStyles.quantityDesc}>
                                                <span className={quantityStyles.minus} onClick={() => toggleCartItemQuantity(item._id, "dec")}>
                                                    <AiOutlineMinus />
                                                </span>
                                                <span className={quantityStyles.num}>
                                                    {item.quantity}
                                                </span>
                                                <span className={quantityStyles.plus} onClick={() => toggleCartItemQuantity(item._id, "inc")}>
                                                    <AiOutlinePlus />
                                                </span>
                                            </p>
                                        </div>
                                        <button type="button" className={cartStyles.removeItem} onClick={() => onRemove(item)}>
                                            <TiDeleteOutline/>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
                {cartItems.length >= 1 && (
                    <div  className={cartStyles.cartBottom}>
                        <div className={cartStyles.total}>
                            <h3>Subtotal:</h3>
                            <h3>${totalPrice}</h3>
                        </div>
                        <div className={buttonStyles.btnContainer}>
                            <button type="button" className={buttonStyles.btn} onClick={handleCheckout}>
                                Pay with Stripe
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;