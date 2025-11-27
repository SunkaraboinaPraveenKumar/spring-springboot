import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useState } from "react";
import moment from "moment";
import AppContext from "../Context/Context";
import axios from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9090/api/product/${id}`
        );
        console.log("Product response:", response.data);
        setProduct(response.data);
        // Try to fetch image - the backend might handle this automatically
        try {
          const imgResponse = await axios.get(
            `http://localhost:9090/api/product/${id}/image`,
            { responseType: "blob" }
          );
          console.log("Image fetched successfully");
          setImageUrl(URL.createObjectURL(imgResponse.data));
        } catch (imgError) {
          console.warn("Image fetch failed, using placeholder");
          setImageUrl("https://via.placeholder.com/400x400?text=No+Image");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleStartEditing = () => {
    setEditFormData({
      name: product.name,
      brand: product.brand,
      price: product.price,
      category: product.category,
      desc: product.desc,
      quantity: product.quantity,
      available: product.available,
      release_date: product.release_date
    });
    setIsEditing(true);
  };

  const handleEditChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: field === 'available' ? value === 'true' : 
               field === 'quantity' ? parseInt(value) || 0 :
               field === 'price' ? parseFloat(value) || 0 :
               value
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      setIsEditing(false);
      const formData = new FormData();
      
      // Add product data as JSON Blob with proper content type
      const productBlob = new Blob([JSON.stringify(editFormData)], { 
        type: 'application/json' 
      });
      formData.append('product', productBlob);
      
      // Add image only if a new one is selected
      if (selectedImage) {
        formData.append('imageFile', selectedImage);
      }

      const response = await axios.put(
        `http://localhost:9090/api/product/${id}`,
        formData
      );

      console.log("Product updated successfully:", response.data);
      alert("Product updated successfully!");
      
      // Refresh product data
      const updatedProduct = await axios.get(
        `http://localhost:9090/api/product/${id}`
      );
      setProduct(updatedProduct.data);
      
      // Refresh image if new one was uploaded
      if (selectedImage) {
        try {
          const imgResponse = await axios.get(
            `http://localhost:9090/api/product/${id}/image`,
            { responseType: "blob" }
          );
          setImageUrl(URL.createObjectURL(imgResponse.data));
        } catch (imgError) {
          console.warn("Image fetch failed");
        }
      }
      
      setSelectedImage(null);
      refreshData();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product: " + (error.response?.data?.error || error.message));
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
    setSelectedImage(null);
  };

  const handleDeleteProduct = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await axios.delete(`http://localhost:9090/api/product/${id}`);
      console.log("Product deleted successfully");
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product: " + (error.response?.data?.error || error.message));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product.available) {
      alert("Product is not available");
      return;
    }

    if (product.quantity < quantity) {
      alert(`Only ${product.quantity} items available in stock`);
      return;
    }

    setIsAddingToCart(true);

    const result = await addToCart(product.id, quantity);

    setIsAddingToCart(false);

    if (result.success) {
      alert("Product added to cart successfully!");
      setQuantity(1); // Reset quantity
    } else {
      alert(result.error || "Failed to add product to cart");
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(product.quantity, parseInt(value) || 1));
    setQuantity(newQuantity);
  };

  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  if (isEditing) {
    return (
      <div className="product-container">
        <div className="edit-form-container">
          <h2>Edit Product</h2>
          
          <div className="edit-form">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                value={editFormData.name || ''}
                onChange={(e) => handleEditChange('name', e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>Brand *</label>
              <input
                type="text"
                value={editFormData.brand || ''}
                onChange={(e) => handleEditChange('brand', e.target.value)}
                placeholder="Enter brand name"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                value={editFormData.category || ''}
                onChange={(e) => handleEditChange('category', e.target.value)}
                placeholder="Enter category"
              />
            </div>

            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                value={editFormData.price || ''}
                onChange={(e) => handleEditChange('price', e.target.value)}
                placeholder="Enter price"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                value={editFormData.quantity || ''}
                onChange={(e) => handleEditChange('quantity', e.target.value)}
                placeholder="Enter quantity"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Release Date *</label>
              <input
                type="date"
                value={editFormData.release_date || ''}
                onChange={(e) => handleEditChange('release_date', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={editFormData.desc || ''}
                onChange={(e) => handleEditChange('desc', e.target.value)}
                placeholder="Enter product description"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Available</label>
              <select
                value={editFormData.available || false}
                onChange={(e) => handleEditChange('available', e.target.value)}
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>

            <div className="form-group">
              <label>Product Image</label>
              <div className="image-preview">
                {selectedImage ? (
                  <img src={URL.createObjectURL(selectedImage)} alt="Preview" />
                ) : (
                  <img src={imageUrl} alt="Current" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
              />
              {selectedImage && (
                <p className="file-name">Selected: {selectedImage.name}</p>
              )}
            </div>

            <div className="form-actions">
              <button className="btn-save" onClick={handleUpdateProduct}>
                Save Changes
              </button>
              <button className="btn-cancel" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="product-container">
        <img
          className="product-image"
          src={imageUrl}
          alt={product.name}
        />

        <div className="product-info">
          <div className="product-description">
            <span className="product-category">{product.category}</span>
            <h1>{product.name}</h1>
            <h6>{product.brand}</h6>
            <p>{product.desc}</p>
            {product.release_date && (
              <p>
                Released: {moment(product.release_date).format("MMMM DD, YYYY")}
              </p>
            )}
          </div>

          <div className="product-price-section">
            <span className="price-tag">₹{product.price?.toLocaleString("en-IN")}</span>
            
            <div className="stock-info">
              <h6>Stock Available: <span className={product.quantity > 0 ? "stock-available" : "stock-unavailable"}>{product.quantity || 0}</span></h6>
            </div>

            {product.available && product.quantity > 0 && (
              <div className="quantity-section">
                <label className="quantity-label">Quantity:</label>
                <div className="quantity-selector">
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className="qty-input"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    min="1"
                    max={product.quantity}
                  />
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              className="cart-button"
              onClick={handleAddToCart}
              disabled={!product.available || product.quantity <= 0 || isAddingToCart}
            >
              {isAddingToCart
                ? "Adding..."
                : product.available && product.quantity > 0
                ? "Add to cart"
                : "Out of Stock"}
            </button>
            
            <div className="product-actions">
              <button 
                className="btn-edit"
                onClick={handleStartEditing}
              >
                Edit Product
              </button>
              <button 
                className="btn-delete"
                onClick={handleDeleteProduct}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Product"}
              </button>
            </div>
            
            <div className="listed-info">
              <h6>Product listed on:</h6>
              <span className="listed-date">
                {product.release_date ? moment(product.release_date).format("MMMM DD, YYYY") : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;