package com.udea.lab12025.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "transactions") //Nombre de la tabla en la DB
public class Transaction {
    @Id //Indica que es un id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_account_number", nullable = false)
    private String senderAccountNumber;
    @Column(name = "receiver_account_number", nullable = false)
    private String receiverAccountNumber;
    @Column(nullable = false) //Como no se le especifica el nombre, toma el del attributo
    private Double amount;
    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;
}
