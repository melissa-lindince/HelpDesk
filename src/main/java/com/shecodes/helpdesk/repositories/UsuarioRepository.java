package com.shecodes.helpdesk.repositories;

import com.shecodes.helpdesk.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<User, Integer> {

    Optional<User> findByName(String name);
}
