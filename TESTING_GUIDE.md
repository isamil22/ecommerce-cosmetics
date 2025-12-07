# Testing Guide - AWS to Hostinger Migration

This guide will help you test the migration from AWS S3 to local file storage step by step.

## Prerequisites

1. ✅ Java 17+ installed
2. ✅ Maven installed
3. ✅ MySQL database running
4. ✅ Application configured

## Step 1: Build the Application

```bash
cd demo
mvn clean install
```

**Expected Result:** Build should complete successfully without AWS dependency errors.

## Step 2: Run Unit Tests

```bash
mvn test
```

**Expected Result:** All tests pass, including `LocalFileServiceTest`.

## Step 3: Start the Application

```bash
mvn spring-boot:run
```

**Expected Result:** 
- Application starts without errors
- No AWS-related errors in logs
- Check logs for: "Started EcomercebasicApplication"

## Step 4: Verify Directory Structure

After starting the application, check if directories are created:

```bash
# Windows PowerShell
ls uploads/images/

# Should show:
# products/
# categories/
# packs/
# hero/
# comments/
```

**Expected Result:** All image type directories exist (may be empty initially).

## Step 5: Test Product Image Upload

### Via Admin Panel:
1. Log in as admin
2. Navigate to Products → Create Product
3. Upload a product image
4. Save the product

### Verify:
1. Check `uploads/images/products/` - should contain the uploaded image
2. Check database - `product_images` table should have the image URL
3. View product on frontend - image should display correctly

**Expected Result:** 
- Image file exists in `uploads/images/products/`
- Database contains URL like: `http://localhost:8080/api/images/products/{uuid}-{filename}`
- Image displays on frontend

## Step 6: Test Category Image Upload

1. Navigate to Categories → Create Category
2. Upload a category image
3. Save the category

### Verify:
- Image in `uploads/images/categories/`
- Database contains correct URL
- Category displays with image on frontend

## Step 7: Test Hero Section Image

1. Navigate to Hero Section settings
2. Upload a new hero image
3. Save

### Verify:
- Image in `uploads/images/hero/`
- Hero section displays new image on homepage

## Step 8: Test Pack Creation with Composite Image

1. Create a pack with multiple products
2. Save the pack

### Verify:
- Composite image generated in `uploads/images/packs/`
- Pack displays with composite image
- Image URL in database

## Step 9: Test Comment Images

1. Add a comment with images (admin comment)
2. Save

### Verify:
- Images in `uploads/images/comments/`
- Comment displays with images
- Images accessible via URL

## Step 10: Test Image Serving

Test direct image access:

```bash
# Replace {type} and {filename} with actual values
curl http://localhost:8080/api/images/products/{filename}
curl http://localhost:8080/api/images/categories/{filename}
```

**Expected Result:** Images are served correctly with proper content-type headers.

## Step 11: Test Image URL Format

Check database URLs:

```sql
-- Check product images
SELECT images FROM product_images LIMIT 5;

-- Check category images
SELECT image_url FROM categories LIMIT 5;

-- Check pack images
SELECT image_url FROM packs LIMIT 5;
```

**Expected Result:** URLs should be in format:
- `http://localhost:8080/api/images/{type}/{filename}`

## Step 12: Test Error Handling

### Test 1: Invalid Image Type
Try accessing non-existent image:
```
http://localhost:8080/api/images/products/nonexistent.jpg
```

**Expected Result:** 404 Not Found

### Test 2: Directory Traversal Protection
Try accessing:
```
http://localhost:8080/api/images/../etc/passwd
```

**Expected Result:** 400 Bad Request or 404 Not Found (security protection)

## Step 13: Performance Test

1. Upload multiple images simultaneously
2. Check response times
3. Verify all images saved correctly

**Expected Result:** 
- All uploads succeed
- Reasonable response times (< 2 seconds per image)
- No memory issues

## Step 14: Frontend Integration Test

1. Open frontend application
2. Browse products - images should load
3. View product details - images should display
4. Check categories - category images should show
5. View packs - pack images should display
6. Check comments - comment images should show

**Expected Result:** All images display correctly on frontend.

## Common Issues & Solutions

### Issue 1: Directory Not Created
**Symptom:** Images fail to upload, directory doesn't exist
**Solution:** Check file permissions, ensure application has write access

### Issue 2: Images Not Displaying
**Symptom:** Images upload but don't display
**Solution:** 
- Check ImageController is working
- Verify URL format in database
- Check CORS settings if frontend on different domain

### Issue 3: 404 on Image Access
**Symptom:** Images saved but return 404 when accessed
**Solution:**
- Verify file exists in correct directory
- Check filename matches URL
- Verify ImageController path mapping

### Issue 4: AWS Errors Still Appearing
**Symptom:** Application tries to use AWS
**Solution:**
- Verify S3Service is not injected anywhere
- Check all services use LocalFileService
- Rebuild application: `mvn clean install`

## Test Checklist

- [ ] Application builds successfully
- [ ] Unit tests pass
- [ ] Application starts without errors
- [ ] Directory structure created
- [ ] Product images upload and display
- [ ] Category images upload and display
- [ ] Hero images upload and display
- [ ] Pack composite images generate correctly
- [ ] Comment images upload and display
- [ ] Image serving works via ImageController
- [ ] Database URLs are correct format
- [ ] Security (directory traversal) works
- [ ] Frontend displays all images correctly
- [ ] No AWS-related errors in logs

## Success Criteria

✅ **Migration Successful When:**
- All tests pass
- All image types upload correctly
- All images display on frontend
- No AWS dependencies in code
- No errors in application logs
- Performance is acceptable

## Next Steps After Testing

1. If all tests pass → Proceed to production deployment
2. If issues found → Review error logs and fix
3. Update production configuration
4. Deploy to Hostinger
5. Verify production deployment

---

**Note:** Keep this guide handy during testing. Document any issues you encounter for reference.

