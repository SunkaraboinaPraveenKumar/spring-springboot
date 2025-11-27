package com.prav.SimpleWebApp.service;

import com.prav.SimpleWebApp.model.Product;
import com.prav.SimpleWebApp.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    ProductRepo repo;
//    List<Product> products = new ArrayList<>(Arrays.asList(
//            new Product(101,"IPhone",50000),
//            new Product(102,"Canon Camera",70000),
//            new Product(103,"Laptop",60000)
//    ));
    public List<Product> getProducts(){
//        return products;
        return repo.findAll();
    }
    public Product getProductById(int prodId){
//        for (Product product : products) {
//            if (product.getProdId() == prodId) {
//                return product;
//            }
//        }
//        normal for loop or enhanced for loop or Java StreamAPI
//        return products.stream().filter(p->p.getProdId()==prodId).findFirst().get();
//        return products.stream().filter(p->p.getProdId()==prodId).findFirst().orElse(new Product(100,"No Item",0));
//        return null;
        return repo.findById(prodId).orElse(new Product());
    }

    public void addProduct(Product prod){
//        products.add(prod);
        repo.save(prod);
    }


    public void updateProduct(Product prod){
//        int index=-1;
//        for(int i=0;i<= products.size();i++){
//            if(products.get(i).getProdId()==prod.getProdId()){
//                index=i;
//                break;
//            }
//        }
//        if(index==-1){
//            System.out.println("Product not found with ProductId: "+prod.getProdId());
//            return;
//        }
//        products.set(index, prod);
        repo.save(prod);
    }

    public void deleteProduct(int prodId) {
//        int index=-1;
//        for(int i=0;i<= products.size();i++){
//            if(products.get(i).getProdId()==prodId){
//                index=i;
//                break;
//            }
//        }
//        if(index==-1){
//            System.out.println("Product not found with ProductId: "+prodId+" to delete");
//            return;
//        }
//        products.remove(index);
        repo.deleteById(prodId);
    }
}
