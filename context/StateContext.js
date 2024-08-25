import React, {createContext, useContext, useEffect, useState} from 'react';
import {toast} from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({children}) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find(product => product._id === id);
        index = cartItems.indexOf(foundProduct);
        if (value === "inc"){
            let newCartItems = [...cartItems];
            newCartItems[index].quantity += 1;
            setCartItems(newCartItems);
            setTotalPrice((prev) => prev + foundProduct.price);
            setTotalQuantities((prev) => prev + 1);
        }else if (value === "dec"){
            if(foundProduct.quantity > 1){
                let newCartItems = [...cartItems];
                newCartItems[index].quantity -= 1;
                setCartItems(newCartItems);
                setTotalPrice((prev) => prev - foundProduct.price);
                setTotalQuantities((prev) => prev - 1);
            }
        }
    }

    const incQty = () => {
        setQty((prev) => prev + 1);
    }

    const decQty = () => {
        setQty((prev) => {
            if(prev - 1 < 1){
                return 1;
            }
            return prev - 1;
        });
    }

    const onAdd = (product, quantity) => {
        // check if the product is already in the cart
        const check = cartItems.find(item => {
            return item._id === product._id;
        });

        setTotalPrice((prev) => prev + product.price * quantity);
        setTotalQuantities((prev) => prev + quantity);

        if(check){
            const updatedCart = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id){
                    return {...cartProduct, quantity: cartProduct.quantity + quantity};
                }
                return cartProduct;
            });

            setCartItems(updatedCart);
        }else{
            product.quantity = quantity;
            setCartItems([...cartItems, product]);
        }
        // show toast notification
        toast.success(`${qty} ${product.name} added to cart`);
    }

    return(
        <Context.Provider
            value={{
                showCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                setShowCart,
                toggleCartItemQuantity
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useStateContext = () => useContext(Context);
