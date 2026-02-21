import os
import shutil

src = r"c:\Users\ASUS\Desktop\Personal\projects\Personal Portfolio\Portfolio\src\assets\Mockups"
dst = r"c:\Users\ASUS\Desktop\Personal\projects\Personal Portfolio\Portfolio\public\Mockups"

def move_recursively(s, d):
    if not os.path.exists(d):
        os.makedirs(d)
    for item in os.listdir(s):
        s_path = os.path.join(s, item)
        d_path = os.path.join(d, item)
        if os.path.isdir(s_path):
            move_recursively(s_path, d_path)
        else:
            if os.path.exists(d_path):
                os.remove(d_path)
            shutil.copy2(s_path, d_path)
            print(f"Moved {s_path} to {d_path}")

if os.path.exists(src):
    move_recursively(src, dst)
    print("Move finished")
else:
    print("Src not found")
