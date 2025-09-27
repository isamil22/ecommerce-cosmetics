package com.example.demo.service;

import com.example.demo.dto.CommentDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.CommentMapper;
import com.example.demo.model.Comment;
import com.example.demo.model.Pack;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repositories.CommentRepository;
import com.example.demo.repositories.PackRepository;
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
    private final PackRepository packRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;
    private final S3Service s3Service;
    private final PasswordEncoder passwordEncoder;

    // Add comment to product by authenticated user
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

    // Add comment to pack by authenticated user
    public CommentDTO addCommentToPack(Long packId, Long userId, CommentDTO commentDTO) {
        Pack pack = packRepository.findById(packId)
                .orElseThrow(() -> new ResourceNotFoundException("Pack not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = commentMapper.toEntity(commentDTO);
        comment.setPack(pack);
        comment.setUser(user);
        comment.setProduct(null); // Explicitly set product to null for pack comments

        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toDTO(savedComment);
    }

    // Add admin comment to product
    public CommentDTO addAdminComment(Long productId, String content, Integer score, String name, List<MultipartFile> images) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        User user = createAdminUser(name);

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

    // Add admin comment to pack
    public CommentDTO addAdminCommentToPack(Long packId, String content, Integer score, String name, List<MultipartFile> images) throws IOException {
        Pack pack = packRepository.findById(packId)
                .orElseThrow(() -> new ResourceNotFoundException("Pack not found"));

        User user = createAdminUser(name);

        Comment comment = new Comment();
        comment.setPack(pack);
        comment.setUser(user);
        comment.setContent(content);
        comment.setScore(score);
        comment.setProduct(null); // Explicitly set product to null for pack comments

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

    // Update pack comment (NEW METHOD)
    public CommentDTO updatePackComment(Long commentId, String content, Integer score, String name, List<MultipartFile> images) throws IOException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        // Verify this is a pack comment
        if (comment.getPack() == null) {
            throw new IllegalArgumentException("Comment is not associated with a pack");
        }

        comment.setContent(content);
        comment.setScore(score);

        // Update user name
        comment.getUser().setFullName(name);
        userRepository.save(comment.getUser());

        // Handle images
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = new ArrayList<>();
            for (MultipartFile image : images) {
                if (image != null && !image.isEmpty()) {
                    imageUrls.add(s3Service.saveImage(image));
                }
            }
            comment.getImages().clear();
            comment.getImages().addAll(imageUrls);
        }

        Comment updatedComment = commentRepository.save(comment);
        return commentMapper.toDTO(updatedComment);
    }

    // Delete pack comment (NEW METHOD)
    public void deletePackComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        // Verify this is a pack comment
        if (comment.getPack() == null) {
            throw new IllegalArgumentException("Comment is not associated with a pack");
        }

        commentRepository.deleteById(commentId);
    }

    // Get comments by product
    public List<CommentDTO> getCommentsByProduct(Long productId){
        List<Comment> comments = commentRepository.findByProductId(productId);
        return comments.stream()
                .map(commentMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get comments by pack
    public List<CommentDTO> getCommentsByPack(Long packId) {
        List<Comment> comments = commentRepository.findByPackId(packId);
        return comments.stream()
                .map(commentMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get all comments (admin only)
    public List<CommentDTO> getAllComments() {
        return commentRepository.findAll().stream()
                .map(commentMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Update comment (for product comments)
    public CommentDTO updateComment(Long commentId, CommentDTO commentDTO, MultipartFile image) throws IOException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        comment.setContent(commentDTO.getContent());
        comment.setScore(commentDTO.getScore());

        if (image != null && !image.isEmpty()) {
            String imageUrl = s3Service.saveImage(image);
            comment.getImages().clear();
            comment.getImages().add(imageUrl);
        }

        Comment updatedComment = commentRepository.save(comment);
        return commentMapper.toDTO(updatedComment);
    }

    // Delete comment (general method)
    public void deleteComment(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new ResourceNotFoundException("Comment not found");
        }
        commentRepository.deleteById(commentId);
    }

    // Delete comment image
    public void deleteCommentImage(Long commentId, String imageUrl) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        comment.getImages().remove(imageUrl);
        commentRepository.save(comment);
    }

    // Helper method to create admin users for comments
    private User createAdminUser(String name) {
        User user = new User();
        user.setFullName(name);
        user.setEmail(UUID.randomUUID().toString() + "@admin-comment.com");
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setRole(User.Role.USER);
        user.setEmailConfirmation(true);
        return userRepository.save(user);
    }
}