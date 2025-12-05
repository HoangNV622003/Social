package vn.datn.social.dto.response.projection;

public interface MonthlySummaryProjection {
    Integer getMonth();
    Long getTotalPosts();
    Long getTotalUsers();
    Long getTotalComments();
    Long getTotalMessages();
    Long getTotalLikes();
}
