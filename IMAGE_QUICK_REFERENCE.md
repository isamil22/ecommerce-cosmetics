# Image System Quick Reference Guide 📸

**Last Updated**: December 7, 2025

---

## Quick Facts

| Aspect | Detail |
|--------|--------|
| **Storage Type** | Local filesystem (not AWS S3) |
| **Storage Location** | `uploads/images/{type}/` |
| **URL Format** | `/api/images/{type}/{uuid}_{name}` |
| **File Organization** | By type (products, categories, packs, hero, comments) |
| **Upload Endpoint** | Admin panel only (authentication required) |
| **View Endpoint** | Public (no authentication needed) |
| **Cache Duration** | 1 year |
| **Max File Size** | 25 MB |

---

## Image Types & Storage

### Products
```
Storage Path: uploads/images/products/
API URL: /api/images/products/{uuid}_{filename}.jpg
Database: JSON array
Example: ["/api/images/products/5d23943d-...-DSC_0183.jpg"]
```

### Categories
```
Storage Path: uploads/images/categories/
API URL: /api/images/categories/{uuid}_{filename}.jpg
Database: Single URL field
Example: "/api/images/categories/abc12345-...-category.jpg"
```

### Packs
```
Storage Path: uploads/images/packs/
API URL: /api/images/packs/{uuid}_{filename}.jpg
Database: Single URL field
Example: "/api/images/packs/def67890-...-pack.jpg"
Auto-generation: Yes (from product images if not provided)
```

### Hero Section
```
Storage Path: uploads/images/hero/
API URL: /api/images/hero/{uuid}_{filename}.jpg
Database: Single URL field
Default: "https://placehold.co/..." (placeholder if not set)
```

### Comments
```
Storage Path: uploads/images/comments/
API URL: /api/images/comments/{uuid}_{filename}.jpg
Database: JSON array
Example: ["/api/images/comments/xyz99999-...-comment.jpg"]
```

---

## Services Responsible for Images

| Service | Methods | Image Type |
|---------|---------|-----------|
| **ProductService** | `createProductWithImages()`, `updateProductWithImages()` | products |
| **CategoryService** | `createCategory()`, `updateCategory()` | categories |
| **PackService** | `createPack()`, `updatePack()`, `updatePackImage()` | packs |
| **HeroService** | `updateHero()` | hero |
| **CommentService** | `addAdminComment()`, `addAdminCommentToPack()` | comments |
| **ImageCompositionService** | `createCompositeImage()` | packs (auto-generated) |

---

## API Endpoints

### Upload Endpoints (POST - Admin Only)

```
POST /api/products
- Body: FormData with images[] array
- Returns: Product with image URLs

POST /api/categories  
- Body: FormData with image file
- Returns: Category with image URL

POST /api/packs
- Body: FormData with image file (optional)
- Returns: Pack with image URL

POST /api/hero
- Body: FormData with image file
- Returns: Hero with image URL

POST /api/comments/product/{productId}
- Body: FormData with images[] array
- Returns: Comment with image URLs
```

### Serve Endpoints (GET - Public)

```
GET /api/images/products/{uuid}_{filename}
- Returns: Image file with proper MIME type
- Cache: 1 year

GET /api/images/categories/{uuid}_{filename}
- Returns: Image file
- Cache: 1 year

GET /api/images/packs/{uuid}_{filename}
- Returns: Image file
- Cache: 1 year

GET /api/images/hero/{uuid}_{filename}
- Returns: Image file
- Cache: 1 year

GET /api/images/comments/{uuid}_{filename}
- Returns: Image file
- Cache: 1 year

GET /api/images/{filename}  (Legacy)
- Backward compatible
- Searches multiple locations
```

---

## Frontend Usage

### Display Images
```jsx
// Product images
{product.images && product.images.map((url, idx) => (
  <img src={url} alt={`Product ${idx + 1}`} />
))}

// Category image
{category.imageUrl && (
  <img src={category.imageUrl} alt={category.name} />
)}

// Pack image
{pack.imageUrl && (
  <img src={pack.imageUrl} alt={pack.name} />
)}

// Comment images
{comment.images && comment.images.map((url, idx) => (
  <img src={url} alt={`Comment ${idx + 1}`} />
))}
```

### Upload Images
```jsx
// Single file input
<input type="file" accept="image/*" onChange={(e) => {
  const file = e.target.files[0];
  // Send via FormData to API
}} />

// Multiple files input
<input type="file" multiple accept="image/*" onChange={(e) => {
  const files = Array.from(e.target.files);
  // Send via FormData to API
}} />

// FormData submission
const formData = new FormData();
formData.append('name', productName);
formData.append('images', file1);
formData.append('images', file2);
await fetch('/api/products', { method: 'POST', body: formData });
```

---

## Troubleshooting

