package vn.datn.social.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.domain.Auditable;
import vn.datn.social.constant.NotificationType;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notifications")
public class Notification extends AbstractAuditingEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "deep_link", nullable = false)
    private String deepLink;

    @Column(name = "type", nullable = false)
    private Short type;

    @Column(name = "status", nullable = false)
    private Short status;
}
