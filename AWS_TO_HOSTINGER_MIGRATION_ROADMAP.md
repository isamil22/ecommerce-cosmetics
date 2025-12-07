# AWS to Hostinger Migration Roadmap

## Executive Summary

This document provides a step-by-step roadmap to migrate your ecommerce application from AWS S3 to local file storage for Hostinger deployment. The migration will replace AWS S3 with a local file storage system that works seamlessly with Hostinger's hosting environment.

## Current State Analysis

### AWS S3 Usage Points
1. **ProductService** - Product image uploads (multiple images per product)
2. **CategoryService** - Category image uploads
3. **HeroService** - Hero section image uploads
4. **PackService** - Pack composite image generation and uploads
5. **CommentService** - Comment image uploads

### Current Infrastructure
- ✅ Local `uploads` directory exists: `C:/Users/Hi/Downloads/ecommerce basic/uploads`
- ✅ `ImageController` already exists to serve local images via `/api/images/{filename}`
- ✅ Database stores image URLs as VARCHAR(2048) strings
- ✅ `application.properties` has `file.upload-dir` configured

### AWS Dependencies
- `aws-java-sdk-s3` dependency in `pom.xml`
- `S3Config.java` - AWS S3 client configuration
- `S3Service.java` - AWS S3 service implementation
- AWS environment variables in `application.properties`

## Migration Strategy

### Best Solution for Hostinger: Local File Storage

**Why Local File Storage?**
- ✅ No external dependencies
- ✅ Works out-of-the-box on Hostinger
- ✅ Lower costs (no S3 fees)
- ✅ Simpler deployment
- ✅ Better performance for small to medium traffic
- ✅ Easy backups (just copy the uploads folder)

**Storage Structure:**
```
uploads/
├── images/
│   ├── products/
│   ├── categories/
│   ├── packs/
│   ├── hero/
│   └── comments/
```

**URL Pattern:**
- Upload: Save to `uploads/images/{type}/{uuid}-{filename}`
- Access: `http://yourdomain.com/api/images/{type}/{filename}`

---

## Step-by-Step Migration Plan

### **PHASE 1: Preparation & Backup** ⚠️ CRITICAL

#### Step 1.1: Create Full Backup
**Objective:** Ensure you can rollback if anything goes wrong

**Actions:**
1. Backup your database (export SQL dump)
2. Backup current `uploads` directory
3. Backup entire project directory
4. Document current AWS S3 bucket contents (list all image URLs)

**Test:**
```bash
# Verify backup exists
ls -la backups/
# Verify database backup
mysql -u user -p sms < backup.sql
```

**✅ Completion Criteria:**
- [ ] Database backup created and verified
- [ ] File system backup created
- [ ] AWS S3 image list exported to CSV/JSON

---

### **PHASE 2: Create Local File Service**

#### Step 2.1: Create LocalFileService
**Objective:** Create a new service to replace S3Service functionality

**File to Create:** `demo/src/main/java/com/example/demo/service/LocalFileService.java`

**Implementation Requirements:**
- Save images to local filesystem
- Generate unique filenames (UUID-based)
- Organize by type (products, categories, packs, hero, comments)
- Return relative URLs for database storage
- Handle both MultipartFile and byte[] inputs

**Test:**
```java
// Unit test: LocalFileServiceTest.java
@Test
void testSaveImage_MultipartFile() throws IOException {
    // Test image upload
}

@Test
void testSaveImage_ByteArray() throws IOException {
    // Test byte array upload
}
```

**✅ Completion Criteria:**
- [ ] LocalFileService created
- [ ] Unit tests pass
- [ ] Images save correctly to local filesystem
- [ ] URLs are generated correctly

---

#### Step 2.2: Update Application Configuration
**Objective:** Configure local file storage paths

**Files to Update:**
- `demo/src/main/resources/application.properties`

