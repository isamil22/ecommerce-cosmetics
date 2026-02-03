#!/usr/bin/env python3
"""
Automatic Admin Page Translation Tool
Extracts strings from JSX files and generates French translations automatically
"""

import re
import json
import sys
from pathlib import Path
from googletrans import Translator

class AdminPageTranslator:
    def __init__(self, jsx_file_path):
        self.jsx_file = Path(jsx_file_path)
        self.translator = Translator()
        self.strings_found = []
        self.translation_keys = {}
        
    def extract_strings(self):
        """Extract all hardcoded strings from JSX file"""
        with open(self.jsx_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all strings in single quotes
        single_quotes = re.findall(r"'([^']{3,})'", content)
        # Find all strings in double quotes  
        double_quotes = re.findall(r'"([^"]{3,})"', content)
        
        # Combine and filter
        all_strings = single_quotes + double_quotes
        
        # Filter out code-like strings
        filtered = []
        for s in all_strings:
            # Skip if contains code patterns
            if any(x in s for x in ['className', 'onClick', 'onChange', 'http', 'www', '.jsx', '.js', '()', '=>', 'const', 'let', 'var']):
                continue
            # Skip very short strings
            if len(s) < 3:
                continue
            # Skip if all uppercase (likely constants)
            if s.isupper():
                continue
            filtered.append(s)
        
        # Remove duplicates while preserving order
        seen = set()
        self.strings_found = [x for x in filtered if not (x in seen or seen.add(x))]
        
        return self.strings_found
    
    def generate_translation_key(self, text, section="general"):
        """Generate a translation key from text"""
        # Remove special characters and convert to camelCase
        key = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        key = key.strip().lower()
        words = key.split()
        if not words:
            return "unknown"
        key = words[0] + ''.join(w.capitalize() for w in words[1:])
        return f"{section}.{key}"
    
    def translate_to_french(self, text):
        """Translate text to French using Google Translate"""
        try:
            result = self.translator.translate(text, src='en', dest='fr')
            return result.text
        except Exception as e:
            print(f"Translation error for '{text}': {e}")
            return text
    
    def create_translations(self, page_name):
        """Create translation objects for fr.js and en.js"""
        fr_translations = {}
        en_translations = {}
        
        print(f"\n🔍 Found {len(self.strings_found)} strings to translate...")
        print("🌍 Translating to French...\n")
        
        for i, text in enumerate(self.strings_found, 1):
            # Generate key
            key = self.generate_translation_key(text, page_name)
            
            # Translate to French
            french = self.translate_to_french(text)
            
            # Store
            en_translations[key] = text
            fr_translations[key] = french
            
            print(f"  [{i}/{len(self.strings_found)}] '{text}' → '{french}'")
        
        return en_translations, fr_translations
    
    def format_js_object(self, translations, page_name):
        """Format translations as JavaScript object"""
        lines = [f"    // {page_name.title()} Page", f"    {page_name}: {{"]
        
        for key, value in translations.items():
            # Escape single quotes in value
            escaped_value = value.replace("'", "\\'")
            simple_key = key.split('.')[-1]
            lines.append(f"        {simple_key}: '{escaped_value}',")
        
        lines.append("    }")
        return '\n'.join(lines)
    
    def update_jsx_file(self, page_name):
        """Update JSX file to use translation function"""
        with open(self.jsx_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Add import if not present
        if "useLanguage" not in content:
            import_line = "import { useLanguage } from '../../contexts/LanguageContext';"
            # Find last import
            imports = re.findall(r"import .+ from .+;", content)
            if imports:
                last_import = imports[-1]
                content = content.replace(last_import, f"{last_import}\n{import_line}")
        
        # Add translation function if not present
        if "const { t } = useLanguage();" not in content:
            # Find component function
            component_match = re.search(r'const \w+ = \(\) => \{', content)
            if component_match:
                insert_pos = component_match.end()
                content = content[:insert_pos] + "\n    const { t } = useLanguage();" + content[insert_pos:]
        
        # Replace strings with translation calls
        for text in self.strings_found:
            key = self.generate_translation_key(text, page_name)
            simple_key = key.split('.')[-1]
            
            # Replace in various contexts
            patterns = [
                (f"'{text}'", f"t('{page_name}.{simple_key}')"),
                (f'"{text}"', f"t('{page_name}.{simple_key}')"),
            ]
            
            for old, new in patterns:
                content = content.replace(old, new)
        
        # Save updated file
        backup_file = self.jsx_file.with_suffix('.jsx.backup')
        with open(backup_file, 'w', encoding='utf-8') as f:
            f.write(open(self.jsx_file, 'r', encoding='utf-8').read())
        
        with open(self.jsx_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"\n✅ Updated {self.jsx_file.name}")
        print(f"📦 Backup saved to {backup_file.name}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python auto_translate.py <jsx_file_path> [page_name]")
        print("Example: python auto_translate.py frontend/src/pages/admin/AdminDashboard.jsx dashboard")
        sys.exit(1)
    
    jsx_file = sys.argv[1]
    page_name = sys.argv[2] if len(sys.argv) > 2 else Path(jsx_file).stem.replace('Admin', '').lower()
    
    print(f"\n🚀 Auto-Translation Tool")
    print(f"📄 File: {jsx_file}")
    print(f"🏷️  Page: {page_name}")
    print("=" * 60)
    
    translator = AdminPageTranslator(jsx_file)
    
    # Extract strings
    strings = translator.extract_strings()
    
    if not strings:
        print("❌ No strings found to translate!")
        sys.exit(1)
    
    # Create translations
    en_trans, fr_trans = translator.create_translations(page_name)
    
    # Format for JS files
    print("\n📝 Generating translation objects...")
    en_js = translator.format_js_object(en_trans, page_name)
    fr_js = translator.format_js_object(fr_trans, page_name)
    
    # Save to files
    output_dir = Path("translation_output")
    output_dir.mkdir(exist_ok=True)
    
    with open(output_dir / f"{page_name}_en.txt", 'w', encoding='utf-8') as f:
        f.write(en_js)
    
    with open(output_dir / f"{page_name}_fr.txt", 'w', encoding='utf-8') as f:
        f.write(fr_js)
    
    print(f"\n✅ Translation files created:")
    print(f"   - {output_dir}/{page_name}_en.txt")
    print(f"   - {output_dir}/{page_name}_fr.txt")
    
    # Update JSX file
    update = input("\n❓ Update JSX file with translations? (y/n): ")
    if update.lower() == 'y':
        translator.update_jsx_file(page_name)
    
    print("\n✨ Done! Copy the translation objects to fr.js and en.js")
    print("=" * 60)


if __name__ == "__main__":
    main()
