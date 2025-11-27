package com.example.myApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Dev {
    // @Autowired // Field Injection
    // private Laptop laptop;
    // public Dev(Laptop laptop){
    //     this.laptop = laptop;
    // }
    // Constructor Injection

    // Setter Injection
    // @Autowired
    // public void setLaptop(Laptop laptop){
    //     this.laptop = laptop;
    // }

    @Autowired
    @Qualifier("desktop")
    private Computer comp;

    public void build(){
        // laptop.compile();
        comp.compile();
        System.out.println("Working on Awesome Project");
    }
}
