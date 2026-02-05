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
        refresh: 'Actualiser',
        settingsTitle: 'Paramètres de l\'annonce',
        enable: {
            title: 'Activer/Désactiver',
            description: 'Basculer la visibilité de la barre d\'annonce sur votre site'
        },
        text: {
            label: 'Texte de l\'annonce',
            placeholder: 'Entrez votre message d\'annonce... (ex : Livraison gratuite au-dessus de 50€)',
            help: 'Ce texte apparaîtra dans la barre supérieure de votre site web'
        },
        background: {
            label: 'Couleur de fond',
            gradient: 'Dégradé',
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
            label: 'Animation',
            none: 'Aucune',
            pulse: 'Pulsation',
            bounce: 'Rebond'
        },
        onlineCounter: {
            title: 'Afficher le compteur en ligne',
            description: 'Afficher un faux compteur "Utilisateurs en ligne" pour créer l\'urgence',
            status: {
                shown: 'Affiché',
                hidden: 'Masqué'
            },
            online: '{count} en ligne maintenant'
        },
        sticky: {
            title: 'Barre collante',
            description: 'Garder la barre visible lors du défilement',
            preview: {
                yes: 'Oui',
                no: 'Non'
            }
        },
        buttons: {
            save: 'Enregistrer les modifications',
            saving: 'Enregistrement...',
            save: 'Enregistrer'
        },
        livePreviewTitle: 'Aperçu en direct',
        preview: {
            title: 'Informations de l\'aperçu',
            status: 'Statut',
            enabled: 'Activé',
            disabled: 'Désactivé',
            background: 'Arrière-plan',
            animation: 'Animation',
            onlineCounter: 'Compteur en ligne',
            sticky: 'Collant',
            clickToPreview: 'Cliquez sur "Afficher l\'aperçu" pour voir la barre d\'annonce en direct'
        },
        loading: 'Chargement des paramètres d\'annonce...',
        messages: {
            loadError: 'Échec du chargement des paramètres d\'annonce',
            updateSuccess: 'Annonce mise à jour avec succès !',
            updateError: 'Échec de la mise à jour de l\'annonce'
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
                title: 'ðŸ›ï¸ Afficher les notifications d\'achat',
                description: 'Afficher les notifications lorsque les clients achètent ce produit',
                enabled: 'Activé',
                disabled: 'Désactivé'
            },
            countdownTimer: {
                title: 'â±ï¸ Afficher le compte à rebours',
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
            update: 'Mettre à jour la catégorie',
            back: 'Retour'
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
        contact: 'Contact',

        timeline_placed: 'Commande passée',
        timeline_transit: 'En transit',
        timeline_delivered: 'Livrée',
        errorExport: 'Échec de l\'exportation des commandes.',
        modal: {
            title: 'Détails de la commande',
            clientInfo: 'Informations client',
            name: 'Nom :',
            phone: 'Téléphone :',
            city: 'Ville :',
            address: 'Adresse :',
            orderInfo: 'Informations commande',
            orderItems: 'Articles de la commande',
            packContents: 'Contenu du pack :',
            variant: 'Variante :',
            qty: 'Qté :',
            subtotal: 'Sous-total :',
            discount: 'Réduction :',
            shipping: 'Livraison :',
            total: 'Total :',
            timeline: 'Chronologie de la commande',
            quickActions: 'Actions rapides',
            markDelivering: 'Marquer en livraison',
            markDelivered: 'Marquer comme livré',
            cancelOrder: 'Annuler',
            restoreOrder: 'Restaurer',
            close: 'Fermer',
            noItems: 'Aucun article dans cette commande.',
            coupon: 'Code promo :',
            free: 'Gratuit'
        }
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
        },
        description: {
            title: 'Description',
            label: 'Description du Pack'
        },
        dragDrop: {
            clickToUpload: 'Cliquez pour télécharger',
            orDrag: 'ou glisser-déposer',
            fileTypeInfo: 'PNG, JPG, GIF jusqu\'à 5 Mo',
            change: 'Changer',
            remove: 'Retirer',
            invalidType: 'Veuillez sélectionner un fichier image valide',
            invalidSize: 'La taille de l\'image doit être inférieure à 5 Mo',
            dropInvalid: 'Veuillez déposer un fichier image valide'
        },
        productSelect: {
            placeholder: 'Sélectionner un produit...',
            search: 'Rechercher des produits...',
            noProducts: 'Aucun produit trouvé',
            selected: 'sélectionné(s)',
            more: 'plus'
        },
        errors: {
            fetchFailed: 'Échec de la récupération des données. Veuillez réessayer.',
            createFailed: 'Échec de la création du pack. Veuillez vérifier les champs.'
        },
        autoSave: 'Formulaire enregistré automatiquement'
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
            totalRevenue: 'Revenu Total',
            orders: 'Total Commandes',
            customers: 'Total Clients',
            totalCoupons: 'Total des coupons',
            activeCoupons: 'Coupons actifs',
            totalUses: 'Utilisations totales',
            totalSavings: 'Économies totales'
        },
        charts: {
            revenue: 'Revenus au Fil du Temps',
            orders: 'Aperçu des Commandes',
            topProducts: 'Meilleurs Produits'
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
            discount: 'Remise',
            active: 'Actif'
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
    },
    // Users Page
    usersPage: {
        title: 'Gérer les utilisateurs',
        table: {
            userId: 'ID Utilisateur',
            name: 'Nom',
            email: 'Email',
            legacyRole: 'Rôle Legacy',
            rbacRoles: 'Rôles RBAC',
            emailConfirmed: 'Email Confirmé',
            actions: 'Actions',
            yes: 'Oui',
            no: 'Non',
            manage: 'Gérer'
        },
        rolesModal: {
            title: 'Gérer les rôles',
            description: 'Sélectionnez les rôles à attribuer à cet utilisateur. Les utilisateurs peuvent avoir plusieurs rôles.',
            cancel: 'Annuler',
            save: 'Enregistrer les rôles',
            success: 'Rôles attribués avec succès !',
            error: 'Échec de l\'attribution des rôles',
            permissions: '{count} permissions'
        },
        permissionsModal: {
            title: 'Permissions utilisateur',
            description: 'Cet utilisateur a {count} permissions via ses rôles attribués.',
            viewTitle: 'Voir les permissions'
        },
        messages: {
            deleteConfirm: 'Êtes-vous sûr de vouloir supprimer l\'utilisateur #{id} ? Cette action est irréversible.',
            deleteSuccess: 'Utilisateur supprimé avec succès !',
            deleteFailed: 'Échec de la suppression de l\'utilisateur',
            roleUpdated: 'Rôle de l\'utilisateur #{id} mis à jour vers {role}.',
            roleUpdateFailed: 'Échec de la mise à jour du rôle pour l\'utilisateur #{id}.',
            fetchFailed: 'Échec de la récupération des utilisateurs.'
        }
    },
    // Roles Page
    rolesPage: {
        title: 'Gestion des rôles',
        subtitle: 'Créez et gérez des rôles avec des permissions spécifiques',
        createButton: 'Créer un nouveau rôle',
        editRole: 'Modifier le rôle',
        createRole: 'Créer le rôle',
        roleName: 'Nom du rôle',
        roleNamePlaceholder: 'ex: ROLE_CONTENT_MANAGER',
        roleNameHelp: 'Utilisez le format : ROLE_NOM (ex: ROLE_MANAGER)',
        description: 'Description',
        descriptionPlaceholder: 'Décrivez ce que ce rôle peut faire...',
        assignPermissions: 'Attribuer les permissions ({count} sélectionnées)',
        permissions: 'Permissions :',
        cancel: 'Annuler',
        save: 'Enregistrer le rôle',
        update: 'Mettre à jour le rôle',
        messages: {
            createSuccess: 'Rôle créé avec succès !',
            updateSuccess: 'Rôle mis à jour avec succès !',
            deleteConfirm: 'Êtes-vous sûr de vouloir supprimer le rôle "{name}" ? Cette action est irréversible.',
            deleteSuccess: 'Rôle supprimé avec succès !',
            deleteFailed: 'Échec de la suppression du rôle. Il est peut-être attribué à des utilisateurs.',
            saveFailed: 'Échec de l\'enregistrement du rôle',
            fetchFailed: 'Échec de la récupération des rôles et permissions'
        }
    },
    // Permissions Page
    permissionsPage: {
        title: 'Gestion des permissions',
        subtitle: 'Gérer les permissions du système et les contrôles d\'accès',
        createButton: 'Créer une nouvelle permission',
        filterResource: 'Filtrer par ressource :',
        allResources: 'Toutes les ressources',
        showingCount: 'Affichage de {count} sur {total} permissions',
        editPermission: 'Modifier la permission',
        createPermission: 'Créer la permission',
        resource: 'Ressource',
        resourcePlaceholder: 'ex: PRODUCT, ORDER, USER',
        action: 'Action',
        actionPlaceholder: 'ex: VIEW, CREATE, EDIT, DELETE',
        permissionName: 'Nom de la permission :',
        description: 'Description',
        descriptionPlaceholder: 'Décrivez ce que cette permission permet...',
        cancel: 'Annuler',
        save: 'Enregistrer la permission',
        update: 'Mettre à jour la permission',
        messages: {
            createSuccess: 'Permission créée avec succès !',
            updateSuccess: 'Permission mise à jour avec succès !',
            deleteConfirm: 'Êtes-vous sûr de vouloir supprimer la permission "{name}" ? Cette action est irréversible.',
            deleteSuccess: 'Permission supprimée avec succès !',
            deleteFailed: 'Échec de la suppression. Elle est peut-être attribuée à des rôles.',
            saveFailed: 'Échec de l\'enregistrement de la permission',
            fetchFailed: 'Échec de la récupération des permissions'
        }
    },
    // Hero Settings
    heroSettings: {
        title: 'Paramètres de la section Hero',
        subtitle: 'Configurez le contenu de la section Hero de votre page d\'accueil',
        pageTitle: 'Gérer la section Hero',
        pageSubtitle: 'Personnalisez la section Hero de votre page d\'accueil pour attirer les visiteurs',
        form: {
            title: 'Titre du Hero',
            titlePlaceholder: 'Entrez le titre de votre Hero (ex: Bienvenue dans notre magasin)',
            titleFont: 'Police du titre',
            subtitle: 'Sous-titre du Hero',
            subtitlePlaceholder: 'Entrez le sous-titre de votre Hero (ex: Découvrez des produits incroyables à bas prix)',
            linkText: 'Texte du bouton',
            linkTextPlaceholder: 'Entrez le texte du bouton (ex: Acheter, Explorer)',
            linkUrl: 'URL du bouton',
            linkUrlPlaceholder: 'Entrez l\'URL du bouton (ex: /products, /shop)',
            desktopBackground: 'Arrière-plan Bureau',
            mobileBackground: 'Arrière-plan Mobile',
            dropDesktop: 'Déposez l\'image pour Bureau',
            dropMobile: 'Déposez l\'image pour Mobile',
            updateButton: 'Mettre à jour la section Hero',
            updating: 'Mise à jour en cours...',
            desktopRec: 'Recommandé : 1920x800px',
            mobileRec: 'Recommandé : 800x1000px'
        },
        preview: {
            title: 'Aperçu en direct',
            subtitle: 'Voyez comment votre section Hero apparaîtra',
            livePreviewBadge: 'Aperçu en direct',
            infoTitle: 'Informations de l\'aperçu',
            titleLength: 'Longueur du titre',
            subtitleLength: 'Longueur du sous-titre',
            hasImage: 'Image de fond présente',
            buttonUrl: 'URL du bouton',
            notSet: 'Non défini',
            yes: 'Oui',
            no: 'Non'
        },
        messages: {
            success: 'Section Hero mise à jour avec succès !',
            loadFailed: 'Échec du chargement des données Hero.',
            validation: {
                titleRequired: 'Le titre du Hero est requis',
                titleMinLength: 'Le titre du Hero doit contenir au moins 3 caractères',
                subtitleRequired: 'Le sous-titre du Hero est requis',
                subtitleMinLength: 'Le sous-titre du Hero doit contenir au moins 5 caractères',
                linkTextRequired: 'Le texte du lien est requis',
                linkUrlRequired: 'L\'URL du lien est requise',
                linkUrlFormat: 'L\'URL du lien doit commencer par / ou http',
                imageRequired: 'Veuillez sélectionner un fichier image valide.'
            }
        },
        shortcuts: {
            save: 'Enregistrer',
            preview: 'Aperçu',
            clear: 'Effacer Messages',
            unsaved: 'Modifications non enregistrées',
            hidePreview: 'Masquer l\'aperçu',
            showPreview: 'Afficher l\'aperçu'
        }
    },
    // Pack Comments
    packComments: {
        title: 'Commentaires pour {packName}',
        addNew: 'Ajouter un nouveau commentaire',
        backToPacks: 'Retour aux packs',
        table: {
            user: 'Utilisateur',
            comment: 'Commentaire',
            score: 'Note',
            actions: 'Actions',
            edit: 'Modifier',
            delete: 'Supprimer'
        },
        form: {
            addTitle: 'Ajouter un nouveau commentaire',
            editTitle: 'Modifier le commentaire',
            displayName: 'Nom affiché',
            content: 'Contenu',
            score: 'Note',
            images: 'Images',
            newImages: 'Nouvelles images (Ajouter)',
            add: 'Ajouter le commentaire',
            update: 'Mettre à jour',
            cancel: 'Annuler',
            delete: 'Supprimer'
        },
        messages: {
            fetchError: 'Échec de la récupération des commentaires du pack.',
            deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce commentaire ?',
            deleteSuccess: 'Commentaire supprimé avec succès !',
            deleteError: 'Échec de la suppression du commentaire.',
            updateSuccess: 'Commentaire mis à jour avec succès !',
            updateError: 'Échec de la mise à jour du commentaire.',
            addSuccess: 'Commentaire ajouté avec succès !',
            addError: 'Échec de l\'ajout du commentaire.',
            deleteImageConfirm: 'Êtes-vous sûr de vouloir supprimer cette image ?',
            deleteImageSuccess: 'Image supprimée avec succès !',
            deleteImageError: 'Échec de la suppression de l\'image.'
        }
    },
    // Reviews
    reviews: {
        title: 'Gérer les avis',
        createButton: '+ Créer un nouvel avis',
        tabs: {
            all: 'Tous les avis ({count})',
            pending: 'En attente ({count})',
            approved: 'Approuvés ({count})'
        },
        form: {
            createTitle: 'Créer un nouvel avis',
            editTitle: 'Modifier l\'avis',
            customerName: 'Nom du client',
            customerNamePlaceholder: 'Entrez le nom du client',
            content: 'Contenu de l\'avis',
            contentPlaceholder: 'Entrez le contenu de l\'avis',
            rating: 'Note',
            ratingHelp: '{rating} sur 5 étoiles',
            approved: 'Approuvé (visible sur la page d\'accueil)',
            create: 'Créer l\'avis',
            update: 'Mettre à jour',
            cancel: 'Annuler'
        },
        list: {
            adminCreated: 'CRÉÉ PAR ADMIN',
            approved: 'APPROUVÉ',
            pending: 'EN ATTENTE',
            customer: 'Client :',
            anonymous: 'Anonyme',
            user: 'Utilisateur :',
            rating: 'Note :',
            noReviews: 'Aucun avis trouvé.',
            actions: {
                edit: 'Modifier',
                approve: 'Approuver',
                delete: 'Supprimer'
            }
        },
        messages: {
            fetchError: 'Échec de la récupération des avis.',
            createSuccess: 'Avis créé avec succès !',
            createError: 'Échec de la création de l\'avis.',
            updateSuccess: 'Avis mis à jour avec succès !',
            updateError: 'Échec de la mise à jour de l\'avis.',
            approveSuccess: 'Avis approuvé avec succès !',
            approveError: 'Échec de l\'approbation de l\'avis.',
            deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet avis ?',
            deleteSuccess: 'Avis supprimé avec succès !',
            deleteError: 'Échec de la suppression de l\'avis.'
        }
    },
    // Brand Settings
    brandSettings: {
        title: 'Paramètres de la marque',
        subtitle: 'Personnalisez l\'identité et l\'apparence de votre marque',
        logoConfiguration: 'Configuration du logo',
        selectNewLogo: 'Sélectionner un nouveau logo',
        uploading: 'Téléchargement...',
        saveLogo: 'Enregistrer le logo',
        recommendedSize: 'Taille recommandée : 500x500px, PNG ou JPG',
        brandDetails: 'Détails de la marque',
        siteTitle: 'Titre du site',
        siteSubtitle: 'Sous-titre du site',
        titleFont: 'Police du titre',
        preview: 'Aperçu',
        saving: 'Enregistrement...',
        saveDetails: 'Enregistrer les détails',
        fontOptions: {
            default: 'Par défaut (Sans-Serif)',
            dancingScript: 'Dancing Script',
            playfairDisplay: 'Playfair Display',
            greatVibes: 'Great Vibes',
            cinzel: 'Cinzel',
            montserrat: 'Montserrat'
        },
        success: {
            detailsSaved: 'Détails de la marque enregistrés avec succès !',
            logoUploaded: 'Logo téléchargé avec succès !'
        },
        errors: {
            loadSettings: 'Échec du chargement des paramètres de la marque.',
            saveDetails: 'Échec de l\'enregistrement des détails de la marque.',
            uploadLogo: 'Échec du téléchargement du logo.'
        }
    },
    // Categories Page
    categoriesPage: {
        title: 'Gestion des catégories',
        subtitle: 'Organisez votre catalogue produit avec de belles catégories',
        header: {
            newCategory: 'Nouvelle catégorie',
            search: 'Rechercher',
            clearSearch: 'Effacer recherche',
            refresh: 'Actualiser',
            addNew: 'Ajouter une catégorie'
        },
        stats: {
            totalCategories: 'Total catégories',
            withProducts: 'Avec produits',
            emptyCategories: 'Catégories vides',
            totalProducts: 'Total produits'
        },
        search: {
            placeholder: 'Rechercher des catégories...',
            sortName: 'Trier par nom',
            sortProducts: 'Trier par nombre de produits',
            clear: 'Effacer',
            title: 'Vue Grille',
            listView: 'Vue Liste'
        },
        list: {
            title: 'Catégories ({count})',
            refresh: 'Actualiser',
            noCategoriesFound: 'Aucune catégorie trouvée',
            noCategoriesAvailable: 'Aucune catégorie disponible',
            tryAdjusting: 'Essayez d\'ajuster vos critères de recherche',
            startCreating: 'Commencez par créer votre première catégorie',
            createFirst: 'Créer votre première catégorie',
            noImage: 'Pas d\'image',
            empty: 'Vide',
            productCount: '{count} produits',
            id: 'ID : {id}',
            edit: 'Modifier',
            delete: 'Supprimer'
        },
        messages: {
            fetchFailed: 'Échec de la récupération des catégories.',
            confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette catégorie ?',
            deleteSuccess: 'Catégorie supprimée avec succès !',
            deleteFailed: 'Échec de la suppression de la catégorie.'
        },
        shortcuts: {
            clearSearch: 'Effacer recherche'
        },
        card: {
            products: 'produits'
        }
    },
    // Products Page
    products: {
        title: 'Inventaire des produits',
        subtitle: 'Gérez et suivez l\'ensemble de votre catalogue produits',
        shortcuts: {
            newProduct: 'Nouveau produit',
            search: 'Chercher',
            closeModal: 'Fermer la fenêtre'
        },
        analytics: {
            totalProducts: 'Total produits',
            inStock: 'En stock',
            lowStock: 'Stock faible',
            outOfStock: 'Rupture de stock',
            totalValue: 'Valeur totale',
            avgPrice: 'Prix moyen'
        },
        refresh: 'Actualiser',
        exportCSV: 'Exporter CSV',
        addNewProduct: 'Ajouter un produit',
        searchPlaceholder: 'Rechercher des produits...',
        allCategories: 'Toutes les catégories',
        allStock: 'Tous les niveaux de stock',
        inStockFilter: 'En stock',
        lowStockFilter: 'Stock faible',
        outOfStockFilter: 'Rupture de stock',
        allStatus: 'Tous les statuts',
        activeStatus: 'Actif',
        disabledStatus: 'Désactivé',
        featuredStatus: 'En vedette',
        newArrivalsStatus: 'Nouveautés',
        sortByName: 'Trier par nom',
        sortByPrice: 'Trier par prix',
        sortByStock: 'Trier par stock',
        sortByDate: 'Trier par date',
        gridView: 'Vue Grille',
        listView: 'Vue Liste',
        clearFilters: 'Effacer les filtres',
        selectedCount: 'sélectionnés',
        clearSelection: 'Effacer la sélection',
        bulkDelete: 'Supprimer la sélection',
        bulkDeleteConfirm: 'Êtes-vous sûr de vouloir supprimer {count} produits ?',
        deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
        selectAll: 'Tout sélectionner',
        noProducts: 'Aucun produit trouvé',
        noProductsDesc: 'Essayez d\'ajuster vos critères de recherche ou ajoutez un nouveau produit',
        stockStatus: {
            inStock: 'en stock',
            low: 'stock faible',
            out: 'rupture de stock'
        },
        featured: 'En vedette',
        newArrival: 'Nouveau',
        errors: {
            fetchFailed: 'Échec de la récupération des produits.',
            deleteFailed: 'Échec de la suppression du produit.',
            noSelection: 'Aucun produit sélectionné.',
            exportFailed: 'Échec de l\'exportation des produits.'
        },
        success: {
            deleted: 'Produit supprimé avec succès !',
            bulkDeleted: '{count} produits supprimés avec succès !',
            exported: 'Produits exportés avec succès !'
        }
    },
    // Product Form
    productForm: {
        title: {
            create: 'Créer un nouveau produit',
            edit: 'Modifier le produit'
        },
        subtitle: {
            create: 'Remplissez les informations ci-dessous pour créer un nouveau produit',
            edit: 'Mettez à jour les informations ci-dessous pour modifier le produit'
        },
        actions: {
            saving: 'Enregistrement...',
            create: 'Créer le produit',
            update: 'Mettre à jour le produit',
            save: 'Enregistrer les modifications'
        },
        basicInfo: {
            title: 'Informations de base',
            productName: 'Nom du produit',
            productNamePlaceholder: 'ex. Crème visage de luxe',
            brand: 'Marque',
            brandPlaceholder: 'ex. L\'Oréal',
            price: 'Prix (DH)',
            pricePlaceholder: '0.00',
            stockQuantity: 'Quantité en stock',
            stockPlaceholder: '0',
            category: 'Catégorie',
            categoryPlaceholder: 'Sélectionner une catégorie',
            type: 'Type de produit',
            typeMen: 'Hommes',
            typeWomen: 'Femmes',
            typeBoth: 'Mixte',
            bestseller: 'Best-seller (En vedette)',
            newArrival: 'Nouvelle arrivée',
            hasVariants: 'A des variantes (Couleurs/Taille)',
            isPackable: 'Disponible en packs'
        },
        description: {
            title: 'Description',
            label: 'Description du produit'
        },
        images: {
            title: 'Images du produit',
            upload: 'Télécharger des images',
            existingImages: 'Images existantes',
            newImages: 'Nouvelles images',
            preview: 'Aperçu',
            existing: 'Existant'
        },
        variantTypes: {
            title: 'Types de variantes',
            typeName: 'Nom du type',
            typeNamePlaceholder: 'ex. Couleur, Taille',
            options: 'Options',
            optionValue: 'Valeur',
            color: 'Couleur',
            image: 'Image',
            removeOption: 'Supprimer l\'option'
        },
        validation: {
            nameRequired: 'Le nom du produit est requis.',
            priceRequired: 'Le prix est requis et doit être supérieur à 0.',
            categoryRequired: 'La catégorie est requise.',
            variantPricesRequired: 'Toutes les variantes doivent avoir un prix valide.'
        },
        errors: {
            categoriesFailed: 'Échec de la récupération des catégories.',
            loadFailed: 'Échec du chargement des détails du produit.',
            saveFailed: 'Échec de l\'enregistrement du produit.'
        },
        success: {
            created: 'Produit créé avec succès !',
            updated: 'Produit mis à jour avec succès !'
        },
        loading: 'Chargement du produit...'
    },
    // Manage Packs Page
    managePacks: {
        title: 'Gérer les Packs',
        subtitle: 'Créez et gérez des offres groupées et spéciales',
        addNew: 'Nouveau Pack',
        noPacks: 'Aucun pack trouvé',
        noPacksDesc: 'Commencez par créer votre premier pack de produits',
        createFirst: 'Créer le premier pack',
        actions: {
            edit: 'Modifier',
            recommendations: 'Recommandations',
            comments: 'Commentaires',
            delete: 'Supprimer',
            deleting: 'Suppression...'
        },
        deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce pack ?',
        deleteSuccess: 'Pack supprimé avec succès',
        deleteFailed: 'Échec de la suppression du pack'
    },
    // Pack Form

    // Pack Recommendations
    packRecommendations: {
        title: 'Gérer les Recommandations',
        subtitle: 'Pack : {name}',
        cancel: 'Annuler',
        save: 'Enregistrer',
        saving: 'Enregistrement...',
        searchPlaceholder: 'Rechercher produits et packs...',
        sections: {
            products: 'Produits recommandés',
            packs: 'Packs recommandés',
            customPacks: 'Packs personnalisés recommandés'
        },
        summary: {
            title: 'Résumé de la sélection',
            selectedProducts: 'Produits sélectionnés',
            selectedPacks: 'Packs sélectionnés',
            selectedCustomPacks: 'Packs personnalisés sélectionnés',
            noneSelected: 'Aucun élément sélectionné'
        },
        messages: {
            success: 'Recommandations mises à jour avec succès !',
            error: 'Échec de l\'enregistrement des recommandations',
            loadError: 'Échec du chargement des données'
        }
    },
    // Order Management Page
    ordersPage: {
        title: 'Gestion des Commandes',
        subtitle: 'Gérer et suivre les commandes clients',
        loading: 'Chargement des commandes...',
        errorExport: 'Échec de l\'exportation des commandes',
        export: 'Exporter',
        searchPlaceholder: 'Rechercher par nom, ID ou téléphone...',
        resetFilters: 'Réinitialiser',
        showActive: 'Commandes actives',
        showDeleted: 'Commandes supprimées',
        selected: 'sélectionné(s)',
        updateStatus: 'Mettre à jour le statut',
        deleteSelected: 'Supprimer la sélection',
        totalOrders: 'Total Commandes',
        totalRevenue: 'Revenu Total',
        averageOrder: 'Panier Moyen',
        uniqueCustomers: 'Clients Uniques',
        status: 'Statut',
        todaysOrders: 'Commandes du jour',
        revenueToday: 'Revenu du jour',
        table: {
            orderId: 'ID Commande',
            customer: 'Client',
            contactInfo: 'Contact',
            created: 'Créé le',
            status: 'Statut',
            total: 'Total',
            actions: 'Actions'
        },
        pagination: {
            previous: 'Précédent',
            next: 'Suivant',
            showing: 'Affichage de',
            to: 'à',
            of: 'sur',
            results: 'résultats'
        },
        status_ALL: 'Tous les statuts',
        status_PREPARING: 'En préparation',
        status_DELIVERING: 'En livraison',
        status_DELIVERED: 'Livré',
        status_CANCELLED: 'Annulé',
        date_ALL: 'Tout le temps',
        date_TODAY: 'Aujourd\'hui',
        date_THIS_WEEK: 'Cette semaine',
        date_THIS_MONTH: 'Ce mois',
        timeline_placed: 'Commande passée',
        timeline_transit: 'En transit',
        timeline_delivered: 'Livrée',
        modal: {
            title: 'Détails de la commande',
            subtitle: 'Informations détaillées et chronologie',
            close: 'Fermer',
            clientInfo: 'Informations Client',
            name: 'Nom :',
            phone: 'Tél :',
            city: 'Ville :',
            address: 'Adresse :',
            orderInfo: 'Informations Commande',
            coupon: 'Code Promo :',
            orderItems: 'Articles',
            packContents: 'Contenu du pack',
            variant: 'Variante :',
            qty: 'Qté :',
            noItems: 'Aucun article trouvé',
            subtotal: 'Sous-total',
            discount: 'Réduction',
            shipping: 'Expédition',
            free: 'Gratuit',
            total: 'Total',
            timeline: 'Chronologie',
            quickActions: 'Actions Rapides',
            markDelivering: 'Marquer En Livraison',
            markDelivered: 'Marquer comme Livré',
            cancelOrder: 'Annuler la commande',
            restoreOrder: 'Restaurer la commande'
        },
        messages: {
            fetchError: 'Échec du chargement des commandes.',
            deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cette commande ?',
            deleteSuccess: 'Commande supprimée avec succès !',
            deleteError: 'Échec de la suppression.',
            restoreSuccess: 'Commande restaurée avec succès !',
            restoreError: 'Échec de la restauration.',
            statusSuccess: 'Statut mis à jour !',
            statusError: 'Échec de la mise à jour du statut.',
            bulkSelect: 'Veuillez sélectionner des commandes.',
            bulkUpdateConfirm: 'Mettre à jour {count} commandes vers {status} ?',
            bulkUpdateSuccess: '{count} commandes mises à jour !',
            bulkUpdateError: 'Échec de la mise à jour de certaines commandes.',
            bulkDeleteSelect: 'Veuillez sélectionner des commandes à supprimer.',
            bulkDeleteConfirm: 'Supprimer {count} commandes ?',
            bulkDeleteSuccess: '{count} commandes supprimées !',
            bulkDeleteError: 'Échec de la suppression de certaines commandes.',
            exportSuccess: 'Commandes exportées avec succès !'
        }
    },
    // Order Feedback Component
    orderFeedback: {
        title: 'Avis Client',
        loading: 'Chargement des avis...',
        error: 'Erreur lors du chargement de l\'avis',
        noFeedback: 'Aucun avis soumis',
        noFeedbackDesc: "Le client n'a pas encore laissé d'avis pour cette commande",
        from: 'De :',
        anonymous: 'Utilisateur Anonyme'
    },
    // Coupon Management Page
    couponsPage: {
        title: 'Gestion des Coupons',
        subtitle: 'Créez des remises incroyables et boostez vos ventes avec des campagnes professionnelles',
        create: 'Créer un Coupon',
        refresh: 'Actualiser',
        refreshSuccess: 'Liste actualisée avec succès !',
        stats: {
            total: 'Total Coupons',
            active: 'Coupons Actifs',
            usage: 'Utilisations',
            savings: 'Économies Totales'
        },
        form: {
            title_create: 'Créer un Coupon',
            title_edit: 'Modifier le Coupon',
            subtitle: 'Configurez la remise parfaite pour vos clients',
            name: 'Nom du Coupon',
            namePlaceholder: 'ex: Soldes d\'Été',
            code: 'Code Promo',
            generate: 'Générer un code',
            discountType: 'Type de Remise',
            discountValue: 'Valeur de la Remise',
            percentage: 'Pourcentage (%)',
            fixed: 'Montant Fixe ($)',
            freeShipping: 'Livraison Gratuite',
            expiry: 'Date d\'expiration',
            usageLimit: 'Limite d\'utilisation',
            usageLimitHelp: 'Laissez 0 pour illimité',
            minPurchase: 'Montant Minimum d\'Achat',
            applicableProducts: 'Produits Éligibles',
            applicableCategories: 'Catégories Éligibles',
            scopeHelp: 'Laissez vide pour appliquer à tout',
            cancel: 'Annuler',
            submit_create: 'Créer',
            submit_update: 'Mettre à jour'
        },
        table: {
            id: 'ID',
            name: 'Nom',
            discount: 'Remise',
            expiry: 'Expiration',
            usage: 'Utilisation',
            scope: 'Portée',
            actions: 'Actions',
            allItems: 'Tous les articles',
            products: 'Produits',
            categories: 'Catégories',
            copy: 'Copier Code',
            edit: 'Modifier',
            analytics: 'Analytique',
            delete: 'Supprimer'
        },
        messages: {
            created: 'Coupon "{name}" créé avec succès !',
            updated: 'Coupon "{name}" mis à jour !',
            deleted: 'Coupon supprimé avec succès !',
            copied: 'Code copié dans le presse-papier !',
            deleteConfirm: 'Voulez-vous vraiment supprimer ce coupon ?',
            deleteConfirmTitle: 'Supprimer le Coupon',
            yesDelete: 'Oui, Supprimer',
            errorFetch: 'Erreur lors du chargement des coupons !',
            errorAction: 'Une erreur est survenue !'
        }
    },
    // Landing Pages Page
    landingPagesPage: {
        title: 'Pages de Destination',
        subtitle: 'Créez des pages de vente à haute conversion pour vos campagnes marketing',
        create: 'Créer une Page',
        searchPlaceholder: 'Rechercher des pages...',
        stats: {
            total: 'Total Pages',
            active: 'Pages Actives',
            views: 'Vues Totales',
            conversions: 'Conv. Moyenne'
        },
        tabs: {
            all: 'Toutes les Pages',
            published: 'Publiées',
            drafts: 'Brouillons'
        },
        table: {
            title: 'Titre',
            slug: 'Slug URL',
            status: 'Statut',
            views: 'Vues',
            conversions: 'Conversions',
            lastModified: 'Dernière Modif',
            actions: 'Actions',
            view: 'Voir',
            edit: 'Modifier',
            duplicate: 'Dupliquer',
            publish: 'Publier',
            unpublish: 'Dépublier',
            delete: 'Supprimer'
        },
        status: {
            published: 'Publié',
            draft: 'Brouillon'
        },
        messages: {
            deleteConfirm: 'Voulez-vous vraiment supprimer cette page ?',
            deleteConfirmTitle: 'Supprimer la Page',
            yesDelete: 'Oui, Supprimer',
            publishedSuccess: 'Page publiée avec succès !',
            unpublishedSuccess: 'Page dépubliée avec succès !',
            deletedSuccess: 'Page supprimée avec succès !',
            duplicatedSuccess: 'Page dupliquée avec succès !',
            errorFetch: 'Erreur lors du chargement des pages',
            errorAction: 'Action échouée'
        }
    },
    // Landing Page Builder
    landingPageBuilder: {
        header: {
            editTitle: 'Modifier la Page',
            newTitle: 'Nouvelle Page',
            back: 'Retour',
            saveDraft: 'Enregistrer Brouillon',
            saving: 'Enregistrement...',
            publish: 'Publier'
        },
        settings: {
            title: 'Paramètres de la Page',
            pageTitle: 'Titre',
            slug: 'Slug',
            generate: 'Générer',
            mainProduct: 'Produit Principal (Défaut)',
            mainProductHelp: 'Ce produit sera utilisé par toute section définie sur "Défaut".'
        },
        sections: {
            title: 'Sections',
            addNew: 'Ajouter',
            clickToAdd: 'CLIQUER POUR AJOUTER :',
            noSections: 'Aucune section. Ajoutez-en une pour commencer !',
            dragToReorder: 'Glisser pour réorganiser',
            done: 'Terminé',
            edit: 'Éditer'
        },
        preview: {
            title: 'Aperçu de Votre Page',
            subtitle: 'Ajoutez des sections depuis le panneau de gauche pour les voir apparaître ici instantanément.'
        },
        messages: {
            enterTitle: 'Veuillez entrer un titre',
            enterSlug: 'Veuillez entrer un slug',
            slugFormat: 'Le slug doit être en minuscules avec des tirets uniquement (ex: serum-ete-2024)',
            duplicateSectionTitle: 'Attendez !',
            duplicateSection: 'Vous avez déjà {count} section(s) "{type}". Êtes-vous sûr de vouloir en ajouter une autre ?',
            deleteSectionConfirm: 'Voulez-vous vraiment supprimer cette section ?',
            saveSuccess: 'Page enregistrée avec succès !',
            createSuccess: 'Page créée avec succès !',
            saveError: 'Échec de l\'enregistrement de la page',
            loadError: 'Échec du chargement de la page',
            productsError: 'Échec du chargement des produits'
        }
    },
    // Product Comments
    productComments: {
        title: 'Commentaires pour {productName}',
        addNew: 'Ajouter un Commentaire',
        backToProducts: 'Retour aux Produits',
        table: {
            user: 'Utilisateur',
            comment: 'Commentaire',
            score: 'Note',
            actions: 'Actions',
            edit: 'Éditer',
            delete: 'Supprimer'
        },
        form: {
            addTitle: 'Ajouter un Commentaire',
            editTitle: 'Modifier le Commentaire',
            displayName: 'Nom Affiché',
            content: 'Contenu',
            score: 'Note',
            images: 'Images',
            newImages: 'Nouvelles Images (Ajouter)',
            add: 'Ajouter',
            update: 'Mettre à jour',
            cancel: 'Annuler'
        },
        messages: {
            fetchError: 'Échec du chargement des commentaires du produit.',
            deleteConfirm: 'Voulez-vous vraiment supprimer ce commentaire ?',
            deleteSuccess: 'Commentaire supprimé avec succès !',
            deleteError: 'Échec de la suppression du commentaire.',
            updateSuccess: 'Commentaire mis à jour avec succès !',
            updateError: 'Échec de la mise à jour du commentaire.',
            addSuccess: 'Commentaire ajouté avec succès !',
            addError: "Échec de l'ajout du commentaire.",
            deleteImageConfirm: 'Voulez-vous vraiment supprimer cette image ?',
            deleteImageSuccess: 'Image supprimée avec succès !',
            deleteImageError: "Échec de la suppression de l'image."
        }
    },
    // General Comments
    commentsPage: {
        title: 'Gérer les Commentaires',
        table: {
            user: 'Utilisateur',
            comment: 'Commentaire',
            score: 'Note',
            actions: 'Actions',
            edit: 'Éditer',
            delete: 'Supprimer'
        },
        form: {
            editTitle: 'Modifier le Commentaire',
            content: 'Contenu',
            score: 'Note',
            update: 'Mettre à jour',
            cancel: 'Annuler'
        },
        messages: {
            fetchError: 'Échec du chargement des commentaires.',
            deleteConfirm: 'Voulez-vous vraiment supprimer ce commentaire ?',
            deleteSuccess: 'Commentaire supprimé avec succès !',
            deleteError: 'Échec de la suppression du commentaire.',
            updateSuccess: 'Commentaire mis à jour avec succès !',
            updateError: 'Échec de la mise à jour du commentaire.'
        }
    },
    // Admin Settings Page
    adminSettings: {
        title: 'Paramètres du système',
        configure: 'Configurer les règles de remise',
        highValue: {
            title: '💰 Remise pour commande de grande valeur',
            thresholdLabel: 'Montant minimum de la commande (MAD)',
            discountLabel: 'Pourcentage de remise (%)',
            help: 'Les commandes supérieures à ce montant généreront un coupon de réduction.'
        },
        loyalty: {
            title: '🏆 Programme de fidélité client',
            orderCountLabel: 'Récompenser chaque N-ième commande',
            discountLabel: 'Pourcentage de remise (%)',
            help: 'Exemple : Réglez sur 3 pour récompenser la 3ème, 6ème, 9ème commande.'
        },
        buttons: {
            save: 'Enregistrer les paramètres',
            saving: 'Enregistrement...'
        },
        messages: {
            saveSuccess: 'Paramètres mis à jour avec succès !',
            saveError: 'Échec de la mise à jour des paramètres.'
        }
    },
    // Announcement Bar
    announcement: {
        title: 'Barre d\'annonce',
        subtitle: 'Gérez la barre de notification supérieure de votre boutique',
        loading: 'Chargement des paramètres...',
        hidePreview: 'Masquer l\'aperçu',
        showPreview: 'Afficher l\'aperçu',
        refresh: 'Actualiser',
        settingsTitle: 'Paramètres de la barre',
        livePreviewTitle: 'Aperçu en direct',
        enable: {
            title: 'Activer l\'annonce',
            description: 'Afficher ou masquer la barre d\'annonce sur la boutique'
        },
        text: {
            label: 'Texte de l\'annonce',
            placeholder: 'Entrez votre texte d\'annonce ici...',
            help: 'Vous pouvez utiliser des émojis ! 🎉'
        },
        background: {
            label: 'Style de fond',
            gradient: 'Dégradé (Rose/Violet)',
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
            label: 'Effet d\'animation',
            none: 'Aucun',
            pulse: 'Pulsation',
            bounce: 'Rebond'
        },
        onlineCounter: {
            title: 'Afficher le compteur de visiteurs',
            description: 'Afficher un compteur "X personnes regardent ceci" pour créer l\'urgence',
            online: '{count} personnes regardent les offres en ce moment',
            status: {
                shown: 'Affiché',
                hidden: 'Masqué'
            }
        },
        sticky: {
            title: 'Position collante (Sticky)',
            description: 'Garder la barre visible en haut lors du défilement',
            preview: {
                yes: 'Collant',
                no: 'Statique'
            }
        },
        buttons: {
            save: 'Enregistrer',
            saving: 'Enregistrement...'
        },
        preview: {
            title: 'Détails de l\'aperçu',
            status: 'Statut :',
            enabled: 'Activé',
            disabled: 'Désactivé',
            background: 'Fond :',
            animation: 'Animation :',
            onlineCounter: 'Compteur :',
            sticky: 'Collant :',
            clickToPreview: 'Cliquez sur "Afficher l\'aperçu" pour voir le résultat !'
        },
        messages: {
            loadError: 'Échec du chargement des paramètres',
            updateSuccess: 'Annonce mise à jour avec succès !',
            updateError: 'Échec de la mise à jour de l\'annonce'
        }
    },
    // Countdown Page
    countdownPage: {
        title: 'Paramètres du Compte à Rebours',
        messages: {
            saveSuccess: 'Paramètres du compte à rebours enregistrés avec succès !',
            saveError: 'Échec de l\'enregistrement des paramètres.'
        },
        buttons: {
            save: 'Enregistrer les paramètres',
            saving: 'Enregistrement...'
        },
        sections: {
            themes: {
                title: 'Thèmes de conception',
                label: 'Choisir un thème prédéfini',
                description: 'Sélectionnez un thème prédéfini pour styliser rapidement votre compte à rebours.',
                applyButton: 'Appliquer le thème sélectionné',
                selectedPreview: 'Aperçu du thème sélectionné :',
                presets: {
                    darkPremium: {
                        name: 'Sombre Premium',
                        description: 'Mode sombre élégant avec des accents dorés. Idéal pour les marques de luxe.',
                        preview: 'Fond bleu foncé, chiffres dorés, urgence rouge'
                    },
                    lightProfessional: {
                        name: 'Clair Professionnel',
                        description: 'Design blanc épuré avec des accents bleus professionnels. Bon pour les magasins généraux.',
                        preview: 'Fond blanc, bordure bleue, urgence rouge'
                    },
                    modernGradient: {
                        name: 'Dégradé Moderne',
                        description: 'Fond dégradé tendance. Haute visibilité et énergie.',
                        preview: 'Dégradé Bleu-Violet, Texte Blanc'
                    },
                    elegantMinimal: {
                        name: 'Élégant Minimal',
                        description: 'Subtil et discret. Se concentre sur le contenu.',
                        preview: 'Fond gris clair, typographie simple'
                    },
                    vibrantEnergy: {
                        name: 'Énergie Vibrante',
                        description: 'Couleurs à fort contraste pour créer une urgence maximale.',
                        preview: 'Fond Rouge/Corail Vif, Accents Jaunes'
                    }
                }
            },
            basic: {
                title: 'Paramètres de base',
                fields: {
                    title: {
                        label: 'Titre',
                        placeholder: 'ex. Vente Flash se termine dans...'
                    },
                    endDate: {
                        label: 'Date et heure de fin'
                    },
                    subtitle: {
                        label: 'Sous-titre',
                        placeholder: 'ex. Ne manquez pas ces offres !'
                    },
                    packName: {
                        label: 'Nom du Pack/Offre',
                        placeholder: 'ex. Pack Été'
                    },
                    urgentMessage: {
                        label: 'Message d\'urgence (< 1 heure)',
                        placeholder: 'ex. Vite ! Fin bientôt !'
                    },
                    expiredMessage: {
                        label: 'Message expiré',
                        placeholder: 'ex. Cette offre est terminée.'
                    },
                    enabled: {
                        label: 'Activer le compte à rebours'
                    }
                }
            },
            colors: {
                title: 'Couleurs personnalisées',
                fields: {
                    background: 'Couleur de fond',
                    text: 'Couleur du texte',
                    border: 'Couleur de la bordure',
                    timerBox: 'Couleur des boîtes',
                    timerText: 'Couleur des chiffres',
                    urgentBg: 'Fond Urgent',
                    urgentText: 'Texte Urgent'
                }
            },
            display: {
                title: 'Éléments d\'affichage',
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
                title: 'Animations',
                fields: {
                    pulse: 'Activer Effet Pulsation',
                    bounce: 'Activer Effet Rebond',
                    threshold: 'Seuil d\'urgence (secondes)'
                }
            },
            layout: {
                title: 'Mise en page et taille',
                fields: {
                    borderRadius: 'Rayon de bordure (px)',
                    padding: 'Rembourrage (px)',
                    fontSize: 'Taille de police (px)',
                    timerFontSize: 'Taille police minuterie (px)'
                }
            }
        }
    },
    // Admin Products Page
    products: {
        title: 'Produits',
        subtitle: 'Gérez votre catalogue de produits',
        shortcuts: {
            newProduct: 'Nouveau Produit',
            search: 'Rechercher',
            closeModal: 'Fermer'
        },
        refresh: 'Actualiser',
        exportCSV: 'Exporter CSV',
        addNewProduct: 'Ajouter un Produit',
        errors: {
            fetchFailed: 'Échec du chargement des produits',
            deleteFailed: 'Échec de la suppression du produit',
            noSelection: 'Aucun produit sélectionné',
            exportFailed: 'Échec de l\'exportation CSV'
        },
        success: {
            deleted: 'Produit supprimé avec succès',
            bulkDeleted: '{count} produits supprimés avec succès',
            exported: 'Produits exportés avec succès'
        },
        bulkDeleteConfirm: 'Êtes-vous sûr de vouloir supprimer {count} produits ?',
        deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
        bulkDelete: 'Supprimer la sélection',
        selectAll: 'Tout sélectionner',
        noProducts: 'Aucun produit trouvé',
        noProductsDesc: 'Commencez par créer votre premier produit.',
        stockStatus: {
            inStock: 'En Stock'
        },
        featured: 'En Vedette',
        newArrival: 'Nouveau',
        category: 'Catégorie',
        quickEdit: 'Édition Rapide',
        edit: 'Modifier',
        analytics: {
            totalProducts: 'Total Produits',
            inStock: 'En Stock',
            lowStock: 'Stock Faible',
            outOfStock: 'Rupture de Stock',
            totalValue: 'Valeur Totale',
            avgPrice: 'Prix Moyen'
        },
        searchPlaceholder: 'Rechercher des produits...',
        allCategories: 'Toutes les Catégories',
        allStock: 'Tout le Stock',
        inStockFilter: 'En Stock',
        lowStockFilter: 'Stock Faible',
        outOfStockFilter: 'Rupture de Stock',
        allStatus: 'Tous les Statuts',
        activeStatus: 'Actif',
        disabledStatus: 'Désactivé',
        featuredStatus: 'En Vedette',
        newArrivalsStatus: 'Nouveaux Arrivages',
        sortByName: 'Nom',
        sortByPrice: 'Prix',
        sortByStock: 'Stock',
        sortByDate: 'Date',
        gridView: 'Vue Grille',
        listView: 'Vue Liste',
        clearFilters: 'Effacer les filtres',
        selectedCount: 'sélectionné(s)',
        clearSelection: 'Effacer la sélection'
    },
    // Admin Categories Page
    categoriesPage: {
        title: 'Catégories',
        subtitle: 'Gérez les catégories de produits',
        header: {
            newCategory: 'Nouvelle Catégorie',
            search: 'Rechercher',
            refresh: 'Actualiser',
            addNew: 'Ajouter'
        },
        shortcuts: {
            clearSearch: 'Effacer la recherche'
        },
        stats: {
            totalCategories: 'Total Catégories',
            withProducts: 'Avec Produits',
            emptyCategories: 'Vides',
            totalProducts: 'Total Produits'
        },
        search: {
            placeholder: 'Rechercher des catégories...',
            sortName: 'Nom',
            sortProducts: 'Nombre de Produits',
            title: 'Vue Grille',
            listView: 'Vue Liste',
            clear: 'Effacer'
        },
        list: {
            title: 'Catégories ({count})',
            refresh: 'Actualiser',
            noCategoriesFound: 'Aucune catégorie trouvée',
            noCategoriesAvailable: 'Aucune catégorie disponible',
            tryAdjusting: 'Essayez d\'ajuster vos termes de recherche',
            startCreating: 'Commencez par créer votre première catégorie',
            createFirst: 'Créer une Catégorie',
            noImage: 'Aucune Image',
            empty: 'Vide',
            productCount: '{count} Produits',
            id: 'ID: {id}',
            edit: 'Modifier',
            delete: 'Supprimer'
        },
        card: {
            products: 'Produits'
        },
        confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette catégorie ?',
        messages: {
            fetchFailed: 'Échec du chargement des catégories',
            deleteSuccess: 'Catégorie supprimée avec succès',
            deleteFailed: 'Échec de la suppression de la catégorie'
        }
    },
    // Admin Product Form
    // Admin Product Form (Consolidated)
    productForm: {
        title: {
            create: 'Créer un Nouveau Produit',
            edit: 'Modifier le Produit'
        },
        subtitle: {
            create: 'Ajouter un nouveau produit à votre catalogue',
            edit: 'Mettre à jour les détails du produit existant'
        },
        loading: 'Chargement des données du produit...',
        actions: {
            saving: 'Enregistrement...',
            create: 'Créer le Produit',
            update: 'Mettre à jour le Produit',
            save: 'Enregistrer',
            backToProducts: 'Retour aux produits'
        },
        basicInfo: {
            title: 'Informations de Base',
            productName: 'Nom du Produit',
            productNamePlaceholder: 'ex: Rouge à Lèvres Premium',
            brand: 'Marque',
            brandPlaceholder: 'ex: L\'Oréal',
            price: 'Prix',
            pricePlaceholder: '0.00',
            stockQuantity: 'Quantité en Stock',
            stockPlaceholder: '0',
            category: 'Catégorie',
            categoryPlaceholder: 'Sélectionner une Catégorie',
            type: 'Type',
            typeMen: 'Hommes',
            typeWomen: 'Femmes',
            typeBoth: 'Unisexe',
            bestseller: 'Meilleure Vente',
            newArrival: 'Nouvel Arrivage',
            hasVariants: 'A des Variantes',
            isPackable: 'Est Packable'
        },
        description: {
            title: 'Description',
            label: 'Description du Produit'
        },
        images: {
            title: 'Images du Produit',
            upload: 'Télécharger des Images',
            existingImages: 'Images Existantes',
            newImages: 'Nouvelles Images',
            preview: 'Aperçu',
            existing: 'Existante',
            removeImage: "Supprimer l'image"
        },
        variantTypes: {
            title: 'Types de Variantes',
            typeName: 'Nom du Type',
            typeNamePlaceholder: 'ex: Couleur, Taille',
            options: 'Options',
            optionValue: 'Valeur',
            color: 'Couleur',
            image: 'Image',
            removeOption: 'Supprimer l\'option'
        },
        displaySettings: {
            title: 'Paramètres d\'affichage',
            purchaseNotifications: {
                title: 'Notifications d\'achat',
                description: 'Afficher les notifications "Quelqu\'un a acheté..."',
                enabled: 'Activé'
            },
            countdownTimer: {
                title: 'Compte à rebours',
                description: 'Afficher le compte à rebours d\'urgence',
                enabled: 'Activé'
            }
        },
        frequentlyBought: {
            title: 'Produits fréquemment achetés ensemble',
            label: 'Sélectionner les produits',
            placeholder: 'Rechercher des produits...'
        }
    },
    validation: {
        nameRequired: 'Le nom du produit est requis',
        priceRequired: 'Le prix est requis',
        categoryRequired: 'La catégorie est requise',
        variantPricesRequired: 'Toutes les variantes doivent avoir un prix valide'
    },
    success: {
        created: 'Produit créé avec succès',
        updated: 'Produit mis à jour avec succès'
    },
    errors: {
        categoriesFailed: 'Échec du chargement des catégories',
        loadFailed: 'Échec du chargement des détails du produit',
        saveFailed: 'Échec de l\'enregistrement du produit'
    }
    ,
    // Admin Users Page
    usersPage: {
        title: 'Gestion des Utilisateurs',
        messages: {
            fetchFailed: 'Échec du chargement des utilisateurs',
            roleUpdated: 'Rôle mis à jour en {role}',
            roleUpdateFailed: 'Échec de la mise à jour du rôle utilisateur',
            deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
            deleteSuccess: 'Utilisateur supprimé avec succès',
            deleteFailed: 'Échec de la suppression de l\'utilisateur'
        },
        rolesModal: {
            title: 'Gérer les Rôles',
            error: 'Erreur lors du chargement des rôles',
            success: 'Rôles assignés avec succès',
            description: 'Assignez des rôles pour contrôler l\'accès des utilisateurs.',
            permissions: '{count} permissions',
            cancel: 'Annuler',
            save: 'Enregistrer les Rôles'
        },
        permissionsModal: {
            title: 'Permissions Utilisateur',
            viewTitle: 'Voir les Permissions',
            description: 'L\'utilisateur a <strong>{count}</strong> permissions basées sur ses rôles.'
        },
        table: {
            userId: 'ID Utilisateur',
            name: 'Nom',
            email: 'Email',
            legacyRole: 'Rôle Hérité',
            rbacRoles: 'Rôles RBAC',
            emailConfirmed: 'Vérifié',
            actions: 'Actions',
            manage: 'Gérer',
            yes: 'Oui',
            no: 'Non'
        }
    },
    // Admin Category Form

    // Admin Roles Page
    rolesPage: {
        title: 'Rôles et Permissions',
        subtitle: 'Gérer les rôles des utilisateurs et les droits d\'accès',
        createButton: 'Créer un Nouveau Rôle',
        createRole: 'Créer un Rôle',
        editRole: 'Modifier le Rôle',
        roleName: 'Nom du Rôle',
        roleNamePlaceholder: 'ex: Gestionnaire de Contenu',
        roleNameHelp: 'Utilisez un nom descriptif pour le rôle',
        description: 'Description',
        descriptionPlaceholder: 'Décrivez à quoi sert ce rôle',
        permissions: 'Permissions',
        selectAll: 'Tout Sélectionner',
        assignPermissions: 'Assigner des Permissions ({count})',
        cancel: 'Annuler',
        save: 'Enregistrer le Rôle',
        update: 'Mettre à jour le Rôle',
        table: {
            roleName: 'Nom du Rôle',
            usersCount: 'Utilisateurs',
            actions: 'Actions',
            edit: 'Modifier',
            delete: 'Supprimer'
        },
        messages: {
            loadFailed: 'Échec du chargement des rôles',
            createSuccess: 'Rôle créé avec succès',
            updateSuccess: 'Rôle mis à jour avec succès',
            deleteSuccess: 'Rôle supprimé avec succès',
            operationFailed: 'L\'opération a échoué',
            deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce rôle ?'
        },
        validation: {
            nameRequired: 'Le nom du rôle est requis'
        }
    },
    // Admin Analytics Page

    // Admin Custom Packs Page

    // Review Form Settings
    reviewFormSettingsPage: {
        title: 'Paramètres du Formulaire d\'Avis',
        subtitle: 'Configurer comment les clients laissent des avis',
        configTitle: 'Configuration Générale',
        showReviewForm: 'Afficher le Formulaire d\'Avis',
        showReviewFormDesc: 'Permettre aux clients de soumettre de nouveaux avis',
        preview: 'Aperçu',
        visibleMsg: 'Le formulaire d\'avis sera visible par les clients.',
        hiddenMsg: 'Le formulaire d\'avis est actuellement masqué pour les clients.',
        reset: 'Rétablir les Défauts',
        unsavedChanges: 'Vous avez des modifications non enregistrées',
        saving: 'Enregistrement...',
        save: 'Enregistrer les Modifications',
        quickInfo: 'Info Rapide',
        quickInfo1: 'Masquer le formulaire empêche de nouvelles soumissions.',
        quickInfo2: 'Les avis existants restent visibles.',
        quickInfo3: 'Utilisez ceci pour suspendre temporairement les avis.',
        currentStatus: 'Statut Actuel',
        enabled: 'Activé',
        disabled: 'Désactivé',
        messages: {
            loadFailed: 'Échec du chargement des paramètres',
            saveSuccess: 'Paramètres enregistrés avec succès',
            saveFailed: 'Échec de l\'enregistrement des paramètres'
        }
    },
    // Enhanced Visitor Counter
    enhancedVisitorCounter: {
        title: 'Gestion du Compteur de Visiteurs',
        subtitle: 'Contrôlez chaque aspect de l\'affichage de votre compteur de visiteurs',
        loading: 'Chargement des paramètres...',
        globalSettings: {
            title: 'Paramètres Globaux',
            enableSystem: 'Activer le Système de Compteur',
            customTitle: 'Titre Personnalisé',
            customTitlePlaceholder: 'Statistiques en Direct',
            animationSpeed: 'Vitesse d\'Animation (ms)'
        },
        metrics: {
            currentViewers: {
                title: 'Visiteurs Actuels',
                subtitle: 'Visionnent Maintenant',
                description: 'Nombre de personnes visionnant actuellement la page'
            },
            totalViews: {
                title: 'Vues Totales',
                subtitle: 'Total Vus',
                description: 'Nombre total de pages vues'
            },
            addedToday: {
                title: 'Ajoutés Aujourd\'hui',
                subtitle: 'Ajoutés Aujourd\'hui',
                description: 'Nombre d\'articles ajoutés aujourd\'hui'
            },
            activity: {
                title: 'Niveau d\'Activité',
                subtitle: 'Activité',
                description: 'Niveau actuel d\'activité des utilisateurs'
            },
            min: 'Valeur Min',
            max: 'Valeur Max',
            preview: 'Aperçu'
        },
        displaySettings: {
            title: 'Paramètres d\'Affichage',
            backgroundColor: 'Couleur de Fond',
            textColor: 'Couleur du Texte',
            borderColor: 'Couleur de Bordure'
        },
        actions: {
            save: 'Enregistrer Tous les Paramètres',
            saving: 'Enregistrement...',
            reset: 'Réinitialiser les Modifications'
        },
        messages: {
            loadFailed: 'Échec du chargement des paramètres du compteur',
            saveSuccess: 'Paramètres enregistrés avec succès',
            saveFailed: 'Échec de l\'enregistrement des paramètres',
            reset: 'Paramètres réinitialisés aux valeurs d\'origine',
            unsavedChanges: 'Vous avez des modifications non enregistrées'
        },
        validation: {
            currentViewersRange: 'Le Min des Visiteurs Actuels ne peut pas être supérieur au Max',
            totalViewsRange: 'Le Min des Vues Totales ne peut pas être supérieur au Max',
            addedTodayRange: 'Le Min des Ajoutés Aujourd\'hui ne peut pas être supérieur au Max',
            activityRange: 'Le Min du Niveau d\'Activité ne peut pas être supérieur au Max'
        },
        preview: {
            title: 'Aperçu en Direct',
            show: 'Afficher l\'Aperçu',
            hide: 'Masquer l\'Aperçu'
        }
    },
    // Notification Settings
    notificationSettings: {
        title: 'Paramètres de Notification en Direct',
        subtitle: 'Contrôlez les notifications d\'activité en direct affichées aux clients',
        loading: 'Chargement des paramètres...',
        unsavedChanges: 'Modifications Non Enregistrées',
        config: {
            title: 'Configuration',
            enable: 'Activer les Notifications en Direct',
            enableDesc: 'Afficher les notifications d\'activité en direct aux clients',
            maxNotifications: 'Notifications Maximum Affichées',
            maxNotificationsHelp: 'Nombre maximum de notifications à afficher par session',
            minInterval: 'Intervalle Min (secondes)',
            maxInterval: 'Intervalle Max (secondes)',
            duration: 'Durée (secondes)',
            types: {
                title: 'Types de Notification',
                purchase: 'Notifications d\'Achat',
                purchaseDesc: 'Afficher quand quelqu\'un achète un produit',
                viewing: 'Notifications de Visionnage',
                viewingDesc: 'Afficher combien de personnes regardent',
                cart: 'Notifications de Panier',
                cartDesc: 'Afficher quand quelqu\'un ajoute au panier'
            },
            position: {
                title: 'Position de la Notification',
                bottomLeft: 'Bas Gauche',
                bottomRight: 'Bas Droite',
                topLeft: 'Haut Gauche',
                topRight: 'Haut Droite'
            }
        },
        actions: {
            save: 'Enregistrer les Modifications',
            saving: 'Enregistrement...',
            reset: 'Réinitialiser'
        },
        messages: {
            loadFailed: 'Échec du chargement des paramètres de notification',
            saveSuccess: 'Paramètres enregistrés avec succès',
            saveFailed: 'Échec de l\'enregistrement des paramètres',
            reset: 'Paramètres réinitialisés au dernier état enregistré'
        },
        validation: {
            maxNotifications: 'Le nombre max de notifications doit être compris entre 1 et 20',
            minInterval: 'L\'intervalle min doit être compris entre 1 et 60 secondes',
            maxInterval: 'L\'intervalle max doit être compris entre 1 et 60 secondes',
            intervalRange: 'L\'intervalle min ne peut pas être supérieur à l\'intervalle max',
            duration: 'La durée doit être comprise entre 1 et 60 secondes'
        },
        preview: {
            title: 'Aperçu en Direct',
            liveActivity: 'Activité en Direct',
            someoneBought: 'Quelqu\'un au Maroc vient d\'acheter',
            currentSettings: 'Résumé des Paramètres Actuels',
            status: 'Statut',
            enabled: 'Actif',
            disabled: 'Désactivé',
            typesEnabled: 'Types Activés'
        }
    },
    // Common
    common: {
        save: 'Enregistrer',
        saving: 'Enregistrement...',
        cancel: 'Annuler',
        back: 'Retour',
        edit: 'Modifier',
        delete: 'Supprimer',
        create: 'Créer',
        update: 'Mettre à jour',
        actions: 'Actions',
        error: 'Erreur :',
        success: 'Succès :',
        unsavedChanges: 'Modifications non enregistrées',
        optional: '(Optionnel)',
        loading: 'Chargement...'
    }
};
