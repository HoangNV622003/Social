package vn.datn.social.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

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
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "Username không được để trống")
    @Size(min = 5, message = "Username phải có ít nhất 5 ký tự")
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, message = "Password phải có ít nhất 6 ký tự")
    @Column(length = 60, nullable = false)
    private String password;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Column(nullable = false, unique = true)
    private String email;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<Post> posts;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<Comment> comments;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<Like> likes;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<FriendShip> friendships;

    @OneToMany(mappedBy = "friend", fetch = FetchType.EAGER)
    private List<FriendShip> friends;

    private boolean enabled;
    private String verificationCode;

    private boolean isAdmin = false;

    @Transient
    private boolean friendPending;

    @Transient
    private boolean friend;

    private boolean isOnline;


    private String address;

    @Lob
    private Blob image;

    private boolean friendRequestReceiver; // Thêm thuộc tính này
}
