import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup.jsx";

const Cart = () => {
  const { cartItems, removeFromCart, updateCartQuantity, clearCart, fetchCartItems, getCartTotal } = useContext(AppContext);
  const [cartItemsWithImages, setCartItemsWithImages] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState({});

  // Fetch cart items on component mount
  useEffect(() => {
    fetchCartItems();
    getCartTotal();
  }, []);

  // Fetch images for cart items
  useEffect(() => {
    const fetchImages = async () => {
      if (cartItems && cartItems.length > 0) {
        const itemsWithImages = await Promise.all(
          cartItems.map(async (cartItem) => {
            try {
              const response = await axios.get(
                `http://localhost:9090/api/product/${cartItem.product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...cartItem, imageUrl };
            } catch (error) {
              console.warn(`Failed to fetch image for product ${cartItem.product.id}`);
              return {
                ...cartItem,
                imageUrl: "https://via.placeholder.com/200x200?text=No+Image",
              };
            }
          })
        );
        setCartItemsWithImages(itemsWithImages);
      } else {
        // Clear the cart items with images when cart is empty
        setCartItemsWithImages([]);
      }
    };

    fetchImages();
  }, [cartItems]);

  // Calculate total price
  useEffect(() => {
    const total = cartItemsWithImages.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
    setCartTotal(total);
  }, [cartItemsWithImages]);

  const handleRemoveFromCart = async (cartItemId) => {
    const result = await removeFromCart(cartItemId);
    if (result.success) {
      alert("Item removed from cart");
      // Refresh cart items to update UI
      await fetchCartItems();
    } else {
      alert(result.error || "Failed to remove item");
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    setIsUpdating((prev) => ({
      ...prev,
      [cartItemId]: true,
    }));

    const result = await updateCartQuantity(cartItemId, newQuantity);

    setIsUpdating((prev) => ({
      ...prev,
      [cartItemId]: false,
    }));

    if (!result.success) {
      alert(result.error || "Failed to update quantity");
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear the entire cart?")) {
      const result = await clearCart();
      if (result.success) {
        alert("Cart cleared successfully");
        // Refresh cart items to update UI
        await fetchCartItems();
      } else {
        alert(result.error || "Failed to clear cart");
      }
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="shopping-cart">
        <h2>Shopping Cart</h2>
        <p style={{ textAlign: "center", padding: "2rem" }}>
          Your cart is empty. <a href="/">Continue shopping</a>
        </p>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2>Shopping Cart</h2>
        <button
          className="remove-button"
          onClick={handleClearCart}
          style={{ marginTop: 0 }}
        >
          Clear Cart
        </button>
      </div>

      {cartItemsWithImages.map((item) => (
        <div key={item.id} className="cart-item">
          <img
            src={item.imageUrl}
            alt={item.product.name}
            className="cart-item-image"
          />
          <div className="cart-item-details">
            <h5>{item.product.name}</h5>
            <p className="cart-item-brand">by {item.product.brand}</p>
            <p className="cart-item-price">
              ₹{item.product.price.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="cart-item-quantity">
            <button
              className="quantity-button"
              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
              disabled={isUpdating[item.id] || item.quantity <= 1}
            >
              −
            </button>
            <span className="quantity-display">{item.quantity}</span>
            <button
              className="quantity-button"
              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
              disabled={isUpdating[item.id]}
            >
              +
            </button>
          </div>
          <div className="cart-item-subtotal">
            <p className="subtotal-label">Subtotal:</p>
            <p className="subtotal-price">
              ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
            </p>
          </div>
          <button
            className="remove-button"
            onClick={() => handleRemoveFromCart(item.id)}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <div className="summary-item">
          <span>Subtotal:</span>
          <span>₹{cartTotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="summary-item">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="summary-item summary-total">
          <span>Total:</span>
          <span>₹{cartTotal.toLocaleString("en-IN")}</span>
        </div>
        <button className="checkout-button" onClick={() => setShowModal(true)}>
          Proceed to Checkout
        </button>
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItemsWithImages}
        totalPrice={cartTotal}
      />
    </div>
  );
};

export default Cart;