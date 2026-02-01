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
    }
};

