import os
import glob

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace('indigo-', 'cyan-')
    new_content = new_content.replace('text-indigo-', 'text-cyan-')
    new_content = new_content.replace('bg-indigo-', 'bg-cyan-')
    new_content = new_content.replace('border-indigo-', 'border-cyan-')
    new_content = new_content.replace('from-indigo-', 'from-cyan-')
    new_content = new_content.replace('via-indigo-', 'via-cyan-')
    new_content = new_content.replace('to-indigo-', 'to-cyan-')
    
    new_content = new_content.replace('Smart Student Success Agent', 'EduInsight AI')
    new_content = new_content.replace('Smart Student', 'EduInsight')
    new_content = new_content.replace('Success Agent', 'AI')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
            replace_in_file(os.path.join(root, file))

print("Theme update complete!")
