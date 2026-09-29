import os
import glob
import shutil

# Rename directories
if os.path.exists('app'):
    os.rename('app', 'backend')
    print("Renamed 'app' to 'backend'")

if os.path.exists('expense_tracker_frontend'):
    os.rename('expense_tracker_frontend', 'frontend')
    print("Renamed 'expense_tracker_frontend' to 'frontend'")

# Update imports
def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace('from app.', 'from backend.').replace('from app ', 'from backend ').replace('import app.', 'import backend.')
    
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated imports in {filepath}")

if os.path.exists('backend'):
    for root, _, files in os.walk('backend'):
        for f in files:
            if f.endswith('.py'):
                process_file(os.path.join(root, f))
