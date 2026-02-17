
import sys
import os

def parse_ranges(ranges_args):
    ranges = []
    for r in ranges_args:
        try:
            start, end = map(int, r.split('-'))
            ranges.append((start, end))
        except ValueError:
            print(f"Invalid range: {r}")
            sys.exit(1)
    # Sort reverse to safely delete from bottom up
    ranges.sort(key=lambda x: x[0], reverse=True)
    return ranges

def main():
    if len(sys.argv) < 4:
        print("Usage: python manage_lines.py <preview|delete> <file_path> <start-end> [start-end ...]")
        sys.exit(1)

    mode = sys.argv[1]
    file_path = sys.argv[2]
    ranges = parse_ranges(sys.argv[3:])

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Error reading file: {e}")
        sys.exit(1)

    if mode == 'preview':
        print(f"Previewing lines to delete from {file_path}:")
        for start, end in ranges:
            print(f"--- Range {start}-{end} ---")
            # Adjust for 0-based indexing
            # start-1 to end (inclusive of end line)
            segment = lines[start-1:end]
            for i, line in enumerate(segment):
                print(f"{start+i}: {line.strip()}")
            print("")
    
    elif mode == 'delete':
        new_lines = list(lines)
        for start, end in ranges:
            # Delete slice. start-1 is inclusive, end is exclusive in Python slice? 
            # No, if I want to delete lines 10 to 12 (10, 11, 12):
            # 0-indexed: 9, 10, 11.
            # lines[9:12]
            del new_lines[start-1:end]
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"Successfully deleted {len(lines) - len(new_lines)} lines from {file_path}")

if __name__ == "__main__":
    main()
