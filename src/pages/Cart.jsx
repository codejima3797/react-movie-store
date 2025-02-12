import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "../styles/style.css";
import { useState, useEffect, useRef } from "react";
import { useClickOutside } from "../hooks/useClickOutside";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    setCartItems,
    calculateItemPrice,
    clearCart,
  } = useCart();
  const [toasts, setToasts] = useState([]);
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiration: "",
    cvv: "",
  });
  const [paymentStatus, setPaymentStatus] = useState("initial"); // 'initial', 'loading', 'success'
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    fullName: "",
    cardNumber: "",
    state: "",
    zipCode: "",
    expiration: "",
    cvv: "",
  });
  const contactMenuRef = useRef(null);

  // Add US states array
  const usStates = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  useClickOutside(contactMenuRef, setIsContactMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle state dropdown click outside
      if (!event.target.closest(".custom-select")) {
        setIsStateDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const subtotal = formatPrice(
    cartItems.reduce((total, item) => {
      const price = calculateItemPrice(item);
      const itemTotal = item.price.isOnSale ? price.sale : price.original;
      return total + parseFloat(itemTotal.replace(/,/g, ""));
    }, 0)
  );

  const tax = formatPrice(parseFloat(subtotal.replace(/,/g, "")) * 0.1);
  const total = formatPrice(
    parseFloat(subtotal.replace(/,/g, "")) + parseFloat(tax.replace(/,/g, ""))
  );

  const updateQuantity = (movieId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.imdbID === movieId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const addToast = () => {
    const id = Date.now(); // Unique ID for each toast
    setToasts((prev) => [...prev, { id, message: "Item Removed" }]);

    // Remove this specific toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const handleRemoveFromCart = (movieId) => {
    removeFromCart(movieId);
    addToast();
  };

  const validatePaymentDetails = () => {
    const newErrors = {
      fullName: "",
      cardNumber: "",
      state: "",
      zipCode: "",
      expiration: "",
      cvv: "",
    };

    let isValid = true;

    // Full Name validation
    if (!paymentDetails.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    // Card number validation
    if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Card number must be 16 digits";
      isValid = false;
    }

    // State validation
    if (!paymentDetails.state) {
      newErrors.state = "Please select a state";
      isValid = false;
    }

    // ZIP code validation
    if (!/^\d{5}$/.test(paymentDetails.zipCode)) {
      newErrors.zipCode = "ZIP code must be 5 digits";
      isValid = false;
    }

    // Expiration validation
    if (!/^(0[1-9]|1[0-2])\/20\d{2}$/.test(paymentDetails.expiration)) {
      newErrors.expiration = "Use MM/YYYY format";
      isValid = false;
    }

    // CVV validation
    if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
      isValid = false;
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!validatePaymentDetails()) {
      return;
    }

    setPaymentStatus("loading");

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    clearCart();
    setPaymentStatus("success");
  };

  // Format card number as user types
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 16);
    // Add spaces every 4 digits
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setPaymentDetails({
      ...paymentDetails,
      cardNumber: value,
    });
  };

  // Format expiration date as user types
  const handleExpirationChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 6);
    }
    setPaymentDetails({
      ...paymentDetails,
      expiration: value,
    });
  };

  // Reset all payment details and dropdown state when modal is closed
  const handleCloseModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentStatus("initial");
    setIsStateDropdownOpen(false);
    setPaymentDetails({
      fullName: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      cardNumber: "",
      expiration: "",
      cvv: "",
    });
  };

  return (
    <>
      <div className="cart__container">
        <div className="cart">
          <div className="cart__header">
            <h1>Shopping Cart</h1>
          </div>
          <hr className="cart__hr" />
          <div className="cart__items">
            {cartItems.length === 0 ? (
              <div className="cart__empty">
                <p>Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((movie) => (
                <div key={movie.imdbID} className="cart__item">
                  <div className="cart__item--top">
                    <div className="cart__item--img-wrapper">
                      {movie.Poster && movie.Poster !== "N/A" ? (
                        <img
                          src={movie.Poster}
                          alt={movie.Title}
                          className="cart__item--img"
                        />
                      ) : (
                        <div className="no-image-placeholder">
                          No image available
                        </div>
                      )}
                    </div>
                    <div className="cart__item--details">
                      <h3>{movie.Title}</h3>
                      <p>
                        {movie.Year} • {movie.Rated}
                      </p>
                    </div>
                  </div>
                  <div className="cart__item--quantity">
                    <button
                      onClick={() =>
                        updateQuantity(movie.imdbID, (movie.quantity || 1) - 1)
                      }
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-number">
                      {movie.quantity || 1}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(movie.imdbID, (movie.quantity || 1) + 1)
                      }
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="cart__item--bottom">
                    <div className="cart__item--price">
                      {movie.price.isOnSale ? (
                        <>
                          <span className="original-price original-price--cart">
                            ${calculateItemPrice(movie).original}
                          </span>
                          <span className="sale-price">
                            ${calculateItemPrice(movie).sale}
                          </span>
                        </>
                      ) : (
                        `$${calculateItemPrice(movie).original}`
                      )}
                    </div>
                    <button
                      className="cart__item--remove"
                      onClick={() => handleRemoveFromCart(movie.imdbID)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="cart__totals">
              <div className="cart__totals--item">
                <span className="cart__totals--label">Subtotal:</span>
                <span className="cart__totals--amount">${subtotal}</span>
              </div>
              <div className="cart__totals--item">
                <span className="cart__totals--label">Tax:</span>
                <span className="cart__totals--amount">${tax}</span>
              </div>
              <div className="cart__totals--item total">
                <span className="cart__totals--label">Total:</span>
                <span className="cart__totals--amount">${total}</span>
              </div>
              <button
                className="cart__buy-btn"
                onClick={() => setIsPaymentModalOpen(true)}
              >
                Buy Now
              </button>
            </div>
          )}
        </div>

        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className="toast-notification">
              {toast.message}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal-content payment-modal"
            onClick={(e) => {
              e.stopPropagation();
              if (!e.target.closest(".custom-select")) {
                setIsStateDropdownOpen(false);
              }
            }}
          >
            <button className="modal-close" onClick={handleCloseModal}>
              <i className="fa-solid fa-times"></i>
            </button>
            <h2 className="modal-title">Complete Your Purchase</h2>
            <p className="payment-disclaimer">
              * This website is a template/example site. None of the information
              you fill out will be saved, charged, or used for any purposes.
            </p>

            {paymentStatus === "initial" && (
              <form onSubmit={handlePaymentSubmit} className="payment-form">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    value={paymentDetails.fullName}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        fullName: e.target.value,
                      })
                    }
                    required
                    placeholder="John Doe"
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "John Doe")}
                    className={fieldErrors.fullName ? "error" : ""}
                  />
                  {fieldErrors.fullName && (
                    <span className="payment-error">
                      {fieldErrors.fullName}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="streetAddress">Street Address</label>
                  <input
                    type="text"
                    id="streetAddress"
                    value={paymentDetails.streetAddress}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        streetAddress: e.target.value,
                      })
                    }
                    required
                    placeholder="Street Address"
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "Street Address")}
                  />
                </div>
                <div className="address-row">
                  <div className="form-group city">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      value={paymentDetails.city}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          city: e.target.value,
                        })
                      }
                      required
                      placeholder="City"
                      onFocus={(e) => (e.target.placeholder = "")}
                      onBlur={(e) => (e.target.placeholder = "City")}
                    />
                  </div>
                  <div className="form-group state">
                    <label htmlFor="state">State</label>
                    <div className="custom-select">
                      <input
                        type="text"
                        id="state"
                        value={paymentDetails.state}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsStateDropdownOpen(!isStateDropdownOpen);
                        }}
                        readOnly
                        placeholder="Select State"
                        required
                        className={fieldErrors.state ? "error" : ""}
                      />
                      {fieldErrors.state && (
                        <span className="payment-error">
                          {fieldErrors.state}
                        </span>
                      )}
                      {isStateDropdownOpen && (
                        <div
                          className="select-dropdown"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {usStates.map((state) => (
                            <div
                              key={state}
                              className="select-option"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPaymentDetails({
                                  ...paymentDetails,
                                  state: state,
                                });
                                setIsStateDropdownOpen(false);
                              }}
                            >
                              {state}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group zip">
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      value={paymentDetails.zipCode}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 5);
                        setPaymentDetails({
                          ...paymentDetails,
                          zipCode: value,
                        });
                      }}
                      required
                      placeholder="ZIP Code"
                      maxLength="5"
                      onFocus={(e) => (e.target.placeholder = "")}
                      onBlur={(e) => (e.target.placeholder = "ZIP Code")}
                      className={fieldErrors.zipCode ? "error" : ""}
                    />
                    {fieldErrors.zipCode && (
                      <span className="payment-error">
                        {fieldErrors.zipCode}
                      </span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={handleCardNumberChange}
                    required
                    placeholder="1234 5678 9012 3456"
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) =>
                      (e.target.placeholder = "1234 5678 9012 3456")
                    }
                    className={fieldErrors.cardNumber ? "error" : ""}
                  />
                  {fieldErrors.cardNumber && (
                    <span className="payment-error">
                      {fieldErrors.cardNumber}
                    </span>
                  )}
                </div>
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="expiration">Expiration Date</label>
                    <input
                      type="text"
                      id="expiration"
                      value={paymentDetails.expiration}
                      onChange={handleExpirationChange}
                      required
                      placeholder="MM/YYYY"
                      maxLength="7"
                      onFocus={(e) => (e.target.placeholder = "")}
                      onBlur={(e) => (e.target.placeholder = "MM/YYYY")}
                      className={fieldErrors.expiration ? "error" : ""}
                    />
                    {fieldErrors.expiration && (
                      <span className="payment-error">
                        {fieldErrors.expiration}
                      </span>
                    )}
                  </div>
                  <div className="form-group half">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      value={paymentDetails.cvv}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4);
                        setPaymentDetails({
                          ...paymentDetails,
                          cvv: value,
                        });
                      }}
                      required
                      placeholder="123"
                      maxLength="4"
                      onFocus={(e) => (e.target.placeholder = "")}
                      onBlur={(e) => (e.target.placeholder = "123")}
                      className={fieldErrors.cvv ? "error" : ""}
                    />
                    {fieldErrors.cvv && (
                      <span className="payment-error">{fieldErrors.cvv}</span>
                    )}
                  </div>
                </div>
                <div className="payment-total">
                  <span className="payment-total-label">Total Payment:</span>
                  <span className="payment-total-amount">${total}</span>
                </div>
                <button type="submit" className="payment-submit-btn">
                  Complete Payment
                </button>
              </form>
            )}

            {paymentStatus === "loading" && (
              <div className="payment-status-container">
                <div className="payment-loading-spinner"></div>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="payment-status-container">
                <div className="payment-success-icon">
                  <i className="fa-regular fa-circle-check"></i>
                </div>
                <p className="payment-success-message">
                  Thank you for your purchase! Your order has been received and
                  is on its way.
                </p>
                <div className="navigation__buttons">
                  <Link
                    to="/"
                    className="nav__button payment__home--button"
                    onClick={() => {
                      setIsPaymentModalOpen(false);
                      setPaymentStatus("initial");
                    }}
                  >
                    Return Home
                  </Link>
                  <Link
                    to="/movies"
                    className="nav__button payment__browse--button"
                    onClick={() => {
                      setIsPaymentModalOpen(false);
                      setPaymentStatus("initial");
                    }}
                  >
                    Browse More Movies
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
