package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Local file storage service to replace AWS S3.
 * Stores images in local filesystem organized by type.
 * 
 * Storage structure:
 * uploads/
 *   images/
 *     products/
 *     categories/
 *     packs/
 *     hero/
 *     comments/
 */
@Service
public class LocalFileService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${file.upload.base-url:http://localhost:8080/api/images}")
    private String baseUrl;

    /**
     * Save a MultipartFile image to local filesystem.
     * 
     * @param file The image file to save
     * @param imageType The type of image (products, categories, packs, hero, comments)
     * @return The URL to access the saved image
     * @throws IOException If file cannot be saved
     */
    public String saveImage(MultipartFile file, String imageType) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        // Ensure image type directory exists
        String typeDir = imageType != null ? imageType : "general";
        Path uploadPath = Paths.get(uploadDir, "images", typeDir);
        ensureDirectoryExists(uploadPath);

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            originalFilename = "image";
        }
        
        // Clean filename (remove special characters)
        String cleanFilename = cleanFilename(originalFilename);
        String uniqueFilename = UUID.randomUUID().toString() + "-" + cleanFilename;

        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath);

        // Return relative URL for database storage
        // Format: /api/images/{type}/{filename}
        return baseUrl + "/" + typeDir + "/" + uniqueFilename;
    }

    /**
     * Save a MultipartFile image (defaults to "general" type).
     * Maintains backward compatibility with S3Service interface.
     */
    public String saveImage(MultipartFile file) throws IOException {
        return saveImage(file, "general");
    }

    /**
     * Save a byte array image to local filesystem.
     * Used for composite images (e.g., pack composite images).
     * 
     * @param imageBytes The image bytes to save
     * @param fileName The desired file name
     * @param imageType The type of image (products, categories, packs, hero, comments)
     * @return The URL to access the saved image
     * @throws IOException If file cannot be saved
     */
    public String saveImage(byte[] imageBytes, String fileName, String imageType) throws IOException {
        if (imageBytes == null || imageBytes.length == 0) {
            throw new IllegalArgumentException("Image bytes cannot be null or empty");
        }

        // Ensure image type directory exists
        String typeDir = imageType != null ? imageType : "general";
        Path uploadPath = Paths.get(uploadDir, "images", typeDir);
        ensureDirectoryExists(uploadPath);

        // Generate unique filename
        String cleanFilename = cleanFilename(fileName);
        String uniqueFilename = UUID.randomUUID().toString() + "-" + cleanFilename;

        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
            fos.write(imageBytes);
        }

        // Return relative URL for database storage
        return baseUrl + "/" + typeDir + "/" + uniqueFilename;
    }

    /**
     * Save a byte array image (defaults to "general" type).
     * Maintains backward compatibility with S3Service interface.
     */
    public String saveImage(byte[] imageBytes, String fileName) throws IOException {
        return saveImage(imageBytes, fileName, "general");
    }

    /**
     * Ensure the directory exists, creating it if necessary.
     */
    private void ensureDirectoryExists(Path directory) throws IOException {
        if (!Files.exists(directory)) {
            Files.createDirectories(directory);
        }
    }

    /**
     * Clean filename by removing special characters and path separators.
     */
    private String cleanFilename(String filename) {
        if (filename == null) {
            return "image";
        }
        
        // Remove path separators and dangerous characters
        String cleaned = filename.replaceAll("[\\\\/:*?\"<>|]", "_");
        
        // Limit length
        if (cleaned.length() > 200) {
            String extension = "";
            int lastDot = cleaned.lastIndexOf('.');
            if (lastDot > 0) {
                extension = cleaned.substring(lastDot);
                cleaned = cleaned.substring(0, lastDot);
            }
            cleaned = cleaned.substring(0, 200 - extension.length()) + extension;
        }
        
        return cleaned;
    }

    /**
     * Delete an image file from local filesystem.
     * 
     * @param imageUrl The URL of the image to delete
     * @return true if file was deleted, false if file doesn't exist
     */
    public boolean deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return false;
        }

        try {
            // Extract filename from URL
            // URL format: http://domain/api/images/{type}/{filename}
            // or: /api/images/{type}/{filename}
            String pathPart = imageUrl;
            if (imageUrl.contains("/api/images/")) {
                pathPart = imageUrl.substring(imageUrl.indexOf("/api/images/") + "/api/images/".length());
            }

            // Split type and filename
            String[] parts = pathPart.split("/", 2);
            if (parts.length != 2) {
                return false;
            }

            String type = parts[0];
            String filename = parts[1];

            // Build file path
            Path filePath = Paths.get(uploadDir, "images", type, filename);
            File file = filePath.toFile();

            if (file.exists() && file.isFile()) {
                return file.delete();
            }
        } catch (Exception e) {
            // Log error but don't throw
            System.err.println("Error deleting image: " + imageUrl + " - " + e.getMessage());
        }

        return false;
    }
}

