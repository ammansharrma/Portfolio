import shutil
import os

src = r"c:\Users\ASUS\Desktop\Personal\projects\Personal Portfolio\Portfolio\src\assets\Mockups"
dst = r"c:\Users\ASUS\Desktop\Personal\projects\Personal Portfolio\Portfolio\public\Mockups"

if os.path.exists(src):
    for root, dirs, files in os.walk(src):
        relative_path = os.path.relpath(root, src)
        dest_path = os.path.join(dst, relative_path)
        
        if not os.path.exists(dest_path):
            os.makedirs(dest_path)
            
        for file in files:
            shutil.copy2(os.path.join(root, file), os.path.join(dest_path, file))
            print(f"Copied {os.path.join(relative_path, file)}")
    
    # Optionally remove src after confirming copy
    # shutil.rmtree(src)
    print("Copy completed.")
else:
    print("Source directory does not exist.")
