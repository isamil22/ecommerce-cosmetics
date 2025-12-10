# 🚀 Landing Page Builder - Quick Start Guide

## What Was Built

A **complete WordPress-style landing page builder** for your e-commerce website that allows admins to create beautiful, customizable product landing pages without any coding.

---

## ⚡ Quick Start (3 Steps)

### Step 1: Start Your Application

**Backend:**
```bash
cd demo
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The database migrations will run automatically and create all necessary tables and permissions.

### Step 2: Access Admin Panel

1. Open your browser: `http://localhost:5173/admin/landing-pages`
2. Log in with an admin account
3. You'll see the Landing Pages dashboard

### Step 3: Create Your First Landing Page

1. Click "**+ Create Landing Page**"
2. Fill in:
   - **Title**: "My First Landing Page"
   - Click "**Generate**" next to Slug (it will create: `my-first-landing-page`)
3. Click "**+ Add Section**" and choose "**Hero Section**"
4. Click "**Edit**" on the Hero section and modify the JSON:
   ```json
   {
     "headline": "Welcome to Our Amazing Product!",
     "subheadline": "The best solution for your needs",
     "ctaText": "Buy Now",
     "backgroundColor": "#ff69b4"
   }
   ```
5. Click "**Save & Publish**"
6. View your landing page at: `http://localhost:5173/landing/my-first-landing-page`

**That's it! You've created your first landing page! 🎉**

---

## 📱 Key URLs

### Admin URLs (Requires Login)
- Landing Pages List: `/admin/landing-pages`
- Create New: `/admin/landing-pages/create`
- Edit Page: `/admin/landing-pages/{id}/edit`

### Public URLs (No Login Required)
- View Landing Page: `/landing/{your-slug}`
- Example: `/landing/summer-serum-2024`

---

## 🎨 Available Section Types

When creating a landing page, you can add these sections:

1. **Hero Section** - Main banner with headline and CTA
2. **Trust Signals** - Badges like "Free Shipping", "Money-Back Guarantee"
3. **Product Showcase** - Large product images with description
4. **Key Benefits** - Grid of benefits with icons
5. **Before/After** - Comparison images
6. **How It Works** - Step-by-step guide
7. **Ingredients** - Product ingredients list
8. **Testimonials** - Customer reviews
9. **FAQ** - Frequently Asked Questions
10. **Urgency Banner** - Countdown timer with limited offer
11. **Final CTA** - Last call-to-action button

---

## 💡 Common Tasks

### To Publish a Draft Page
1. Go to `/admin/landing-pages`
2. Find your page
3. Click "**Publish**" button

### To Change Section Order
1. Edit the landing page
2. Use **↑** and **↓** buttons next to each section

### To Hide a Section (Without Deleting)
1. Edit the landing page
2. Click the **👁️** icon on the section

### To Duplicate a Page
1. Go to `/admin/landing-pages`
2. Click "**Duplicate**" on any page
3. Enter a new slug
4. Edit the duplicated page as needed

---

## 🛡️ Permissions

Your users need these permissions to access landing pages:

- **ADMIN**: Full access to everything
- **MANAGER**: Full access to landing pages
- **EDITOR**: Can view, create, and edit (cannot delete or publish)
- **USER**: No access to admin panel

Permissions are automatically set up by the migration scripts.

---

## 🎯 Example Landing Page Structure

Here's a recommended structure for a product landing page:

```
1. Hero Section (grab attention)
2. Trust Signals (build credibility)
3. Product Showcase (show the product)
4. Key Benefits (explain why buy)
5. Testimonials (social proof)
6. FAQ (answer questions)
7. Urgency Banner (create urgency)
8. Final CTA (convert)
```

---

## 📊 Check Analytics

1. Go to `/admin/landing-pages`
2. See "**Views**" column for each page
3. Click on a page to see detailed analytics

---

## 🐛 Quick Troubleshooting

**Can't see the landing page?**
- Make sure it's **Published** (not Draft)
- Check the slug URL is correct
- Clear browser cache

**Sections not showing?**
- Check if section is visible (👁️ icon)
- Verify JSON data is valid
- Check browser console for errors

**Can't save?**
- Slug must be lowercase with hyphens only
- Title cannot be empty
- Check you have proper permissions

---

## 📖 Full Documentation

For detailed documentation, see: `LANDING_PAGE_BUILDER_GUIDE.md`

---

## ✅ Everything Works Out of the Box!

✅ Backend API ready  
✅ Frontend UI ready  
✅ Database tables created automatically  
✅ Permissions configured automatically  
✅ Routes added  
✅ 11+ section types available  
✅ Preview functionality  
✅ Analytics tracking  
✅ Mobile responsive  
✅ SEO optimized  

**Just start your application and begin creating landing pages!**

---

**Questions? Check the full guide: `LANDING_PAGE_BUILDER_GUIDE.md`**

