package com.udea.lab12025.mapper;

import com.udea.lab12025.DTO.TransactionDTO;
import com.udea.lab12025.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TransactionMapper {
    TransactionMapper INSTANCE = Mappers.getMapper(TransactionMapper.class);
    TransactionDTO toDTO(Transaction transaction);
}
