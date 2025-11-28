package com.oauth.springoauth2demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {


    @GetMapping("/")
    public String greet() {
        return "Welcome to OAuth Google, Last Video...";
    }
}
