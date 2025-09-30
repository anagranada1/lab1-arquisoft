package com.udea.lab12025.service;

import com.udea.lab12025.DTO.CustomerDTO;
import com.udea.lab12025.entity.Customer;
import com.udea.lab12025.mapper.CustomerMapper;
import com.udea.lab12025.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Autowired
    public CustomerService(CustomerRepository customerRepository,CustomerMapper customerMapper){
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }

    //Obtener informacion de todos los clientes
    public List<CustomerDTO> getAllCustomers(){
        return customerRepository.findAll().stream().map(customerMapper::toDTO).toList();
    }

    //Obtener el dato de un cliente por un ID
    public CustomerDTO getCustomerById(Long id){
        return customerRepository.findById(id).map(customerMapper::toDTO).orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    //Crear un nuevo cliente
    public CustomerDTO createCustomer(CustomerDTO customerDTO){
        Customer customer = customerMapper.toEntity(customerDTO);
        return customerMapper.toDTO(customerRepository.save(customer));
    }
}
