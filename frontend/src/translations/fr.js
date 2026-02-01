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
    }
};

