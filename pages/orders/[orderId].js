'use client';
import { client, urlFor } from '../../lib/client';

const Orders = ({ order,products }) => {
    console.log("Order", order);
    console.log("Products", products);
    return (
        <div className="orders-wrapper">
            <h1 className="order-heading">Your Order</h1>
            <div className="order-container">
                <h3>Order Id: {order.orderNumber}</h3>
                <p>Date Ordered: {new Date(order.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}</p>
                <h3>Items Ordered</h3>
                <ul className="items-list">
                    {order.items.map((item, index) => {
                        const product = products.find(prod => prod._id === item.product._ref);
                        return (
                            <li key={index}>
                                <img src={urlFor(product.image[0])} alt={product?.name} className="order-product-image" />
                                <div className="item-details">
                                    <p>Product Name: {product?.name || 'Unknown Product'}</p>
                                    <p>Quantity Ordered: {item.quantity}</p>
                                    <p>Price per unit: ${item.price}</p>
                                    <p className="total-per-product">Total: ${item.quantity * item.price}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <p className="order-total">Order Subtotal: ${order.total - order.shippingCost}</p>
                <p className="shipping-type">Shipping Type: {order.shippingType}</p>
                {order.shippingType === 'fast' && (
                    <p className="shipping-cost">Shipping Cost: ${order.shippingCost}</p>
                )}
                <p className="order-total">Order Total: ${order.total}</p>
                <p className="order-status">Status: {order.status}</p>
            </div>
        </div>
    );
}

export default Orders;  

// this function is called at build time to statically generate the page from the fetched data
export const getStaticProps = async ({params : {orderId}}) => {
    // fetch the product with the matching slug
    const query = `*[_type == "order" && orderNumber == '${orderId}'][0]`;
    const order = await client.fetch(query);

    const productIds = order.items.map(item => item.product._ref);
    const productQuery = `*[_type == "product" && _id in $productIds]`;
    const products = await client.fetch(productQuery, {productIds});
    return {
      props: {
        order,
        products
      },
    };
}

// This function is called at build time to determine which paths to pre-render
export const getStaticPaths = async () => {
    // Fetch all order IDs
    const query = `*[_type == "order" && count(items) > 0]{ 
        orderNumber{
            current
        }
    }`;
    const orders = await client.fetch(query);

    // Map over the orders to create paths
    const paths = orders
        .filter((order) => typeof order.orderNumber?.current === 'string')
        .map((order) => ({
            params: { orderId: order.orderNumber.current },
        }));

    return {
        paths,
        fallback: 'blocking', // Allows new paths to be generated at request time if not pre-rendered
    };
}