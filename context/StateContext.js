import React, {createContext, useContext, useEffect, useState} from 'react';
import {toast} from 'react-hot-toast';

// create context allows us to create a context object that 
// we can use to pass down the state and functions to the children components
const Context = createContext();

export const StateContext = ({children}) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);


    // Load initial data from local storage
    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
        const storedTotalPrice = JSON.parse(localStorage.getItem('totalPrice'));
        const storedTotalQuantities = JSON.parse(localStorage.getItem('totalQuantities'));

        if (storedCartItems) setCartItems(storedCartItems);
        if (storedTotalPrice) setTotalPrice(storedTotalPrice);
        if (storedTotalQuantities) setTotalQuantities(storedTotalQuantities);
    }, []);

    // Save data to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
        localStorage.setItem('totalQuantities', JSON.stringify(totalQuantities));
    }, [cartItems, totalPrice, totalQuantities]);

    let foundProduct;
    let index;

    const onRemove = (product) => {
        foundProduct = cartItems.find(item => item._id === product._id);
        index = cartItems.indexOf(foundProduct);
        const updatedCart = [...cartItems];
        updatedCart.splice(index, 1);
        setCartItems(updatedCart);
        setTotalPrice((prev) => prev - (foundProduct.price * foundProduct.quantity));
        setTotalQuantities((prev) => prev - foundProduct.quantity);
    }
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

    /*the context provider component will wrap the entire application 
    and provide the state and functions specified in the value prop to the children components*/
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
                toggleCartItemQuantity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities
            }}
        >
            {children}
        </Context.Provider>
    );
};

// this custom hook makes it easier to access the state and functions in the context with less boilerplate code
export const useStateContext = () => useContext(Context);
