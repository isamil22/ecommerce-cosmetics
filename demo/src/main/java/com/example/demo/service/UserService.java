package com.example.demo.service;

import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.dto.UpdateUserRequestDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.UserMapper;
import com.example.demo.model.User;
import com.example.demo.repositories.CommentRepository;
import com.example.demo.repositories.OrderRepository;
import com.example.demo.repositories.ReviewRepository;
import com.example.demo.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final UserMapper userMapper;
    private final OrderRepository orderRepository;
    private final CommentRepository commentRepository;
    private final ReviewRepository reviewRepository;
    // Removed RecaptchaService dependency as it's no longer used in this service for validation
    // private final RecaptchaService recaptchaService;

    @Value("${frontend.url}")
    private String frontendUrl;

    public User registerUser(User user){
        // Removed reCAPTCHA validation from here as it's now handled at the controller layer (AuthController)
        // if (!recaptchaService.validateRecaptcha(user.getRecaptchaToken())) {
        //     throw new BadCredentialsException("reCAPTCHA validation failed. Please try again.");
        // }

        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already taken");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(User.Role.USER);
        user.setConfirmationCode(generateConfirmationCode());
        user.setEmailConfirmation(false);
        emailService.sendConfirmationCode(user);
        return userRepository.save(user);
    }

    public User getUserByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("User not found"));
    }

    public void changePassword(String email, ChangePasswordRequest request){
        User user = getUserByEmail(email);
        if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void confirmEmail(String email, String confirmationCode){
        User user = getUserByEmail(email);
        if(user.getConfirmationCode().equals(confirmationCode)){
            user.setEmailConfirmation(true);
            user.setConfirmationCode(null);
            userRepository.save(user);
        }
        else{
            throw new BadCredentialsException("Invalid confirmation code");
        }
    }

    private String generateConfirmationCode(){
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public List<UserDTO> getAllUsers() {
        return userMapper.toDTOs(userRepository.findAll());
    }

    public UserDTO createUser(UpdateUserRequestDTO request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already taken");
        }
        
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setEmailConfirmation(request.isEmailConfirmation());
        user.setActive(request.isActive());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setProfileImageUrl(request.getProfileImageUrl());
        user.setNotes(request.getNotes());
        
        // Set password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        // Corrected method call from findByUserId to findByUser_Id
        orderRepository.deleteAll(orderRepository.findByUser_Id(id));
        commentRepository.deleteAll(commentRepository.findByUserId(id));
        reviewRepository.deleteAll(reviewRepository.findByUserId(id));
        userRepository.deleteById(id);
    }

    public UserDTO updateUserRole(Long id, User.Role role) {
        User user = getUserById(id);
        user.setRole(role);
        User updatedUser = userRepository.save(user);
        return userMapper.toDTO(updatedUser);
    }

    public void forgotPassword(String email) {
        User user = getUserByEmail(email);
        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(1)); // Token is valid for 1 hour
        userRepository.save(user);
        String resetLink = frontendUrl + "/reset-password/" + token;
        emailService.sendPasswordResetEmail(user, resetLink);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid password reset token"));

        if (user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadCredentialsException("Password reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);
    }

    public UserDTO getUserByIdDTO(Long id) {
        User user = getUserById(id);
        return userMapper.toDTO(user);
    }

    public UserDTO updateUser(Long id, UpdateUserRequestDTO request) {
        User user = getUserById(id);
        
        // Check if email is being changed and if it's already taken
        if (!user.getEmail().equals(request.getEmail()) && 
            userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already taken");
        }
        
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setEmailConfirmation(request.isEmailConfirmation());
        user.setActive(request.isActive());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setProfileImageUrl(request.getProfileImageUrl());
        user.setNotes(request.getNotes());
        
        User updatedUser = userRepository.save(user);
        return userMapper.toDTO(updatedUser);
    }

    public UserDTO toggleUserActive(Long id) {
        User user = getUserById(id);
        user.setActive(!user.isActive());
        User updatedUser = userRepository.save(user);
        return userMapper.toDTO(updatedUser);
    }

    public void updateLastLogin(String email) {
        User user = getUserByEmail(email);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public String exportUsersToCsv() {
        List<UserDTO> users = getAllUsers();
        StringBuilder csv = new StringBuilder();
        
        // CSV Header
        csv.append("ID,Full Name,Email,Role,Email Confirmed,Active,Phone Number,Profile Image URL,Created At,Last Login,Notes\n");
        
        // CSV Data
        for (UserDTO user : users) {
            csv.append(user.getId()).append(",");
            csv.append("\"").append(user.getFullName() != null ? user.getFullName().replace("\"", "\"\"") : "").append("\",");
            csv.append("\"").append(user.getEmail().replace("\"", "\"\"")).append("\",");
            csv.append(user.getRole()).append(",");
            csv.append(user.isEmailConfirmation()).append(",");
            csv.append(user.isActive()).append(",");
            csv.append("\"").append(user.getPhoneNumber() != null ? user.getPhoneNumber().replace("\"", "\"\"") : "").append("\",");
            csv.append("\"").append(user.getProfileImageUrl() != null ? user.getProfileImageUrl().replace("\"", "\"\"") : "").append("\",");
            csv.append("\"").append(user.getCreatedAt() != null ? user.getCreatedAt().toString() : "").append("\",");
            csv.append("\"").append(user.getLastLoginAt() != null ? user.getLastLoginAt().toString() : "").append("\",");
            csv.append("\"").append(user.getNotes() != null ? user.getNotes().replace("\"", "\"\"").replace("\n", " ").replace("\r", " ") : "").append("\"\n");
        }
        
        return csv.toString();
    }
}