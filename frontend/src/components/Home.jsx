import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import AppContext from "../Context/Context";

const Home = () => {
  const { data, isError, isLoading, refreshData, addToCart } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [productImages, setProductImages] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const location = useLocation();

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      setProducts(data);
      setFilteredProducts(data);
      // Fetch images for all products
      data.forEach((product) => {
        fetchProductImage(product.id);
      });
    }
  }, [data]);

  // Handle URL parameters for search and category
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    const categoryParam = urlParams.get('category');

    if (searchParam) {
      setSearchKeyword(searchParam);
      handleSearch(searchParam);
    } else if (categoryParam) {
      setSelectedCategory(categoryParam);
      filterByCategory(categoryParam, data);
    } else {
      setSearchKeyword("");
      setSelectedCategory("");
      setFilteredProducts(data);
    }
  }, [location.search, data]);

  const fetchProductImage = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:9090/api/product/${productId}/image`,
        { responseType: "blob" }
      );
      const imageUrl = URL.createObjectURL(response.data);
      setProductImages((prev) => ({
        ...prev,
        [productId]: imageUrl,
      }));
    } catch (error) {
      console.warn(`Failed to fetch image for product ${productId}`);
      setProductImages((prev) => ({
        ...prev,
        [productId]: "https://via.placeholder.com/300x200?text=No+Image",
      }));
    }
  };

  const handleSearch = async (keyword) => {
    if (!keyword || keyword.trim() === "") {
      setFilteredProducts(data);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `http://localhost:9090/api/products/search?keyword=${keyword}`
      );
      setFilteredProducts(response.data);
      
      // Fetch images for search results
      response.data.forEach((product) => {
        if (!productImages[product.id]) {
          fetchProductImage(product.id);
        }
      });
    } catch (error) {
      console.error("Search error:", error);
      // Fallback to client-side filtering
      const filtered = data.filter(
        (product) =>
          product.name?.toLowerCase().includes(keyword.toLowerCase()) ||
          product.desc?.toLowerCase().includes(keyword.toLowerCase()) ||
          product.brand?.toLowerCase().includes(keyword.toLowerCase()) ||
          product.category?.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredProducts(filtered);
    } finally {
      setIsSearching(false);
    }
  };

  const filterByCategory = (category, productData = data) => {
    if (!category) {
      setFilteredProducts(productData);
      return;
    }
    const filtered = productData.filter(
      (product) =>
        product.category?.toLowerCase() === category.toLowerCase()
    );
    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchKeyword("");
    setSelectedCategory("");
    setFilteredProducts(data);
    window.history.pushState({}, "", "/");
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.available) {
      alert("Product is not available");
      return;
    }

    if (product.quantity <= 0) {
      alert("Product is out of stock");
      return;
    }

    setAddingToCart((prev) => ({
      ...prev,
      [product.id]: true,
    }));

    const result = await addToCart(product.id, 1);

    setAddingToCart((prev) => ({
      ...prev,
      [product.id]: false,
    }));

    if (result.success) {
      alert("Product added to cart successfully!");
    } else {
      alert(result.error || "Failed to add product to cart");
    }
  };

  if (isLoading) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Something went wrong...
      </h2>
    );
  }

  return (
    <>
      {/* Search/Filter Header */}
      {(searchKeyword || selectedCategory) && (
        <div className="container" style={{ paddingTop: "6rem", paddingBottom: "1rem" }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 style={{ color: "var(--text_color)", marginBottom: "0.5rem" }}>
                {searchKeyword && `Search Results for "${searchKeyword}"`}
                {selectedCategory && `Category: ${selectedCategory}`}
              </h4>
              <p style={{ color: "var(--text_color)", opacity: "0.7", marginBottom: "0" }}>
                {filteredProducts.length} product(s) found
              </p>
            </div>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={clearFilters}
              style={{ whiteSpace: "nowrap" }}
            >
              <i className="bi bi-x-circle me-1"></i>
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {filteredProducts.length === 0 && !isSearching && (
        <div className="text-center" style={{ padding: "5rem 1rem" }}>
          <i
            className="bi bi-inbox"
            style={{ fontSize: "4rem", color: "var(--text_color)", opacity: "0.5" }}
          ></i>
          <h3 style={{ color: "var(--text_color)", marginTop: "1rem" }}>
            No products found
          </h3>
          <p style={{ color: "var(--text_color)", opacity: "0.7" }}>
            {searchKeyword
              ? `No results for "${searchKeyword}". Try a different search term.`
              : "Try adjusting your filters or search criteria."}
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={clearFilters}
          >
            View All Products
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length > 0 && (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="product-link"
            >
              <div className="product-card">
                <div className="product-card-image">
                  <img
                    src={
                      productImages[product.id] ||
                      "https://via.placeholder.com/300x200?text=Loading..."
                    }
                    alt={product.name}
                    className="product-img"
                  />
                </div>
                <div>
                  <div className="product-top">
                    <span className="product-badge">
                      {product.category || "N/A"}
                    </span>
                    <h5 className="product-title">
                      {product.name ? product.name : "N/A"}
                    </h5>
                    <span className="product-brand">
                      by {product.brand || "N/A"}
                    </span>
                  </div>
                  <div>
                    {product.release_date && (
                      <p className="product-date">
                        {moment(product.release_date).format("MMM DD, YYYY")}
                      </p>
                    )}
                    <p className="product-price">
                      ₹
                      {product.price
                        ? product.price.toLocaleString("en-IN")
                        : "0"}
                    </p>
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={
                        !product.available ||
                        product.quantity <= 0 ||
                        addingToCart[product.id]
                      }
                    >
                      {addingToCart[product.id]
                        ? "Adding..."
                        : product.available && product.quantity > 0
                        ? "Add to Cart"
                        : "Out of Stock"}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Home;