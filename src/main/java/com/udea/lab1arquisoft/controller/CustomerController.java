package com.udea.lab1arquisoft.controller;

import com.udea.lab1arquisoft.DTO.CustomerDTO;
import com.udea.lab1arquisoft.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    //Obtener todos los clientes
    //Recursos HTTP --> URL
    //Metodos HTTP --> GET, POST, PUT, DELETE
    //Representaciòn del recurso JSON/XML/Testo plano
    //Còdigos de respuesta HTTP (200 ok), (201 created), (404 Not Found)

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers(){
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    //Obtener un cliente por un Id
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Long id){
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    //Crear un nuevo cliente
    @PostMapping
    public ResponseEntity<CustomerDTO> createCustomer(@RequestBody CustomerDTO customerDTO){
        if(customerDTO.getBalance()==null){
            throw new IllegalArgumentException("El saldo no puede ser nulo");
        }
        return ResponseEntity.ok(customerService.createCustomer(customerDTO));
    }
}
