package com.example.demo.service;

import com.example.demo.dto.CommentDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.CommentMapper;
import com.example.demo.model.Comment;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repositories.CommentRepository;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;
    private final S3Service s3Service;
    private final PasswordEncoder passwordEncoder; // --- NEW: Inject PasswordEncoder ---

    public CommentDTO addComment(Long productId, Long userId, CommentDTO commentDTO){
        Product product = productRepository.findById(productId)
                .orElseThrow(()-> new ResourceNotFoundException("Product not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new ResourceNotFoundException("User not found"));

        Comment comment = commentMapper.toEntity(commentDTO);
        comment.setProduct(product);
        comment.setUser(user);
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toDTO(savedComment);
    }

    public CommentDTO addAdminComment(Long productId, String content, Integer score, String name, List<MultipartFile> images) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // --- FIX START ---
        User user = new User();
        user.setFullName(name);
        user.setEmail(UUID.randomUUID().toString() + "@admin-comment.com");
        // --- THIS IS THE FIX ---
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // Set a random, secure password
        user.setRole(User.Role.USER);
        user.setEmailConfirmation(true);
        userRepository.save(user);
        // --- FIX END ---

        Comment comment = new Comment();
        comment.setProduct(product);
        comment.setUser(user);
        comment.setContent(content);
        comment.setScore(score);

        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = new ArrayList<>();
            for (MultipartFile image : images) {
                imageUrls.add(s3Service.saveImage(image));
            }
            comment.setImages(imageUrls);
        }

        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toDTO(savedComment);
    }

    public List<CommentDTO> getCommentsByProduct(Long productId){
        List<Comment> comments = commentRepository.findByProductId(productId);
        return comments.stream()
                .map(commentMapper::toDTO)
                .collect(Collectors.toList());
    }
}