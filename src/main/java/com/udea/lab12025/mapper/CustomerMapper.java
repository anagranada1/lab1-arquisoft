package com.udea.lab12025.mapper;

import com.udea.lab12025.DTO.CustomerDTO;
import com.udea.lab12025.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    CustomerMapper INSTANCE = Mappers.getMapper(CustomerMapper.class);
    //El INSTANCE Genera instancia automatica en tiempo en compilacion
    CustomerDTO toDTO(Customer customer);
    Customer toEntity(CustomerDTO customerDTO);
}
