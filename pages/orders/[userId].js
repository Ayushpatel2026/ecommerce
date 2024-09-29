'use client';
import { client, urlFor } from '../../lib/client';
import {account} from '../../lib/appwriteConfig';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import {toast} from 'react-hot-toast';
import {ID} from 'appwrite';
import styles from './orders.module.css';

// TODO - the order fetch is slow, when a new order is placed, the order is not displayed immediately
// you have to refresh the page after 10 seconds or so to see the new order

const Orders = () => {
    const [orders, setOrders] = useState(null);
    const [productsMap, setProductsMap] = useState({});
    const router = useRouter();

    useEffect(() => {
        console.log("Fetching orders");
        const fetchOrders = async () => {
            try {

                // Get the currently logged-in user's details
                try{
                    const user = await account.get();
                }catch(error){
                    console.error("Please login to view your orders", error);
                    router.push('/login');
                }

                const userEmail = user.email;
                console.log("User email", userEmail);   

                // Fetch the orders from Sanity using the user's email
                const ordersQuery = `*[_type == "order" && customerEmail == '${userEmail}']`;
                const ordersData = await client.fetch(ordersQuery);

                // sort ordersData by date in descending order
                ordersData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                
                if (ordersData.length > 0) {

                    // make this a set to avoid duplicates
                    const productRefs = new Set();

                    ordersData.forEach(order => {
                        order.items.forEach(item => {
                            productRefs.add(item.product._ref);
                        });
                    });

                    // Convert Set to array for querying Sanity
                    const productIds = Array.from(productRefs);
                    // Fetch the product details for all referenced products
                    if (productIds.length > 0) {
                        const productsQuery = `*[_type == "product" && _id in $productIds]`;
                        const productsData = await client.fetch(productsQuery, { productIds });

                        // Create a map of product IDs to their data for easy lookup
                        const productsMap = productsData.reduce((map, product) => {
                            map[product._id] = product;
                            return map;
                        }, {});
                        
                        setProductsMap(productsMap);
                    }

                    setOrders(ordersData);
                }
            } catch (error) {
                console.error("Error fetching orders or user details", error);
            }
        };

        fetchOrders();
    }, []);

    console.log("Order", orders);
    console.log("Products", productsMap);

    if (!orders) {
        return <div>Loading...</div>;
    }

    if (orders.length === 0) {
        return <div>No orders found for this account.</div>;
    }

    return (
        <div className={styles.ordersWrapper}>
            <h1 className={styles.orderHeading}>Your Orders</h1>
            {orders.map((order, orderIndex) => (
                <div key={orderIndex} className={styles.orderContainer}>
                    <h3>Order Id: {order.orderNumber}</h3>
                    <p>Date Ordered: {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}</p>
                    <h3>Items Ordered</h3>
                    <ul className={styles.itemList}>
                        {order.items.map((item, itemIndex) => {
                            const product = productsMap[item.product._ref];
                            return (
                                <li key={itemIndex}>
                                    <img src={urlFor(product?.image[0])} alt={product?.name || 'Unknown Product'} className={styles.orderProductImage} />
                                    <div className={styles.itemDetails}>
                                        <p>Product Name: {product?.name || 'Unknown Product'}</p>
                                        <p>Quantity Ordered: {item.quantity}</p>
                                        <p>Price per unit: ${item.price}</p>
                                        <p className={styles.totalPerProduct}>Total: ${item.quantity * item.price}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <p className={styles.orderTotal}>Order Subtotal: ${order.total - order.shippingCost}</p>
                    <p className={styles.shippingType}>Shipping Type: {order.shippingType}</p>
                    {order.shippingType === 'fast' && (
                        <p className={styles.shippingCost}>Shipping Cost: ${order.shippingCost}</p>
                    )}
                    <p className={styles.orderTotal}>Order Total: ${order.total}</p>
                    <p className={styles.orderStatus}>Status: {order.status}</p>
                </div>
            ))}
        </div>
    );
}

export default Orders;  