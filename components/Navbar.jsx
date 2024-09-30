import React from "react";
import Link from "next/link";
import {AiOutlineShopping} from "react-icons/ai";
import Cart from "./Cart"
import { useStateContext } from "../context/StateContext";
import styles from "./styles/navbar.module.css";

const Navbar = () => {
    const {showCart, setShowCart, totalQuantities, user, logoutUser} = useStateContext();

    // TODO user profile: the url should include the user's id
    // instead of Profile as the text in the link, it could be an avatar or the user's name

    return (
        <div className={styles.navbarContainer}>
            <p className={styles.logo}>
                <Link href="/">
                    <a>Headphones Store</a>
                </Link>
            </p>
            <div className={styles.rightHeaderSection}>
                {user ? (
                    <div className={styles.userActions}>
                        <button type="button" className={styles.userIcon}>
                            <Link href="/user">
                                <a>Profile</a>
                            </Link>
                        </button>
                        <button type="button" className={styles.userIcon} onClick={logoutUser}>
                            <Link href="/">
                                <a>Logout</a>
                            </Link>
                        </button>
                    </div>
                ) : (
                    <button type="button" className={styles.userIcon}>
                        <Link href="/login">
                            <a>Login</a>
                        </Link>
                    </button>
                )}
                <button type="button" className={styles.cartIcon}
                    onClick={() => setShowCart(true)}
                    data-testid="cart-icon"    
                    >
                    <AiOutlineShopping/>
                    <span className={styles.cartItemQuantity}>
                        {totalQuantities}
                    </span>
                </button>
            </div>
            
            {showCart && <Cart/>}
        </div>
    );
}

export default Navbar;