**Changes:**
```properties
# Remove AWS configuration (or comment out)
# aws.accessKeyId=${AWS_ACCESS_KEY_ID}
# aws.secretKey=${AWS_SECRET_ACCESS_KEY}
# aws.region=${AWS_REGION}
# aws.s3.bucketName=${AWS_S3_BUCKET_NAME}

# Add/Update local file storage configuration
file.upload-dir=uploads
file.upload.base-url=http://localhost:8080/api/images
file.upload.images-dir=uploads/images
```

**Test:**
```bash
# Verify configuration loads
mvn spring-boot:run
# Check logs for configuration errors
```

**✅ Completion Criteria:**
- [ ] Configuration updated
- [ ] Application starts without errors
- [ ] Configuration values are accessible

---

### **PHASE 3: Service Migration (One by One)**

#### Step 3.1: Migrate ProductService
**Objective:** Replace S3Service with LocalFileService in ProductService

**Files to Update:**
- `demo/src/main/java/com/example/demo/service/ProductService.java`

**Changes:**
1. Replace `@Autowired private S3Service s3Service;` with `@Autowired private LocalFileService localFileService;`
2. Update `uploadAndGetImageUrl()` method
3. Update `uploadAndGetImageUrls()` method

**Test:**
```java
// Integration test
@Test
void testCreateProductWithImages() {
    // Create product with images
    // Verify images saved locally
    // Verify URLs in database
    // Verify images accessible via ImageController
}
```

**Manual Test:**
1. Start application
2. Create a product via admin panel with images
3. Verify images appear in `uploads/images/products/`
4. Verify product displays correctly on frontend
5. Check database - image URLs should be relative paths

**✅ Completion Criteria:**
- [ ] ProductService uses LocalFileService
- [ ] Product creation with images works
- [ ] Product update with images works
- [ ] Images display correctly on frontend
- [ ] All unit tests pass

---

#### Step 3.2: Migrate CategoryService
**Objective:** Replace S3Service with LocalFileService in CategoryService

**Files to Update:**
- `demo/src/main/java/com/example/demo/service/CategoryService.java`

**Changes:**
1. Replace S3Service injection with LocalFileService
2. Update image upload calls in `createCategory()` and `updateCategory()`

**Test:**
```java
@Test
void testCreateCategoryWithImage() {
    // Create category with image
    // Verify image saved
    // Verify URL in database
}
```

**Manual Test:**
1. Create a category with image via admin panel
2. Verify image in `uploads/images/categories/`
3. Verify category displays correctly

**✅ Completion Criteria:**
- [ ] CategoryService migrated
- [ ] Category images work correctly
- [ ] Tests pass

---

#### Step 3.3: Migrate HeroService
**Objective:** Replace S3Service with LocalFileService in HeroService

**Files to Update:**
- `demo/src/main/java/com/example/demo/service/HeroService.java`

**Changes:**
1. Replace S3Service injection with LocalFileService
2. Update image upload in `updateHero()`
3. Remove S3 error handling (or adapt for local storage)

**Test:**
```java
@Test
void testUpdateHeroWithImage() {
    // Update hero with new image
    // Verify image saved
}
```

**Manual Test:**
1. Update hero section with new image
2. Verify image in `uploads/images/hero/`
3. Verify hero displays on homepage

**✅ Completion Criteria:**
- [ ] HeroService migrated
- [ ] Hero images work correctly
- [ ] Tests pass

---

#### Step 3.4: Migrate PackService
**Objective:** Replace S3Service with LocalFileService in PackService

**Files to Update:**
- `demo/src/main/java/com/example/demo/service/PackService.java`

**Changes:**
1. Replace S3Service injection with LocalFileService
2. Update composite image upload in `updatePackImage()`
3. Handle byte[] image uploads

**Test:**
```java
@Test
void testCreatePackWithCompositeImage() {
    // Create pack
    // Verify composite image generated
    // Verify image saved locally
}
```

**Manual Test:**
1. Create a pack with products
2. Verify composite image generated and saved
3. Verify pack displays correctly

