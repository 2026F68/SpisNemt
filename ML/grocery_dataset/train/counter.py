import os

def count_in_directory(target_path):
    """Counts all files and sub-folders within a specific path."""
    count = 0
    for root, dirs, files in os.walk(target_path):
        count += len(dirs) + len(files)
    return count

def main():
    # Get the directory where the script is run
    base_dir = os.getcwd()
    print(f"Directory Report for: {base_dir}\n")

    # List everything in the current directory
    try:
        items = os.listdir(base_dir)
    except PermissionError:
        print("Permission denied to read this directory.")
        return

    for item in sorted(items):
        item_path = os.path.join(base_dir, item)
        
        # Only process if the item is a directory
        if os.path.isdir(item_path):
            total_elements = count_in_directory(item_path)
            print(f"{item}: {total_elements}")

if __name__ == "__main__":
    main()