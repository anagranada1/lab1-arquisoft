package com.udea.lab1arquisoft.DTO;

public class CustomerDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String accountNumber;
    private Double balance;

    public CustomerDTO(Double balance, String accountNumber, String lastName, String firstName, Long id) {
        this.balance = balance;
        this.accountNumber = accountNumber;
        this.lastName = lastName;
        this.firstName = firstName;
        this.id = id;
    }

    public CustomerDTO() {

    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
