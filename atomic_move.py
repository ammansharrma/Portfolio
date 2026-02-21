import os

src = r"c:\Users\ASUS\Desktop\Personal\projects\Personal Portfolio\Portfolio\src\assets\Mockups"
dst = r"c:\Users\ASUS\Desktop\Personal\projects\Personal Portfolio\Portfolio\public\Mockups"

try:
    if os.path.exists(dst):
        import shutil
        shutil.rmtree(dst)
    os.rename(src, dst)
    print("Successfully moved directory")
except Exception as e:
    print(f"Error: {e}")
