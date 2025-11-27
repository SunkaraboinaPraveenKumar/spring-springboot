package com.prav.ecom_proj.repo;

import com.prav.ecom_proj.model.Cart;
import com.prav.ecom_proj.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepo extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByProduct(Product product);
}