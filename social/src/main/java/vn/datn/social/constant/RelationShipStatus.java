package vn.datn.social.constant;

import lombok.Getter;

@Getter
public enum RelationShipStatus {
    SELF,
    SENT_REQUEST,     // Đã gửi lời mời kết bạn
    RECEIVED_REQUEST, // Nhận được lời mời kết bạn
    FRIEND,           // Đã là bạn bè
    STRANGER          // Người lạ, không có quan hệ gì
}
