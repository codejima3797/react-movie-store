import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Nav() {
  const location = useLocation();
  const { cartItems } = useCart();

  // Calculate total quantity
  const totalQuantity = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const isHomePage = location.pathname === "/";
  const isMoviesPage = location.pathname === "/movies";
  const isCartPage = location.pathname === "/cart";

  return (
    <>
      <nav className="nav">
        <div className="nav__logo--wrapper">
          <Link to="/">JMDB</Link>
        </div>
        <div className="nav__slogan">
          Find your picks with just a few clicks!
        </div>
        <div className="nav__links">
          {!isHomePage && (
            <Link to="/" className="nav__link--wrapper">
              <div className="nav__link">
                <i className="fa-solid fa-house"></i>
                <span className="nav__link--text">Home</span>
              </div>
            </Link>
          )}
          {!isMoviesPage && (
            <Link to="/movies" className="nav__link--wrapper">
              <div className="nav__link">
                <i className="fa-solid fa-film"></i>
                <span className="nav__link--text">Movies</span>
              </div>
            </Link>
          )}
          {!isCartPage && (
            <Link to="/cart" className="nav__link--wrapper">
              <div className="nav__link">
                <i className="fa-solid fa-cart-shopping"></i>
                {cartItems.length > 0 && (
                  <span className="cart-badge">
                    {cartItems.reduce(
                      (total, item) => total + (item.quantity || 1),
                      0
                    ) > 99
                      ? "99+"
                      : cartItems.reduce(
                          (total, item) => total + (item.quantity || 1),
                          0
                        )}
                  </span>
                )}
                <span className="nav__link--text cart__link--text">Cart</span>
              </div>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Nav;
