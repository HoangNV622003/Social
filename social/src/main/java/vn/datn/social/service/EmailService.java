package vn.datn.social.service;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import vn.datn.social.entity.User;

import java.io.UnsupportedEncodingException;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {

    private JavaMailSender mailSender;

    public void sendVerificationEmail(User user, String siteURL) throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = "phucnek169@gmail.com";
        String senderName = "Block Chat Email Verification";
        String subject = "Please Visit Your Account!";
        String content = "Dear [[name]],<br><br>"
                + "Thank you for registering an account at Block CHat!<br>"
                + "To complete your registration and verify your account, please click the link below:<br><br>"
                + "<h2><a href=\"[[URL]]\" target=\"_self\" style=\"text-decoration:none; color:#0056b3;\">Verify Account</a></h2><br>"
                + "If you did not initiate this registration, please disregard this email.<br><br>"
                + "Best regards,<br>"
                + "The Block Chat Team";


        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[name]]", user.getUsername());
        String verifyURL = siteURL + "/verify?code=" + user.getVerificationCode();

        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);

        mailSender.send(message);
    }
}

