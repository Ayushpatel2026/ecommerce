import React, {useState, useEffect, useRef} from "react";
import Link from 'next/link';
import {BsBagCheckFill} from 'react-icons/bs';

import { runFireworks } from "../lib/utils";
import { useStateContext } from '../context/StateContext';

const Success = () => {
    // in the sucess page, we want to clear the cart items, total price, and total quantities
    const {setCartItems, setTotalPrice, setTotalQuantities, cartItems} = useStateContext();
    console.log("Context cart", cartItems);
    // clear everything as soon as the customer reaches this success page

    useEffect(() => {
        runFireworks();
    }, []);

    const makeOrder = async () => {
        console.log("Making order", cartItems);
        const orderNumber = `ORD-${new Date().getTime()}`; // Example to generate a unique order number
        let totalAmount = 0;

        cartItems.forEach(item => {
            console.log("Item:", item)
            totalAmount += item.price * item.quantity;
        })

        const orderData = {
            _type: 'order',
            orderNumber: orderNumber,
            items: cartItems.map(item => {
                return({
                _type: 'object',
                product: {
                    _type: 'reference',
                    _ref: item._id, // Assuming each item has an _id that references the product in Sanity
                },
                quantity: item.quantity,
                price: item.price * item.quantity,
            })}),
            total: totalAmount,
            status: 'pending', // Default status
            orderDate: new Date().toISOString(),
            shippingType: 'free', // this is hard coded, will have to get this from stripe
        };

        try {
            const response = await fetch('/api/sanity-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData), // orderData from the previous example
            });
            const result = await response.json();
            localStorage.clear();
            setTotalPrice(0);
            setTotalQuantities(0);
            setCartItems([]);
            console.log('Order created', result);
        } catch (error) {
            console.error('Error creating order', error);
        }
    };

    const clearState = () => {
        localStorage.clear();
        setTotalPrice(0);
        setTotalQuantities(0);
        setCartItems([]);
    }

    const handleSuccess = async () => {
        await makeOrder();
    }
    
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
                <Link href="/order-summary">
                    <button type="button" width="300px" className="btn" style={{backgroundColor: 'green'}}
                        onClick={handleSuccess}
                    >See Your Order</button>
                </Link>
                <Link href="/">
                    <button type="button" width="300px" className="btn"
                    onClick={clearState}>Continue Shopping</button>
                </Link>
            </div>
        </div>
    )
}

export default Success;