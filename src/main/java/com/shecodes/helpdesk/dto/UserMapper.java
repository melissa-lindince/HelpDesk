package com.shecodes.helpdesk.dto;

import com.shecodes.helpdesk.models.User;

public class UserMapper {

    public static UserGetResponseDTO toDTO(User user){
        return new UserGetResponseDTO(
                user.getId(),
                user.getName()
        );
    }
}
