package com.shecodes.helpdesk.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "created_at", nullable = false)
    private LocalDate createdOn;

    @OneToMany(mappedBy = "author")
    private List<Ticket> createdTickets;

    @OneToMany(mappedBy = "responsableUser")
    private List<Ticket> assignedTickets;

    public User() {}

    public User(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", createdAt=" + createdOn +
                ", tarefasCriadas=" + createdTickets +
                ", tarefasDesignadas=" + assignedTickets +
                '}';
    }
}
