
import sys

def find_occurrences(file_path, search_terms):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        for term in search_terms:
            print(f"Searching for '{term}':")
            count = 0
            for i, line in enumerate(lines):
                if term in line:
                    print(f"  Line {i+1}: {line.strip()}")
                    count += 1
            print(f"  Total found: {count}")
            print("-" * 20)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    files = ["frontend/src/translations/fr.js", "frontend/src/translations/en.js"]
    search_terms = ["productForm:", "variantTypes:"]
    for file_path in files:
        print(f"Checking {file_path}...")
        find_occurrences(file_path, search_terms)
