"use client";
import React from "react";
import { client, urlFor } from "../../lib/client";
import {AiOutlineMinus, AiOutlinePlus, AiOutlineStar, AiFillStar} from 'react-icons/ai';
import Product from "../../components/Product";
import { useState } from "react";
import { useStateContext } from "../../context/StateContext";
import quantityStyles from '../../styles/quantity.module.css';

// the data on this page is fetched at build time, therefore it is static, any changes to the sanity data will not be reflected until the page is rebuilt

const ProductDetails = ({product, products}) => {
    const {name, price, image, details} = product;
    const {incQty, decQty, qty, onAdd, setShowCart} = useStateContext();

    const handleBuyNow = () => {
        onAdd(product, qty);
        setShowCart(true);
    }

    // the index here is used to keep track of which product image is currently being displayed
    const [index, setIndex] = useState(0);
    return (
        <div>
            <div className="product-detail-container">
                <div className="image-container">
                    <img className="product-detail-image" src={urlFor(image && image[index])} alt="" />
                    <div className="small-images-container">
                        {image?.map((img, i) => {
                            return (
                                <img 
                                key={i}
                                src={urlFor(img)}
                                className={i === index ? "small-image selected-image" : "small-image"}
                                onMouseEnter={() => setIndex(i)}
                            />
                            );
                        })}
                    </div>
                </div>
                <div className="product-detail-desc">
                    <h1>{name}</h1>
                    <div className="reviews">
                        <div>
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiFillStar />
                            <AiOutlineStar />
                        </div>
                        <p>
                            {20}
                        </p>
                    </div>
                    <h4>Details</h4>
                    <p>{details}</p>
                    <p className="price">${price}</p>
                    <div className="quantity">
                        <h3>Quantity:</h3>
                        <p className={quantityStyles.quantityDesc}>
                            <span className={quantityStyles.minus} onClick={decQty}>
                                <AiOutlineMinus />
                            </span>
                            <span className={quantityStyles.num}>
                                {qty}
                            </span>
                            <span className={quantityStyles.plus} onClick={incQty}>
                                <AiOutlinePlus />
                            </span>
                        </p>
                    </div>

                    <div className="buttons">
                        <button type="button"
                            className="add-to-cart"
                            onClick={() => onAdd(product, qty)}
                        >
                            Add to Cart
                        </button>

                        <button type="button"
                            className="buy-now"
                            onClick={handleBuyNow}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            <div className="maylike-products-wrapper">
                <h2>You may also like</h2>
                <div className="marquee">
                    <div className="maylike-products-container track">
                        {products.map((item) => {
                            return (<Product key={item._id} product={item}/>);
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;

// this function is called at build time to statically generate the page from the fetched data
export const getStaticProps = async ({params : {slug}}) => {
    // fetch the product with the matching slug
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const product = await client.fetch(query);
    
    // fetch all products (used for the related products section)
    const products_query = '*[_type == "product"]';
    const products = await client.fetch(products_query);

    return {
      props: {
        product,
        products,
      },
    };
}


export const getStaticPaths = async () => {
    // fetch the slug of all products, not the whole product
    const query = `*[_type == "product"]{
        slug{
            current
        }
    }`;
    const products = await client.fetch(query);

    // map the products to an array of slugs
    const paths = products.map((product) => ({
        params: {slug: product.slug.current}
    }));


    // fallback: false means that if the slug is not found in the paths array, it will return a 404 page
    return {
        paths,
        fallback: false,
    };
}