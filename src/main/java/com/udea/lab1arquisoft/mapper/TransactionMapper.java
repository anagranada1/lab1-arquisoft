package com.udea.lab1arquisoft.mapper;

import com.udea.lab1arquisoft.DTO.TransactionDTO;
import com.udea.lab1arquisoft.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TransactionMapper {
    TransactionMapper INSTANCE = Mappers.getMapper(TransactionMapper.class);
    TransactionDTO toDTO(Transaction transaction);
}