**✅ Completion Criteria:**
- [ ] PackService migrated
- [ ] Pack composite images work
- [ ] Tests pass

---

#### Step 3.5: Migrate CommentService
**Objective:** Replace S3Service with LocalFileService in CommentService

**Files to Update:**
- `demo/src/main/java/com/example/demo/service/CommentService.java`

**Changes:**
1. Replace S3Service injection with LocalFileService
2. Update image uploads in `addAdminComment()` and `addAdminCommentToPack()`

**Test:**
```java
@Test
void testAddCommentWithImages() {
    // Add comment with images
    // Verify images saved
}
```

**Manual Test:**
1. Add comment with images
2. Verify images in `uploads/images/comments/`
3. Verify comments display correctly

**✅ Completion Criteria:**
- [ ] CommentService migrated
- [ ] Comment images work
- [ ] Tests pass

---

### **PHASE 4: Remove AWS Dependencies**

#### Step 4.1: Remove AWS Configuration
**Objective:** Remove AWS S3 configuration classes

**Files to Delete:**
- `demo/src/main/java/com/example/demo/config/S3Config.java`

**Files to Update:**
- `demo/src/main/resources/application.properties` (remove AWS properties)

**Test:**
```bash
# Verify application compiles without AWS
mvn clean compile
# Verify no AWS references in code
grep -r "amazonaws" demo/src/
```

**✅ Completion Criteria:**
- [ ] S3Config deleted
- [ ] No compilation errors
- [ ] No AWS references in code

---

#### Step 4.2: Remove AWS Dependency from pom.xml
**Objective:** Remove AWS SDK dependency

**Files to Update:**
- `demo/pom.xml`

**Changes:**
```xml
<!-- Remove or comment out -->
<!--
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-java-sdk-s3</artifactId>
    <version>1.12.766</version>
</dependency>
-->
```

**Test:**
```bash
# Verify Maven builds without AWS
mvn clean install
# Verify no AWS classes in classpath
mvn dependency:tree | grep aws
```

**✅ Completion Criteria:**
- [ ] AWS dependency removed
- [ ] Application builds successfully
- [ ] No AWS classes in dependencies

---

#### Step 4.3: Remove S3Service (Optional - Keep for Reference)
**Objective:** Archive or remove old S3Service

**Options:**
1. **Keep for reference:** Rename to `S3Service.old.java`
2. **Delete:** Remove file completely

**Recommendation:** Keep for reference initially, delete after full migration verification.

**✅ Completion Criteria:**
- [ ] S3Service archived or removed
- [ ] No references to S3Service in code

---

### **PHASE 5: Update ImageController (If Needed)**

#### Step 5.1: Verify ImageController
**Objective:** Ensure ImageController handles all image types correctly

**Files to Review:**
- `demo/src/main/java/com/example/demo/controller/ImageController.java`

**Verify:**
- Handles all image types (products, categories, packs, hero, comments)
- Proper content-type headers
- Error handling for missing files
- Security (prevent directory traversal)

**Enhancements (if needed):**
- Add subdirectory support: `/api/images/{type}/{filename}`
- Add caching headers
- Add image optimization (optional)

**Test:**
```bash
# Test image serving
curl http://localhost:8080/api/images/products/test-image.jpg
curl http://localhost:8080/api/images/categories/cat-image.jpg
```

**✅ Completion Criteria:**
- [ ] ImageController serves all image types
- [ ] Security checks in place
- [ ] Tests pass

---

### **PHASE 6: Database Migration (If Needed)**

#### Step 6.1: Migrate Existing AWS URLs (Optional)
**Objective:** Convert existing AWS S3 URLs to local paths (if you have existing data)

**Note:** Only needed if you have existing products/categories with AWS URLs in database.

**Approach:**
1. Export all image URLs from database
2. Download images from AWS S3
3. Save to local filesystem
4. Update database URLs to local paths

