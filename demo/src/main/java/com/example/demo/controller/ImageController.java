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
    @GetMapping("/{type}/{filename:.+}")
    public ResponseEntity<Resource> getImageByType(
            @PathVariable String type,
            @PathVariable("filename") String filename,
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
                    .header(HttpHeaders.CACHE_CONTROL, getCacheControlHeader(type)) // Smart caching based on type
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Legacy endpoint for backward compatibility.
     * Supports old structure: /api/images/{filename}
     */
    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable("filename") String filename,
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
                    .header(HttpHeaders.CACHE_CONTROL, getCacheControlHeader("general")) // Smart caching for legacy
                                                                                         // endpoint
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

            // Create cache directory if not exists - ensure absolute path
            Path cacheDir = Paths.get(uploadDir, "images", "cache").toAbsolutePath();
            if (!cacheDir.toFile().exists()) {
                cacheDir.toFile().mkdirs();
            }

            // Generate unique cache filename: original_wX_hY.webp
            String cacheFilename = originalFilename + "_w" + targetWidth + "_h" + targetHeight + ".webp";
            File cacheFile = cacheDir.resolve(cacheFilename).toFile();

            // Check if cached file exists and is not empty
            if (!cacheFile.exists() || cacheFile.length() == 0) {
                // Synchronize on the filename to prevent multiple threads from resizing the
                // same image
                synchronized (cacheFilename.intern()) {
                    // Double-check inside synchronization
                    if (!cacheFile.exists() || cacheFile.length() == 0) {
                        File tempFile = new File(cacheFile.getAbsolutePath() + ".tmp");
                        try {
                            System.out.println("🔨 Generating thumbnail: " + cacheFilename);
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
                                    .toFile(tempFile);

                            // Move temp file to final destination
                            // Copy and delete is more robust across different file system types/docker
                            // volumes than move
                            java.nio.file.Files.copy(
                                    tempFile.toPath().toAbsolutePath(),
                                    cacheFile.toPath().toAbsolutePath(),
                                    java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                            try {
                                java.nio.file.Files.deleteIfExists(tempFile.toPath());
                            } catch (Exception ignored) {
                                // Ignored
                            }

                            System.out.println("✅ Generated thumbnail successfully: " + cacheFilename);
                        } catch (Exception resizeError) {
                            System.err.println("💥 Failed to generate thumbnail: " + cacheFilename + " - "
                                    + resizeError.getClass().getName() + ": " + resizeError.getMessage());
                            resizeError.printStackTrace(); // Print full stack trace for debugging

                            if (tempFile.exists())
                                tempFile.delete();

                            // FALLBACK: Serve original image if resizing fails
                            System.out.println("🔄 Falling back to original image for: " + originalFilename);
                            return ResponseEntity.ok()
                                    .header(HttpHeaders.CONTENT_TYPE, getContentType(originalFilename))
                                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600") // Cache for less time
                                    .body(new FileSystemResource(originalFile));
                        }
                    }
                }
            }

            // Serve cached file
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, "image/webp")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=2592000")
                    .body(new FileSystemResource(cacheFile));
        } catch (Exception e) {
            System.err.println("❌ Error in serveResizedImage: " + e.getMessage());
            // Fallback to original image as last resort
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, getContentType(originalFilename))
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

    /**
     * Get appropriate cache control header based on image type.
     * Different image types have different update frequencies.
     * 
     * @param type The image type (hero, products, categories, etc.)
     * @return Cache-Control header value
     */
    private String getCacheControlHeader(String type) {
        if (type == null) {
            return "public, max-age=31536000"; // 1 year default
        }

        switch (type) {
            case "hero":
                // Hero images change infrequently but need quick updates when they do
                return "public, max-age=300"; // 5 minutes
            case "products":
            case "categories":
            case "packs":
            case "custom-packs":
                // Product-related images may change but not frequently
                return "public, max-age=86400"; // 1 day
            case "comments":
                // Comment images rarely change
                return "public, max-age=604800"; // 1 week
            default:
                // Everything else can be cached long-term
                return "public, max-age=31536000"; // 1 year
        }
    }
}
