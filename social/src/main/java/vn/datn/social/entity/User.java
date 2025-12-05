package vn.datn.social.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.sql.Blob;
import java.util.List;

@Entity
@Table(name = "user", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends AbstractAuditingEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="username",nullable = false, unique = true)
    private String username;

    @Column(name="password",length = 60, nullable = false)
    private String password;

    @Column(name="email",nullable = false, unique = true)
    private String email;

    @Column(name="address")
    private String address;

    @Column(name = "image")
    private String image;

    private Integer role;
}
