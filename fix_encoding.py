
import os

def fix_file(file_path, replacements):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        new_lines = []
        modified_count = 0
        
        for line in lines:
            replaced = False
            for target_text, replacement_line in replacements.items():
                if target_text in line and "title:" in line:
                    # Preserve indentation
                    indent = line[:line.find("title:")]
                    new_lines.append(indent + replacement_line + "\n")
                    modified_count += 1
                    replaced = True
                    break
            
            if not replaced:
                new_lines.append(line)
                
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
            
        print(f"Fixed {modified_count} lines in {file_path}")
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    # French replacements
    fr_replacements = {
        "Afficher les notifications d'achat": "title: '🛒 Afficher les notifications d\\'achat',",
        "Afficher le compte à rebours": "title: '⏱️ Afficher le compte à rebours',"
    }
    fix_file("frontend/src/translations/fr.js", fr_replacements)

    # English replacements
    en_replacements = {
        "Show Purchase Notifications": "title: '🛒 Show Purchase Notifications',",
        "Show Countdown Timer": "title: '⏱️ Show Countdown Timer',"
    }
    fix_file("frontend/src/translations/en.js", en_replacements)
