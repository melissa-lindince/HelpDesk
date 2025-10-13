package com.shecodes.helpdesk.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Getter
@Setter
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title", length = 35, nullable = false)
    private String title;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "created_on", nullable = false)
    private LocalDateTime createdOn;

//    @Column(name = "data_ultima_atualizacao", nullable = false)
//    private LocalDateTime dataAtualizacao;

    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

//    @Column(name = "dias_ativos")
//    private LocalDateTime diasAtivos;

    //
    @Enumerated(EnumType.STRING)
    @JoinColumn(name = "category")
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;


    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    @ManyToOne
    @JoinColumn(name = "responsable_id")
    private User responsableUser;

    public Ticket() {
    }

    public Ticket(String title, String description, Category category, Priority priority, User author, User responsableUser) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.author = author;
        this.responsableUser = responsableUser;
    }

    //Pesquisar como definir a data de entrega com base na prioridade(Camada Service)
}
