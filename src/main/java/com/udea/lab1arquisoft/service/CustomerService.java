package com.udea.lab1arquisoft.service;

import com.udea.lab1arquisoft.DTO.CustomerDTO;
import com.udea.lab1arquisoft.entity.Customer;
import com.udea.lab1arquisoft.mapper.CustomerMapper;
import com.udea.lab1arquisoft.repository.CustomerRepository;
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
        // validar unicidad
        if (customerDTO.getAccountNumber()==null||customerDTO.getAccountNumber().isBlank()){
            throw new IllegalArgumentException("El número de cuenta es obligatorio");
        }
        if (customerRepository.existsByAccountNumber(customerDTO.getAccountNumber())){
            throw new IllegalArgumentException("Ya existe un cliente con ese número de cuenta");
        }
        Customer customer = customerMapper.toEntity(customerDTO);
        if (customer.getBalance()==null){
            customer.setBalance(0d);
        }
        return customerMapper.toDTO(customerRepository.save(customer));
    }

    //Actualizar un cliente
    public CustomerDTO updateCustomer(Long id, CustomerDTO dto) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // Validaciones simples
        if (dto.getFirstName() == null || dto.getFirstName().isBlank())
            throw new IllegalArgumentException("El nombre es obligatorio.");
        if (dto.getLastName() == null || dto.getLastName().isBlank())
            throw new IllegalArgumentException("El apellido es obligatorio.");
        if (dto.getAccountNumber() == null || dto.getAccountNumber().isBlank())
            throw new IllegalArgumentException("El número de cuenta es obligatorio.");
        if (dto.getBalance() == null)
            throw new IllegalArgumentException("El balance es obligatorio.");

        // Unicidad del número de cuenta
        if (customerRepository.existsByAccountNumberAndIdNot(dto.getAccountNumber(), id)) {
            throw new IllegalArgumentException("Ya existe un cliente con ese número de cuenta.");
        }

        // Merge controlado
        c.setFirstName(dto.getFirstName().trim());
        c.setLastName(dto.getLastName().trim());
        c.setAccountNumber(dto.getAccountNumber().trim());
        c.setBalance(dto.getBalance());

        c = customerRepository.save(c);
        return customerMapper.toDTO(c);
    }

    //Borrar cliente
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Cliente no encontrado");
        }
        customerRepository.deleteById(id);
    }
}
