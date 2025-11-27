import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  return (
    <div className="checkoutPopup">
   
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: "700", fontSize: "1.3rem" }}>Checkout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="checkout-items">
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item" style={{ display: 'flex', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
              <img src={item.imageUrl} alt={item.product?.name || 'Product'} style={{ width: '80px', height: '80px', marginRight: '15px', objectFit: 'cover', borderRadius: '5px' }} />
              <div style={{ flex: 1 }}>
                <b><p style={{ margin: "5px 0" }}>{item.product?.name || 'Product'}</p></b>
                <p style={{ margin: "5px 0", color: "#666" }}>Quantity: {item.quantity}</p>
                <p style={{ margin: "5px 0", fontWeight: "600", color: "#2c3e50" }}>₹{((item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
          <div className="total" style={{ paddingTop: "10px", borderTop: "2px solid #333" }}>
            <h5 style={{ fontWeight: "700", color: "#2c3e50" }}>Total: ₹{(totalPrice || 0).toLocaleString("en-IN")}</h5>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCheckout} style={{ backgroundColor: "#007bff", fontWeight: "600" }}>
          Confirm Purchase
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  );
};

export default CheckoutPopup;