### Images Not Showing
**Check**:
1. URL format: Should be `/api/images/{type}/{filename}`
2. Status: Should return 200 OK
3. File exists: Check `uploads/images/{type}/` directory
4. Security: Check SecurityConfig for `/api/images/**` in permitAll

**Solution**: See IMAGE_DISPLAY_FIX_COMPLETE.md

### Upload Fails
**Check**:
1. File size: Must be under 25 MB
2. MIME type: Must be image/*
3. Permissions: uploads directory must be writable
4. Authentication: Admin role required

**Solution**: Check browser console for error message

### Images Lost After Restart
**Check**:
1. Docker volume mount: `./uploads:/app/uploads`
2. Directory exists on host
3. File permissions are correct

**Solution**: Verify docker-compose.yml has volume mount

### 404 on Image Request
**Check**:
1. Filename is correct
2. File exists in uploads directory
3. Type directory is correct

**Solution**: Check uploads directory structure

---

## File Organization Best Practices

### For Admins
1. Always add images when creating products
2. Use descriptive filenames (will be UUID'd)
3. Compress images before uploading (optional)
4. Don't manually delete from uploads directory

### For Developers
1. Don't hardcode image URLs
2. Always use relative paths
3. Check for null/empty images in frontend
4. Validate file uploads in backend

---

## Docker Commands

### View Uploaded Images
```bash
# From host
ls -la uploads/images/products/
ls -la uploads/images/categories/

# From container
docker exec backend ls -la /app/uploads/images/
```

### Backup Images
```bash
# Backup uploads directory
cp -r uploads/ uploads_backup_$(date +%Y%m%d)/

# Or using Docker
docker cp backend:/app/uploads ./uploads_backup
```

### Restore Images
```bash
# Restore from backup
cp -r uploads_backup/* ./uploads/

# Rebuild containers
docker-compose down --remove-orphans
docker-compose up -d
```

---

## Production Checklist

- [ ] Update CORS origins to production domain
- [ ] Set proper file permissions (755 dirs, 644 files)
- [ ] Backup uploads directory
- [ ] Test image upload on production
- [ ] Test image display on production
- [ ] Monitor disk space usage
- [ ] Set up automated backups
- [ ] Consider CDN for images
- [ ] Monitor upload errors

---

## Performance Tips

1. **Compress images** before uploading (reduce file size)
2. **Use browser caching** (already 1 year)
3. **Consider CDN** for production (fast global delivery)
4. **Monitor uploads directory** size (alert at 80% full)
5. **Implement cleanup** for old images (optional)

---

## Security Checklist

- ✅ Public read access (no auth for GET /api/images/**)
- ✅ Admin-only upload (auth required for POST)
- ✅ Directory traversal protection
- ✅ MIME type validation
- ✅ File size limits
- ✅ CORS properly configured
- ✅ Filename sanitization
- ✅ UUID for uniqueness

---

## Important Paths

```
uploads/                    # Host filesystem
├── images/
│   ├── products/          # Product images
│   ├── categories/        # Category images
│   ├── packs/             # Pack images
│   ├── hero/              # Hero section image
│   └── comments/          # Comment images

/app/uploads/              # Container filesystem (same content via volume mount)
```

---

## Configuration Files

| File | Setting | Value |
|------|---------|-------|
| `application.properties` | `file.upload-dir` | `uploads` |
| `application.properties` | `file.upload.base-url` | `/api/images` |
| `application.properties` | `multipart.max-file-size` | `25MB` |
| `docker-compose.yml` | `volumes` | `./uploads:/app/uploads` |
| `SecurityConfig.java` | GET permitAll | `/api/images/**` |

---

## Quick Links

- **Audit Report**: See IMAGE_STORAGE_AUDIT_REPORT.md
- **Test Results**: See IMAGE_TESTING_RESULTS.md
- **Fix Summary**: See IMAGE_DISPLAY_FIX_COMPLETE.md
- **Admin Panel**: http://localhost:8085/admin/products

---

## Support Resources

**If images don't display:**
1. Check IMAGE_DISPLAY_FIX_COMPLETE.md
2. Check SecurityConfig.java for `/api/images/**` in permitAll
3. Check docker-compose.yml for volume mount
4. Run `docker-compose build --no-cache && docker-compose up -d`

**If upload fails:**
1. Check file size (max 25MB)
2. Check MIME type (image/*)
3. Check permissions on uploads directory
4. Check backend logs: `docker logs backend`

**If unsure:**
1. Read IMAGE_STORAGE_AUDIT_REPORT.md (comprehensive)
2. Read IMAGE_TESTING_RESULTS.md (test coverage)
3. Read this file (quick reference)

---

**Everything is working! No action needed unless you want to:**
- Upload test images
- Deploy to production
- Implement additional features

**Ready for production deployment to Hostinger!** ✅
