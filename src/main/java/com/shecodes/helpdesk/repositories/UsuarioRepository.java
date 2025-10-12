package com.shecodes.helpdesk.repositories;

import com.shecodes.helpdesk.models.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UsuarioRepository extends JpaRepository<User, Integer> {
}
