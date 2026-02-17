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
    managePacksLink: 'Manage Packs',
    manageCustomPacksLink: 'Manage Custom Packs',
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
        refresh: 'Refresh',
        settingsTitle: 'Announcement Settings',
        enable: {
            title: 'Enable/Disable',
            description: 'Toggle the announcement bar visibility on your site'
        },
        text: {
            label: 'Announcement Text',
            placeholder: 'Enter your announcement message... (e.g. Free Shipping over $50)',
            help: 'This text will appear in the top bar of your website'
        },
        background: {
            label: 'Background Color',
            gradient: 'Gradient',
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
            label: 'Animation',
            none: 'None',
            pulse: 'Pulse',
            bounce: 'Bounce'
        },
        onlineCounter: {
            title: 'Show Online Counter',
            description: 'Display a fake "Online Users" counter to create urgency',
            status: {
                shown: 'Shown',
                hidden: 'Hidden'
            },
            online: '{count} online now'
        },
        sticky: {
            title: 'Sticky Bar',
            description: 'Keep the bar visible when scrolling',
            preview: {
                yes: 'Yes',
                no: 'No'
            }
        },
        buttons: {
            save: 'Save Changes',
            saving: 'Saving...'
        },
        livePreviewTitle: 'Live Preview',
        preview: {
            title: 'Preview Information',
            status: 'Status',
            enabled: 'Enabled',
            disabled: 'Disabled',
            background: 'Background',
            animation: 'Animation',
            onlineCounter: 'Online Counter',
            sticky: 'Sticky',
            clickToPreview: 'Click "Show Preview" to see the live announcement bar'
        },
        loading: 'Loading announcement settings...',
        messages: {
            loadError: 'Failed to load announcement settings',
            updateSuccess: 'Announcement updated successfully!',
            updateError: 'Failed to update announcement'
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
            addOption: 'Add Option',
            remove: 'Remove',
            removeOption: 'Remove Option',
            addVariantType: 'Add Variant Type (e.g. Size)'
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
            update: 'Update Category',
            back: 'Back'
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
        managePacksLink: 'Manage Packs',
        manageCustomPacksLink: 'Manage Custom Packs',
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
    },

    adminSidebar: {
        adminPanel: 'Admin Panel',
        storeManagement: 'Store Management',
        dashboard: 'Dashboard',
        products: 'Products',
        categories: 'Categories',
        packs: 'Packs',
        customPacks: 'Custom Packs',
        sales: 'Sales',
        orders: 'Orders',
        coupons: 'Coupons',
        discountRules: 'Discount Rules',
        users: 'Users',
        reviews: 'Reviews',
        content: 'Content',
        heroSection: 'Hero Section',
        announcements: 'Announcements',
        landingPages: 'Landing Pages',
        countdown: 'Countdown',
        enhancedCounter: 'Enhanced Counter',
        reviewFormSettings: 'Review Form Settings',
        analytics: 'Analytics',
        accessControl: 'Access Control',
        roles: 'Roles',
        permissions: 'Permissions',
        logoSettings: 'Logo Settings',
        facebookPixel: 'Facebook Pixel'
    },
    adminLayout: {
        checkingPermissions: 'Checking access permissions...',
        openMenu: 'Open Menu',
        collapseMenu: 'Collapse Menu'
    },
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
        status_CANCELED: 'Cancelled',

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

        table: {
            orderId: 'Order ID',
            customer: 'Customer',
            contactInfo: 'Contact Info',
            created: 'Date',
            status: 'Status',
            total: 'Total',
            actions: 'Actions'
        },

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
        customer: 'Customer',
        contact: 'Contact',
        modal: {
            title: 'Order Details',
            clientInfo: 'Client Information',
            name: 'Name:',
            phone: 'Phone:',
            city: 'City:',
            address: 'Address:',
            orderInfo: 'Order Information',
            orderItems: 'Order Items',
            packContents: 'Pack Contents:',
            variant: 'Variant:',
            qty: 'Qty:',
            subtotal: 'Subtotal:',
            discount: 'Discount:',
            shipping: 'Shipping:',
            total: 'Total:',
            timeline: 'Order Timeline',
            quickActions: 'Quick Actions',
            markDelivering: 'Mark as Delivering',
            markDelivered: 'Mark as Delivered',
            cancelOrder: 'Cancel Order',
            restoreOrder: 'Restore Order',
            close: 'Close',
            noItems: 'No items in this order.',
            coupon: 'Coupon:',
            free: 'Free'
        }
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

    // ===== BATCH 3: PACK MANAGEMENT =====
    managePacks: {
        title: 'Manage Packs',
        subtitle: 'Create and manage product bundles',
        addNew: 'Add New Pack',
        noPacks: 'No packs found',
        noPacksDesc: 'Get started by creating your first product pack',
        createFirst: 'Create Your First Pack',
        deleteConfirm: 'Are you sure you want to delete this pack?',
        deleteSuccess: 'Pack deleted successfully!',
        deleteFailed: 'Failed to delete pack.',
        actions: {
            edit: 'Edit',
            recommendations: 'Recommendations',
            comments: 'Comments',
            delete: 'Delete',
            deleting: 'Deleting...'
        }
    },

    packForm: {
        createTitle: 'Create New Pack',
        editTitle: 'Edit Pack',
        createSubtitle: 'Build a product bundle with multiple items',
        editSubtitle: 'Update your product bundle with multiple items',
        clearDraft: 'Clear Draft',
        unsavedChanges: 'Unsaved changes',
        steps: {
            basicInfo: 'Basic Info',
            packItems: 'Pack Items',
            displaySettings: 'Display Settings',
            recommendations: 'Recommendations',
            review: 'Review'
        },
        basicInfo: {
            title: 'Basic Information',
            name: 'Pack Name',
            namePlaceholder: 'Enter pack name',
            price: 'Pack Price',
            image: 'Pack Image',
            hideComments: 'Hide Comment Form',
            hideCommentsDesc: "When enabled, users won't be able to leave comments on this pack. Existing comments will still be visible."
        },
        items: {
            title: 'Pack Items',
            addItem: 'Add Item',
            itemTitle: 'Item {index}',
            defaultProduct: 'Default Product',
            defaultPlaceholder: '-- Select Default Product --',
            variations: 'Variation Products (Optional)',
            variationsPlaceholder: '-- Select Variation Products --',
            enhancedSelection: 'Enhanced Product Selection',
            enhancedDesc: 'Each dropdown now shows product images for easy identification. Search functionality is built into each selector.'
        },
        settings: {
            title: 'Display Settings',
            purchaseNotif: 'Show Purchase Notifications',
            purchaseNotifDesc: 'Display notifications when customers buy this pack',
            countdown: 'Show Countdown Timer',
            countdownDesc: 'Display flash sale countdown timer for urgency',
            enabled: 'Enabled',
            disabled: 'Disabled'
        },
        recommendations: {
            title: 'Pack Recommendations',
            systemTitle: 'Recommendation System',
            systemDesc: 'Select products and other packs to recommend to customers when they view this pack. This helps increase sales through cross-selling.',
            products: 'Recommended Products',
            packs: 'Recommended Packs',
            noProducts: 'No products available',
            noPacks: 'No other packs available',
            summary: 'Selection Summary',
            selectedProducts: 'Products',
            selectedPacks: 'Packs'
        },
        review: {
            title: 'Ready to Create Pack?',
            subtitle: 'Review your pack details and create the bundle',
            cancel: 'Cancel',
            create: 'Create Pack',
            update: 'Update Pack',
            creating: 'Creating...',
            updating: 'Updating...'
        },
        validation: {
            nameRequired: 'Pack name is required',
            nameLength: 'Pack name must be at least 3 characters',
            priceRequired: 'Valid price is required',
            imageRequired: 'Please select a valid image file',
            imageSize: 'Image size must be less than 5MB',
            itemDefaultRequired: 'Default product is required for each item',
            minItems: 'At least one pack item is required'
        },
        success: {
            created: 'Pack created successfully!',
            updated: 'Pack updated successfully!',
            draftCleared: 'Draft cleared'
        },
        description: {
            title: 'Description',
            label: 'Pack Description'
        },
        dragDrop: {
            clickToUpload: 'Click to upload',
            orDrag: 'or drag and drop',
            fileTypeInfo: 'PNG, JPG, GIF up to 5MB',
            change: 'Change',
            remove: 'Remove',
            invalidType: 'Please select a valid image file',
            invalidSize: 'Image size must be less than 5MB',
            dropInvalid: 'Please drop a valid image file'
        },
        productSelect: {
            placeholder: 'Select Product...',
            search: 'Search products...',
            noProducts: 'No products found',
            selected: 'selected',
            more: 'more'
        },
        errors: {
            fetchFailed: 'Failed to fetch data. Please try again later.',
            createFailed: 'Failed to create pack. Please check the form fields.'
        },
        autoSave: 'Form auto-saved'
    },

    // Review Form Settings
    reviewFormSettingsPage: {
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
            totalRevenue: 'Total Revenue',
            orders: 'Total Orders',
            customers: 'Total Customers',
            totalCoupons: 'Total Coupons',
            activeCoupons: 'Active Coupons',
            totalUses: 'Total Uses',
            totalSavings: 'Total Savings'
        },
        charts: {
            revenue: 'Revenue Over Time',
            orders: 'Orders Overview',
            topProducts: 'Top Products'
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
    },

    // Countdown Page
    countdownPage: {
        title: 'Countdown Control Panel',
        messages: {
            saveSuccess: 'Settings saved successfully!',
            saveError: 'Error saving settings.'
        },
        sections: {
            themes: {
                title: 'WEBSITE-COMPATIBLE DESIGN THEMES',
                label: 'Choose a Design Theme:',
                description: 'This will set all colors, text, animations, and layout to match your website\'s style and branding.',
                applyButton: 'Apply Theme',
                selectedPreview: 'Selected Theme Preview:',
                presets: {
                    darkPremium: {
                        name: 'Dark Premium',
                        description: 'Luxury dark theme with gold accents',
                        preview: 'Deep dark blue-purple background with gold timer numbers and coral borders. Perfect for luxury brands.'
                    },
                    lightProfessional: {
                        name: 'Light Professional',
                        description: 'Clean white theme for business sites',
                        preview: 'Clean white background with professional blue accents. Perfect for corporate brands.'
                    },
                    modernGradient: {
                        name: 'Modern Gradient',
                        description: 'Contemporary gradient design',
                        preview: 'Blue-purple gradient with pink accents. Perfect for modern, trendy websites.'
                    },
                    elegantMinimal: {
                        name: 'Elegant Minimal',
                        description: 'Clean and simple design',
                        preview: 'Light gray background with subtle accents. Perfect for minimalist and clean designs.'
                    },
                    vibrantEnergy: {
                        name: 'Vibrant Energy',
                        description: 'High-energy colorful design',
                        preview: 'Bright coral background with gold accents. Perfect for energetic brands and flash sales.'
                    }
                }
            },
            basic: {
                title: 'Basic Settings',
                fields: {
                    title: { label: 'Title', placeholder: 'e.g. Limited Offer!' },
                    endDate: { label: 'End Date & Time' },
                    subtitle: { label: 'Subtitle', placeholder: 'e.g. Save now before offer ends' },
                    packName: { label: 'Pack/Product Name', placeholder: 'e.g. Special Offers' },
                    urgentMessage: { label: 'Urgent Message', placeholder: 'e.g. Hurry! Time running out' },
                    expiredMessage: { label: 'Expired Message', placeholder: 'e.g. Limited Time Expired!' },
                    enabled: { label: 'Enable Countdown' }
                }
            },
            colors: {
                title: 'Color Settings',
                fields: {
                    background: 'Background',
                    text: 'Text Color',
                    border: 'Border Color',
                    timerBox: 'Timer Box',
                    timerText: 'Timer Text',
                    urgentBg: 'Urgent Background',
                    urgentText: 'Urgent Text'
                }
            },
            display: {
                title: 'Display Settings',
                fields: {
                    showDays: 'Show Days',
                    showHours: 'Show Hours',
                    showMinutes: 'Show Minutes',
                    showSeconds: 'Show Seconds',
                    showPackName: 'Show Pack Name',
                    showSubtitle: 'Show Subtitle'
                }
            },
            animation: {
                title: 'Animation Settings',
                fields: {
                    pulse: 'Enable Pulse Animation',
                    bounce: 'Enable Bounce Animation',
                    threshold: 'Urgent Threshold (seconds)'
                }
            },
            layout: {
                title: 'Layout Settings',
                fields: {
                    borderRadius: 'Border Radius (px)',
                    padding: 'Padding (px)',
                    fontSize: 'Font Size (px)',
                    timerFontSize: 'Timer Font Size (px)'
                }
            }
        },
        buttons: {
            save: 'Save All Settings'
        }
    },
    // Custom Packs
    customPacks: {
        manageTitle: 'Manage Custom Packs',
        manageSubtitle: 'Create and manage custom product bundles',
        refresh: 'Refresh',
        addNew: 'Add New Custom Pack',
        noPacks: 'No Custom Packs Found',
        noPacksDesc: 'Create your first custom pack to get started',
        createFirst: 'Create First Pack',
        deleteConfirm: 'Are you sure you want to delete this custom pack?',
        deleteSuccess: 'Custom pack deleted successfully!',
        deleteFailed: 'Failed to delete custom pack.',
        fetchFailed: 'Failed to fetch custom packs.',
        table: {
            id: 'ID',
            edit: 'Edit',
            delete: 'Delete',
            deleting: 'Deleting...',
            fixedPrice: 'Fixed Price',
            percentageDiscount: 'Percentage Discount',
            discount: 'Discount',
            active: 'Active'
        },
        form: {
            createTitle: 'Create Custom Pack',
            editTitle: 'Edit Custom Pack',
            createSubtitle: 'Build a flexible product bundle with custom pricing',
            editSubtitle: 'Update your custom product bundle',
            basicInfo: 'Basic Information',
            packName: 'Pack Name',
            packNamePlaceholder: 'Enter pack name...',
            packImage: 'Pack Image',
            uploadFile: 'Upload a file',
            dragDrop: 'or drag and drop',
            imageConstraints: 'PNG, JPG, GIF up to 10MB',
            description: 'Description',
            descriptionPlaceholder: 'Describe your custom pack...',
            configuration: 'Pack Configuration',
            minItems: 'Minimum Items',
            maxItems: 'Maximum Items',
            pricingConfig: 'Pricing Configuration',
            pricingType: 'Pricing Type',
            fixedPrice: 'Fixed Price',
            fixedPriceDesc: 'Set a fixed price for the pack',
            dynamicDiscount: 'Dynamic Discount',
            dynamicDiscountDesc: 'Apply percentage discount',
            discountRate: 'Discount Rate',
            allowStacking: 'Allow Stacking Discounts',
            stackingDesc: 'Allow other discounts to apply on top of this pack',
            productSelection: 'Product Selection',
            searchPlaceholder: 'Search products...',
            selectAll: 'Select All Products',
            clearSelection: 'Clear Selection',
            clearSearch: 'Clear Search',
            statistics: 'Pack Statistics',
            totalProducts: 'Total Products',
            selected: 'Selected',
            totalValue: 'Total Value',
            savings: 'Savings',
            quickActions: 'Quick Actions',
            unsavedChanges: 'Unsaved changes',
            preview: 'Preview',
            readyToSave: 'Ready to save?',
            reviewSettings: 'Review settings and save changes',
            cancel: 'Cancel',
            create: 'Create Custom Pack',
            update: 'Update Custom Pack',
            creating: 'Creating...',
            updating: 'Updating...',
            validation: {
                nameRequired: 'Pack name is required',
                minItemsRequired: 'Minimum items is required',
                maxItemsRequired: 'Maximum items is required',
                fixedPriceRequired: 'Fixed price is required',
                discountRateRequired: 'Discount rate is required',
                nameLength: 'Pack name must be at least 3 characters',
                minItemsValue: 'Minimum items must be at least 1',
                fixedPriceMin: 'Fixed price must be greater than 0',
                discountRateRange: 'Discount rate must be between 0 and 1 (e.g., 0.20 for 20%)',
                fixErrors: 'Please fix the validation errors before submitting',
                saveFailed: 'Failed to save custom pack.',
                minProducts: 'Select at least {count} products',
                maxItemsError: 'Maximum items cannot be less than minimum items'
            },
            success: {
                created: 'Custom pack created successfully',
                updated: 'Custom pack updated successfully'
            }
        }
    },
    // Users Page
    usersPage: {
        title: 'Manage Users',
        table: {
            userId: 'User ID',
            name: 'Name',
            email: 'Email',
            legacyRole: 'Legacy Role',
            rbacRoles: 'RBAC Roles',
            emailConfirmed: 'Email Confirmed',
            actions: 'Actions',
            yes: 'Yes',
            no: 'No',
            manage: 'Manage'
        },
        rolesModal: {
            title: 'Manage Roles',
            description: 'Select the roles to assign to this user. Users can have multiple roles.',
            cancel: 'Cancel',
            save: 'Save Roles',
            success: 'Roles assigned successfully!',
            error: 'Failed to assign roles',
            permissions: '{count} permissions'
        },
        permissionsModal: {
            title: 'User Permissions',
            description: 'This user has {count} permissions through their assigned roles.',
            viewTitle: 'View Permissions'
        },
        messages: {
            deleteConfirm: 'Are you sure you want to delete user #{id}? This action cannot be undone.',
            deleteSuccess: 'User deleted successfully!',
            deleteFailed: 'Failed to delete user',
            roleUpdated: 'User #{id} role updated to {role}.',
            roleUpdateFailed: 'Failed to update role for user #{id}.',
            fetchFailed: 'Failed to fetch users.'
        }
    },
    // Roles Page
    rolesPage: {
        title: 'Role Management',
        subtitle: 'Create and manage roles with specific permissions',
        createButton: 'Create New Role',
        editRole: 'Edit Role',
        createRole: 'Create Role',
        roleName: 'Role Name',
        roleNamePlaceholder: 'e.g., ROLE_CONTENT_MANAGER',
        roleNameHelp: 'Use format: ROLE_NAME (e.g., ROLE_MANAGER)',
        description: 'Description',
        descriptionPlaceholder: 'Describe what this role can do...',
        assignPermissions: 'Assign Permissions ({count} selected)',
        permissions: 'Permissions:',
        cancel: 'Cancel',
        save: 'Save Role',
        update: 'Update Role',
        messages: {
            createSuccess: 'Role created successfully!',
            updateSuccess: 'Role updated successfully!',
            deleteConfirm: 'Are you sure you want to delete role "{name}"? This cannot be undone.',
            deleteSuccess: 'Role deleted successfully!',
            deleteFailed: 'Failed to delete role. It may be assigned to users.',
            saveFailed: 'Failed to save role',
            fetchFailed: 'Failed to fetch roles and permissions'
        }
    },
    // Permissions Page
    permissionsPage: {
        title: 'Permission Management',
        subtitle: 'Manage system permissions and access controls',
        createButton: 'Create New Permission',
        filterResource: 'Filter by Resource:',
        allResources: 'All Resources',
        showingCount: 'Showing {count} of {total} permissions',
        editPermission: 'Edit Permission',
        createPermission: 'Create Permission',
        resource: 'Resource',
        resourcePlaceholder: 'e.g., PRODUCT, ORDER, USER',
        action: 'Action',
        actionPlaceholder: 'e.g., VIEW, CREATE, EDIT, DELETE',
        permissionName: 'Permission Name:',
        description: 'Description',
        descriptionPlaceholder: 'Describe what this permission allows...',
        cancel: 'Cancel',
        save: 'Save Permission',
        update: 'Update Permission',
        messages: {
            createSuccess: 'Permission created successfully!',
            updateSuccess: 'Permission updated successfully!',
            deleteConfirm: 'Are you sure you want to delete permission "{name}"? This cannot be undone.',
            deleteSuccess: 'Permission deleted successfully!',
            deleteFailed: 'Failed to delete permission. It may be assigned to roles.',
            saveFailed: 'Failed to save permission',
            fetchFailed: 'Failed to fetch permissions'
        }
    },
    // Hero Settings
    heroSettings: {
        title: 'Hero Section Settings',
        subtitle: 'Configure your homepage hero section content',
        pageTitle: 'Manage Hero Section',
        pageSubtitle: 'Customize your homepage hero section to engage visitors',
        form: {
            title: 'Hero Title',
            titlePlaceholder: 'Enter your hero title (e.g., Welcome to Our Store)',
            titleFont: 'Title Font',
            subtitle: 'Hero Subtitle',
            subtitlePlaceholder: 'Enter your hero subtitle (e.g., Discover amazing products at great prices)',
            linkText: 'Button Text',
            linkTextPlaceholder: 'Enter button text (e.g., Shop Now, Explore)',
            linkUrl: 'Button URL',
            linkUrlPlaceholder: 'Enter button URL (e.g., /products, /shop)',
            desktopBackground: 'Desktop Background',
            mobileBackground: 'Mobile Background',
            dropDesktop: 'Drop Desktop Image',
            dropMobile: 'Drop Mobile Image',
            updateButton: 'Update Hero Section',
            updating: 'Updating Hero Section...',
            desktopRec: '1920x800px recommended',
            mobileRec: '800x1000px recommended'
        },
        preview: {
            title: 'Live Preview',
            subtitle: 'See how your hero section will appear',
            livePreviewBadge: 'Live Preview',
            infoTitle: 'Preview Information',
            titleLength: 'Title Length',
            subtitleLength: 'Subtitle Length',
            hasImage: 'Has Background Image',
            buttonUrl: 'Button URL',
            notSet: 'Not set',
            yes: 'Yes',
            no: 'No',
            chars: 'characters'
        },
        messages: {
            success: 'Hero section updated successfully!',
            loadFailed: 'Failed to load hero data.',
            validation: {
                titleRequired: 'Hero title is required',
                titleMinLength: 'Hero title must be at least 3 characters',
                subtitleRequired: 'Hero subtitle is required',
                subtitleMinLength: 'Hero subtitle must be at least 5 characters',
                linkTextRequired: 'Link text is required',
                linkUrlRequired: 'Link URL is required',
                linkUrlFormat: 'Link URL must start with / or http',
                imageRequired: 'Please select a valid image file.',
                saveFailed: 'Failed to save changes.',
                fixErrors: 'Please fix errors before saving.'
            }
        },
        shortcuts: {
            save: 'Save',
            preview: 'Preview',
            clear: 'Clear Messages',
            unsaved: 'Unsaved changes',
            hidePreview: 'Hide Preview',
            showPreview: 'Show Preview'
        }
    },
    // Pack Comments
    packComments: {
        title: 'Comments for {packName}',
        addNew: 'Add New Comment',
        backToPacks: 'Back to Packs',
        table: {
            user: 'User',
            comment: 'Comment',
            score: 'Score',
            actions: 'Actions',
            edit: 'Edit',
            delete: 'Delete'
        },
        form: {
            addTitle: 'Add New Comment',
            editTitle: 'Edit Comment',
            displayName: 'Display Name',
            content: 'Content',
            score: 'Score',
            images: 'Images',
            newImages: 'New Images (Append)',
            add: 'Add Comment',
            update: 'Update',
            cancel: 'Cancel',
            preview: 'Preview'
        },
        messages: {
            fetchError: 'Failed to fetch pack comments.',
            deleteConfirm: 'Are you sure you want to delete this comment?',
            deleteSuccess: 'Comment deleted successfully!',
            deleteError: 'Failed to delete comment.',
            updateSuccess: 'Comment updated successfully!',
            updateError: 'Failed to update comment.',
            addSuccess: 'Comment added successfully!',
            addError: 'Failed to add comment.',
            deleteImageConfirm: 'Are you sure you want to delete this image?',
            deleteImageSuccess: 'Image deleted successfully!',
            deleteImageError: 'Failed to delete image.'
        }
    },
    // Reviews
    reviews: {
        title: 'Manage Reviews',
        createButton: '+ Create New Review',
        tabs: {
            all: 'All Reviews ({count})',
            pending: 'Pending ({count})',
            approved: 'Approved ({count})'
        },
        form: {
            createTitle: 'Create New Review',
            editTitle: 'Edit Review',
            customerName: 'Customer Name',
            customerNamePlaceholder: 'Enter customer name',
            content: 'Review Content',
            contentPlaceholder: 'Enter review content',
            rating: 'Rating',
            ratingHelp: '{rating} out of 5 stars',
            approved: 'Approved (visible on homepage)',
            create: 'Create Review',
            update: 'Update Review',
            cancel: 'Cancel'
        },
        list: {
            adminCreated: 'ADMIN CREATED',
            approved: 'APPROVED',
            pending: 'PENDING',
            customer: 'Customer:',
            anonymous: 'Anonymous',
            user: 'User:',
            rating: 'Rating:',
            noReviews: 'No reviews found.',
            actions: {
                edit: 'Edit',
                approve: 'Approve',
                delete: 'Delete'
            }
        },
        messages: {
            fetchError: 'Failed to fetch reviews.',
            createSuccess: 'Review created successfully!',
            createError: 'Failed to create review.',
            updateSuccess: 'Review updated successfully!',
            updateError: 'Failed to update review.',
            approveSuccess: 'Review approved successfully!',
            approveError: 'Failed to approve review.',
            deleteConfirm: 'Are you sure you want to delete this review?',
            deleteSuccess: 'Review deleted successfully!',
            deleteError: 'Failed to delete review.'
        }
    },
    // Brand Settings
    brandSettings: {
        title: 'Brand Settings',
        subtitle: 'Customize your brand identity and appearance',
        logoConfiguration: 'Logo Configuration',
        selectNewLogo: 'Select New Logo',
        uploading: 'Uploading...',
        saveLogo: 'Save Logo',
        recommendedSize: 'Recommended size: 500x500px, PNG or JPG',
        brandDetails: 'Brand Details',
        siteTitle: 'Site Title',
        siteSubtitle: 'Site Subtitle',
        titleFont: 'Title Font',
        preview: 'Preview',
        saving: 'Saving...',
        saveDetails: 'Save Details',
        fontOptions: {
            default: 'Default (Sans-Serif)',
            dancingScript: 'Dancing Script (Start)',
            playfairDisplay: 'Playfair Display (Serif)',
            greatVibes: 'Great Vibes (Cursive)',
            cinzel: 'Cinzel (Serif)',
            montserrat: 'Montserrat (Sans-Serif)'
        },
        success: {
            detailsSaved: 'Brand details saved successfully!',
            logoUploaded: 'Logo uploaded successfully!'
        },
        errors: {
            loadSettings: 'Failed to load brand settings.',
            saveDetails: 'Failed to save brand details.',
            uploadLogo: 'Failed to upload logo.'
        }
    },
    // Categories Page
    categoriesPage: {
        title: 'Category Management',
        subtitle: 'Organize your product catalog with beautiful categories',
        header: {
            newCategory: 'New Category',
            search: 'Search',
            clearSearch: 'Clear Search',
            refresh: 'Refresh',
            addNew: 'Add New Category'
        },
        stats: {
            totalCategories: 'Total Categories',
            withProducts: 'With Products',
            emptyCategories: 'Empty Categories',
            totalProducts: 'Total Products'
        },
        search: {
            placeholder: 'Search categories...',
            sortName: 'Sort by Name',
            sortProducts: 'Sort by Product Count',
            clear: 'Clear',
            title: 'Grid View',
            listView: 'List View'
        },
        list: {
            title: 'Categories ({count})',
            refresh: 'Refresh',
            noCategoriesFound: 'No categories found',
            noCategoriesAvailable: 'No categories available',
            tryAdjusting: 'Try adjusting your search criteria',
            startCreating: 'Start by creating your first category',
            createFirst: 'Create Your First Category',
            noImage: 'No Image',
            empty: 'Empty',
            productCount: '{count} products',
            id: 'ID: {id}',
            edit: 'Edit',
            delete: 'Delete'
        },
        messages: {
            fetchFailed: 'Failed to fetch categories.',
            confirmDelete: 'Are you sure you want to delete this category?',
            deleteSuccess: 'Category deleted successfully!',
            deleteFailed: 'Failed to delete category.'
        },
        shortcuts: {
            clearSearch: 'Clear Search'
        },
        card: {
            products: 'products'
        }
    },
    // Products Page

    // Product Form
    productForm: {
        title: {
            create: 'Create New Product',
            edit: 'Edit Product'
        },
        subtitle: {
            create: 'Fill in the information below to create a new product',
            edit: 'Update the information below to edit the product'
        },
        actions: {
            saving: 'Saving...',
            create: 'Create Product',
            update: 'Update Product',
            save: 'Save Changes'
        },
        basicInfo: {
            title: 'Basic Information',
            productName: 'Product Name',
            productNamePlaceholder: 'e.g. Luxury Face Cream',
            brand: 'Brand',
            brandPlaceholder: 'e.g. L\'Oréal',
            price: 'Price (DH)',
            pricePlaceholder: '0.00',
            stockQuantity: 'Stock Quantity',
            stockPlaceholder: '0',
            category: 'Category',
            categoryPlaceholder: 'Select Category',
            type: 'Product Type',
            typeMen: 'Men',
            typeWomen: 'Women',
            typeBoth: 'Both (Unisex)',
            bestseller: 'Bestseller (Featured)',
            newArrival: 'New Arrival',
            hasVariants: 'Has Variants (Colors/Size)',
            isPackable: 'Available in Packs'
        },
        description: {
            title: 'Description',
            label: 'Product Description'
        },
        images: {
            title: 'Product Images',
            upload: 'Upload Images',
            existingImages: 'Existing Images',
            newImages: 'New Images',
            preview: 'Preview',
            existing: 'Existing'
        },
        variantTypes: {
            title: 'Variant Types',
            typeName: 'Type Name',
            typeNamePlaceholder: 'e.g. Color, Size',
            options: 'Options',
            optionValue: 'Value',
            color: 'Color',
            image: 'Image',
            removeOption: 'Remove Option'
        },
        validation: {
            nameRequired: 'Product name is required.',
            priceRequired: 'Price is required and must be greater than 0.',
            categoryRequired: 'Category is required.',
            variantPricesRequired: 'All variants must have a valid price.'
        },
        errors: {
            categoriesFailed: 'Failed to fetch categories.',
            loadFailed: 'Failed to load product details.',
            saveFailed: 'Failed to save product.'
        },
        success: {
            created: 'Product created successfully!',
            updated: 'Product updated successfully!'
        },
        loading: 'Loading product...'
    },
    // Manage Packs Page
    managePacks: {
        title: 'Manage Packs',
        subtitle: 'Create and manage product bundles and special offers',
        addNew: 'Add New Pack',
        noPacks: 'No packs found',
        noPacksDesc: 'Get started by creating your first product pack',
        createFirst: 'Create First Pack',
        actions: {
            edit: 'Edit',
            recommendations: 'Recommendations',
            comments: 'Comments',
            delete: 'Delete',
            deleting: 'Deleting...'
        },
        deleteConfirm: 'Are you sure you want to delete this pack?',
        deleteSuccess: 'Pack deleted successfully',
        deleteFailed: 'Failed to delete pack'
    },
    // Pack Form

    // Pack Recommendations
    packRecommendations: {
        title: 'Manage Recommendations',
        subtitle: 'Pack: {name}',
        cancel: 'Cancel',
        save: 'Save Changes',
        saving: 'Saving...',
        searchPlaceholder: 'Search products and packs...',
        sections: {
            products: 'Product Recommendations',
            packs: 'Pack Recommendations',
            customPacks: 'Custom Pack Recommendations'
        },
        summary: {
            title: 'Current Selection Summary',
            selectedProducts: 'Selected Products',
            selectedPacks: 'Selected Packs',
            selectedCustomPacks: 'Selected Custom Packs',
            noneSelected: 'No items selected'
        },
        messages: {
            success: 'Recommendations updated successfully!',
            error: 'Failed to save recommendations',
            loadError: 'Failed to load data'
        }
    },
    // Order Management Page
    ordersPage: {
        title: 'Order Management',
        subtitle: 'Manage and track customer orders',
        loading: 'Loading orders...',
        errorExport: 'Failed to export orders',
        export: 'Export Orders',
        searchPlaceholder: 'Search by name, ID, or phone...',
        resetFilters: 'Reset Filters',
        showActive: 'Show Active Orders',
        showDeleted: 'Show Deleted Orders',
        selected: 'selected',
        updateStatus: 'Update Status',
        deleteSelected: 'Delete Selected',
        totalOrders: 'Total Orders',
        totalRevenue: 'Total Revenue',
        averageOrder: 'Average Order',
        uniqueCustomers: 'Unique Customers',
        status: 'Order Status',
        todaysOrders: 'Today\'s Orders',
        revenueToday: 'Revenue Today',
        table: {
            orderId: 'Order ID',
            customer: 'Customer',
            contactInfo: 'Contact Info',
            created: 'Created',
            status: 'Status',
            total: 'Total',
            actions: 'Actions'
        },
        pagination: {
            previous: 'Previous',
            next: 'Next',
            showing: 'Showing',
            to: 'to',
            of: 'of',
            results: 'results'
        },
        status_ALL: 'All Statuses',
        status_PREPARING: 'Preparing',
        status_DELIVERING: 'Delivering',
        status_DELIVERED: 'Delivered',
        status_CANCELLED: 'Cancelled',
        date_ALL: 'All Time',
        date_TODAY: 'Today',
        date_THIS_WEEK: 'This Week',
        date_THIS_MONTH: 'This Month',
        timeline_placed: 'Order Placed',
        timeline_transit: 'In Transit',
        timeline_delivered: 'Delivered',
        modal: {
            title: 'Order Details',
            subtitle: 'Detailed order information and timeline',
            close: 'Close Details',
            clientInfo: 'Customer Information',
            name: 'Name:',
            phone: 'Phone:',
            city: 'City:',
            address: 'Address:',
            orderInfo: 'Order Information',
            coupon: 'Coupon Applied:',
            orderItems: 'Order Items',
            packContents: 'Pack Contents',
            variant: 'Variant:',
            qty: 'Qty:',
            noItems: 'No items found in this order',
            subtotal: 'Subtotal',
            discount: 'Discount',
            shipping: 'Shipping',
            free: 'Free',
            total: 'Total Amount',
            timeline: 'Order Timeline',
            quickActions: 'Quick Actions',
            markDelivering: 'Mark as Delivering',
            markDelivered: 'Mark as Delivered',
            cancelOrder: 'Cancel Order',
            restoreOrder: 'Restore Order'
        },
        messages: {
            fetchError: 'Failed to fetch orders.',
            deleteConfirm: 'Are you sure you want to delete this order?',
            deleteSuccess: 'Order deleted successfully!',
            deleteError: 'Failed to delete order.',
            restoreSuccess: 'Order restored successfully!',
            restoreError: 'Failed to restore order.',
            statusSuccess: 'Order status updated!',
            statusError: 'Failed to update order status.',
            bulkSelect: 'Please select orders to update.',
            bulkUpdateConfirm: 'Are you sure you want to update {count} orders to {status}?',
            bulkUpdateSuccess: '{count} orders updated successfully!',
            bulkUpdateError: 'Failed to update some orders.',
            bulkDeleteSelect: 'Please select orders to delete.',
            bulkDeleteConfirm: 'Are you sure you want to delete {count} orders?',
            bulkDeleteSuccess: '{count} orders deleted successfully!',
            bulkDeleteError: 'Failed to delete some orders.',
            exportSuccess: 'Orders exported successfully!'
        }
    },
    // Order Feedback Component
    orderFeedback: {
        title: 'Customer Feedback',
        loading: 'Loading feedback...',
        error: 'Error loading feedback',
        noFeedback: 'No feedback submitted yet',
        noFeedbackDesc: "Customer hasn't provided feedback for this order",
        from: 'From:',
        anonymous: 'Anonymous User'
    },
    // Coupon Management Page
    couponsPage: {
        title: 'Coupon Management',
        subtitle: 'Create amazing discounts and boost your sales with professional coupon campaigns',
        create: 'Create Coupon',
        refresh: 'Refresh Lists',
        refreshSuccess: 'Coupons refreshed successfully!',
        stats: {
            total: 'Total Coupons',
            active: 'Active Coupons',
            usage: 'Total Usage',
            savings: 'Total Savings'
        },
        form: {
            title_create: 'Create Amazing Coupon',
            title_edit: 'Edit Coupon',
            subtitle: 'Design the perfect discount to boost your sales',
            name: 'Coupon Name',
            namePlaceholder: 'e.g., Summer Sale Spectacular',
            code: 'Coupon Code',
            generate: 'Generate Random Code',
            discountType: 'Discount Type',
            discountValue: 'Discount Value',
            percentage: 'Percentage (%)',
            fixed: 'Fixed Amount ($)',
            freeShipping: 'Free Shipping',
            expiry: 'Expiry Date',
            usageLimit: 'Usage Limit',
            usageLimitHelp: 'Leave 0 for unlimited usage',
            minPurchase: 'Minimum Purchase Amount',
            applicableProducts: 'Applicable Products',
            applicableCategories: 'Applicable Categories',
            scopeHelp: 'Leave empty to apply to all products/categories',
            cancel: 'Cancel',
            submit_create: 'Create Coupon',
            submit_update: 'Update Coupon'
        },
        table: {
            id: 'ID',
            name: 'Coupon Name',
            discount: 'Discount',
            expiry: 'Expiry',
            usage: 'Usage',
            scope: 'Scope',
            actions: 'Actions',
            allItems: 'All Items',
            products: 'Products',
            categories: 'Categories',
            copy: 'Copy Code',
            edit: 'Edit',
            analytics: 'Analytics',
            delete: 'Delete'
        },
        messages: {
            created: 'Coupon "{name}" created successfully!',
            updated: 'Coupon "{name}" updated successfully!',
            deleted: 'Coupon deleted successfully!',
            refreshed: 'Coupons refreshed successfully!',
            copied: 'Code copied to clipboard!',
            deleteConfirm: 'Are you sure you want to delete this coupon?',
            deleteConfirmTitle: 'Delete Coupon',
            yesDelete: 'Yes, Delete',
            errorFetch: 'Something went wrong fetching coupons!',
            errorAction: 'Something went wrong!'
        }
    },
    // Landing Pages Page
    landingPagesPage: {
        title: 'Landing Pages',
        subtitle: 'Create high-converting landing pages for your marketing campaigns',
        create: 'Create Landing Page',
        searchPlaceholder: 'Search landing pages...',
        search: 'Search',
        stats: {
            total: 'Total Landing Pages',
            active: 'Active Pages',
            views: 'Total Views',
            conversions: 'Avg. Conversion'
        },
        tabs: {
            all: 'All Pages',
            published: 'Published',
            drafts: 'Drafts',
            archived: 'Archived'
        },
        table: {
            title: 'Title',
            slug: 'URL Slug',
            status: 'Status',
            views: 'Views',
            conversions: 'Conversions',
            lastModified: 'Last Modified',
            createdOn: 'Created On',
            actions: 'Actions',
            view: 'View',
            edit: 'Edit',
            duplicate: 'Duplicate',
            publish: 'Publish',
            unpublish: 'Unpublish',
            delete: 'Delete'
        },
        status: {
            published: 'Published',
            draft: 'Draft',
            archived: 'Archived'
        },
        pagination: {
            previous: 'Previous',
            next: 'Next',
            pageOf: 'Page {current} of {total}'
        },
        messages: {
            deleteConfirm: 'Are you sure you want to delete this landing page?',
            deleteConfirmTitle: 'Delete Landing Page',
            yesDelete: 'Yes, Delete',
            publishConfirm: 'Are you sure you want to publish this landing page?',
            unpublishConfirm: 'Are you sure you want to unpublish this landing page?',
            duplicatePrompt: 'Enter a slug for the duplicated page (e.g., product-landing-copy):',
            publishedSuccess: 'Landing page published successfully!',
            unpublishedSuccess: 'Landing page unpublished successfully!',
            deletedSuccess: 'Landing page deleted successfully!',
            duplicatedSuccess: 'Landing page duplicated successfully!',
            errorFetch: 'Failed to fetch landing pages',
            errorAction: 'Action failed'
        }
    },
    // Landing Page Builder
    landingPageBuilder: {
        header: {
            editTitle: 'Edit Page Details',
            newTitle: 'New Page',
            back: 'Back',
            saveDraft: 'Save Draft',
            saving: 'Saving...',
            publish: 'Publish'
        },
        settings: {
            title: 'Page Settings',
            pageTitle: 'Title',
            slug: 'Slug',
            generate: 'Generate',
            mainProduct: 'Main Product (Default)',
            mainProductHelp: 'This product will be used by any section set to "Default".'
        },
        sections: {
            title: 'Sections',
            addNew: 'Add New',
            clickToAdd: 'CLICK TO ADD:',
            noSections: 'No sections yet. Add one to start!',
            dragToReorder: 'Drag to reorder',
            done: 'Done',
            edit: 'Edit'
        },
        preview: {
            title: 'Your Page Preview',
            subtitle: 'Add sections from the left panel to see them appear here instantly.'
        },
        messages: {
            enterTitle: 'Please enter a title',
            enterSlug: 'Please enter a slug',
            slugFormat: 'Slug must be lowercase with hyphens only (e.g., summer-serum-2024)',
            duplicateSectionTitle: 'Wait!',
            duplicateSection: 'You already have {count} "{type}" section(s). Are you sure you want to add another one?',
            deleteSectionConfirm: 'Are you sure you want to delete this section?',
            saveSuccess: 'Landing page saved successfully!',
            createSuccess: 'Landing page created successfully!',
            saveError: 'Failed to save landing page',
            loadError: 'Failed to load landing page',
            productsError: 'Failed to fetch products'
        }
    },
    // Product Comments
    productComments: {
        title: 'Comments for {productName}',
        addNew: 'Add New Comment',
        backToProducts: 'Back to Products',
        table: {
            user: 'User',
            comment: 'Comment',
            score: 'Score',
            actions: 'Actions',
            edit: 'Edit',
            delete: 'Delete'
        },
        form: {
            addTitle: 'Add New Comment',
            editTitle: 'Edit Comment',
            displayName: 'Display Name',
            content: 'Content',
            score: 'Score',
            images: 'Images',
            newImages: 'New Images (Append)',
            add: 'Add Comment',
            update: 'Update',
            cancel: 'Cancel'
        },
        messages: {
            fetchError: 'Failed to fetch product comments.',
            deleteConfirm: 'Are you sure you want to delete this comment?',
            deleteSuccess: 'Comment deleted successfully!',
            deleteError: 'Failed to delete comment.',
            updateSuccess: 'Comment updated successfully!',
            updateError: 'Failed to update comment.',
            addSuccess: 'Comment added successfully!',
            addError: 'Failed to add comment.',
            deleteImageConfirm: 'Are you sure you want to delete this image?',
            deleteImageSuccess: 'Image deleted successfully!',
            deleteImageError: 'Failed to delete image.'
        }
    },
    // General Comments
    commentsPage: {
        title: 'Manage Comments',
        table: {
            user: 'User',
            comment: 'Comment',
            score: 'Score',
            actions: 'Actions',
            edit: 'Edit',
            delete: 'Delete'
        },
        form: {
            editTitle: 'Edit Comment',
            content: 'Content',
            score: 'Score',
            update: 'Update',
            delete: 'Delete'
        },
        messages: {
            fetchError: 'Failed to fetch comments.',
            deleteConfirm: 'Are you sure you want to delete this comment?',
            deleteSuccess: 'Comment deleted successfully!',
            deleteError: 'Failed to delete comment.',
            updateSuccess: 'Comment updated successfully!',
            updateError: 'Failed to update comment.'
        }
    },
    // Admin Settings Page
    adminSettings: {
        title: 'System Settings',
        configure: 'Configure Discount Rules',
        highValue: {
            title: '💰 High Value Order Discount',
            thresholdLabel: 'Minimum Order Amount (MAD)',
            discountLabel: 'Discount Percentage (%)',
            help: 'Orders above this amount will generate a discount coupon.'
        },
        loyalty: {
            title: '🏆 Customer Loyalty Program',
            orderCountLabel: 'Reward Every N-th Order',
            discountLabel: 'Discount Percentage (%)',
            help: 'Example: Set to 3 to reward the 3rd, 6th, 9th order.'
        },
        buttons: {
            save: 'Save Settings',
            saving: 'Saving...'
        },
        messages: {
            saveSuccess: 'Settings updated successfully!',
            saveError: 'Failed to update settings.'
        }
    },
    // Announcement Bar
    announcement: {
        title: 'Announcement Bar',
        subtitle: 'Manage the top notification bar of your store',
        loading: 'Loading announcement settings...',
        hidePreview: 'Hide Preview',
        showPreview: 'Show Preview',
        refresh: 'Refresh',
        settingsTitle: 'Bar Settings',
        livePreviewTitle: 'Live Preview',
        enable: {
            title: 'Enable Announcement',
            description: 'Show or hide the announcement bar on the storefront'
        },
        text: {
            label: 'Announcement Text',
            placeholder: 'Enter your announcement text here...',
            help: 'You can use emojis! 🎉'
        },
        background: {
            label: 'Background Style',
            gradient: 'Gradient (Pink/Purple)',
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
            label: 'Animation Effect',
            none: 'None',
            pulse: 'Pulse',
            bounce: 'Bounce'
        },
        onlineCounter: {
            title: 'Show Online Viewer Counter',
            description: 'Display a fake "X people are viewing this" counter to create urgency',
            online: '{count} people viewing offers right now',
            status: {
                shown: 'Shown',
                hidden: 'Hidden'
            }
        },
        sticky: {
            title: 'Sticky Position',
            description: 'Keep the bar visible at the top while scrolling',
            preview: {
                yes: 'Sticky',
                no: 'Static'
            }
        },
        buttons: {
            save: 'Save Changes',
            saving: 'Saving...'
        },
        preview: {
            title: 'Preview Details',
            status: 'Status:',
            enabled: 'Enabled',
            disabled: 'Disabled',
            background: 'Background:',
            animation: 'Animation:',
            onlineCounter: 'Online Counter:',
            sticky: 'Sticky:',
            clickToPreview: 'Click "Show Preview" to see how it looks!'
        },
        messages: {
            loadError: 'Failed to load announcement settings',
            updateSuccess: 'Announcement updated successfully!',
            updateError: 'Failed to update announcement'
        }
    },
    // Countdown Page
    countdownPage: {
        title: 'Countdown Timer Settings',
        messages: {
            saveSuccess: 'Countdown settings saved successfully!',
            saveError: 'Failed to save countdown settings.'
        },
        buttons: {
            save: 'Save Settings',
            saving: 'Saving...'
        },
        sections: {
            themes: {
                title: 'Design Themes',
                label: 'Choose a Preset Theme',
                description: 'Select a pre-designed theme to quickly style your countdown timer to match your brand.',
                applyButton: 'Apply Selected Theme',
                selectedPreview: 'Selected Theme Preview:',
                presets: {
                    darkPremium: {
                        name: 'Dark Premium',
                        description: 'Elegant dark mode with gold accents. Perfect for luxury brands.',
                        preview: 'Dark Blue Background, Gold Numbers, Red Urgency'
                    },
                    lightProfessional: {
                        name: 'Light Professional',
                        description: 'Clean white design with professional blue accents. Good for general stores.',
                        preview: 'White Background, Blue Border, Red Urgency'
                    },
                    modernGradient: {
                        name: 'Modern Gradient',
                        description: 'Trendy gradient background. High visibility and energy.',
                        preview: 'Blue-Purple Gradient, White Text'
                    },
                    elegantMinimal: {
                        name: 'Elegant Minimal',
                        description: 'Subtle and understated. Focuses on content.',
                        preview: 'Light Gray Background, Simple Typography'
                    },
                    vibrantEnergy: {
                        name: 'Vibrant Energy',
                        description: 'High contrast colors to create maximum urgency.',
                        preview: 'Bright Red/Coral Background, Yellow Accents'
                    }
                }
            },
            basic: {
                title: 'Basic Settings',
                fields: {
                    title: {
                        label: 'Title',
                        placeholder: 'e.g., Flash Sale ends in...'
                    },
                    endDate: {
                        label: 'End Date & Time'
                    },
                    subtitle: {
                        label: 'Subtitle',
                        placeholder: 'e.g., Don\'t miss out on these deals!'
                    },
                    packName: {
                        label: 'Pack/Offer Name',
                        placeholder: 'e.g., Summer Bundle'
                    },
                    urgentMessage: {
                        label: 'Urgent Message (< 1 hour)',
                        placeholder: 'e.g., Hurry! Ending soon!'
                    },
                    expiredMessage: {
                        label: 'Expired Message',
                        placeholder: 'e.g., This offer has ended.'
                    },
                    enabled: {
                        label: 'Enable Countdown Timer'
                    }
                }
            },
            colors: {
                title: 'Custom Colors',
                fields: {
                    background: 'Background Color',
                    text: 'Text Color',
                    border: 'Border Color',
                    timerBox: 'Timer Box Color',
                    timerText: 'Timer Text Color',
                    urgentBg: 'Urgent Background',
                    urgentText: 'Urgent Text Color'
                }
            },
            display: {
                title: 'Display Elements',
                fields: {
                    showDays: 'Show Days',
                    showHours: 'Show Hours',
                    showMinutes: 'Show Minutes',
                    showSeconds: 'Show Seconds',
                    showPackName: 'Show Pack Name',
                    showSubtitle: 'Show Subtitle'
                }
            },
            animation: {
                title: 'Animations',
                fields: {
                    pulse: 'Enable Pulse Effect',
                    bounce: 'Enable Bounce Effect',
                    threshold: 'Urgency Threshold (seconds)'
                }
            },
            layout: {
                title: 'Layout & Sizing',
                fields: {
                    borderRadius: 'Border Radius (px)',
                    padding: 'Padding (px)',
                    fontSize: 'Font Size (px)',
                    timerFontSize: 'Timer Font Size (px)'
                }
            }
        }
    },
    // Admin Products Page

    // Admin Categories Page
    categoriesPage: {
        title: 'Categories',
        subtitle: 'Manage product categories',
        header: {
            newCategory: 'New Category',
            search: 'Search',
            refresh: 'Refresh',
            addNew: 'Add New'
        },
        shortcuts: {
            clearSearch: 'Clear Search'
        },
        stats: {
            totalCategories: 'Total Categories',
            withProducts: 'With Products',
            emptyCategories: 'Empty',
            totalProducts: 'Total Products'
        },
        search: {
            placeholder: 'Search categories...',
            sortName: 'Name',
            sortProducts: 'Product Count',
            title: 'Grid View',
            listView: 'List View',
            clear: 'Clear'
        },
        list: {
            title: 'Categories ({count})',
            refresh: 'Refresh',
            noCategoriesFound: 'No categories found',
            noCategoriesAvailable: 'No categories available',
            tryAdjusting: 'Try adjusting your search terms',
            startCreating: 'Get started by creating your first category',
            createFirst: 'Create Category',
            noImage: 'No Image',
            empty: 'Empty',
            productCount: '{count} Products',
            id: 'ID: {id}',
            edit: 'Edit',
            delete: 'Delete'
        },
        card: {
            products: 'Products'
        },
        confirmDelete: 'Are you sure you want to delete this category?',
        messages: {
            fetchFailed: 'Failed to fetch categories',
            deleteSuccess: 'Category deleted successfully',
            deleteFailed: 'Failed to delete category'
        }
    },
    // Admin Product Form
    productForm: {
        title: {
            create: 'Create New Product',
            edit: 'Edit Product'
        },
        subtitle: {
            create: 'Add a new product to your catalog',
            edit: 'Update existing product details'
        },
        loading: 'Loading product data...',
        actions: {
            saving: 'Saving...',
            create: 'Create Product',
            update: 'Update Product'
        },
        basicInfo: {
            title: 'Basic Information',
            productName: 'Product Name',
            productNamePlaceholder: 'e.g. Premium Lipstick',
            brand: 'Brand',
            brandPlaceholder: 'e.g. L\'Oreal',
            price: 'Price',
            pricePlaceholder: '0.00',
            stockQuantity: 'Stock Quantity',
            stockPlaceholder: '0',
            category: 'Category',
            categoryPlaceholder: 'Select Category',
            type: 'Type',
            typeMen: 'Men',
            typeWomen: 'Women',
            typeBoth: 'Unisex',
            bestseller: 'Bestseller',
            newArrival: 'New Arrival',
            hasVariants: 'Has Variants',
            isPackable: 'Is Packable'
        },
        description: {
            title: 'Description',
            label: 'Product Description'
        },
        images: {
            title: 'Product Images',
            upload: 'Upload Images',
            existingImages: 'Existing Images',
            newImages: 'New Images',
            preview: 'Preview',
            existing: 'Existing'
        },
        variantTypes: {
            title: 'Variant Types',
            typeName: 'Type Name',
            typeNamePlaceholder: 'e.g. Color, Size',
            options: 'Options',
            optionValue: 'Option Value',
            color: 'Color',
            image: 'Image',
            removeOption: 'Remove Option'
        },
        displaySettings: {
            title: 'Display Settings',
            purchaseNotifications: {
                title: 'Purchase Notifications',
                description: 'Show "Someone bought..." notifications',
                enabled: 'Enabled'
            },
            countdownTimer: {
                title: 'Countdown Timer',
                description: 'Show urgency countdown timer',
                enabled: 'Enabled'
            }
        },
        frequentlyBought: {
            title: 'Frequently Bought Together',
            label: 'Select Products',
            placeholder: 'Search products...'
        },
        validation: {
            nameRequired: 'Product Name is required',
            priceRequired: 'Price is required',
            categoryRequired: 'Category is required',
            variantPricesRequired: 'All variants must have a valid price'
        },
        success: {
            created: 'Product created successfully',
            updated: 'Product updated successfully'
        },
        errors: {
            categoriesFailed: 'Failed to load categories',
            loadFailed: 'Failed to load product details',
            saveFailed: 'Failed to save product'
        }
    },
    // Admin Users Page
    usersPage: {
        title: 'Users Management',
        messages: {
            fetchFailed: 'Failed to fetch users',
            roleUpdated: 'Role updated to {role}',
            roleUpdateFailed: 'Failed to update user role',
            deleteConfirm: 'Are you sure you want to delete this user?',
            deleteSuccess: 'User deleted successfully',
            deleteFailed: 'Failed to delete user'
        },
        rolesModal: {
            title: 'Manage Roles',
            error: 'Error loading roles',
            success: 'Roles assigned successfully',
            description: 'Assign roles to control user access.',
            permissions: '{count} permissions',
            cancel: 'Cancel',
            save: 'Save Roles'
        },
        permissionsModal: {
            title: 'User Permissions',
            viewTitle: 'View Permissions',
            description: 'User has <strong>{count}</strong> permissions based on their roles.'
        },
        table: {
            userId: 'User ID',
            name: 'Name',
            email: 'Email',
            legacyRole: 'Legacy Role',
            rbacRoles: 'RBAC Roles',
            emailConfirmed: 'Verified',
            actions: 'Actions',
            manage: 'Manage',
            yes: 'Yes',
            no: 'No'
        }
    },
    // Admin Category Form

    // Admin Roles Page
    rolesPage: {
        title: 'Roles & Permissions',
        subtitle: 'Manage user roles and access rights',
        createButton: 'Create New Role',
        createRole: 'Create Role',
        editRole: 'Edit Role',
        roleName: 'Role Name',
        roleNamePlaceholder: 'e.g. Content Manager',
        roleNameHelp: 'Use a descriptive name for the role',
        description: 'Description',
        descriptionPlaceholder: 'Describe what this role is for',
        permissions: 'Permissions',
        selectAll: 'Select All',
        assignPermissions: 'Assign Permissions ({count})',
        cancel: 'Cancel',
        save: 'Save Role',
        update: 'Update Role',
        table: {
            roleName: 'Role Name',
            usersCount: 'Users',
            actions: 'Actions',
            edit: 'Edit',
            delete: 'Delete'
        },
        messages: {
            loadFailed: 'Failed to load roles',
            createSuccess: 'Role created successfully',
            updateSuccess: 'Role updated successfully',
            deleteSuccess: 'Role deleted successfully',
            operationFailed: 'Operation failed',
            deleteConfirm: 'Are you sure you want to delete this role?'
        },
        validation: {
            nameRequired: 'Role name is required'
        }
    },
    // Admin Analytics Page

    // Admin Custom Packs Page

    // Review Form Settings
    reviewFormSettingsPage: {
        title: 'Review Form Settings',
        subtitle: 'Configure how customers leave reviews',
        configTitle: 'General Configuration',
        showReviewForm: 'Show Review Form',
        showReviewFormDesc: 'Allow customers to submit new reviews',
        preview: 'Preview',
        visibleMsg: 'The review form will be visible to customers.',
        hiddenMsg: 'The review form is currently hidden from customers.',
        reset: 'Reset Defaults',
        unsavedChanges: 'You have unsaved changes',
        saving: 'Saving...',
        save: 'Save Changes',
        quickInfo: 'Quick Info',
        quickInfo1: 'Hiding the form prevents new submissions.',
        quickInfo2: 'Existing reviews remain visible.',
        quickInfo3: 'Use this to temporarily pause reviews.',
        currentStatus: 'Current Status',
        enabled: 'Enabled',
        disabled: 'Disabled',
        messages: {
            loadFailed: 'Failed to load settings',
            saveSuccess: 'Settings saved successfully',
            saveFailed: 'Failed to save settings'
        }
    },
    // Enhanced Visitor Counter
    enhancedVisitorCounter: {
        title: 'Enhanced Visitor Counter Management',
        subtitle: 'Control every aspect of your visitor counter display',
        loading: 'Loading settings...',
        globalSettings: {
            title: 'Global Settings',
            enableSystem: 'Enable Visitor Counter System',
            customTitle: 'Custom Title',
            customTitlePlaceholder: 'Live Statistics',
            animationSpeed: 'Animation Speed (ms)'
        },
        metrics: {
            currentViewers: {
                title: 'Current Viewers',
                subtitle: 'Viewing Now',
                description: 'Number of people currently viewing the page'
            },
            totalViews: {
                title: 'Total Views',
                subtitle: 'Total Viewed',
                description: 'Total number of page views'
            },
            addedToday: {
                title: 'Added Today',
                subtitle: 'Added Today',
                description: 'Number of items added today'
            },
            activity: {
                title: 'Activity Level',
                subtitle: 'Activity',
                description: 'Current level of user activity'
            },
            min: 'Min Value',
            max: 'Max Value',
            preview: 'Preview'
        },
        displaySettings: {
            title: 'Display Settings',
            backgroundColor: 'Background Color',
            textColor: 'Text Color',
            borderColor: 'Border Color'
        },
        actions: {
            save: 'Save All Settings',
            saving: 'Saving...',
            reset: 'Reset Changes'
        },
        messages: {
            loadFailed: 'Failed to load enhanced visitor counter settings',
            saveSuccess: 'Settings saved successfully',
            saveFailed: 'Failed to save settings',
            reset: 'Settings reset to original values',
            unsavedChanges: 'You have unsaved changes'
        },
        validation: {
            currentViewersRange: 'Current Viewers Min cannot be greater than Max',
            totalViewsRange: 'Total Views Min cannot be greater than Max',
            addedTodayRange: 'Added Today Min cannot be greater than Max',
            activityRange: 'Activity Level Min cannot be greater than Max'
        },
        preview: {
            title: 'Live Preview',
            show: 'Show Preview',
            hide: 'Hide Preview'
        }
    },
    // Notification Settings
    notificationSettings: {
        title: 'Live Notification Settings',
        subtitle: 'Control live activity notifications displayed to customers',
        loading: 'Loading settings...',
        unsavedChanges: 'Unsaved Changes',
        config: {
            title: 'Configuration',
            enable: 'Enable Live Notifications',
            enableDesc: 'Show live activity notifications to customers',
            maxNotifications: 'Maximum Notifications Displayed',
            maxNotificationsHelp: 'Maximum number of notifications to show per session',
            minInterval: 'Min Interval (seconds)',
            maxInterval: 'Max Interval (seconds)',
            duration: 'Duration (seconds)',
            types: {
                title: 'Notification Types',
                purchase: 'Purchase Notifications',
                purchaseDesc: 'Show when someone buys a product',
                viewing: 'Viewing Notifications',
                viewingDesc: 'Show how many people are viewing',
                cart: 'Cart Notifications',
                cartDesc: 'Show when someone adds to cart'
            },
            position: {
                title: 'Notification Position',
                bottomLeft: 'Bottom Left',
                bottomRight: 'Bottom Right',
                topLeft: 'Top Left',
                topRight: 'Top Right'
            }
        },
        actions: {
            save: 'Save Changes',
            saving: 'Saving...',
            reset: 'Reset'
        },
        messages: {
            loadFailed: 'Failed to load notification settings',
            saveSuccess: 'Settings saved successfully',
            saveFailed: 'Failed to save settings',
            reset: 'Settings reset to last saved state'
        },
        validation: {
            maxNotifications: 'Max notifications must be between 1 and 20',
            minInterval: 'Min interval must be between 1 and 60 seconds',
            maxInterval: 'Max interval must be between 1 and 60 seconds',
            intervalRange: 'Min interval cannot be greater than Max interval',
            duration: 'Duration must be between 1 and 60 seconds'
        },
        preview: {
            title: 'Live Preview',
            liveActivity: 'Live Activity',
            someoneBought: 'Someone in Morocco just bought',
            currentSettings: 'Current Settings Summary',
            status: 'Status',
            enabled: 'Active',
            disabled: 'Disabled',
            typesEnabled: 'Types Enabled'
        }
    },
    // Common
    common: {
        save: 'Save',
        saving: 'Saving...',
        cancel: 'Cancel',
        back: 'Back',
        edit: 'Edit',
        delete: 'Delete',
        create: 'Create',
        update: 'Update',
        actions: 'Actions',
        error: 'Error:',
        success: 'Success:',
        unsavedChanges: 'Unsaved changes',
        optional: '(Optional)',
        loading: 'Loading...'
    }
};
