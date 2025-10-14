package com.shecodes.helpdesk.exception;

//criação de classe exception customizada
public class NotFoundException extends RuntimeException{
    public NotFoundException(String message){
        super(message);
    }
}
