import React, {useEffect} from "react";
import Link from 'next/link';
import {BsBagCheckFill} from 'react-icons/bs';

import { runFireworks } from "../lib/utils";
import { useRouter } from "next/router";
import { useStateContext } from '../context/StateContext';
import buttonStyles from '../styles/buttons.module.css';

const Success = () => {

    const {setCartItems, setTotalPrice, setTotalQuantities, cartItems, user} = useStateContext();
    const router = useRouter();
    const {session_id} = router.query;

    if (!user){
        router.push('/');
    }
    
    // clear everything as soon as the customer reaches this success page
    let order_summary = {};
    useEffect(() => {
        if (session_id) {
          console.log("Session ID:", session_id);
          fetchOrderSummary(session_id);
        }
        localStorage.clear();
        setCartItems([]);
        setTotalPrice(0);
        setTotalQuantities(0);
        runFireworks();
      }, [session_id]);

      const fetchOrderSummary = async (sessionId) => {
        console.log('Fetching order summary for session:', sessionId);
        try {
          const response = await fetch('/api/getOrderSummary', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId }),
          });
          const data = await response.json();
          console.log('Order data:', data);
          order_summary = await makeOrder(data);
          console.log('Order summary:', order_summary);
        } catch (error) {
          console.error('Error fetching order summary:', error);
        }
      };

    const makeOrder = async (data) => {
        console.log('Creating order:', data);

        const orderData = {
            _type: 'order',
            orderNumber: data.id,
            items: data.line_items.data.map(item => {
                return({
                _type: 'object',
                _key: item.price.product.metadata.productId,
                product: {
                    _type: 'reference',
                    _ref: item.price.product.metadata.productId, 
                },
                quantity: item.quantity,
                price: item.price.unit_amount/100,
            })}),
            customerEmail: data.customer_details.email,
            paymentInfo:{
                _type: 'object',
                method: data.payment_method_types[0],
                transactionId: data.id,
                paymentStatus: data.payment_status,
            },
            total: data.amount_total/100,
            status: data.status, // Default status
            orderDate: new Date(data.created * 1000).toISOString(), // Convert UNIX timestamp to ISO string
            shippingCost: data.shipping_cost.amount_total / 100,
            shippingType: data.shipping_cost.amount_total === 0 ? 'free' : 'fast', // right now there are only two options, this will need to be refactored if more options are added
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
            return result;
        } catch (error) {
            console.error('Error creating order', error);
        }
    };
    
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
                <Link href={`/orders/${user.$id}`}>
                    <button type="button" width="300px" className={buttonStyles.btn} style={{backgroundColor: 'green'}}>
                        See Your Order
                    </button>
                </Link>
                <Link href="/">
                    <button type="button" width="300px" className={buttonStyles.btn}>
                        Continue Shopping
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Success;