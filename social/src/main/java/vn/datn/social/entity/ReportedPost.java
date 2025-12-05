package vn.datn.social.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "reported_post")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportedPost extends AbstractAuditingEntity implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "post_id", nullable = false)
    Long postId;

    @Column(nullable = false)
    private String reason; // Lý do báo cáo
}
