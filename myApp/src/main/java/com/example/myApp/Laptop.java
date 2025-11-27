package com.example.myApp;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

// @Component
// public class Laptop {
//     public void compile(){
//         System.out.println("Compiling an Awesome Project!");
//     }
// }

@Component
@Primary  
public class Laptop implements Computer{
    public void compile(){
        System.out.println("Compiling an Awesome Project!");
    }
}