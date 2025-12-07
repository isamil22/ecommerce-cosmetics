package com.example.demo.service;

import com.example.demo.dto.CommentDTO;
import com.example.demo.dto.PackItemRequestDTO;
import com.example.demo.dto.PackRequestDTO;
import com.example.demo.dto.PackResponseDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Category;
import com.example.demo.model.Pack;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repositories.CategoryRepository;
import com.example.demo.repositories.CommentRepository;
import com.example.demo.repositories.PackRepository;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class PackCommentManagementTestSuite {

    @Autowired
    private PackService packService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private PackRepository packRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private LocalFileService localFileService;

    private Pack testPack;
    private Product testProduct;
    private User testUser;

    @BeforeEach
    void setUp() throws IOException {
        Category testCategory = new Category();
        testCategory.setName("Test Category");
        testCategory.setDescription("A category for testing");
        categoryRepository.save(testCategory);

        testProduct = new Product();
        testProduct.setName("Test Product");
        testProduct.setPrice(BigDecimal.TEN);
        testProduct.setQuantity(100);
        testProduct.setCategory(testCategory);
        testProduct.setImages(new ArrayList<>());
        productRepository.save(testProduct);

        PackRequestDTO packRequestDTO = new PackRequestDTO();
        packRequestDTO.setName("Test Pack");
        packRequestDTO.setDescription("Test Pack Description");
        packRequestDTO.setPrice(20.0);
        PackItemRequestDTO packItem = new PackItemRequestDTO();
        packItem.setDefaultProductId(testProduct.getId());
        packItem.setVariationProductIds(Collections.emptyList());
        packRequestDTO.setItems(Collections.singletonList(packItem));

        PackResponseDTO packResponseDTO = packService.createPack(packRequestDTO, null);
        testPack = packRepository.findById(packResponseDTO.getId()).orElse(null);

        testUser = new User();
        testUser.setEmail("testuser@example.com");
        testUser.setPassword("password");
        testUser.setFullName("Test User");
        testUser.setRole(User.Role.USER);
        userRepository.save(testUser);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testAdminCanManagePackComments() throws IOException {
        // 1. Admin adds a comment to a pack
        String initialCommentContent = "This is an admin comment.";
        Integer initialCommentScore = 5;
        String adminCommenterName = "Admin User";
        List<MultipartFile> images = new ArrayList<>();

        CommentDTO addedComment = commentService.addAdminCommentToPack(testPack.getId(), initialCommentContent, initialCommentScore, adminCommenterName, images);
        assertNotNull(addedComment.getId());
        assertEquals(initialCommentContent, addedComment.getContent());
        assertEquals(initialCommentScore, addedComment.getScore());

        // Verify that a new user was created for the admin comment
        User adminCommentUser = userRepository.findById(addedComment.getUserId()).orElse(null);
        assertNotNull(adminCommentUser);
        assertEquals(adminCommenterName, adminCommentUser.getFullName());

        // 2. Admin updates the comment
        String updatedCommentContent = "This is the updated admin comment.";
        Integer updatedCommentScore = 4;
        addedComment.setContent(updatedCommentContent);
        addedComment.setScore(updatedCommentScore);

        MockMultipartFile imageFile = new MockMultipartFile("image", "test.jpg", "image/jpeg", "test image content".getBytes());

        Mockito.when(localFileService.saveImage(Mockito.any(MultipartFile.class), Mockito.anyString())).thenReturn("http://localhost:8080/api/images/comments/test.jpg");


        CommentDTO updatedCommentDTO = commentService.updateComment(addedComment.getId(), addedComment, imageFile);
        assertEquals(updatedCommentContent, updatedCommentDTO.getContent());
        assertEquals(updatedCommentScore, updatedCommentDTO.getScore());
        assertFalse(updatedCommentDTO.getImages().isEmpty());


        // 3. Admin deletes the comment
        commentService.deleteComment(updatedCommentDTO.getId());
        assertFalse(commentRepository.findById(updatedCommentDTO.getId()).isPresent());
    }

    @Test
    void testAddCommentToNonExistentPackThrowsException() {
        long nonExistentPackId = 999L;
        String content = "Test comment";
        Integer score = 5;
        String commenterName = "Admin";
        List<MultipartFile> images = new ArrayList<>();

        assertThrows(ResourceNotFoundException.class, () -> {
            commentService.addAdminCommentToPack(nonExistentPackId, content, score, commenterName, images);
        });
    }

    @Test
    @WithMockUser(username = "testuser@example.com", roles = "USER")
    void testRegularUserCanAddCommentToPack() {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setContent("A regular user's comment.");
        commentDTO.setScore(4);

        CommentDTO result = commentService.addCommentToPack(testPack.getId(), testUser.getId(), commentDTO);

        assertNotNull(result.getId());
        assertEquals(commentDTO.getContent(), result.getContent());
        assertEquals(testUser.getId(), result.getUserId());
    }
}