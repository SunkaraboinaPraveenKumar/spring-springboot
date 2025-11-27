import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";

const Navbar = () => {
  const { cartItems } = useContext(AppContext);
  const navigate = useNavigate();
  
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  }; 

  const [theme, setTheme] = useState(getInitialTheme());
  const [searchKeyword, setSearchKeyword] = useState("");
  
  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/?search=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate("/");
    }
  };

  const handleSearchInput = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleCategoryClick = (category) => {
    navigate(`/?category=${category}`);
  };

  // Calculate cart item count
  const cartItemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: "var(--navbar_background)", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <div className="container-fluid">
            <Link className="navbar-brand" to="/" style={{ fontWeight: "700", fontSize: "1.5rem", color: "var(--navbar_text)" }}>
              🛒 Ecommerce
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/" style={{ fontWeight: "600", color: "var(--navbar_text)" }}>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add_product" style={{ fontWeight: "600", color: "var(--navbar_text)" }}>
                    Add Product
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ fontWeight: "600", color: "var(--navbar_text)" }}
                  >
                    Categories
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick('Electronics'); }}>
                        Electronics
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick('Fashion'); }}>
                        Fashion
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick('Home'); }}>
                        Home
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleCategoryClick('Books'); }}>
                        Books
                      </a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link className="dropdown-item" to="/">
                        All Categories
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>

              <form className="d-flex align-items-center me-3" onSubmit={handleSearch}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search products..."
                  aria-label="Search"
                  value={searchKeyword}
                  onChange={handleSearchInput}
                  style={{ minWidth: "200px" }}
                />
                <button 
                  className="btn btn-outline-primary" 
                  type="submit"
                  style={{ whiteSpace: "nowrap" }}
                >
                  <i className="bi bi-search"></i>
                </button>
              </form>

              <button 
                className="theme-btn me-3" 
                onClick={() => toggleTheme()} 
                style={{ 
                  backgroundColor: "transparent", 
                  border: "none", 
                  fontSize: "1.3rem", 
                  cursor: "pointer", 
                  color: "var(--navbar_text)" 
                }}
              >
                {theme === "dark-theme" ? (
                  <i className="bi bi-moon-fill"></i>
                ) : (
                  <i className="bi bi-sun-fill"></i>
                )}
              </button>

              <div className="d-flex align-items-center">
                <Link to="/cart" className="nav-link position-relative" style={{ fontWeight: "600", color: "var(--navbar_text)" }}>
                  <i className="bi bi-cart" style={{ fontSize: "1.5rem" }}></i>
                  {cartItemCount > 0 && (
                    <span 
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;