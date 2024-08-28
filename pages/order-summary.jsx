import React from "react";
import { client } from "../lib/client";

// right now this displays all the orders, it should be by user
const Orders = ({ orders }) => {
    return (
        <div className="orders-wrapper">
            <h1 className="order-heading">Your Orders</h1>
            <div className="orders-container">
                {orders.length > 0 && orders.map((order, index) => (
                    <div key={index} className="order-container">
                        <h3>Order Id: {order.orderNumber}</h3>
                        <p>Date Ordered: {new Date(order.orderDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}</p>
                        <h3>Items Ordered</h3>
                        <ul>
                            {order.items.map((item, index) => (
                                <li key={index}>
                                    <div className="item-details">
                                        <p>Product Name: {item.product.name}</p>
                                        <p>Quantity Ordered: {item.quantity}</p>
                                        <p>Price per unit: ${item.price}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <p className="order-total">Order Total: ${order.total}</p>
                        <p className="order-status">Status: {order.status}</p>
                        <p className="shipping-type">Shipping Type: {order.shippingType}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Orders;

export const getServerSideProps = async () => {
    // this is SSR, all the data is fetched and embedded within the html before we send it to the client
    // fetch all products and bannerData from our sanity client (* indicates all)
    const query = `
        *[_type == "order" && count(items) > 0]{
            orderNumber,
            orderDate,
            total,
            status,
            shippingType,
            items[]{
                quantity,
                price,
                product->{
                    name
                }
            }
        }
    `;
    const orders = await client.fetch(query);
  
    // this prop will be passed to the Home component during rendering, cool beans
    return {
      props: {
        orders
      },
    };
  }