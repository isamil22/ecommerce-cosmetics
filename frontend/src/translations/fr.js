// French translations
export const fr = {
    // Admin Dashboard
    adminDashboard: 'Tableau de bord Admin',
    welcomeMessage: "Bienvenue! Voici ce qui se passe avec votre boutique aujourd'hui.",
    refresh: 'Actualiser',
    liveStatus: 'Statut en direct: En ligne',
    lastUpdated: 'DerniÃ¨re mise Ã  jour',
    error: 'Erreur',
    loadingDashboard: 'Chargement du tableau de bord...',

    // Metrics
    totalRevenue: 'Revenu total',
    totalOrders: 'Total des commandes',
    totalUsers: 'Total des utilisateurs',
    totalProducts: 'Total des produits',
    packsAvailable: 'Packs disponibles',
    customPacks: 'Packs personnalisÃ©s',
    categories: 'CatÃ©gories',
    visitorCounter: 'Compteur de visiteurs',

    // Growth
    fromLastMonth: 'par rapport au mois dernier',

    // Status
    active: 'Actif',
    disabled: 'DÃ©sactivÃ©',
    range: 'Plage',

    // Sections
    recentProducts: 'Produits rÃ©cents',
    recentOrders: 'Commandes rÃ©centes',
    pendingReviews: 'Avis en attente',
    quickActions: 'Actions rapides',

    // Actions
    addNew: 'Ajouter nouveau',
    viewAll: 'Voir tout',
    viewAllProducts: 'Voir tous les produits',
    viewAllOrders: 'Voir toutes les commandes',
    manageReviews: 'GÃ©rer les avis',
    managePacks: 'GÃ©rer les packs',
    manageCustomPacks: 'GÃ©rer les packs personnalisÃ©s',
    manageCategories: 'GÃ©rer les catÃ©gories',
    configureSettings: 'Configurer les paramÃ¨tres',

    // Quick Actions
    addNewProduct: 'Ajouter un nouveau produit',
    createNewPack: 'CrÃ©er un nouveau pack',
    newCustomPack: 'Nouveau pack personnalisÃ©',
    addCategory: 'Ajouter une catÃ©gorie',
    reviewFormSettings: 'ParamÃ¨tres du formulaire d\'avis',

    // Confirmation
    deleteProductConfirm: 'ÃŠtes-vous sÃ»r de vouloir supprimer ce produit?',

    // Errors
    failedToFetchDashboard: 'Ã‰chec de la rÃ©cupÃ©ration des donnÃ©es du tableau de bord.',
    failedToDeleteProduct: 'Ã‰chec de la suppression du produit.',

    // ===== BATCH 1: SETTINGS PAGES =====

    // Brand Settings Page
    brandSettings: {
        title: 'ParamÃ¨tres du logo',
        subtitle: 'GÃ©rez l\'identitÃ© visuelle de votre site web',
        logoConfiguration: 'Configuration du logo',
        selectNewLogo: 'SÃ©lectionner un nouveau logo',
        saveLogo: 'Enregistrer le logo',
        uploading: 'TÃ©lÃ©chargement...',
        recommendedSize: 'Taille recommandÃ©e: 512x512px (CarrÃ©). Format PNG ou JPG.',
        brandDetails: 'DÃ©tails de la marque',
        siteTitle: 'Titre du site',
        siteSubtitle: 'Sous-titre du site',
        titleFont: 'Police du titre',
        preview: 'AperÃ§u:',
        saveDetails: 'Enregistrer les dÃ©tails',
        saving: 'Enregistrement...',
        fontOptions: {
            default: 'Par dÃ©faut (Sans Serif)',
            dancingScript: 'Dancing Script (Cursive)',
            playfairDisplay: 'Playfair Display (Serif)',
            greatVibes: 'Great Vibes (Calligraphique)',
            cinzel: 'Cinzel (Luxe)',
            montserrat: 'Montserrat (Moderne)'
        },
        success: {
            logoUploaded: 'Logo tÃ©lÃ©chargÃ© avec succÃ¨s!',
            detailsSaved: 'DÃ©tails de la marque enregistrÃ©s avec succÃ¨s!'
        },
        errors: {
            loadSettings: 'Ã‰chec du chargement des paramÃ¨tres.',
            saveDetails: 'Ã‰chec de l\'enregistrement des dÃ©tails.',
            uploadLogo: 'Ã‰chec du tÃ©lÃ©chargement du logo.'
        }
    },

    // Announcement Page
    announcement: {
        title: 'Gestion des annonces',
        subtitle: 'GÃ©rez les paramÃ¨tres de la barre d\'annonces de votre site',
        hidePreview: 'Masquer l\'aperÃ§u',
        showPreview: 'Afficher l\'aperÃ§u',
        settings: 'ParamÃ¨tres de l\'annonce',
        enableDisable: 'Activer/DÃ©sactiver',
        enabled: 'ActivÃ©',
        disabled: 'DÃ©sactivÃ©',
        announcementText: 'Texte de l\'annonce',
        textPlaceholder: 'Entrez votre message d\'annonce...',
        backgroundColor: 'Couleur de fond',
        gradient: 'DÃ©gradÃ©',
        solid: 'Solide',
        textColor: 'Couleur du texte',
        animation: 'Animation',
        animationTypes: {
            none: 'Aucune',
            pulse: 'Pulsation',
            bounce: 'Rebond',
            slide: 'Glissement'
        },
        stickyBar: 'Barre collante',
        fontWeight: 'Ã‰paisseur de la police',
        fontWeights: {
            normal: 'Normal',
            medium: 'Moyen',
            semibold: 'Semi-gras',
            bold: 'Gras'
        },
        showOnlineCounter: 'Afficher le compteur en ligne',
        livePreview: 'AperÃ§u en direct',
        currentSettings: 'ParamÃ¨tres actuels',
        saveChanges: 'Enregistrer les modifications',
        saving: 'Enregistrement...',
        loadingSettings: 'Chargement des paramÃ¨tres d\'annonce...',
        success: 'Annonce mise Ã  jour avec succÃ¨s!',
        errors: {
            loadSettings: 'Ã‰chec du chargement des paramÃ¨tres d\'annonce',
            updateFailed: 'Ã‰chec de la mise Ã  jour de l\'annonce'
        }
    },

    // Countdown Page
    countdown: {
        title: 'Gestion du compte Ã  rebours',
        subtitle: 'Configurez le minuteur de compte Ã  rebours de votre site',
        settings: 'ParamÃ¨tres du compte Ã  rebours',
        enableDisable: 'Activer/DÃ©sactiver',
        enabled: 'ActivÃ©',
        disabled: 'DÃ©sactivÃ©',
        targetDate: 'Date cible',
        targetTime: 'Heure cible',
        title: 'Titre',
        titlePlaceholder: 'Vente flash se termine dans...',
        message: 'Message',
        messagePlaceholder: 'DÃ©pÃªchez-vous! Offre Ã  durÃ©e limitÃ©e!',
        position: 'Position',
        positions: {
            top: 'Haut',
            bottom: 'Bas',
            floating: 'Flottant'
        },
        style: 'Style',
        styles: {
            minimal: 'Minimal',
            bold: 'Gras',
            gradient: 'DÃ©gradÃ©'
        },
        showDays: 'Afficher les jours',
        showHours: 'Afficher les heures',
        showMinutes: 'Afficher les minutes',
        showSeconds: 'Afficher les secondes',
        autoHide: 'Masquer automatiquement aprÃ¨s expiration',
        preview: 'AperÃ§u',
        saveChanges: 'Enregistrer les modifications',
        saving: 'Enregistrement...',
        loadingSettings: 'Chargement des paramÃ¨tres du compte Ã  rebours...',
        success: 'Compte Ã  rebours mis Ã  jour avec succÃ¨s!',
        errors: {
            loadSettings: 'Ã‰chec du chargement des paramÃ¨tres du compte Ã  rebours',
            updateFailed: 'Ã‰chec de la mise Ã  jour du compte Ã  rebours',
            invalidDate: 'Date ou heure invalide'
        }
    },

    // Integrations Page
    integrations: {
        title: 'IntÃ©grations',
        subtitle: 'GÃ©rez les intÃ©grations tierces et les clÃ©s API',
        analytics: 'Analytique',
        googleAnalytics: 'Google Analytics',
        trackingId: 'ID de suivi',
        trackingIdPlaceholder: 'UA-XXXXXXXXX-X ou G-XXXXXXXXXX',
        facebookPixel: 'Facebook Pixel',
        pixelId: 'ID du pixel',
        pixelIdPlaceholder: 'Votre ID de pixel Facebook',
        payment: 'Paiement',
        stripeKeys: 'ClÃ©s Stripe',
        publishableKey: 'ClÃ© publiable',
        publishableKeyPlaceholder: 'pk_test_...',
        secretKey: 'ClÃ© secrÃ¨te',
        secretKeyPlaceholder: 'sk_test_...',
        paypalSettings: 'ParamÃ¨tres PayPal',
        clientId: 'ID client',
        clientIdPlaceholder: 'Votre ID client PayPal',
        email: 'E-mail',
        emailService: 'Service d\'e-mail',
        smtpSettings: 'ParamÃ¨tres SMTP',
        smtpHost: 'HÃ´te SMTP',
        smtpPort: 'Port SMTP',
        smtpUsername: 'Nom d\'utilisateur SMTP',
        smtpPassword: 'Mot de passe SMTP',
        senderEmail: 'E-mail de l\'expÃ©diteur',
        senderName: 'Nom de l\'expÃ©diteur',
        storage: 'Stockage',
        awsS3: 'AWS S3',
        accessKey: 'ClÃ© d\'accÃ¨s',
        secretAccessKey: 'ClÃ© d\'accÃ¨s secrÃ¨te',
        bucketName: 'Nom du bucket',
        region: 'RÃ©gion',
        testConnection: 'Tester la connexion',
        testing: 'Test...',
        saveChanges: 'Enregistrer les modifications',
        saving: 'Enregistrement...',
        loadingSettings: 'Chargement des intÃ©grations...',
        success: {
            saved: 'IntÃ©grations enregistrÃ©es avec succÃ¨s!',
            connectionSuccess: 'Connexion rÃ©ussie!'
        },
        errors: {
            loadSettings: 'Ã‰chec du chargement des intÃ©grations',
            updateFailed: 'Ã‰chec de la mise Ã  jour des intÃ©grations',
            connectionFailed: 'Ã‰chec du test de connexion',
            invalidCredentials: 'Identifiants invalides'
        }
    },

    // ===== BATCH 2: PRODUCTS PAGE =====
    products: {
        title: 'Gestion des produits',
        subtitle: 'GÃ©rez votre catalogue de produits avec des outils avancÃ©s et des informations',

        // Header Actions
        refresh: 'Actualiser',
        exportCSV: 'Exporter CSV',
        addNewProduct: 'Ajouter un nouveau produit',

        // Keyboard Shortcuts
        shortcuts: {
            newProduct: 'Nouveau produit',
            search: 'Rechercher',
            closeModal: 'Fermer le modal'
        },

        // Analytics Cards
        analytics: {
            totalProducts: 'Total des produits',
            inStock: 'En stock',
            lowStock: 'Stock faible',
            outOfStock: 'Rupture de stock',
            totalValue: 'Valeur totale',
            avgPrice: 'Prix moyen'
        },

        // Search and Filters
        searchPlaceholder: 'Rechercher des produits...',
        allCategories: 'Toutes les catÃ©gories',
        allStock: 'Tous les stocks',
        inStockFilter: 'En stock',
        lowStockFilter: 'Stock faible',
        outOfStockFilter: 'Rupture de stock',
        allStatus: 'Tous les statuts',
        activeStatus: 'Actif',
        disabledStatus: 'DÃ©sactivÃ©',
        featuredStatus: 'En vedette',
        newArrivalsStatus: 'NouveautÃ©s',

        // Sort Options
        sortByName: 'Trier par nom',
        sortByPrice: 'Trier par prix',
        sortByStock: 'Trier par stock',
        sortByDate: 'Trier par date',

        // View Modes
        gridView: 'Vue grille',
        listView: 'Vue liste',

        // Bulk Actions
        selectAll: 'Tout sÃ©lectionner',
        clearSelection: 'Effacer la sÃ©lection',
        bulkDelete: 'Supprimer la sÃ©lection',
        selectedCount: 'sÃ©lectionnÃ©(s)',
        clearFilters: 'Effacer les filtres',

        // Product Card
        edit: 'Modifier',
        delete: 'Supprimer',
        quickEdit: 'Modification rapide',
        view: 'Voir',
        category: 'CatÃ©gorie',
        brand: 'Marque',
        price: 'Prix',
        stock: 'Stock',
        status: 'Statut',

        // Stock Status
        stockStatus: {
            inStock: 'En stock',
            lowStock: 'Stock faible',
            outOfStock: 'Rupture de stock'
        },

        // Product Badges
        bestseller: 'Meilleure vente',
        newArrival: 'NouveautÃ©',
        featured: 'En vedette',
        disabled: 'DÃ©sactivÃ©',

        // Messages
        noProducts: 'Aucun produit trouvÃ©',
        noProductsDesc: 'Commencez par ajouter votre premier produit',
        loadingProducts: 'Chargement des produits...',

        // Confirmations
        deleteConfirm: 'ÃŠtes-vous sÃ»r de vouloir supprimer ce produit?',
        bulkDeleteConfirm: 'ÃŠtes-vous sÃ»r de vouloir supprimer {count} produit(s)? Cette action ne peut pas Ãªtre annulÃ©e.',

        // Success Messages
        success: {
            deleted: 'Produit supprimÃ© avec succÃ¨s!',
            bulkDeleted: '{count} produit(s) supprimÃ©(s) avec succÃ¨s!',
            updated: 'Produit mis Ã  jour avec succÃ¨s!',
            exported: 'Produits exportÃ©s avec succÃ¨s!'
        },

        // Error Messages
        errors: {
            fetchFailed: 'Ã‰chec de la rÃ©cupÃ©ration des produits.',
            deleteFailed: 'Ã‰chec de la suppression du produit.',
            updateFailed: 'Ã‰chec de la mise Ã  jour du produit.',
            exportFailed: 'Ã‰chec de l\'exportation des produits.',
            noSelection: 'Aucun produit sÃ©lectionnÃ© pour la suppression'
        },

        // Warnings
        warnings: {
            partialDelete: '{success} produit(s) supprimÃ©(s), {failed} Ã©chec(s)'
        }
    },

    // Admin Product Form
    productForm: {
        // Page Header
        title: {
            create: 'CrÃ©er un nouveau produit',
            edit: 'Modifier le produit'
        },
        subtitle: {
            create: 'Ajouter un nouveau produit Ã  votre catalogue',
            edit: 'Mettre Ã  jour les informations de votre produit'
        },
        loading: 'Chargement du produit...',

        // Actions
        actions: {
            save: 'Enregistrer',
            saving: 'Enregistrement...',
            savingProduct: 'Enregistrement du produit...',
            create: 'CrÃ©er le produit',
            update: 'Mettre Ã  jour le produit',
            backToProducts: 'Retour aux produits'
        },

        // Basic Information Section
        basicInfo: {
            title: 'Informations de base',
            productName: 'Nom du produit',
            productNamePlaceholder: 'Entrez le nom du produit',
            brand: 'Marque',
            brandPlaceholder: 'Entrez le nom de la marque',
            price: 'Prix ($)',
            pricePlaceholder: '0.00',
            stockQuantity: 'QuantitÃ© en stock',
            stockPlaceholder: '0',
            category: 'CatÃ©gorie',
            categoryPlaceholder: '-- SÃ©lectionnez une catÃ©gorie --',
            type: 'Type',
            typeMen: 'Hommes',
            typeWomen: 'Femmes',
            typeBoth: 'Les deux',

            // Checkboxes
            bestseller: 'Meilleure vente',
            newArrival: 'Nouvelle arrivÃ©e',
            hasVariants: 'A des variantes',
            isPackable: 'Disponible pour les packs personnalisÃ©s'
        },

        // Description Section
        description: {
            title: 'Description du produit',
            label: 'Description'
        },

        // Images Section
        images: {
            title: 'Images du produit',
            upload: 'TÃ©lÃ©charger des images',
            existingImages: 'Images existantes:',
            newImages: 'Nouvelles images Ã  ajouter:',
            removeImage: "Supprimer l'image"
        },

        // Variant Types Section
        variantTypes: {
            title: 'Types de variantes',
            typeName: 'Nom du type',
            typeNamePlaceholder: 'ex: Taille, Couleur',
            options: 'Options',
            optionValue: 'Valeur (ex: Rouge)',
            color: 'Couleur',
            image: 'Image',
            addOption: '+ Ajouter une option',
            remove: 'Supprimer',
            removeOption: "Supprimer l'option",
            addVariantType: 'Ajouter un type de variante'
        },

        // Product Variants Section
        variants: {
            title: 'Variantes du produit',
            select: 'SÃ©lectionner {name}',
            price: 'Prix',
            stock: 'Stock',
            variantImage: 'Image de la variante',
            removeImage: "Supprimer l'image",
            removeVariant: 'Supprimer la variante'
        },

        // Display Settings Section
        displaySettings: {
            title: "ParamÃ¨tres d'affichage",
            purchaseNotifications: {
                title: 'ðŸ›ï¸ Afficher les notifications d\'achat',
                description: 'Afficher les notifications lorsque les clients achÃ¨tent ce produit',
                enabled: 'ActivÃ©',
                disabled: 'DÃ©sactivÃ©'
            },
            countdownTimer: {
                title: 'â±ï¸ Afficher le compte Ã  rebours',
                description: 'Afficher le compte Ã  rebours des ventes flash pour crÃ©er l\'urgence',
                enabled: 'ActivÃ©',
                disabled: 'DÃ©sactivÃ©'
            }
        },

        // Frequently Bought Together Section
        frequentlyBought: {
            title: 'FrÃ©quemment achetÃ©s ensemble',
            label: 'SÃ©lectionnez les produits frÃ©quemment achetÃ©s avec ce produit',
            placeholder: 'Rechercher et sÃ©lectionner des produits...'
        },

        // Validation Messages
        validation: {
            nameRequired: 'Le nom du produit est requis.',
            priceRequired: 'Un prix valide est requis.',
            categoryRequired: 'La catÃ©gorie est requise.',
            variantPricesRequired: 'Toutes les variantes doivent avoir des prix valides.'
        },

        // Success Messages
        success: {
            created: 'Produit crÃ©Ã© avec succÃ¨s!',
            updated: 'Produit mis Ã  jour avec succÃ¨s!'
        },

        // Error Messages
        errors: {
            saveFailed: 'Ã‰chec de l\'enregistrement du produit.',
            loadFailed: 'Ã‰chec du chargement du produit.',
            categoriesFailed: 'Ã‰chec du chargement des catÃ©gories de produits. Veuillez rÃ©essayer.'
        }
    }
    ,

    // Categories Management
    categoriesPage: {
        title: 'Gestion des catégories',
        subtitle: 'Organisez votre catalogue de produits avec de belles catégories',
        shortcuts: {
            newCategory: 'Nouvelle catégorie',
            search: 'Rechercher',
            clearSearch: 'Effacer la recherche'
        },
        actions: {
            refresh: 'Actualiser',
            addNew: 'Ajouter une nouvelle catégorie'
        },
        analytics: {
            totalCategories: 'Total des catégories',
            withProducts: 'Avec produits',
            emptyCategories: 'Catégories vides',
            totalProducts: 'Total des produits'
        },
        search: {
            placeholder: 'Rechercher des catégories...'
        },
        sort: {
            name: 'Nom',
            products: 'Produits'
        },
        viewMode: {
            grid: 'Grille',
            list: 'Liste'
        },
        card: {
            products: 'produits',
            edit: 'Modifier',
            delete: 'Supprimer'
        },
        confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette catégorie?',
        messages: {
            fetchFailed: 'Échec de la récupération des catégories.',
            deleteSuccess: 'Catégorie supprimée avec succès!',
            deleteFailed: 'Échec de la suppression de la catégorie. Elle pourrait être utilisée par certains produits.'
        },
        noCategories: 'Aucune catégorie trouvée',
        noResults: 'Aucune catégorie ne correspond à votre recherche'
    },

    // Category Form
    categoryForm: {
        title: {
            create: 'Créer une catégorie',
            edit: 'Modifier la catégorie'
        },
        subtitle: {
            create: 'Ajouter une nouvelle catégorie pour organiser vos produits',
            edit: 'Mettre à jour les informations de votre catégorie'
        },
        shortcuts: {
            save: 'Enregistrer',
            back: 'Retour'
        },
        unsavedChanges: 'Modifications non enregistrées',
        backToCategories: 'Retour aux catégories',
        sectionTitle: {
            create: 'Informations sur la catégorie',
            edit: 'Modifier les détails de la catégorie'
        },
        sectionSubtitle: {
            create: 'Remplissez les détails pour créer une nouvelle catégorie',
            edit: 'Mettez à jour les informations et les paramètres de votre catégorie'
        },
        fields: {
            categoryName: 'Nom de la catégorie',
            categoryNamePlaceholder: 'Entrez le nom de la catégorie (ex: Électronique, Mode, Livres)',
            description: 'Description',
            descriptionOptional: '(Optionnel)',
            descriptionPlaceholder: 'Décrivez cette catégorie (optionnel)',
            categoryImage: 'Image de la catégorie',
            imageOptional: '(Optionnel)',
            charactersCount: 'caractères'
        },
        imageUpload: {
            dropHere: 'Déposez votre image ici',
            orClick: 'ou cliquez pour parcourir',
            chooseFile: 'Choisir un fichier',
            supportedFormats: 'Formats supportés: JPG, PNG, GIF. Taille max: 5MB',
            preview: 'Aperçu de la catégorie'
        },
        validation: {
            nameRequired: 'Le nom de la catégorie est requis',
            nameMinLength: 'Le nom de la catégorie doit contenir au moins 2 caractères',
            descriptionMaxLength: 'La description doit contenir moins de 500 caractères',
            invalidImage: 'Veuillez sélectionner un fichier image valide.',
            fixErrors: 'Veuillez corriger les erreurs avant de soumettre.'
        },
        actions: {
            cancel: 'Annuler',
            creating: 'Création...',
            updating: 'Mise à jour...',
            create: 'Créer une catégorie',
            update: 'Mettre à jour la catégorie'
        },
        messages: {
            notFound: 'Catégorie introuvable.',
            loadFailed: 'Échec du chargement des données de la catégorie.',
            createSuccess: 'Catégorie créée avec succès!',
            updateSuccess: 'Catégorie mise à jour avec succès!',
            operationFailed: 'Opération échouée. Veuillez réessayer.'
        }
    }
    ,

    // Admin Dashboard
    dashboard: {
        loadingDashboard: 'Chargement du tableau de bord...',
        adminDashboard: 'Tableau de bord administrateur',
        welcomeMessage: 'Bienvenue dans votre panneau d\'administration',
        refresh: 'Actualiser',
        liveStatus: 'En direct',
        lastUpdated: 'Dernière mise à jour',
        error: 'Erreur',

        // Metrics
        totalRevenue: 'Revenu total',
        totalOrders: 'Total des commandes',
        totalUsers: 'Total des utilisateurs',
        totalProducts: 'Total des produits',
        fromLastMonth: 'par rapport au mois dernier',

        // Secondary Metrics
        packsAvailable: 'Packs disponibles',
        customPacks: 'Packs personnalisés',
        categories: 'Catégories',
        visitorCounter: 'Compteur de visiteurs',
        active: 'Actif',
        disabled: 'Désactivé',
        range: 'Plage',

        // Links
        managePacks: 'Gérer les packs',
        manageCustomPacks: 'Gérer les packs personnalisés',
        manageCategories: 'Gérer les catégories',
        configureSettings: 'Configurer les paramètres',

        // Sections
        recentProducts: 'Produits récents',
        addNew: 'Ajouter',
        viewAllProducts: 'Voir tous les produits',
        recentOrders: 'Commandes récentes',
        viewAllOrders: 'Voir toutes les commandes',
        pendingReviews: 'Avis en attente',
        manageReviews: 'Gérer les avis',

        // Quick Actions
        quickActions: 'Actions rapides',
        addNewProduct: 'Ajouter un nouveau produit',
        createNewPack: 'Créer un nouveau pack',
        newCustomPack: 'Nouveau pack personnalisé',
        addCategory: 'Ajouter une catégorie',
        reviewFormSettings: 'Paramètres du formulaire d\'avis'
    },

    // Orders Page
    ordersPage: {
        title: 'Gestion des commandes',
        subtitle: 'Gérez et suivez les commandes des clients',
        deletedOrders: 'Commandes supprimées',
        activeOrders: 'Commandes actives',
        searchPlaceholder: 'Rechercher par ID ou client...',
        filterStatus: 'Filtrer par statut',
        filterDate: 'Filtrer par date',
        sortBy: 'Trier par',

        status_ALL: 'Tous les statuts',
        status_PENDING: 'En attente',
        status_PREPARING: 'En préparation',
        status_DELIVERING: 'En livraison',
        status_DELIVERED: 'Livré',
        status_CANCELLED: 'Annulé',

        date_ALL: 'Toutes les dates',
        date_TODAY: 'Aujourd\'hui',
        date_THIS_WEEK: 'Cette semaine',
        date_THIS_MONTH: 'Ce mois-ci',

        orderBy: 'Commandé par',
        items: 'Articles',
        total: 'Total',
        status: 'Statut',
        date: 'Date',
        actions: 'Actions',

        totalRevenue: 'Revenu total',
        averageOrder: 'Panier moyen',
        uniqueCustomers: 'Clients uniques',
        todaysOrders: 'Commandes d\'aujourd\'hui',
        revenueToday: 'Revenu d\'aujourd\'hui',

        viewDetails: 'Voir détails',
        delete: 'Supprimer',
        restore: 'Restaurer',
        deletePermanently: 'Supprimer définitivement',
        changeStatus: 'Changer le statut',
        export: 'Exporter CSV',

        loading: 'Chargement des commandes...',
        retry: 'Réessayer',
        resetFilters: 'Réinitialiser les filtres',
        showActive: 'Afficher actifs',
        showDeleted: 'Afficher supprimés',
        updateStatus: 'Mettre à jour le statut',
        deleteSelected: 'Supprimer la sélection',
        selected: 'sélectionné(s)',
        orderId: 'ID commande',
        customer: 'Client',

        timeline_placed: 'Commande passée',
        timeline_transit: 'En transit',
        timeline_delivered: 'Livrée',
        errorExport: 'Échec de l\'exportation des commandes.'
    },

    // Integrations Page
    integrationsPage: {
        title: 'Intégrations',
        subtitle: 'Connectez des services et outils externes',
        facebookPixel: {
            title: 'Facebook Pixel',
            activeTitle: 'Facebook Pixel Actif',
            activeDesc: 'Votre pixel est configuré et suit les événements',
            inactiveTitle: 'Facebook Pixel Non Configuré',
            inactiveDesc: 'Ajoutez votre ID Pixel pour commencer le suivi',
            configTitle: 'Configuration du Pixel',
            label: 'ID Pixel Facebook',
            placeholder: 'Entrez votre ID Pixel Facebook (15-16 chiffres)',
            helpText: 'Cet ID sera utilisé pour suivre l\'activité des utilisateurs à des fins de marketing et d\'optimisation des conversions.'
        },
        googleAnalytics: {
            title: 'Google Analytics',
            activeTitle: 'Google Analytics Actif',
            activeDesc: 'Vos analyses sont configurées et actives.',
            inactiveTitle: 'Google Analytics Non Configuré',
            inactiveDesc: 'Ajoutez votre ID de mesure pour commencer le suivi.',
            configTitle: 'Configuration Google Analytics',
            label: 'ID de mesure (G-XXXXXXXXXX)',
            placeholder: 'Entrez votre ID de mesure (ex: G-T78R8VV7E4)',
            helpText: 'Cet ID connecte votre site à Google Analytics 4 (GA4).'
        },
        actions: {
            clear: 'Effacer',
            save: 'Enregistrer la configuration',
            saving: 'Enregistrement...'
        },
        messages: {
            pixelSaved: 'Paramètres Facebook Pixel enregistrés avec succès !',
            gaSaved: 'Paramètres Google Analytics enregistrés avec succès !',
            saveFailed: 'Échec de l\'enregistrement. Vous devez être administrateur.',
            loadFailed: 'Échec du chargement des paramètres.'
        }
    },

    // ===== BATCH 3: PACK MANAGEMENT =====
    managePacks: {
        title: 'Gérer les packs',
        subtitle: 'Créez et gérez des lots de produits',
        addNew: 'Ajouter un nouveau pack',
        noPacks: 'Aucun pack trouvé',
        noPacksDesc: 'Commencez par créer votre premier pack de produits',
        createFirst: 'Créer votre premier pack',
        deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce pack ?',
        deleteSuccess: 'Pack supprimé avec succès !',
        deleteFailed: 'Échec de la suppression du pack.',
        actions: {
            edit: 'Modifier',
            recommendations: 'Recommandations',
            comments: 'Commentaires',
            delete: 'Supprimer',
            deleting: 'Suppression...'
        }
    },

    packForm: {
        createTitle: 'Créer un nouveau pack',
        editTitle: 'Modifier le pack',
        createSubtitle: 'Créez un lot de produits avec plusieurs articles',
        editSubtitle: 'Mettez à jour votre lot de produits avec plusieurs articles',
        clearDraft: 'Effacer le brouillon',
        unsavedChanges: 'Modifications non enregistrées',
        steps: {
            basicInfo: 'Infos de base',
            packItems: 'Articles du pack',
            displaySettings: 'Paramètres d\'affichage',
            recommendations: 'Recommandations',
            review: 'Révision'
        },
        basicInfo: {
            title: 'Informations de base',
            name: 'Nom du pack',
            namePlaceholder: 'Entrez le nom du pack',
            price: 'Prix du pack',
            image: 'Image du pack',
            hideComments: 'Masquer le formulaire de commentaires',
            hideCommentsDesc: "Lorsqu'il est activé, les utilisateurs ne pourront pas laisser de commentaires sur ce pack. Les commentaires existants resteront visibles."
        },
        items: {
            title: 'Articles du pack',
            addItem: 'Ajouter un article',
            itemTitle: 'Article {index}',
            defaultProduct: 'Produit par défaut',
            defaultPlaceholder: '-- Sélectionner le produit par défaut --',
            variations: 'Produits variantes (Optionnel)',
            variationsPlaceholder: '-- Sélectionner les produits variantes --',
            enhancedSelection: 'Sélection de produits améliorée',
            enhancedDesc: 'Chaque menu déroulant affiche désormais les images des produits pour une identification facile. La fonctionnalité de recherche est intégrée à chaque sélecteur.'
        },
        settings: {
            title: 'Paramètres d\'affichage',
            purchaseNotif: 'Afficher les notifications d\'achat',
            purchaseNotifDesc: 'Afficher les notifications lorsque les clients achètent ce pack',
            countdown: 'Afficher le compte à rebours',
            countdownDesc: 'Afficher le compte à rebours de vente flash pour l\'urgence',
            enabled: 'Activé',
            disabled: 'Désactivé'
        },
        recommendations: {
            title: 'Recommandations de pack',
            systemTitle: 'Système de recommandation',
            systemDesc: 'Sélectionnez des produits et d\'autres packs à recommander aux clients lorsqu\'ils consultent ce pack. Cela aide à augmenter les ventes grâce aux ventes croisées.',
            products: 'Produits recommandés',
            packs: 'Packs recommandés',
            noProducts: 'Aucun produit disponible',
            noPacks: 'Aucun autre pack disponible',
            summary: 'Résumé de la sélection',
            selectedProducts: 'Produits',
            selectedPacks: 'Packs'
        },
        review: {
            title: 'Prêt à créer le pack ?',
            subtitle: 'Passez en revue les détails de votre pack et créez le lot',
            cancel: 'Annuler',
            create: 'Créer le pack',
            update: 'Mettre à jour le pack',
            creating: 'Création...',
            updating: 'Mise à jour...'
        },
        validation: {
            nameRequired: 'Le nom du pack est requis',
            nameLength: 'Le nom du pack doit contenir au moins 3 caractères',
            priceRequired: 'Un prix valide est requis',
            imageRequired: 'Veuillez sélectionner un fichier image valide',
            imageSize: 'La taille de l\'image doit être inférieure à 5 Mo',
            itemDefaultRequired: 'Le produit par défaut est requis pour chaque article',
            minItems: 'Au moins un article de pack est requis'
        },
        success: {
            created: 'Pack créé avec succès !',
            updated: 'Pack mis à jour avec succès !',
            draftCleared: 'Brouillon effacé'
        }
    },

    // Review Form Settings
    reviewFormSettingsPage: {
        title: 'Paramètres du formulaire d\'avis',
        subtitle: 'Contrôlez la visibilité du formulaire d\'avis sur s produits',
        configTitle: 'Configuration du formulaire',
        showReviewForm: 'Afficher le formulaire',
        showReviewFormDesc: 'Afficher la section "Rédiger un avis" sur les pages produits',
        preview: 'Aperçu',
        visibleMsg: 'Le formulaire sera visible par les clients',
        hiddenMsg: 'Le formulaire sera masqué pour les clients',
        quickInfo: 'Infos rapides',
        quickInfo1: 'Ce paramètre contrôle la visibilité sur toutes les pages produits.',
        quickInfo2: 'Si désactivé, les clients ne pourront pas soumettre de nouveaux avis.',
        quickInfo3: 'Les avis existants resteront visibles.',
        currentStatus: 'État actuel',
        enabled: 'Formulaire activé',
        disabled: 'Formulaire désactivé',
        reset: 'Réinitialiser',
        save: 'Enregistrer',
        saving: 'Enregistrement...',
        unsavedChanges: 'Vous avez des modifications non enregistrées',
        messages: {
            saved: 'Paramètres enregistrés avec succès !',
            saveFailed: 'Échec de l\'enregistrement des paramètres',
            loadFailed: 'Échec du chargement des paramètres'
        }
    },

    // Analytics Page
    analyticsPage: {
        title: 'Tableau de bord analytique',
        subtitle: 'Aperçu complet des performances de vos coupons et métriques commerciales',
        loading: 'Chargement du tableau de bord...',
        lastUpdated: 'Dernière mise à jour :',
        actions: {
            refresh: 'Actualiser les données',
            viewCoupons: 'Voir les coupons',
            manageCoupons: 'Gérer les coupons',
            viewOrders: 'Voir les commandes',
            dashboard: 'Tableau de bord'
        },
        stats: {
            totalCoupons: 'Total des coupons',
            activeCoupons: 'Coupons actifs',
            totalUses: 'Utilisations totales',
            totalSavings: 'Économies totales'
        },
        usage: {
            title: 'Analytique d\'utilisation',
            dailyTrend: 'Tendance quotidienne',
            totalDaily: 'Total utilisations jour',
            recentActivity: 'Activité récente',
            uses: 'utilisations',
            noDataTitle: 'Aucune donnée disponible',
            noDataDesc: 'Les statistiques apparaîtront ici une fois les coupons utilisés.'
        },
        performance: {
            title: 'Performance des coupons',
            detailTitle: 'Analytique détaillée disponible',
            detailDesc: 'Cliquez sur un coupon dans la page Coupons pour voir les statistiques détaillées et les insights IA.'
        },
        features: {
            title: 'Fonctionnalités analytiques',
            chartsTitle: '10+ Types de graphiques',
            chartsDesc: 'Double axe, radar, entonnoir, carte thermique, et plus',
            aiTitle: 'Insights IA',
            aiDesc: 'Recommandations intelligentes et analyse de performance',
            realTimeTitle: 'Analytique en temps réel',
            realTimeDesc: 'Mises à jour en direct et surveillance des performances'
        },
        quickActions: {
            title: 'Actions rapides'
        },
        messages: {
            refreshSuccess: 'Données analytiques actualisées avec succès !',
            refreshError: 'Échec de l\'actualisation des données'
        }
    },

    // Announcement Page
    announcementPage: {
        title: 'Gestion des annonces',
        subtitle: 'Gérez la barre d\'annonce de votre site',
        loading: 'Chargement des paramètres d\'annonce...',
        hidePreview: 'Masquer l\'aperçu',
        showPreview: 'Afficher l\'aperçu',
        refresh: 'Actualiser',
        settingsTitle: 'Paramètres d\'annonce',
        livePreviewTitle: 'Aperçu en direct',
        enable: {
            title: 'Activer l\'annonce',
            description: 'Afficher ou masquer la barre d\'annonce'
        },
        text: {
            label: 'Texte de l\'annonce',
            placeholder: 'Entrez le texte de votre annonce...',
            help: 'Prend en charge le texte en arabe et en anglais'
        },
        background: {
            label: 'Style d\'arrière-plan',
            gradient: 'Dégradé (Rose vers Violet vers Bleu)',
            red: 'Rouge',
            blue: 'Bleu',
            green: 'Vert',
            yellow: 'Jaune',
            purple: 'Violet',
            pink: 'Rose'
        },
        textColor: {
            label: 'Couleur du texte'
        },
        animation: {
            label: 'Type d\'animation',
            none: 'Aucune animation',
            pulse: 'Pulsation',
            bounce: 'Rebond'
        },
        onlineCounter: {
            title: 'Afficher le compteur en ligne',
            description: 'Afficher "X utilisateurs en ligne"',
            demoText: '25 utilisateurs en ligne maintenant',
            status: {
                shown: 'Affiché',
                hidden: 'Masqué'
            }
        },
        sticky: {
            title: 'Position fixe',
            description: 'Garder la barre d\'annonce en haut lors du défilement',
            preview: {
                yes: 'Oui',
                no: 'Non'
            }
        },
        buttons: {
            save: 'Enregistrer les modifications',
            saving: 'Enregistrement...'
        },
        preview: {
            title: 'Paramètres d\'aperçu :',
            status: 'Statut :',
            enabled: 'Activé',
            disabled: 'Désactivé',
            background: 'Arrière-plan :',
            animation: 'Animation :',
            onlineCounter: 'Compteur en ligne :',
            sticky: 'Fixe :',
            clickToPreview: 'Cliquez sur "Afficher l\'aperçu" pour voir à quoi ressemblera votre annonce'
        },
        messages: {
            loadError: 'Échec du chargement des paramètres d\'annonce',
            updateSuccess: 'Annonce mise à jour avec succès !',
            updateError: 'Échec de la mise à jour de l\'annonce'
        }
    },

    // Countdown Page
    countdownPage: {
        title: 'Tableau de commande du compte à rebours',
        messages: {
            saveSuccess: 'Paramètres enregistrés avec succès !',
            saveError: 'Erreur lors de l\'enregistrement des paramètres.'
        },
        sections: {
            themes: {
                title: 'THÈMES DE DESIGN COMPATIBLES',
                label: 'Choisir un thème :',
                description: 'Ceci définira toutes les couleurs, textes, animations et mises en page pour correspondre au style de votre site.',
                applyButton: 'Appliquer le thème',
                selectedPreview: 'Aperçu du thème sélectionné :',
                presets: {
                    darkPremium: {
                        name: 'Dark Premium',
                        description: 'Thème sombre luxueux avec accents dorés',
                        preview: 'Fond bleu-violet sombre profond avec chiffres dorés et bordures corail. Parfait pour les marques de luxe.'
                    },
                    lightProfessional: {
                        name: 'Light Professional',
                        description: 'Thème blanc épuré pour sites professionnels',
                        preview: 'Fond blanc propre avec accents bleus professionnels. Parfait pour les sites d\'entreprise.'
                    },
                    modernGradient: {
                        name: 'Modern Gradient',
                        description: 'Design dégradé contemporain',
                        preview: 'Dégradé bleu-violet avec accents roses. Parfait pour les sites modernes et tendances.'
                    },
                    elegantMinimal: {
                        name: 'Elegant Minimal',
                        description: 'Design épuré et simple',
                        preview: 'Fond gris clair avec accents subtils. Parfait pour les designs minimalistes.'
                    },
                    vibrantEnergy: {
                        name: 'Vibrant Energy',
                        description: 'Design coloré haute énergie',
                        preview: 'Fond corail vif avec accents dorés. Parfait pour les marques énergiques et les ventes flash.'
                    }
                }
            },
            basic: {
                title: 'Paramètres de base',
                fields: {
                    title: { label: 'Titre', placeholder: 'Ex: Offre Limitée !' },
                    endDate: { label: 'Date et heure de fin' },
                    subtitle: { label: 'Sous-titre', placeholder: 'Ex: Économisez maintenant' },
                    packName: { label: 'Nom du pack/produit', placeholder: 'Ex: Offres Spéciales' },
                    urgentMessage: { label: 'Message urgent', placeholder: 'Ex: Vite ! Le temps presse' },
                    expiredMessage: { label: 'Message expiré', placeholder: 'Ex: Offre terminée' },
                    enabled: { label: 'Activer le compte à rebours' }
                }
            },
            colors: {
                title: 'Paramètres de couleur',
                fields: {
                    background: 'Arrière-plan',
                    text: 'Texte',
                    border: 'Bordure',
                    timerBox: 'Boîte du minuteur',
                    timerText: 'Texte du minuteur',
                    urgentBg: 'Fond urgent',
                    urgentText: 'Texte urgent'
                }
            },
            display: {
                title: 'Paramètres d\'affichage',
                fields: {
                    showDays: 'Afficher Jours',
                    showHours: 'Afficher Heures',
                    showMinutes: 'Afficher Minutes',
                    showSeconds: 'Afficher Secondes',
                    showPackName: 'Afficher Nom du Pack',
                    showSubtitle: 'Afficher Sous-titre'
                }
            },
            animation: {
                title: 'Paramètres d\'animation',
                fields: {
                    pulse: 'Activer animation pulsation',
                    bounce: 'Activer animation rebond',
                    threshold: 'Seuil d\'urgence (secondes)'
                }
            },
            layout: {
                title: 'Paramètres de mise en page',
                fields: {
                    borderRadius: 'Rayon de bordure (px)',
                    padding: 'Marge interne (px)',
                    fontSize: 'Taille de police (px)',
                    timerFontSize: 'Taille police minuteur (px)'
                }
            }
        },
        buttons: {
            save: 'Enregistrer tous les paramètres'
        }
    },
    // Custom Packs
    customPacks: {
        manageTitle: 'Gérer les Packs Personnalisés',
        manageSubtitle: 'Créer et gérer des packs de produits personnalisés',
        refresh: 'Actualiser',
        addNew: 'Ajouter un Nouveau Pack',
        noPacks: 'Aucun pack personnalisé trouvé',
        noPacksDesc: 'Créez votre premier pack personnalisé pour commencer',
        createFirst: 'Créer le Premier Pack',
        deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce pack personnalisé ?',
        deleteSuccess: 'Pack personnalisé supprimé avec succès !',
        deleteFailed: 'Échec de la suppression du pack personnalisé.',
        fetchFailed: 'Échec de la récupération des packs personnalisés.',
        table: {
            id: 'ID',
            edit: 'Modifier',
            delete: 'Supprimer',
            deleting: 'Suppression...',
            fixedPrice: 'Prix Fixe',
            percentageDiscount: 'Remise en Pourcentage',
            discount: 'Remise'
        },
        form: {
            createTitle: 'Créer un Pack Personnalisé',
            editTitle: 'Modifier le Pack Personnalisé',
            createSubtitle: 'Créez un ensemble de produits flexible avec une tarification personnalisée',
            editSubtitle: 'Mettez à jour votre ensemble de produits personnalisé',
            basicInfo: 'Informations de Base',
            packName: 'Nom du Pack',
            packNamePlaceholder: 'Entrez le nom du pack...',
            packImage: 'Image du Pack',
            uploadFile: 'Télécharger un fichier',
            dragDrop: 'ou glisser-déposer',
            imageConstraints: 'PNG, JPG, GIF jusqu\'à 10MB',
            description: 'Description',
            descriptionPlaceholder: 'Décrivez votre pack personnalisé...',
            configuration: 'Configuration du Pack',
            minItems: 'Articles Minimum',
            maxItems: 'Articles Maximum',
            pricingConfig: 'Configuration des Prix',
            pricingType: 'Type de Tarification',
            fixedPrice: 'Prix Fixe',
            fixedPriceDesc: 'Définir un prix fixe pour le pack',
            dynamicDiscount: 'Remise Dynamique',
            dynamicDiscountDesc: 'Appliquer un pourcentage de remise',
            discountRate: 'Taux de Remise',
            allowStacking: 'Autoriser les Remises Cumulables',
            stackingDesc: 'Autoriser d\'autres remises à s\'appliquer sur ce pack',
            productSelection: 'Sélection de Produits',
            searchPlaceholder: 'Rechercher des produits...',
            selectAll: 'Tout Sélectionner',
            clearSelection: 'Effacer la Sélection',
            clearSearch: 'Effacer la Recherche',
            statistics: 'Statistiques du Pack',
            totalProducts: 'Total Produits',
            selected: 'Sélectionné',
            totalValue: 'Valeur Totale',
            savings: 'Économies',
            quickActions: 'Actions Rapides',
            readyToSave: 'Prêt à enregistrer ?',
            reviewSettings: 'Vérifiez les paramètres et enregistrez les modifications',
            cancel: 'Annuler',
            create: 'Créer Pack',
            update: 'Mettre à Jour',
            creating: 'Création...',
            updating: 'Mise à jour...',
            validation: {
                nameRequired: 'Le nom du pack est requis',
                minItemsRequired: 'Le nombre minimum d\'articles est requis',
                maxItemsRequired: 'Le nombre maximum d\'articles est requis',
                fixedPriceRequired: 'Le prix fixe est requis',
                discountRateRequired: 'Le taux de remise est requis',
                minProducts: 'Sélectionnez au moins {count} produits',
                maxItemsError: 'Le nombre maximum d\'articles ne peut pas être inférieur au minimum'
            },
            success: {
                created: 'Pack personnalisé créé avec succès',
                updated: 'Pack personnalisé mis à jour avec succès'
            }
        }
    }
};
