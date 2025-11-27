import axios from "../axios";
import { useState, useEffect, createContext } from "react";

const AppContext = createContext({
  data: [],
  isError: "",
  isLoading: false,
  cart: [],
  cartItems: [],
  addToCart: (productId, quantity) => {},
  removeFromCart: (cartItemId) => {},
  refreshData: () => {},
  fetchCartItems: () => {},
  updateCartQuantity: (cartItemId, quantity) => {},
  clearCart: () => {},
  getCartTotal: () => {},
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Fetch all products
  const refreshData = async () => {
    setIsLoading(true);
    setIsError("");
    try {
      const response = await axios.get("/products");
      if (response.status === 200 || response.status === 302) {
        setData(response.data);
        setIsError("");
      } else {
        setIsError(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart items from backend
  const fetchCartItems = async () => {
    try {
      const response = await axios.get("/cart");
      setCartItems(response.data || []);
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      // Fallback to localStorage
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(savedCart);
    }
  };

  // Add to cart (backend)
  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post(`/cart?productId=${productId}&quantity=${quantity}`);
      console.log("Product added to cart:", response.data);
      // Refresh cart items
      await fetchCartItems();
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error adding to cart:", error);
      const errorMsg = error.response?.data?.error || "Failed to add item to cart";
      setIsError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Update cart item quantity
  const updateCartQuantity = async (cartItemId, newQuantity) => {
    try {
      const response = await axios.put(`/cart/${cartItemId}?quantity=${newQuantity}`);
      console.log("Cart updated:", response.data);
      // Refresh cart items
      await fetchCartItems();
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error updating cart:", error);
      const errorMsg = error.response?.data?.error || "Failed to update cart";
      setIsError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Remove from cart (by cart item ID from backend)
  const removeFromCart = async (cartItemId) => {
    try {
      const response = await axios.delete(`/cart/${cartItemId}`);
      console.log("Item removed from cart:", response.data);
      // Refresh cart items
      await fetchCartItems();
      return { success: true };
    } catch (error) {
      console.error("Error removing from cart:", error);
      const errorMsg = error.response?.data?.error || "Failed to remove item";
      setIsError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      await axios.delete("/cart");
      // Refresh cart items to ensure UI is in sync
      await fetchCartItems();
      console.log("Cart cleared");
      return { success: true };
    } catch (error) {
      console.error("Error clearing cart:", error);
      return { success: false, error: error.message };
    }
  };

  // Get cart total
  const getCartTotal = async () => {
    try {
      const response = await axios.get("/cart/total");
      setCartTotal(response.data.total || 0);
      return response.data.total;
    } catch (error) {
      console.error("Error fetching cart total:", error);
      return 0;
    }
  };

  // Initialize - fetch products and cart items
  useEffect(() => {
    refreshData();
    fetchCartItems();
    getCartTotal();
  }, []);
  
  return (
    <AppContext.Provider
      value={{
        data,
        isError,
        isLoading,
        cart,
        cartItems,
        cartTotal,
        addToCart,
        removeFromCart,
        refreshData,
        fetchCartItems,
        updateCartQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;