**Script Example:**
```sql
-- Find all AWS S3 URLs
SELECT id, images FROM product_images WHERE images LIKE '%s3.amazonaws.com%';
SELECT id, image_url FROM categories WHERE image_url LIKE '%s3.amazonaws.com%';
-- etc.
```

**Migration Script:**
Create a one-time migration script to:
1. Download images from S3
2. Save to local filesystem
3. Update database URLs

**✅ Completion Criteria:**
- [ ] All AWS URLs identified
- [ ] Images downloaded and saved locally
- [ ] Database URLs updated
- [ ] Verification script confirms all URLs updated

---

### **PHASE 7: Testing & Validation**

#### Step 7.1: Comprehensive Testing
**Objective:** Verify all functionality works with local storage

**Test Checklist:**

**Backend Tests:**
- [ ] Product creation with images
- [ ] Product update with images
- [ ] Category creation with images
- [ ] Category update with images
- [ ] Hero section image update
- [ ] Pack creation with composite images
- [ ] Comment creation with images
- [ ] Image serving via ImageController
- [ ] Image deletion (if implemented)

**Frontend Tests:**
- [ ] Product images display correctly
- [ ] Category images display correctly
- [ ] Hero image displays correctly
- [ ] Pack images display correctly
- [ ] Comment images display correctly
- [ ] Image uploads work in admin panel
- [ ] Image updates work in admin panel

**Integration Tests:**
- [ ] Full product creation flow
- [ ] Full category creation flow
- [ ] Full pack creation flow
- [ ] Image serving performance

**✅ Completion Criteria:**
- [ ] All tests pass
- [ ] No errors in logs
- [ ] All images accessible
- [ ] Performance acceptable

---

#### Step 7.2: Performance Testing
**Objective:** Ensure local file storage performs well

**Tests:**
- Image upload speed
- Image serving speed
- Concurrent uploads
- Large file handling (25MB limit)

**✅ Completion Criteria:**
- [ ] Upload performance acceptable
- [ ] Serving performance acceptable
- [ ] No memory issues
- [ ] File size limits respected

---

### **PHASE 8: Hostinger Deployment Preparation**

#### Step 8.1: Update Configuration for Production
**Objective:** Configure for Hostinger environment

**Files to Update:**
- `demo/src/main/resources/application.properties`

**Changes:**
```properties
# Production configuration
file.upload-dir=/home/yourusername/public_html/uploads
file.upload.base-url=https://yourdomain.com/api/images

# Or use relative path (recommended)
file.upload-dir=uploads
file.upload.base-url=https://yourdomain.com/api/images
```

**Hostinger Considerations:**
- Use relative paths (easier deployment)
- Ensure `uploads` directory has write permissions (chmod 755)
- Configure web server to serve static files (if needed)

**✅ Completion Criteria:**
- [ ] Production configuration ready
- [ ] Paths configured correctly
- [ ] Permissions documented

---

#### Step 8.2: Create Deployment Script
**Objective:** Automate deployment process

**Create:** `deploy-to-hostinger.sh` or `deploy-to-hostinger.ps1`

**Script should:**
1. Build application (Maven)
2. Create uploads directory structure
3. Set proper permissions
4. Deploy application
5. Verify deployment

**✅ Completion Criteria:**
- [ ] Deployment script created
- [ ] Script tested locally
- [ ] Documentation updated

---

#### Step 8.3: Hostinger-Specific Configuration
**Objective:** Configure for Hostinger hosting

**Considerations:**
1. **Directory Structure:**
   ```
   public_html/
   ├── api/ (Spring Boot app)
   ├── uploads/
   │   └── images/
   └── frontend/ (React app)
   ```

2. **Permissions:**
   ```bash
   chmod 755 uploads
   chmod 755 uploads/images
   chmod 755 uploads/images/products
   chmod 755 uploads/images/categories
   chmod 755 uploads/images/packs
   chmod 755 uploads/images/hero
   chmod 755 uploads/images/comments
   ```

