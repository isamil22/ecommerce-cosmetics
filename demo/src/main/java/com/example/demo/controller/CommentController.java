package com.example.demo.controller;

import com.example.demo.dto.CommentDTO;
import com.example.demo.model.User;
import com.example.demo.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping("/product/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long productId,
                                                 @AuthenticationPrincipal UserDetails userDetails,
                                                 @Valid @RequestBody CommentDTO commentDTO){
        Long userId = ((User) userDetails).getId();
        return ResponseEntity.ok(commentService.addComment(productId, userId, commentDTO));
    }

    @PostMapping("/admin/product/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommentDTO> addAdminComment(@PathVariable Long productId,
                                                      @RequestParam("content") String content,
                                                      @RequestParam("score") Integer score,
                                                      @RequestParam("name") String name,
                                                      @RequestParam(value = "images", required = false) List<MultipartFile> images) throws IOException {
        return ResponseEntity.ok(commentService.addAdminComment(productId, content, score, name, images));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByProduct(@PathVariable Long productId){
        return ResponseEntity.ok(commentService.getCommentsByProduct(productId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CommentDTO>> getAllComments() {
        return ResponseEntity.ok(commentService.getAllComments());
    }

    @PutMapping("/{commentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommentDTO> updateComment(@PathVariable Long commentId, @Valid @RequestBody CommentDTO commentDTO) {
        return ResponseEntity.ok(commentService.updateComment(commentId, commentDTO));
    }

    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{commentId}/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCommentImage(@PathVariable Long commentId, @RequestParam String imageUrl) {
        commentService.deleteCommentImage(commentId, imageUrl);
        return ResponseEntity.noContent().build();
    }
}