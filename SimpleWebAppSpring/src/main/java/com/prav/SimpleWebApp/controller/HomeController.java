package com.prav.SimpleWebApp.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
//@Controller
public class HomeController {

    @RequestMapping("/")
//    @ResponseBody
    public String greet(){
        return "Welcome to springBoot!";
    }

    @RequestMapping("/about")
    public String about(){
        return "About Page is under construction!";
    }
}
