package com.udea.lab1arquisoft.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {
    @GetMapping({"/customers", "/customers/**", "/transactions", "/transactions/**"})
    public String forwardSpa() {
        return "forward:/index.html";
    }
}
