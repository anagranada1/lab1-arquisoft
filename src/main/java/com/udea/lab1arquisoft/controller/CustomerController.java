package com.udea.lab1arquisoft.controller;

import com.udea.lab1arquisoft.DTO.CustomerDTO;
import com.udea.lab1arquisoft.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private CustomerService customerService;

    public CustomerController (CustomerService customerService){
        this.customerService=customerService;

    }
    //obtener todos los clientes
    //Recursos HTTP --> URL
    //Metodos HTTP --> GET, POST, DELETE
    //Representacion del recurso JSON, XML,  texto plano
    //codigos de respuesta HTTP(200 OK),(201 CREATE), 404 (NOT FOUND)

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers(){
        return ResponseEntity.ok(customerService.getAllCustomers());

    }
    //Obtener un cliente por un id
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO>getCustomerById(@PathVariable Long id){
        return ResponseEntity.ok(customerService.getCustomerById(id));

    }
    //Crear un nuevo cliente
    @PostMapping
    public ResponseEntity<CustomerDTO>createCustomer(@RequestBody CustomerDTO customerDTO){
        if (customerDTO.getBalance()==null){
            throw new IllegalArgumentException("El saldo no puede ser nulo. ");

        }
        return ResponseEntity.ok(customerService.createCustomer(customerDTO));
    }

    //Actualizar un cliente
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody CustomerDTO customerDTO){
        try {
            return ResponseEntity.ok(customerService.updateCustomer(id, customerDTO));
        } catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //Borrar un cliente
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id){
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
