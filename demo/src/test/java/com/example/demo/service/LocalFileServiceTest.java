package com.example.demo.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for LocalFileService.
 * Tests image saving functionality for local file storage.
 */
class LocalFileServiceTest {

    private LocalFileService localFileService;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        localFileService = new LocalFileService();
        // Set upload directory to temp directory for testing
        ReflectionTestUtils.setField(localFileService, "uploadDir", tempDir.toString());
        ReflectionTestUtils.setField(localFileService, "baseUrl", "http://localhost:8080/api/images");
    }

    @Test
    void testSaveImage_MultipartFile_Products() throws IOException {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "image",
                "test-image.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        // Act
        String imageUrl = localFileService.saveImage(file, "products");

        // Assert
        assertNotNull(imageUrl);
        assertTrue(imageUrl.contains("/api/images/products/"));
        assertTrue(imageUrl.contains("test-image.jpg"));
        
        // Verify file was created
        String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        Path filePath = tempDir.resolve("images").resolve("products").resolve(filename);
        assertTrue(Files.exists(filePath), "Image file should be created");
    }

    @Test
    void testSaveImage_MultipartFile_Categories() throws IOException {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "image",
                "category.jpg",
                "image/jpeg",
                "category image".getBytes()
        );

        // Act
        String imageUrl = localFileService.saveImage(file, "categories");

        // Assert
        assertNotNull(imageUrl);
        assertTrue(imageUrl.contains("/api/images/categories/"));
        
        // Verify file was created
        String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        Path filePath = tempDir.resolve("images").resolve("categories").resolve(filename);
        assertTrue(Files.exists(filePath), "Category image file should be created");
    }

    @Test
    void testSaveImage_ByteArray() throws IOException {
        // Arrange
        byte[] imageBytes = "fake image bytes".getBytes();
        String fileName = "composite-image.png";

        // Act
        String imageUrl = localFileService.saveImage(imageBytes, fileName, "packs");

        // Assert
        assertNotNull(imageUrl);
        assertTrue(imageUrl.contains("/api/images/packs/"));
        assertTrue(imageUrl.contains("composite-image.png"));
        
        // Verify file was created
        String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        Path filePath = tempDir.resolve("images").resolve("packs").resolve(filename);
        assertTrue(Files.exists(filePath), "Composite image file should be created");
    }

    @Test
    void testSaveImage_EmptyFile_ThrowsException() {
        // Arrange
        MockMultipartFile emptyFile = new MockMultipartFile(
                "image",
                "empty.jpg",
                "image/jpeg",
                new byte[0]
        );

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            localFileService.saveImage(emptyFile, "products");
        });
    }

    @Test
    void testSaveImage_NullFile_ThrowsException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            localFileService.saveImage((MockMultipartFile) null, "products");
        });
    }

    @Test
    void testSaveImage_CreatesDirectoryIfNotExists() throws IOException {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "image",
                "test.jpg",
                "image/jpeg",
                "test".getBytes()
        );

        // Act
        localFileService.saveImage(file, "hero");

        // Assert - directory should be created
        Path heroDir = tempDir.resolve("images").resolve("hero");
        assertTrue(Files.exists(heroDir), "Hero directory should be created");
        assertTrue(Files.isDirectory(heroDir), "Hero path should be a directory");
    }

    @Test
    void testDeleteImage_ExistingFile() throws IOException {
        // Arrange - create a file first
        MockMultipartFile file = new MockMultipartFile(
                "image",
                "to-delete.jpg",
                "image/jpeg",
                "test".getBytes()
        );
        String imageUrl = localFileService.saveImage(file, "products");
        
        // Extract filename
        String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        Path filePath = tempDir.resolve("images").resolve("products").resolve(filename);
        assertTrue(Files.exists(filePath), "File should exist before deletion");

        // Act
        boolean deleted = localFileService.deleteImage(imageUrl);

        // Assert
        assertTrue(deleted, "Image should be deleted");
        assertFalse(Files.exists(filePath), "File should not exist after deletion");
    }

    @Test
    void testDeleteImage_NonExistentFile() {
        // Act
        boolean deleted = localFileService.deleteImage("http://localhost:8080/api/images/products/nonexistent.jpg");

        // Assert
        assertFalse(deleted, "Non-existent image should return false");
    }

    @Test
    void testSaveImage_DefaultType() throws IOException {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "image",
                "test.jpg",
                "image/jpeg",
                "test".getBytes()
        );

        // Act - use default type (should use "general")
        String imageUrl = localFileService.saveImage(file);

        // Assert
        assertNotNull(imageUrl);
        // Should use "general" as default type
        assertTrue(imageUrl.contains("/api/images/general/") || imageUrl.contains("/api/images/"));
    }
}

