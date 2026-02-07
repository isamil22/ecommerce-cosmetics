package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
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
     * Also supports legacy structure: /api/images/{filename} (for backward
     * compatibility)
     */
    /**
     * Serve images with type and filename.
     * Supports new structure: /api/images/{type}/{filename}
     * Also supports resizing: ?w=300&h=300
     */
    @GetMapping("/{type}/{filename}")
    public ResponseEntity<Resource> getImageByType(
            @PathVariable String type,
            @PathVariable String filename,
            @RequestParam(required = false) Integer w,
            @RequestParam(required = false) Integer h) {
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

            // If resizing is requested
            if (w != null || h != null) {
                return serveResizedImage(file, filename, w, h);
            }

            Resource resource = new FileSystemResource(file);
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
    public ResponseEntity<Resource> getImage(@PathVariable String filename,
            @RequestParam(required = false) Integer w,
            @RequestParam(required = false) Integer h) {
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

            // If resizing is requested
            if (w != null || h != null) {
                return serveResizedImage(file, filename, w, h);
            }

            Resource resource = new FileSystemResource(file);
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

    private ResponseEntity<Resource> serveResizedImage(File originalFile, String originalFilename, Integer width,
            Integer height) {
        try {
            // Determine dimensions
            int targetWidth = width != null ? width : 0;
            int targetHeight = height != null ? height : 0;

            if (targetWidth == 0 && targetHeight == 0) {
                // No valid dimensions, return original
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(getContentType(originalFilename)))
                        .body(new FileSystemResource(originalFile));
            }

            // Create cache directory if not exists
            Path cacheDir = Paths.get(uploadDir, "images", "cache");
            if (!cacheDir.toFile().exists()) {
                cacheDir.toFile().mkdirs();
            }

            // Generate unique cache filename: original_wX_hY.webp
            String cacheFilename = originalFilename + "_w" + targetWidth + "_h" + targetHeight + ".webp";
            File cacheFile = cacheDir.resolve(cacheFilename).toFile();

            // Check if cached file exists
            if (!cacheFile.exists()) {
                // Create thumbnail
                var builder = net.coobird.thumbnailator.Thumbnails.of(originalFile);

                if (targetWidth > 0 && targetHeight > 0) {
                    builder.size(targetWidth, targetHeight);
                } else if (targetWidth > 0) {
                    builder.width(targetWidth);
                } else {
                    builder.height(targetHeight);
                }

                builder.outputFormat("webp")
                        .outputQuality(0.7)
                        .toFile(cacheFile);
            }

            // Serve cached file
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("image/webp"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + cacheFilename + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000")
                    .body(new FileSystemResource(cacheFile));

        } catch (Exception e) {
            // Fallback to original if resizing fails
            System.err.println("Error resizing image: " + e.getMessage());
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(getContentType(originalFilename)))
                    .body(new FileSystemResource(originalFile));
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
