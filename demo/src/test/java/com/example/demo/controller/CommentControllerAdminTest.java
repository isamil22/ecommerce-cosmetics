package com.example.demo.controller;

import com.example.demo.dto.CommentDTO;
import com.example.demo.dto.PackItemRequestDTO;
import com.example.demo.dto.PackRequestDTO;
import com.example.demo.dto.PackResponseDTO;
import com.example.demo.model.Category;
import com.example.demo.model.Pack;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repositories.CategoryRepository;
import com.example.demo.repositories.CommentRepository;
import com.example.demo.repositories.PackRepository;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.service.PackService;
import com.example.demo.service.LocalFileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.is;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class CommentControllerAdminTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PackService packService;

    @Autowired
    private PackRepository packRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

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
    void testAdminCanManagePackCommentsAPI() throws Exception {
        // 1. Admin adds a comment to a pack
        MvcResult result = mockMvc.perform(multipart("/api/v1/comments/admin/pack/{packId}", testPack.getId())
                        .param("content", "This is an admin comment.")
                        .param("score", "5")
                        .param("name", "Admin User"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content", is("This is an admin comment.")))
                .andExpect(jsonPath("$.score", is(5)))
                .andReturn();

        String responseString = result.getResponse().getContentAsString();
        CommentDTO addedComment = objectMapper.readValue(responseString, CommentDTO.class);

        // 2. Admin updates the comment
        addedComment.setContent("This is the updated admin comment.");
        addedComment.setScore(4);

        MockMultipartFile imageFile = new MockMultipartFile("image", "test.jpg", "image/jpeg", "test image content".getBytes());
        MockMultipartFile commentDtoString = new MockMultipartFile("commentDTO", "", "application/json", objectMapper.writeValueAsString(addedComment).getBytes());

        Mockito.when(localFileService.saveImage(Mockito.any(org.springframework.web.multipart.MultipartFile.class), Mockito.anyString())).thenReturn("http://localhost:8080/api/images/comments/test.jpg");

        mockMvc.perform(multipart("/api/v1/comments/{commentId}", addedComment.getId())
                        .file(imageFile)
                        .file(commentDtoString)
                        .with(request -> {
                            request.setMethod("PUT");
                            return request;
                        }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", is("This is the updated admin comment.")))
                .andExpect(jsonPath("$.score", is(4)));

        // 3. Admin deletes the comment
        mockMvc.perform(delete("/api/v1/comments/{commentId}", addedComment.getId()))
                .andExpect(status().isNoContent());
    }
}