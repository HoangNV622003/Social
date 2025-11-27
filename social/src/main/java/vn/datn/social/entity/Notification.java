package vn.datn.social.entity;
import jakarta.persistence.*;
import lombok.*;
import vn.datn.social.constant.NotificationType;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contentnoti;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

    private String status; // e.g., "unread", "read"

    private LocalDateTime timestamp; // to store the notification creation time

    @Enumerated(EnumType.STRING) // Sử dụng EnumType.STRING để lưu trữ giá trị enum
    private NotificationType type;
}
