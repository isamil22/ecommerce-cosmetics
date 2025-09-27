package com.example.demo.controller;

import com.example.demo.dto.CommentDTO;
import com.example.demo.model.User;
import com.example.demo.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
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

    // Add comment to product (authenticated user)
    @PostMapping("/product/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long productId,
                                                 @AuthenticationPrincipal UserDetails userDetails,
                                                 @Valid @RequestBody CommentDTO commentDTO){
        Long userId = ((User) userDetails).getId();
        return ResponseEntity.ok(commentService.addComment(productId, userId, commentDTO));
    }

    // Add comment to pack (authenticated user)
    @PostMapping("/pack/{packId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentDTO> addCommentToPack(@PathVariable Long packId,
                                                       @AuthenticationPrincipal UserDetails userDetails,
                                                       @Valid @RequestBody CommentDTO commentDTO) {
        Long userId = ((User) userDetails).getId();
        return ResponseEntity.ok(commentService.addCommentToPack(packId, userId, commentDTO));
    }

    // Add admin comment to product
    @PostMapping(value = "/admin/product/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommentDTO> addAdminComment(@PathVariable Long productId,
                                                      @RequestParam("content") String content,
                                                      @RequestParam("score") Integer score,
                                                      @RequestParam("name") String name,
                                                      @RequestParam(value = "images", required = false) List<MultipartFile> images) throws IOException {
        return ResponseEntity.ok(commentService.addAdminComment(productId, content, score, name, images));
    }

    // Add admin comment to pack
    @PostMapping(value = "/admin/pack/{packId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommentDTO> addAdminCommentToPack(@PathVariable Long packId,
                                                            @RequestParam("content") String content,
                                                            @RequestParam("score") Integer score,
                                                            @RequestParam("name") String name,
                                                            @RequestParam(value = "images", required = false) List<MultipartFile> images) throws IOException {
        return ResponseEntity.ok(commentService.addAdminCommentToPack(packId, content, score, name, images));
    }

    // Get comments by product
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByProduct(@PathVariable Long productId){
        return ResponseEntity.ok(commentService.getCommentsByProduct(productId));
    }

    // Get comments by pack
    @GetMapping("/pack/{packId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByPack(@PathVariable Long packId) {
        return ResponseEntity.ok(commentService.getCommentsByPack(packId));
    }

    // Get all comments (admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CommentDTO>> getAllComments() {
        return ResponseEntity.ok(commentService.getAllComments());
    }

    // Update product comment (admin only)
    @PutMapping("/product/{commentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommentDTO> updateProductComment(@PathVariable Long commentId,
                                                           @RequestPart("comment") @Valid CommentDTO commentDTO,
                                                           @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        return ResponseEntity.ok(commentService.updateComment(commentId, commentDTO, image));
    }

    // Update pack comment (admin only) - NEW
    @PutMapping(value = "/pack/{commentId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommentDTO> updatePackComment(@PathVariable Long commentId,
                                                        @RequestParam("content") String content,
                                                        @RequestParam("score") Integer score,
                                                        @RequestParam("name") String name,
                                                        @RequestParam(value = "images", required = false) List<MultipartFile> images) throws IOException {
        return ResponseEntity.ok(commentService.updatePackComment(commentId, content, score, name, images));
    }

    // Delete product comment (admin only)
    @DeleteMapping("/product/{commentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProductComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    // Delete pack comment (admin only) - NEW
    @DeleteMapping("/pack/{commentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePackComment(@PathVariable Long commentId) {
        commentService.deletePackComment(commentId);
        return ResponseEntity.noContent().build();
    }

    // Delete comment image (admin only)
    @DeleteMapping("/{commentId}/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCommentImage(@PathVariable Long commentId, @RequestParam String imageUrl) {
        commentService.deleteCommentImage(commentId, imageUrl);
        return ResponseEntity.noContent().build();
    }
}