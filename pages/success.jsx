import React, {useState, useEffect} from "react";
import Link from 'next/link';
import {BsBagCheckFill} from 'react-icons/bs';

import { runFireworks } from "../lib/utils";
import { useStateContext } from '../context/StateContext';

const Success = () => {
    // in the sucess page, we want to clear the cart items, total price, and total quantities
    const {setCartItems, setTotalPrice, setTotalQuantities} = useStateContext();

    // clear everything as soon as the customer reaches this success page
    useEffect(() => {
        localStorage.clear();
        setCartItems([]);
        setTotalPrice(0);
        setTotalQuantities(0);
        runFireworks();
    }, []);
    
    return (
        <div className="success-wrapper">
            <div className="success">
                <p className="icon">
                    <BsBagCheckFill />
                </p>
                <h2>Thank you for your order!</h2>
                <p className="email-msg">Check your email inbox for the receipt.</p>
                <p className="description">
                    If you have any questions, please feel free to contact us at <a className="email" href="mailto:orders@example.com">orders@example.com</a>
                </p>
                <Link href="/">
                    <button type="button" width="300px" className="btn">Continue Shopping</button>
                </Link>
            </div>
        </div>
    )
}

export default Success;