// French translations
export const fr = {
    // Admin Dashboard
    adminDashboard: 'Tableau de bord Admin',
    welcomeMessage: "Bienvenue! Voici ce qui se passe avec votre boutique aujourd'hui.",
    refresh: 'Actualiser',
    liveStatus: 'Statut en direct: En ligne',
    lastUpdated: 'Dernière mise à jour',
    error: 'Erreur',
    loadingDashboard: 'Chargement du tableau de bord...',

    // Metrics
    totalRevenue: 'Revenu total',
    totalOrders: 'Total des commandes',
    totalUsers: 'Total des utilisateurs',
    totalProducts: 'Total des produits',
    packsAvailable: 'Packs disponibles',
    customPacks: 'Packs personnalisés',
    categories: 'Catégories',
    visitorCounter: 'Compteur de visiteurs',

    // Growth
    fromLastMonth: 'par rapport au mois dernier',

    // Status
    active: 'Actif',
    disabled: 'Désactivé',
    range: 'Plage',

    // Sections
    recentProducts: 'Produits récents',
    recentOrders: 'Commandes récentes',
    pendingReviews: 'Avis en attente',
    quickActions: 'Actions rapides',

    // Actions
    addNew: 'Ajouter nouveau',
    viewAll: 'Voir tout',
    viewAllProducts: 'Voir tous les produits',
    viewAllOrders: 'Voir toutes les commandes',
    manageReviews: 'Gérer les avis',
    managePacks: 'Gérer les packs',
    manageCustomPacks: 'Gérer les packs personnalisés',
    manageCategories: 'Gérer les catégories',
    configureSettings: 'Configurer les paramètres',

    // Quick Actions
    addNewProduct: 'Ajouter un nouveau produit',
    createNewPack: 'Créer un nouveau pack',
    newCustomPack: 'Nouveau pack personnalisé',
    addCategory: 'Ajouter une catégorie',
    reviewFormSettings: 'Paramètres du formulaire d\'avis',

    // Confirmation
    deleteProductConfirm: 'Êtes-vous sûr de vouloir supprimer ce produit?',

    // Errors
    failedToFetchDashboard: 'Échec de la récupération des données du tableau de bord.',
    failedToDeleteProduct: 'Échec de la suppression du produit.',

    // ===== BATCH 1: SETTINGS PAGES =====

    // Brand Settings Page
    brandSettings: {
        title: 'Paramètres du logo',
        subtitle: 'Gérez l\'identité visuelle de votre site web',
        logoConfiguration: 'Configuration du logo',
        selectNewLogo: 'Sélectionner un nouveau logo',
        saveLogo: 'Enregistrer le logo',
        uploading: 'Téléchargement...',
        recommendedSize: 'Taille recommandée: 512x512px (Carré). Format PNG ou JPG.',
        brandDetails: 'Détails de la marque',
        siteTitle: 'Titre du site',
        siteSubtitle: 'Sous-titre du site',
        titleFont: 'Police du titre',
        preview: 'Aperçu:',
        saveDetails: 'Enregistrer les détails',
        saving: 'Enregistrement...',
        fontOptions: {
            default: 'Par défaut (Sans Serif)',
            dancingScript: 'Dancing Script (Cursive)',
            playfairDisplay: 'Playfair Display (Serif)',
            greatVibes: 'Great Vibes (Calligraphique)',
            cinzel: 'Cinzel (Luxe)',
            montserrat: 'Montserrat (Moderne)'
        },
        success: {
            logoUploaded: 'Logo téléchargé avec succès!',
            detailsSaved: 'Détails de la marque enregistrés avec succès!'
        },
        errors: {
            loadSettings: 'Échec du chargement des paramètres.',
            saveDetails: 'Échec de l\'enregistrement des détails.',
            uploadLogo: 'Échec du téléchargement du logo.'
        }
    },

    // Announcement Page
    announcement: {
        title: 'Gestion des annonces',
        subtitle: 'Gérez les paramètres de la barre d\'annonces de votre site',
        hidePreview: 'Masquer l\'aperçu',
        showPreview: 'Afficher l\'aperçu',
        settings: 'Paramètres de l\'annonce',
        enableDisable: 'Activer/Désactiver',
        enabled: 'Activé',
        disabled: 'Désactivé',
        announcementText: 'Texte de l\'annonce',
        textPlaceholder: 'Entrez votre message d\'annonce...',
        backgroundColor: 'Couleur de fond',
        gradient: 'Dégradé',
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
        fontWeight: 'Épaisseur de la police',
        fontWeights: {
            normal: 'Normal',
            medium: 'Moyen',
            semibold: 'Semi-gras',
            bold: 'Gras'
        },
        showOnlineCounter: 'Afficher le compteur en ligne',
        livePreview: 'Aperçu en direct',
        currentSettings: 'Paramètres actuels',
        saveChanges: 'Enregistrer les modifications',
        saving: 'Enregistrement...',
        loadingSettings: 'Chargement des paramètres d\'annonce...',
        success: 'Annonce mise à jour avec succès!',
        errors: {
            loadSettings: 'Échec du chargement des paramètres d\'annonce',
            updateFailed: 'Échec de la mise à jour de l\'annonce'
        }
    },

    // Countdown Page
    countdown: {
        title: 'Gestion du compte à rebours',
        subtitle: 'Configurez le minuteur de compte à rebours de votre site',
        settings: 'Paramètres du compte à rebours',
        enableDisable: 'Activer/Désactiver',
        enabled: 'Activé',
        disabled: 'Désactivé',
        targetDate: 'Date cible',
        targetTime: 'Heure cible',
        title: 'Titre',
        titlePlaceholder: 'Vente flash se termine dans...',
        message: 'Message',
        messagePlaceholder: 'Dépêchez-vous! Offre à durée limitée!',
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
            gradient: 'Dégradé'
        },
        showDays: 'Afficher les jours',
        showHours: 'Afficher les heures',
        showMinutes: 'Afficher les minutes',
        showSeconds: 'Afficher les secondes',
        autoHide: 'Masquer automatiquement après expiration',
        preview: 'Aperçu',
        saveChanges: 'Enregistrer les modifications',
        saving: 'Enregistrement...',
        loadingSettings: 'Chargement des paramètres du compte à rebours...',
        success: 'Compte à rebours mis à jour avec succès!',
        errors: {
            loadSettings: 'Échec du chargement des paramètres du compte à rebours',
            updateFailed: 'Échec de la mise à jour du compte à rebours',
            invalidDate: 'Date ou heure invalide'
        }
    },

    // Integrations Page
    integrations: {
        title: 'Intégrations',
        subtitle: 'Gérez les intégrations tierces et les clés API',
        analytics: 'Analytique',
        googleAnalytics: 'Google Analytics',
        trackingId: 'ID de suivi',
        trackingIdPlaceholder: 'UA-XXXXXXXXX-X ou G-XXXXXXXXXX',
        facebookPixel: 'Facebook Pixel',
        pixelId: 'ID du pixel',
        pixelIdPlaceholder: 'Votre ID de pixel Facebook',
        payment: 'Paiement',
        stripeKeys: 'Clés Stripe',
        publishableKey: 'Clé publiable',
        publishableKeyPlaceholder: 'pk_test_...',
        secretKey: 'Clé secrète',
        secretKeyPlaceholder: 'sk_test_...',
        paypalSettings: 'Paramètres PayPal',
        clientId: 'ID client',
        clientIdPlaceholder: 'Votre ID client PayPal',
        email: 'E-mail',
        emailService: 'Service d\'e-mail',
        smtpSettings: 'Paramètres SMTP',
        smtpHost: 'Hôte SMTP',
        smtpPort: 'Port SMTP',
        smtpUsername: 'Nom d\'utilisateur SMTP',
        smtpPassword: 'Mot de passe SMTP',
        senderEmail: 'E-mail de l\'expéditeur',
        senderName: 'Nom de l\'expéditeur',
        storage: 'Stockage',
        awsS3: 'AWS S3',
        accessKey: 'Clé d\'accès',
        secretAccessKey: 'Clé d\'accès secrète',
        bucketName: 'Nom du bucket',
        region: 'Région',
        testConnection: 'Tester la connexion',
        testing: 'Test...',
        saveChanges: 'Enregistrer les modifications',
        saving: 'Enregistrement...',
        loadingSettings: 'Chargement des intégrations...',
        success: {
            saved: 'Intégrations enregistrées avec succès!',
            connectionSuccess: 'Connexion réussie!'
        },
        errors: {
            loadSettings: 'Échec du chargement des intégrations',
            updateFailed: 'Échec de la mise à jour des intégrations',
            connectionFailed: 'Échec du test de connexion',
            invalidCredentials: 'Identifiants invalides'
        }
    },

    // ===== BATCH 2: PRODUCTS PAGE =====
    products: {
        title: 'Gestion des produits',
        subtitle: 'Gérez votre catalogue de produits avec des outils avancés et des informations',

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
        allCategories: 'Toutes les catégories',
        allStock: 'Tous les stocks',
        inStockFilter: 'En stock',
        lowStockFilter: 'Stock faible',
        outOfStockFilter: 'Rupture de stock',
        allStatus: 'Tous les statuts',
        activeStatus: 'Actif',
        disabledStatus: 'Désactivé',
        featuredStatus: 'En vedette',
        newArrivalsStatus: 'Nouveautés',

        // Sort Options
        sortByName: 'Trier par nom',
        sortByPrice: 'Trier par prix',
        sortByStock: 'Trier par stock',
        sortByDate: 'Trier par date',

        // View Modes
        gridView: 'Vue grille',
        listView: 'Vue liste',

        // Bulk Actions
        selectAll: 'Tout sélectionner',
        clearSelection: 'Effacer la sélection',
        bulkDelete: 'Supprimer la sélection',
        selectedCount: 'sélectionné(s)',
        clearFilters: 'Effacer les filtres',

        // Product Card
        edit: 'Modifier',
        delete: 'Supprimer',
        quickEdit: 'Modification rapide',
        view: 'Voir',
        category: 'Catégorie',
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
        newArrival: 'Nouveauté',
        featured: 'En vedette',
        disabled: 'Désactivé',

        // Messages
        noProducts: 'Aucun produit trouvé',
        noProductsDesc: 'Commencez par ajouter votre premier produit',
        loadingProducts: 'Chargement des produits...',

        // Confirmations
        deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce produit?',
        bulkDeleteConfirm: 'Êtes-vous sûr de vouloir supprimer {count} produit(s)? Cette action ne peut pas être annulée.',

        // Success Messages
        success: {
            deleted: 'Produit supprimé avec succès!',
            bulkDeleted: '{count} produit(s) supprimé(s) avec succès!',
            updated: 'Produit mis à jour avec succès!',
            exported: 'Produits exportés avec succès!'
        },

        // Error Messages
        errors: {
            fetchFailed: 'Échec de la récupération des produits.',
            deleteFailed: 'Échec de la suppression du produit.',
            updateFailed: 'Échec de la mise à jour du produit.',
            exportFailed: 'Échec de l\'exportation des produits.',
            noSelection: 'Aucun produit sélectionné pour la suppression'
        },

        // Warnings
        warnings: {
            partialDelete: '{success} produit(s) supprimé(s), {failed} échec(s)'
        }
    },

    // Admin Product Form
    productForm: {
        // Page Header
        title: {
            create: 'Créer un nouveau produit',
            edit: 'Modifier le produit'
        },
        subtitle: {
            create: 'Ajouter un nouveau produit à votre catalogue',
            edit: 'Mettre à jour les informations de votre produit'
        },
        loading: 'Chargement du produit...',

        // Actions
        actions: {
            save: 'Enregistrer',
            saving: 'Enregistrement...',
            savingProduct: 'Enregistrement du produit...',
            create: 'Créer le produit',
            update: 'Mettre à jour le produit',
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
            stockQuantity: 'Quantité en stock',
            stockPlaceholder: '0',
            category: 'Catégorie',
            categoryPlaceholder: '-- Sélectionnez une catégorie --',
            type: 'Type',
            typeMen: 'Hommes',
            typeWomen: 'Femmes',
            typeBoth: 'Les deux',

            // Checkboxes
            bestseller: 'Meilleure vente',
            newArrival: 'Nouvelle arrivée',
            hasVariants: 'A des variantes',
            isPackable: 'Disponible pour les packs personnalisés'
        },

        // Description Section
        description: {
            title: 'Description du produit',
            label: 'Description'
        },

        // Images Section
        images: {
            title: 'Images du produit',
            upload: 'Télécharger des images',
            existingImages: 'Images existantes:',
            newImages: 'Nouvelles images à ajouter:',
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
            select: 'Sélectionner {name}',
            price: 'Prix',
            stock: 'Stock',
            variantImage: 'Image de la variante',
            removeImage: "Supprimer l'image",
            removeVariant: 'Supprimer la variante'
        },

        // Display Settings Section
        displaySettings: {
            title: "Paramètres d'affichage",
            purchaseNotifications: {
                title: '🛍️ Afficher les notifications d\'achat',
                description: 'Afficher les notifications lorsque les clients achètent ce produit',
                enabled: 'Activé',
                disabled: 'Désactivé'
            },
            countdownTimer: {
                title: '⏱️ Afficher le compte à rebours',
                description: 'Afficher le compte à rebours des ventes flash pour créer l\'urgence',
                enabled: 'Activé',
                disabled: 'Désactivé'
            }
        },

        // Frequently Bought Together Section
        frequentlyBought: {
            title: 'Fréquemment achetés ensemble',
            label: 'Sélectionnez les produits fréquemment achetés avec ce produit',
            placeholder: 'Rechercher et sélectionner des produits...'
        },

        // Validation Messages
        validation: {
            nameRequired: 'Le nom du produit est requis.',
            priceRequired: 'Un prix valide est requis.',
            categoryRequired: 'La catégorie est requise.',
            variantPricesRequired: 'Toutes les variantes doivent avoir des prix valides.'
        },

        // Success Messages
        success: {
            created: 'Produit créé avec succès!',
            updated: 'Produit mis à jour avec succès!'
        },

        // Error Messages
        errors: {
            saveFailed: 'Échec de l\'enregistrement du produit.',
            loadFailed: 'Échec du chargement du produit.',
            categoriesFailed: 'Échec du chargement des catégories de produits. Veuillez réessayer.'
        }
    }
};
