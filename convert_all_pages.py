"""
Comprehensive script to convert all remaining admin pages to hardcoded French.
"""

import re
import os

# Comprehensive French translations for all admin pages
TRANSLATIONS = {
    # Common
    'loadingSettings': 'Chargement des paramètres...',
    'saving': 'Enregistrement...',
    'saveSettings': 'Enregistrer les Paramètres',
    'save': 'Enregistrer',
    'reset': 'Réinitialiser',
    'success': 'Succès',
    'error': 'Erreur',
    'enabled': 'Activé',
    'disabled': 'Désactivé',
    'yes': 'Oui',
    'no': 'Non',
    'loading': 'Chargement...',
    
    # AdminCountdownPage
    'countdownSettings': 'Paramètres du Compte à Rebours',
    'countdownManagement': 'Gestion du Compte à Rebours',
    'enableCountdown': 'Activer le Compte à Rebours',
    'countdownTitle': 'Titre du Compte à Rebours',
    'endDate': 'Date de Fin',
    'backgroundColor': 'Couleur de Fond',
    'textColor': 'Couleur du Texte',
    'showOnHomepage': 'Afficher sur la Page d\'Accueil',
    
    # EnhancedVisitorCounterSettingsPage
    'visitorCounterSettings': 'Paramètres du Compteur de Visiteurs',
    'enableVisitorCounter': 'Activer le Compteur de Visiteurs',
    'currentViewers': 'Visiteurs Actuels',
    'totalViews': 'Vues Totales',
    'addedToday': 'Ajoutés Aujourd\'hui',
    'customTitle': 'Titre Personnalisé',
    
    # AdminRolesPage
    'roleManagement': 'Gestion des Rôles',
    'createRole': 'Créer un Rôle',
    'editRole': 'Modifier le Rôle',
    'deleteRole': 'Supprimer le Rôle',
    'roleName': 'Nom du Rôle',
    'roleDescription': 'Description du Rôle',
    'permissions': 'Permissions',
    'selectPermissions': 'Sélectionner les Permissions',
    
    # AdminPermissionsPage
    'permissionManagement': 'Gestion des Permissions',
    'createPermission': 'Créer une Permission',
    'editPermission': 'Modifier la Permission',
    'deletePermission': 'Supprimer la Permission',
    'permissionName': 'Nom de la Permission',
    'resource': 'Ressource',
    'action': 'Action',
    
    # AdminAnalyticsPage
    'analyticsSettings': 'Paramètres d\'Analytique',
    'analyticsDashboard': 'Tableau de Bord Analytique',
    'totalRevenue': 'Revenu Total',
    'totalOrders': 'Total des Commandes',
    'totalUsers': 'Total des Utilisateurs',
    'conversionRate': 'Taux de Conversion',
    'revenueOverTime': 'Revenu au Fil du Temps',
    'topProducts': 'Meilleurs Produits',
}

def convert_file_to_french(filepath):
    """Convert a file to hardcoded French"""
    print(f"Converting {os.path.basename(filepath)}...")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove useLanguage import
        content = re.sub(
            r"import\s+\{\s*useLanguage\s*\}\s+from\s+['\"].*?LanguageContext['\"];?\s*\n",
            "// Translation system removed - using hardcoded French text\n",
            content
        )
        
        # Comment out const { t } = useLanguage();
        content = re.sub(
            r"const\s+\{\s*t\s*\}\s*=\s*useLanguage\(\);",
            "// const { t } = useLanguage(); // Removed",
            content
        )
        
        # Pattern: t('key') - Global replacement
        # We replace t('key') with "French String" (quoted)
        # This works for:
        # <div>{t('key')}</div> -> <div>{"French String"}</div> (Valid JSX, renders string)
        # placeholder={t('key')} -> placeholder={"French String"} (Valid JSX)
        # placeholder={t('key') || 'fallback'} -> placeholder={"French String" || 'fallback'} (Valid)
        
        def replacer(match):
            key = match.group(1)
            # Get translation or Title Case key
            french = TRANSLATIONS.get(key, key.replace('_', ' ').title())
            # Return quoted string (handle escapes if needed, minimal here)
            # Using double quotes for the string
            safe_french = french.replace('"', '\\"')
            return f'"{safe_french}"'
        
        pattern = r"t\(['\"]([^'\"]+)['\"]\)"
        content = re.sub(pattern, replacer, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Converted {os.path.basename(filepath)}")
        return True
    except Exception as e:
        print(f"✗ Error converting {os.path.basename(filepath)}: {e}")
        return False

# Convert all admin pages
base_path = r"c:\Users\Hi\Downloads\Project Cosmetics Ayoub\ecommerce-basic - Copy\frontend\src\pages\admin"

files_to_convert = [
    "AdminAnnouncementPage.jsx",
    "AdminHeroPage.jsx",
    "AdminCountdownPage.jsx",
    "EnhancedVisitorCounterSettingsPage.jsx",
    "AdminRolesPage.jsx",
    "AdminPermissionsPage.jsx",
    "AdminAnalyticsPage.jsx",
]

print("Converting remaining admin pages to French...\n")
success_count = 0

for filename in files_to_convert:
    filepath = os.path.join(base_path, filename)
    if os.path.exists(filepath):
        if convert_file_to_french(filepath):
            success_count += 1
    else:
        print(f"✗ File not found: {filename}")

print(f"\n✅ Conversion complete! {success_count}/{len(files_to_convert)} files converted successfully.")
