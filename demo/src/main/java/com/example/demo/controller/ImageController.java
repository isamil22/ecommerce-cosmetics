package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    /**
     * Serve images with type and filename.
     * Supports new structure: /api/images/{type}/{filename}
     * Also supports legacy structure: /api/images/{filename} (for backward compatibility)
     */
    @GetMapping("/{type}/{filename}")
    public ResponseEntity<Resource> getImageByType(
            @PathVariable String type,
            @PathVariable String filename) {
        try {
            // Security: Prevent directory traversal
            if (filename.contains("..") || type.contains("..")) {
                return ResponseEntity.badRequest().build();
            }

            Path filePath = Paths.get(uploadDir, "images", type, filename);
            File file = filePath.toFile();
            
            if (!file.exists() || !file.isFile()) {
                return ResponseEntity.notFound().build();
            }
            
            Resource resource = new FileSystemResource(file);
            
            // Determine content type based on file extension
            String contentType = getContentType(filename);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000") // Cache for 1 year
                    .body(resource);
                    
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Legacy endpoint for backward compatibility.
     * Supports old structure: /api/images/{filename}
     */
    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            // Security: Prevent directory traversal
            if (filename.contains("..")) {
                return ResponseEntity.badRequest().build();
            }

            // Try new structure first (images/general/)
            Path filePath = Paths.get(uploadDir, "images", "general", filename);
            File file = filePath.toFile();
            
            // If not found, try old structure (directly in uploads/)
            if (!file.exists()) {
                filePath = Paths.get(uploadDir, filename);
                file = filePath.toFile();
            }
            
            // If still not found, try images/ directory
            if (!file.exists()) {
                filePath = Paths.get(uploadDir, "images", filename);
                file = filePath.toFile();
            }
            
            if (!file.exists() || !file.isFile()) {
                return ResponseEntity.notFound().build();
            }
            
            Resource resource = new FileSystemResource(file);
            
            // Determine content type based on file extension
            String contentType = getContentType(filename);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000") // Cache for 1 year
                    .body(resource);
                    
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    private String getContentType(String filename) {
        String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        switch (extension) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "webp":
                return "image/webp";
            default:
                return "application/octet-stream";
        }
    }
}
