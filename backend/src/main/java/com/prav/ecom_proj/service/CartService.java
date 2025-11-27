package com.prav.ecom_proj.service;

import com.prav.ecom_proj.model.Cart;
import com.prav.ecom_proj.model.Product;
import com.prav.ecom_proj.repo.CartRepo;
import com.prav.ecom_proj.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private ProductRepo productRepo;

    public List<Cart> getAllCartItems() {
        return cartRepo.findAll();
    }

    public Cart getCartItemById(int id) {
        return cartRepo.findById(id).orElse(null);
    }

    public Cart addToCart(int productId, int quantity) {
        Optional<Product> productOpt = productRepo.findById(productId);

        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }

        Product product = productOpt.get();

        if (!product.isAvailable()) {
            throw new RuntimeException("Product is not available");
        }

        if (product.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getQuantity());
        }

        // Check if product already exists in cart
        Optional<Cart> existingCart = cartRepo.findByProduct(product);

        if (existingCart.isPresent()) {
            Cart cart = existingCart.get();
            int newQuantity = cart.getQuantity() + quantity;

            if (product.getQuantity() < newQuantity) {
                throw new RuntimeException("Insufficient stock for requested quantity");
            }

            cart.setQuantity(newQuantity);
            return cartRepo.save(cart);
        } else {
            Cart cart = new Cart();
            cart.setProduct(product);
            cart.setQuantity(quantity);
            return cartRepo.save(cart);
        }
    }

    public Cart updateCartQuantity(int cartId, int quantity) {
        Optional<Cart> cartOpt = cartRepo.findById(cartId);

        if (cartOpt.isEmpty()) {
            return null;
        }

        Cart cart = cartOpt.get();
        Product product = cart.getProduct();

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        if (product.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getQuantity());
        }

        cart.setQuantity(quantity);
        return cartRepo.save(cart);
    }

    public void deleteCartItem(int id) {
        cartRepo.deleteById(id);
    }

    public void clearCart() {
        cartRepo.deleteAll();
    }

    public BigDecimal getCartTotal() {
        List<Cart> cartItems = cartRepo.findAll();
        return cartItems.stream()
                .map(Cart::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}