package vn.datn.social.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "reported_post")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportedPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String reason; // Lý do báo cáo

    @Column(nullable = false)
    private Date reportedAt; // Thời gian báo cáo

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post; // Liên kết với bảng Post

    @Column(name = "reported_by", nullable = false)
    private Long reportedBy; // Chỉ lưu user_id của người báo cáo
}
