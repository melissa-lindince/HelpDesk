package com.shecodes.helpdesk.controllers;

import com.shecodes.helpdesk.dto.UserGetResponseDTO;
import com.shecodes.helpdesk.dto.UserMapper;
import com.shecodes.helpdesk.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public List<UserGetResponseDTO> listUsers(){
        return userRepository.findAll().stream().map(UserMapper::toDTO).collect(Collectors.toList());
    }
}
