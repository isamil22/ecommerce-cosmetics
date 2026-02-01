"""
Script to convert admin pages from translation system to hardcoded French text.
This removes useLanguage imports and replaces all {t('key')} calls with French strings.
"""

import re
import os

# French translations mapping
TRANSLATIONS = {
    # AdminHeroPage
    'manageHeroSection': 'Gérer la Section Héros',
    'heroSectionCustomize': 'Personnalisez votre section héros de page d\'accueil',
    'clearMessages': 'Effacer les Messages',
    'success': 'Succès',
    'error': 'Erreur',
    'heroSectionSettings': 'Paramètres de la Section Héros',
    'content': 'Contenu',
    'heroTitle': 'Titre Héros',
    'color': 'Couleur',
    'heroSubtitle': 'Sous-titre Héros',
    'callToAction': 'Appel à l\'Action',
    'buttonText': 'Texte du Bouton',
    'buttonUrl': 'URL du Bouton',
    'btnColor': 'Couleur du Bouton',
    'textColor': 'Couleur du Texte',
    'backgroundImages': 'Images d\'Arrière-plan',
    'desktopBackground': 'Arrière-plan Bureau',
    'imageUpload': 'Télécharger une Image',
    'mobileBackground': 'Arrière-plan Mobile',
    'updating': 'Mise à jour...',
    'updateHeroSection': 'Mettre à Jour la Section Héros',
    'livePreview': 'Aperçu en Direct',
    'desktopMode': 'Aperçu Bureau',
    'previewInformation': 'Informations d\'Aperçu',
    'previewInfoDesc': 'Cet aperçu montre comment votre section héros apparaîtra sur les appareils de bureau.',
    
    # Common
    'loadingSettings': 'Chargement des paramètres...',
    'saving': 'Enregistrement...',
    'saveSettings': 'Enregistrer les Paramètres',
    'reset': 'Réinitialiser',
}

def remove_translation_import(content):
    """Remove useLanguage import line"""
    content = re.sub(
        r"import\s+\{\s*useLanguage\s*\}\s+from\s+['\"].*?LanguageContext['\"];?\s*\n",
        "// Translation system removed - using hardcoded French text\n",
        content
    )
    return content

def comment_out_use_language(content):
    """Comment out const { t } = useLanguage();"""
    content = re.sub(
        r"const\s+\{\s*t\s*\}\s*=\s*useLanguage\(\);",
        "// const { t } = useLanguage(); // Removed to avoid build errors",
        content
    )
    return content

def replace_translation_calls(content):
    """Replace {t('key')} with French text"""
    # Pattern: {t('key')} or {t("key")}
    pattern = r"\{t\(['\"]([^'\"]+)['\"]\)(?:\s*\|\|\s*['\"]([^'\"]*)['\"])?\}"
    
    def replacer(match):
        key = match.group(1)
        fallback = match.group(2) if match.group(2) else None
        french = TRANSLATIONS.get(key, fallback or key)
        return french
    
    content = re.sub(pattern, replacer, content)
    
    # Pattern: t('key') in JSX attributes
    pattern2 = r"t\(['\"]([^'\"]+)['\"]\)"
    
    def replacer2(match):
        key = match.group(1)
        french = TRANSLATIONS.get(key, key)
        return f'"{french}"'
    
    content = re.sub(pattern2, replacer2, content)
    
    return content

def convert_file(filepath):
    """Convert a single file"""
    print(f"Converting {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Apply transformations
    content = remove_translation_import(content)
    content = comment_out_use_language(content)
    content = replace_translation_calls(content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Converted {filepath}")

# Convert AdminHeroPage
base_path = r"c:\Users\Hi\Downloads\Project Cosmetics Ayoub\ecommerce-basic - Copy\frontend\src\pages\admin"
convert_file(os.path.join(base_path, "AdminHeroPage.jsx"))

print("\n✅ Conversion complete!")
