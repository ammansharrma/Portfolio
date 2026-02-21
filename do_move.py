import os
import shutil

src_root = r"c:\Users\ASUS\Desktop\Personal\projects\Personal Portfolio\Portfolio\src\assets\Mockups"
dst_root = r"c:\Users\ASUS\Desktop\Personal\projects\Personal Portfolio\Portfolio\public\Mockups"

print(f"Source exists: {os.path.exists(src_root)}")
print(f"Dest exists: {os.path.exists(dst_root)}")

for item in os.listdir(src_root):
    s = os.path.join(src_root, item)
    d = os.path.join(dst_root, item)
    if os.path.isdir(s):
        print(f"Copying dir {item}...")
        if os.path.exists(d):
            shutil.rmtree(d)
        shutil.copytree(s, d)
    else:
        print(f"Copying file {item}...")
        shutil.copy2(s, d)

print("Contents of dest after copy:")
print(os.listdir(dst_root))
