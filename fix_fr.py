
import os

def fix_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        new_lines = []
        modified_count = 0
        
        target = "Afficher les notifications d\\'achat"
        replacement = "                title: '🛒 Afficher les notifications d\\'achat',\n"
        
        for line in lines:
            if target in line:
                new_lines.append(replacement)
                modified_count += 1
            else:
                new_lines.append(line)
                
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
            
        print(f"Fixed {modified_count} lines in {file_path}")
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    fix_file("frontend/src/translations/fr.js")