3. **Web Server Configuration:**
   - Ensure Spring Boot serves `/api/images/**`
   - Or configure Nginx/Apache to serve static files directly

**✅ Completion Criteria:**
- [ ] Directory structure planned
- [ ] Permissions documented
- [ ] Web server configuration ready

---

### **PHASE 9: Final Verification & Go-Live**

#### Step 9.1: Pre-Deployment Checklist
- [ ] All code changes committed
- [ ] All tests passing
- [ ] Backup created
- [ ] Configuration reviewed
- [ ] Deployment script ready
- [ ] Rollback plan prepared

#### Step 9.2: Deploy to Hostinger
1. Deploy application
2. Create uploads directory structure
3. Set permissions
4. Start application
5. Verify health endpoint

#### Step 9.3: Post-Deployment Verification
- [ ] Application starts successfully
- [ ] Database connection works
- [ ] Image upload works
- [ ] Image serving works
- [ ] Frontend displays images correctly
- [ ] No errors in logs

#### Step 9.4: Monitor & Optimize
- Monitor application logs
- Monitor file system usage
- Optimize if needed
- Set up backups for uploads directory

---

## Testing Strategy

### Unit Tests
Each service should have unit tests:
- `LocalFileServiceTest.java`
- `ProductServiceTest.java` (updated)
- `CategoryServiceTest.java` (updated)
- `HeroServiceTest.java` (updated)
- `PackServiceTest.java` (updated)
- `CommentServiceTest.java` (updated)

### Integration Tests
- Full image upload flow
- Image serving flow
- Database URL storage

### Manual Tests
- Admin panel image uploads
- Frontend image display
- All image types (products, categories, packs, hero, comments)

---

## Rollback Plan

If something goes wrong:

1. **Immediate Rollback:**
   - Restore database backup
   - Restore code from git (previous commit)
   - Restart application

2. **Partial Rollback:**
   - Keep LocalFileService
   - Re-enable S3Service
   - Update services to use S3Service again
   - Re-add AWS dependency

3. **Data Recovery:**
   - Restore uploads directory from backup
   - Re-run database migration if needed

---

## Risk Mitigation

### Risks:
1. **Data Loss:** Mitigated by comprehensive backups
2. **Downtime:** Mitigated by testing in staging first
3. **Performance Issues:** Mitigated by performance testing
4. **Missing Images:** Mitigated by URL migration script

### Mitigation Steps:
- Always test in development first
- Keep backups at each phase
- Test thoroughly before production
- Have rollback plan ready

---

## Timeline Estimate

- **Phase 1 (Preparation):** 1-2 hours
- **Phase 2 (LocalFileService):** 2-3 hours
- **Phase 3 (Service Migration):** 4-6 hours (1-1.5 hours per service)
- **Phase 4 (Remove AWS):** 1 hour
- **Phase 5 (ImageController):** 1-2 hours
- **Phase 6 (Database Migration):** 2-4 hours (if needed)
- **Phase 7 (Testing):** 3-4 hours
- **Phase 8 (Deployment Prep):** 2-3 hours
- **Phase 9 (Go-Live):** 2-3 hours

**Total Estimated Time:** 18-29 hours

---

## Success Criteria

✅ **Migration Complete When:**
- All services use LocalFileService
- No AWS dependencies in code
- All tests pass
- All images work correctly
- Application deployed to Hostinger
- No errors in production
- Performance acceptable

---

## Next Steps

1. Review this roadmap
2. Create backups (Phase 1)
3. Start with Phase 2 (LocalFileService)
4. Proceed step-by-step
5. Test thoroughly at each phase
6. Deploy to Hostinger when ready

---

## Support & Questions

If you encounter issues:
1. Check the test results
2. Review error logs
3. Verify configuration
4. Check file permissions
5. Review this roadmap for missed steps

---

**Last Updated:** [Current Date]
**Version:** 1.0
**Status:** Ready for Implementation

