package com.example.demo.controller;

import com.example.demo.dto.CommentDTO;
import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.repositories.CategoryRepository;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.service.LocalFileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpMethod;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class CommentControllerAdminProductTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @MockBean
    private LocalFileService localFileService;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        Category testCategory = new Category();
        testCategory.setName("Test Category for Product");
        testCategory.setDescription("A category for product comment testing");
        categoryRepository.save(testCategory);

        testProduct = new Product();
        testProduct.setName("Test Product for Comments");
        testProduct.setPrice(BigDecimal.valueOf(50.0));
        testProduct.setQuantity(50);
        testProduct.setCategory(testCategory);
        testProduct.setImages(new ArrayList<>());
        productRepository.save(testProduct);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testAdminCanManageProductCommentsAPI() throws Exception {
        // 1. Admin adds a comment to a product
        MvcResult result = mockMvc.perform(multipart(HttpMethod.POST, "/api/v1/comments/admin/product/{productId}", testProduct.getId())
                        .param("content", "This is an admin comment on a product.")
                        .param("score", "4")
                        .param("name", "Admin Product Reviewer"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content", is("This is an admin comment on a product.")))
                .andExpect(jsonPath("$.score", is(4)))
                .andReturn();

        String responseString = result.getResponse().getContentAsString();
        CommentDTO addedComment = objectMapper.readValue(responseString, CommentDTO.class);

        // 2. Admin updates the comment
        addedComment.setContent("This is the updated product comment.");
        addedComment.setScore(3);

        MockMultipartFile imageFile = new MockMultipartFile("image", "product_test.jpg", "image/jpeg", "product image content".getBytes());
        MockMultipartFile commentDtoString = new MockMultipartFile("commentDTO", "", "application/json", objectMapper.writeValueAsString(addedComment).getBytes());

        Mockito.when(localFileService.saveImage(Mockito.any(org.springframework.web.multipart.MultipartFile.class), Mockito.anyString())).thenReturn("http://localhost:8080/api/images/comments/product_test.jpg");

        mockMvc.perform(multipart(HttpMethod.PUT, "/api/v1/comments/{commentId}", addedComment.getId())
                        .file(imageFile)
                        .file(commentDtoString))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", is("This is the updated product comment.")))
                .andExpect(jsonPath("$.score", is(3)));

        // 3. Admin deletes the comment
        mockMvc.perform(delete("/api/v1/comments/{commentId}", addedComment.getId()))
                .andExpect(status().isNoContent());
    }
}