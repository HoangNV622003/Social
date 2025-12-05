package vn.datn.social.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.domain.Auditable;

import java.io.Serial;
import java.io.Serializable;
import java.sql.Blob;
import java.util.Date;

@Entity
@Table(name = "comment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment extends AbstractAuditingEntity implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @Column(name = "post_id", nullable = false)
    private Long postId;

    @Column(name = "image")
    String image;
}
