// English translations
export const en = {
    // Admin Dashboard
    adminDashboard: 'Admin Dashboard',
    welcomeMessage: "Welcome back! Here's what's happening with your store today.",
    refresh: 'Refresh',
    liveStatus: 'Live Status: Online',
    lastUpdated: 'Last updated',
    error: 'Error',
    loadingDashboard: 'Loading dashboard...',

    // Metrics
    totalRevenue: 'Total Revenue',
    totalOrders: 'Total Orders',
    totalUsers: 'Total Users',
    totalProducts: 'Total Products',
    packsAvailable: 'Packs Available',
    customPacks: 'Custom Packs',
    categories: 'Categories',
    visitorCounter: 'Visitor Counter',

    // Growth
    fromLastMonth: 'from last month',

    // Status
    active: 'Active',
    disabled: 'Disabled',
    range: 'Range',

    // Sections
    recentProducts: 'Recent Products',
    recentOrders: 'Recent Orders',
    pendingReviews: 'Pending Reviews',
    quickActions: 'Quick Actions',

    // Actions
    addNew: 'Add New',
    viewAll: 'View all',
    viewAllProducts: 'View all products',
    viewAllOrders: 'View all orders',
    manageReviews: 'Manage reviews',
    managePacks: 'Manage Packs',
    manageCustomPacks: 'Manage Custom Packs',
    manageCategories: 'Manage Categories',
    configureSettings: 'Configure Settings',

    // Quick Actions
    addNewProduct: 'Add New Product',
    createNewPack: 'Create New Pack',
    newCustomPack: 'New Custom Pack',
    addCategory: 'Add Category',
    reviewFormSettings: 'Review Form Settings',

    // Confirmation
    deleteProductConfirm: 'Are you sure you want to delete this product?',

    // Errors
    failedToFetchDashboard: 'Failed to fetch dashboard data.',
    failedToDeleteProduct: 'Failed to delete product.',

    // ===== BATCH 1: SETTINGS PAGES =====

    // Brand Settings Page
    brandSettings: {
        title: 'Logo Settings',
        subtitle: 'Manage your website\'s visual identity',
        logoConfiguration: 'Logo Configuration',
        selectNewLogo: 'Select New Logo',
        saveLogo: 'Save Logo',
        uploading: 'Uploading...',
        recommendedSize: 'Recommended size: 512x512px (Square). PNG or JPG format.',
        brandDetails: 'Brand Details',
        siteTitle: 'Site Title',
        siteSubtitle: 'Site Subtitle',
        titleFont: 'Title Font',
        preview: 'Preview:',
        saveDetails: 'Save Details',
        saving: 'Saving...',
        fontOptions: {
            default: 'Default (Sans Serif)',
            dancingScript: 'Dancing Script (Cursive)',
            playfairDisplay: 'Playfair Display (Serif)',
            greatVibes: 'Great Vibes (Calligraphic)',
            cinzel: 'Cinzel (Luxury)',
            montserrat: 'Montserrat (Modern)'
        },
        success: {
            logoUploaded: 'Logo uploaded successfully!',
            detailsSaved: 'Brand details saved successfully!'
        },
        errors: {
            loadSettings: 'Failed to load settings.',
            saveDetails: 'Failed to save details.',
            uploadLogo: 'Failed to upload logo.'
        }
    },

    // Announcement Page
    announcement: {
        title: 'Announcement Management',
        subtitle: 'Manage your site\'s announcement bar settings',
        hidePreview: 'Hide Preview',
        showPreview: 'Show Preview',
        settings: 'Announcement Settings',
        enableDisable: 'Enable/Disable',
        enabled: 'Enabled',
        disabled: 'Disabled',
        announcementText: 'Announcement Text',
        textPlaceholder: 'Enter your announcement message...',
        backgroundColor: 'Background Color',
        gradient: 'Gradient',
        solid: 'Solid',
        textColor: 'Text Color',
        animation: 'Animation',
        animationTypes: {
            none: 'None',
            pulse: 'Pulse',
            bounce: 'Bounce',
            slide: 'Slide'
        },
        stickyBar: 'Sticky Bar',
        fontWeight: 'Font Weight',
        fontWeights: {
            normal: 'Normal',
            medium: 'Medium',
            semibold: 'Semibold',
            bold: 'Bold'
        },
        showOnlineCounter: 'Show Online Counter',
        livePreview: 'Live Preview',
        currentSettings: 'Current Settings',
        saveChanges: 'Save Changes',
        saving: 'Saving...',
        loadingSettings: 'Loading announcement settings...',
        success: 'Announcement updated successfully!',
        errors: {
            loadSettings: 'Failed to load announcement settings',
            updateFailed: 'Failed to update announcement'
        }
    },

    // Countdown Page
    countdown: {
        title: 'Countdown Management',
        subtitle: 'Configure your site\'s countdown timer',
        settings: 'Countdown Settings',
        enableDisable: 'Enable/Disable',
        enabled: 'Enabled',
        disabled: 'Disabled',
        targetDate: 'Target Date',
        targetTime: 'Target Time',
        title: 'Title',
        titlePlaceholder: 'Flash Sale Ends In...',
        message: 'Message',
        messagePlaceholder: 'Hurry up! Limited time offer!',
        position: 'Position',
        positions: {
            top: 'Top',
            bottom: 'Bottom',
            floating: 'Floating'
        },
        style: 'Style',
        styles: {
            minimal: 'Minimal',
            bold: 'Bold',
            gradient: 'Gradient'
        },
        showDays: 'Show Days',
        showHours: 'Show Hours',
        showMinutes: 'Show Minutes',
        showSeconds: 'Show Seconds',
        autoHide: 'Auto-hide after expiration',
        preview: 'Preview',
        saveChanges: 'Save Changes',
        saving: 'Saving...',
        loadingSettings: 'Loading countdown settings...',
        success: 'Countdown updated successfully!',
        errors: {
            loadSettings: 'Failed to load countdown settings',
            updateFailed: 'Failed to update countdown',
            invalidDate: 'Invalid date or time'
        }
    },

    // Integrations Page
    integrations: {
        title: 'Integrations',
        subtitle: 'Manage third-party integrations and API keys',
        analytics: 'Analytics',
        googleAnalytics: 'Google Analytics',
        trackingId: 'Tracking ID',
        trackingIdPlaceholder: 'UA-XXXXXXXXX-X or G-XXXXXXXXXX',
        facebookPixel: 'Facebook Pixel',
        pixelId: 'Pixel ID',
        pixelIdPlaceholder: 'Your Facebook Pixel ID',
        payment: 'Payment',
        stripeKeys: 'Stripe Keys',
        publishableKey: 'Publishable Key',
        publishableKeyPlaceholder: 'pk_test_...',
        secretKey: 'Secret Key',
        secretKeyPlaceholder: 'sk_test_...',
        paypalSettings: 'PayPal Settings',
        clientId: 'Client ID',
        clientIdPlaceholder: 'Your PayPal Client ID',
        email: 'Email',
        emailService: 'Email Service',
        smtpSettings: 'SMTP Settings',
        smtpHost: 'SMTP Host',
        smtpPort: 'SMTP Port',
        smtpUsername: 'SMTP Username',
        smtpPassword: 'SMTP Password',
        senderEmail: 'Sender Email',
        senderName: 'Sender Name',
        storage: 'Storage',
        awsS3: 'AWS S3',
        accessKey: 'Access Key',
        secretAccessKey: 'Secret Access Key',
        bucketName: 'Bucket Name',
        region: 'Region',
        testConnection: 'Test Connection',
        testing: 'Testing...',
        saveChanges: 'Save Changes',
        saving: 'Saving...',
        loadingSettings: 'Loading integrations...',
        success: {
            saved: 'Integrations saved successfully!',
            connectionSuccess: 'Connection successful!'
        },
        errors: {
            loadSettings: 'Failed to load integrations',
            updateFailed: 'Failed to update integrations',
            connectionFailed: 'Connection test failed',
            invalidCredentials: 'Invalid credentials'
        }
    },

    // ===== BATCH 2: PRODUCTS PAGE =====
    products: {
        title: 'Product Management',
        subtitle: 'Manage your product catalog with advanced tools and insights',

        // Header Actions
        refresh: 'Refresh',
        exportCSV: 'Export CSV',
        addNewProduct: 'Add New Product',

        // Keyboard Shortcuts
        shortcuts: {
            newProduct: 'New Product',
            search: 'Search',
            closeModal: 'Close Modal'
        },

        // Analytics Cards
        analytics: {
            totalProducts: 'Total Products',
            inStock: 'In Stock',
            lowStock: 'Low Stock',
            outOfStock: 'Out of Stock',
            totalValue: 'Total Value',
            avgPrice: 'Avg Price'
        },

        // Search and Filters
        searchPlaceholder: 'Search products...',
        allCategories: 'All Categories',
        allStock: 'All Stock',
        inStockFilter: 'In Stock',
        lowStockFilter: 'Low Stock',
        outOfStockFilter: 'Out of Stock',
        allStatus: 'All Status',
        activeStatus: 'Active',
        disabledStatus: 'Disabled',
        featuredStatus: 'Featured',
        newArrivalsStatus: 'New Arrivals',

        // Sort Options
        sortByName: 'Sort by Name',
        sortByPrice: 'Sort by Price',
        sortByStock: 'Sort by Stock',
        sortByDate: 'Sort by Date',

        // View Modes
        gridView: 'Grid View',
        listView: 'List View',

        // Bulk Actions
        selectAll: 'Select All',
        clearSelection: 'Clear Selection',
        bulkDelete: 'Delete Selected',
        selectedCount: 'selected',
        clearFilters: 'Clear Filters',

        // Product Card
        edit: 'Edit',
        delete: 'Delete',
        quickEdit: 'Quick Edit',
        view: 'View',
        category: 'Category',
        brand: 'Brand',
        price: 'Price',
        stock: 'Stock',
        status: 'Status',

        // Stock Status
        stockStatus: {
            inStock: 'In Stock',
            lowStock: 'Low Stock',
            outOfStock: 'Out of Stock'
        },

        // Product Badges
        bestseller: 'Bestseller',
        newArrival: 'New Arrival',
        featured: 'Featured',
        disabled: 'Disabled',

        // Messages
        noProducts: 'No products found',
        noProductsDesc: 'Get started by adding your first product',
        loadingProducts: 'Loading products...',

        // Confirmations
        deleteConfirm: 'Are you sure you want to delete this product?',
        bulkDeleteConfirm: 'Are you sure you want to delete {count} product(s)? This action cannot be undone.',

        // Success Messages
        success: {
            deleted: 'Product deleted successfully!',
            bulkDeleted: '{count} product(s) deleted successfully!',
            updated: 'Product updated successfully!',
            exported: 'Products exported successfully!'
        },

        // Error Messages
        errors: {
            fetchFailed: 'Failed to fetch products.',
            deleteFailed: 'Failed to delete product.',
            updateFailed: 'Failed to update product.',
            exportFailed: 'Failed to export products.',
            noSelection: 'No products selected for deletion'
        },

        // Warnings
        warnings: {
            partialDelete: '{success} product(s) deleted, {failed} failed'
        }
    },

    // Admin Product Form
    productForm: {
        // Page Header
        title: {
            create: 'Create New Product',
            edit: 'Edit Product'
        },
        subtitle: {
            create: 'Add a new product to your catalog',
            edit: 'Update your product information'
        },
        loading: 'Loading product...',

        // Actions
        actions: {
            save: 'Save',
            saving: 'Saving...',
            savingProduct: 'Saving Product...',
            create: 'Create Product',
            update: 'Update Product',
            backToProducts: 'Back to Products'
        },

        // Basic Information Section
        basicInfo: {
            title: 'Basic Information',
            productName: 'Product Name',
            productNamePlaceholder: 'Enter product name',
            brand: 'Brand',
            brandPlaceholder: 'Enter brand name',
            price: 'Price ($)',
            pricePlaceholder: '0.00',
            stockQuantity: 'Stock Quantity',
            stockPlaceholder: '0',
            category: 'Category',
            categoryPlaceholder: '-- Select a Category --',
            type: 'Type',
            typeMen: 'Men',
            typeWomen: 'Women',
            typeBoth: 'Both',

            // Checkboxes
            bestseller: 'Bestseller',
            newArrival: 'New Arrival',
            hasVariants: 'Has Variants',
            isPackable: 'Available for Custom Packs'
        },

        // Description Section
        description: {
            title: 'Product Description',
            label: 'Description'
        },

        // Images Section
        images: {
            title: 'Product Images',
            upload: 'Upload Images',
            existingImages: 'Existing Images:',
            newImages: 'New Images to Append:',
            removeImage: 'Remove Image'
        },

        // Variant Types Section
        variantTypes: {
            title: 'Variant Types',
            typeName: 'Type Name',
            typeNamePlaceholder: 'e.g., Size, Color',
            options: 'Options',
            optionValue: 'Value (e.g. Red)',
            color: 'Color',
            image: 'Image',
            addOption: '+ Add Option',
            remove: 'Remove',
            removeOption: 'Remove Option',
            addVariantType: 'Add Variant Type'
        },

        // Product Variants Section
        variants: {
            title: 'Product Variants',
            select: 'Select {name}',
            price: 'Price',
            stock: 'Stock',
            variantImage: 'Variant Image',
            removeImage: 'Remove Image',
            removeVariant: 'Remove Variant'
        },

        // Display Settings Section
        displaySettings: {
            title: 'Display Settings',
            purchaseNotifications: {
                title: 'ðŸ›ï¸ Show Purchase Notifications',
                description: 'Display notifications when customers buy this product',
                enabled: 'Enabled',
                disabled: 'Disabled'
            },
            countdownTimer: {
                title: 'â±ï¸ Show Countdown Timer',
                description: 'Display flash sale countdown timer for urgency',
                enabled: 'Enabled',
                disabled: 'Disabled'
            }
        },

        // Frequently Bought Together Section
        frequentlyBought: {
            title: 'Frequently Bought Together',
            label: 'Select products that are frequently bought together with this product',
            placeholder: 'Search and select products...'
        },

        // Validation Messages
        validation: {
            nameRequired: 'Product name is required.',
            priceRequired: 'Valid price is required.',
            categoryRequired: 'Category is required.',
            variantPricesRequired: 'All variants must have valid prices.'
        },

        // Success Messages
        success: {
            created: 'Product created successfully!',
            updated: 'Product updated successfully!'
        },

        // Error Messages
        errors: {
            saveFailed: 'Failed to save product.',
            loadFailed: 'Failed to load product.',
            categoriesFailed: 'Failed to load product categories. Please try again.'
        }
    }
    ,

    // Categories Management
    categoriesPage: {
        title: 'Category Management',
        subtitle: 'Organize your product catalog with beautiful categories',
        shortcuts: {
            newCategory: 'New Category',
            search: 'Search',
            clearSearch: 'Clear Search'
        },
        actions: {
            refresh: 'Refresh',
            addNew: 'Add New Category'
        },
        analytics: {
            totalCategories: 'Total Categories',
            withProducts: 'With Products',
            emptyCategories: 'Empty Categories',
            totalProducts: 'Total Products'
        },
        search: {
            placeholder: 'Search categories...'
        },
        sort: {
            name: 'Name',
            products: 'Products'
        },
        viewMode: {
            grid: 'Grid',
            list: 'List'
        },
        card: {
            products: 'products',
            edit: 'Edit',
            delete: 'Delete'
        },
        confirmDelete: 'Are you sure you want to delete this category?',
        messages: {
            fetchFailed: 'Failed to fetch categories.',
            deleteSuccess: 'Category deleted successfully!',
            deleteFailed: 'Failed to delete category. It might be in use by some products.'
        },
        noCategories: 'No categories found',
        noResults: 'No categories match your search'
    },

    // Category Form
    categoryForm: {
        title: {
            create: 'Create Category',
            edit: 'Edit Category'
        },
        subtitle: {
            create: 'Add a new category to organize your products',
            edit: 'Update your category information'
        },
        shortcuts: {
            save: 'Save',
            back: 'Back'
        },
        unsavedChanges: 'Unsaved changes',
        backToCategories: 'Back to Categories',
        sectionTitle: {
            create: 'Category Information',
            edit: 'Edit Category Details'
        },
        sectionSubtitle: {
            create: 'Fill in the details to create a new category',
            edit: 'Update your category information and settings'
        },
        fields: {
            categoryName: 'Category Name',
            categoryNamePlaceholder: 'Enter category name (e.g., Electronics, Fashion, Books)',
            description: 'Description',
            descriptionOptional: '(Optional)',
            descriptionPlaceholder: 'Describe this category (optional)',
            categoryImage: 'Category Image',
            imageOptional: '(Optional)',
            charactersCount: 'characters'
        },
        imageUpload: {
            dropHere: 'Drop your image here',
            orClick: 'or click to browse',
            chooseFile: 'Choose File',
            supportedFormats: 'Supported formats: JPG, PNG, GIF. Max size: 5MB',
            preview: 'Category preview'
        },
        validation: {
            nameRequired: 'Category name is required',
            nameMinLength: 'Category name must be at least 2 characters',
            descriptionMaxLength: 'Description must be less than 500 characters',
            invalidImage: 'Please select a valid image file.',
            fixErrors: 'Please fix the errors before submitting.'
        },
        actions: {
            cancel: 'Cancel',
            creating: 'Creating...',
            updating: 'Updating...',
            create: 'Create Category',
            update: 'Update Category'
        },
        messages: {
            notFound: 'Category not found.',
            loadFailed: 'Failed to load category data.',
            createSuccess: 'Category created successfully!',
            updateSuccess: 'Category updated successfully!',
            operationFailed: 'Operation failed. Please try again.'
        }
    }
    ,

    // Admin Dashboard
    dashboard: {
        loadingDashboard: 'Loading dashboard...',
        adminDashboard: 'Admin Dashboard',
        welcomeMessage: 'Welcome to your administration panel',
        refresh: 'Refresh',
        liveStatus: 'Live',
        lastUpdated: 'Last updated',
        error: 'Error',

        // Metrics
        totalRevenue: 'Total Revenue',
        totalOrders: 'Total Orders',
        totalUsers: 'Total Users',
        totalProducts: 'Total Products',
        fromLastMonth: 'from last month',

        // Secondary Metrics
        packsAvailable: 'Packs Available',
        customPacks: 'Custom Packs',
        categories: 'Categories',
        visitorCounter: 'Visitor Counter',
        active: 'Active',
        disabled: 'Disabled',
        range: 'Range',

        // Links
        managePacks: 'Manage Packs',
        manageCustomPacks: 'Manage Custom Packs',
        manageCategories: 'Manage Categories',
        configureSettings: 'Configure Settings',

        // Sections
        recentProducts: 'Recent Products',
        addNew: 'Add New',
        viewAllProducts: 'View All Products',
        recentOrders: 'Recent Orders',
        viewAllOrders: 'View All Orders',
        pendingReviews: 'Pending Reviews',
        manageReviews: 'Manage Reviews',

        // Quick Actions
        quickActions: 'Quick Actions',
        addNewProduct: 'Add New Product',
        createNewPack: 'Create New Pack',
        newCustomPack: 'New Custom Pack',
        addCategory: 'Add Category',
        reviewFormSettings: 'Review Form Settings'
    }
    ,
    // Orders Page
    ordersPage: {
        title: 'Orders Management',
        subtitle: 'Manage and track customer orders',
        deletedOrders: 'Deleted Orders',
        activeOrders: 'Active Orders',
        searchPlaceholder: 'Search by ID or customer...',
        filterStatus: 'Filter by Status',
        filterDate: 'Filter by Date',
        sortBy: 'Sort by',

        status_ALL: 'All Statuses',
        status_PENDING: 'Pending',
        status_PREPARING: 'Preparing',
        status_DELIVERING: 'Delivering',
        status_DELIVERED: 'Delivered',
        status_CANCELLED: 'Cancelled',

        date_ALL: 'All Dates',
        date_TODAY: 'Today',
        date_THIS_WEEK: 'This Week',
        date_THIS_MONTH: 'This Month',

        orderBy: 'Ordered By',
        items: 'Items',
        total: 'Total',
        status: 'Status',
        date: 'Date',
        actions: 'Actions',

        totalRevenue: 'Total Revenue',
        averageOrder: 'Average Order',
        uniqueCustomers: 'Unique Customers',
        todaysOrders: 'Today\'s Orders',
        timeline_placed: 'Order Placed',
        timeline_transit: 'In Transit',
        timeline_delivered: 'Delivered',
        errorExport: 'Failed to export orders.',
        revenueToday: 'Today\'s Revenue',

        viewDetails: 'View Details',
        delete: 'Delete',
        restore: 'Restore',
        deletePermanently: 'Delete Permanently',
        changeStatus: 'Change Status',
        export: 'Export CSV',
        loading: 'Loading orders...',
        retry: 'Retry',
        resetFilters: 'Reset Filters',
        showActive: 'Show Active',
        showDeleted: 'Show Deleted',
        updateStatus: 'Update Status',
        deleteSelected: 'Delete Selected',
        selected: 'selected',
        orderId: 'Order ID',
        customer: 'Customer'
    },

    // Integrations Page
    integrationsPage: {
        title: 'Integrations',
        subtitle: 'Connect external services and tools',
        facebookPixel: {
            title: 'Facebook Pixel',
            activeTitle: 'Facebook Pixel Active',
            activeDesc: 'Your pixel is configured and tracking events',
            inactiveTitle: 'Facebook Pixel Not Configured',
            inactiveDesc: 'Add your Pixel ID to start tracking user behavior',
            configTitle: 'Pixel Configuration',
            label: 'Facebook Pixel ID',
            placeholder: 'Enter your Facebook Pixel ID (15-16 digits)',
            helpText: 'This ID will be used to track user activity for marketing purposes and conversion optimization.'
        },
        googleAnalytics: {
            title: 'Google Analytics',
            activeTitle: 'Google Analytics Active',
            activeDesc: 'Your analytics are configured and tracking.',
            inactiveTitle: 'Google Analytics Not Configured',
            inactiveDesc: 'Add your Measurement ID to start tracking.',
            configTitle: 'Google Analytics Configuration',
            label: 'Measurement ID (G-XXXXXXXXXX)',
            placeholder: 'Enter your Measurement ID (e.g., G-T78R8VV7E4)',
            helpText: 'This Measurement ID connects your site to Google Analytics 4 (GA4).'
        },
        actions: {
            clear: 'Clear',
            save: 'Save Configuration',
            saving: 'Saving...'
        },
        messages: {
            pixelSaved: 'Facebook Pixel settings saved successfully!',
            gaSaved: 'Google Analytics settings saved successfully!',
            saveFailed: 'Failed to save settings. You must be an admin.',
            loadFailed: 'Failed to load settings.'
        }
    },

    // Review Form Settings
    reviewFormSettings: {
        title: 'Review Form Settings',
        subtitle: 'Control the visibility of the review form on product detail pages',
        configTitle: 'Review Form Configuration',
        showReviewForm: 'Show Review Form',
        showReviewFormDesc: 'Display the "Write Your Review" section on product detail pages',
        preview: 'Preview',
        visibleMsg: 'Review form will be visible to customers on product detail pages',
        hiddenMsg: 'Review form will be hidden from customers on product detail pages',
        quickInfo: 'Quick Info',
        quickInfo1: 'This setting controls the visibility of the review form on all product detail pages.',
        quickInfo2: 'When disabled, customers won\'t be able to submit new reviews.',
        quickInfo3: 'Existing reviews will still be visible regardless of this setting.',
        currentStatus: 'Current Status',
        enabled: 'Review Form Enabled',
        disabled: 'Review Form Disabled',
        reset: 'Reset',
        save: 'Save Settings',
        saving: 'Saving...',
        unsavedChanges: 'You have unsaved changes',
        messages: {
            saved: 'Review Form settings saved successfully!',
            saveFailed: 'Failed to save settings',
            loadFailed: 'Failed to fetch settings'
        }
    },

    // Analytics Page
    analyticsPage: {
        title: 'Analytics Dashboard',
        subtitle: 'Comprehensive insights into your coupon performance and business metrics',
        loading: 'Loading Analytics Dashboard...',
        lastUpdated: 'Last updated:',
        actions: {
            refresh: 'Refresh Data',
            viewCoupons: 'View Coupons',
            manageCoupons: 'Manage Coupons',
            viewOrders: 'View Orders',
            dashboard: 'Dashboard'
        },
        stats: {
            totalCoupons: 'Total Coupons',
            activeCoupons: 'Active Coupons',
            totalUses: 'Total Uses',
            totalSavings: 'Total Savings'
        },
        usage: {
            title: 'Usage Analytics',
            dailyTrend: 'Daily Usage Trend',
            totalDaily: 'Total Daily Uses',
            recentActivity: 'Recent Activity',
            uses: 'uses',
            noDataTitle: 'No Usage Data Available',
            noDataDesc: 'Usage statistics will appear here once customers start using coupons.'
        },
        performance: {
            title: 'Coupon Performance',
            detailTitle: 'Detailed Analytics Available',
            detailDesc: 'Click on any coupon in the Coupons page to view detailed usage analytics, performance metrics, and AI-powered insights.'
        },
        features: {
            title: 'Analytics Features',
            chartsTitle: '10+ Chart Types',
            chartsDesc: 'Dual-axis, radar, funnel, heatmap, and more',
            aiTitle: 'AI-Powered Insights',
            aiDesc: 'Smart recommendations and performance analysis',
            realTimeTitle: 'Real-Time Analytics',
            realTimeDesc: 'Live updates and performance monitoring'
        },
        quickActions: {
            title: 'Quick Actions'
        },
        messages: {
            refreshSuccess: 'Analytics data refreshed successfully!',
            refreshError: 'Failed to refresh analytics data'
        }
    },

    // Announcement Page
    announcementPage: {
        title: 'Announcement Management',
        subtitle: 'Manage your site\'s announcement bar settings',
        loading: 'Loading announcement settings...',
        hidePreview: 'Hide Preview',
        showPreview: 'Show Preview',
        refresh: 'Refresh',
        settingsTitle: 'Announcement Settings',
        livePreviewTitle: 'Live Preview',
        enable: {
            title: 'Enable Announcement',
            description: 'Show or hide the announcement bar'
        },
        text: {
            label: 'Announcement Text',
            placeholder: 'Enter your announcement text...',
            help: 'Supports both Arabic and English text'
        },
        background: {
            label: 'Background Style',
            gradient: 'Gradient (Pink to Purple to Blue)',
            red: 'Red',
            blue: 'Blue',
            green: 'Green',
            yellow: 'Yellow',
            purple: 'Purple',
            pink: 'Pink'
        },
        textColor: {
            label: 'Text Color'
        },
        animation: {
            label: 'Animation Type',
            none: 'No Animation',
            pulse: 'Pulse',
            bounce: 'Bounce'
        },
        onlineCounter: {
            title: 'Show Online Counter',
            description: 'Display "X users online now"',
            demoText: '25 Online now',
            status: {
                shown: 'Shown',
                hidden: 'Hidden'
            }
        },
        sticky: {
            title: 'Sticky Position',
            description: 'Keep announcement bar at top when scrolling',
            preview: {
                yes: 'Yes',
                no: 'No'
            }
        },
        buttons: {
            save: 'Save Changes',
            saving: 'Saving...'
        },
        preview: {
            title: 'Preview Settings:',
            status: 'Status:',
            enabled: 'Enabled',
            disabled: 'Disabled',
            background: 'Background:',
            animation: 'Animation:',
            onlineCounter: 'Online Counter:',
            sticky: 'Sticky:',
            clickToPreview: 'Click "Show Preview" to see how your announcement will look'
        },
        messages: {
            loadError: 'Failed to load announcement settings',
            updateSuccess: 'Announcement updated successfully!',
            updateError: 'Failed to update announcement'
        }
    }
};
