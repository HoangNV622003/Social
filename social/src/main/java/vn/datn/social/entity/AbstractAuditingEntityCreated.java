package vn.datn.social.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serial;
import java.io.Serializable;
@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AbstractAuditingEntityCreated extends AbstractAuditingDateCreated implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @CreatedBy
    @JsonIgnore
    @Column(name = "created_by", nullable = false, updatable = false)
    private Long createdBy;
}
