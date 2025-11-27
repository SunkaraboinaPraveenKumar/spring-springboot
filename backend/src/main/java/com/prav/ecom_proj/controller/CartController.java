package com.prav.ecom_proj.controller;

import com.prav.ecom_proj.model.Cart;
import com.prav.ecom_proj.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<Cart>> getAllCartItems() {
        return new ResponseEntity<>(cartService.getAllCartItems(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cart> getCartItemById(@PathVariable int id) {
        Cart cartItem = cartService.getCartItemById(id);
        if (cartItem != null) {
            return new ResponseEntity<>(cartItem, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestParam int productId, @RequestParam int quantity) {
        try {
            Cart cart = cartService.addToCart(productId, quantity);
            return new ResponseEntity<>(cart, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCartItem(@PathVariable int id, @RequestParam int quantity) {
        try {
            Cart updatedCart = cartService.updateCartQuantity(id, quantity);
            if (updatedCart != null) {
                return new ResponseEntity<>(updatedCart, HttpStatus.OK);
            }
            return new ResponseEntity<>("Cart item not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCartItem(@PathVariable int id) {
        try {
            cartService.deleteCartItem(id);
            return new ResponseEntity<>("Cart item deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart() {
        try {
            cartService.clearCart();
            return new ResponseEntity<>("Cart cleared successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getCartTotal() {
        BigDecimal total = cartService.getCartTotal();
        return new ResponseEntity<>(total, HttpStatus.OK);
    }
}