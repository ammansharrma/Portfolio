import shutil
import os

src = r"c:\Users\ASUS\Desktop\Personal\projects\Personal Portfolio\Portfolio\src\assets\Mockups"
dst = r"c:\Users\ASUS\Desktop\Personal\projects\Personal Portfolio\Portfolio\public\Mockups"
log = r"c:\Users\ASUS\Desktop\Personal\projects\Personal Portfolio\Portfolio\copy_log.txt"

with open(log, 'w') as f:
    f.write(f"Source exists: {os.path.exists(src)}\n")
    if os.path.exists(src):
        if os.path.exists(dst):
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
        f.write(f"Copy tree complete. Dest exists: {os.path.exists(dst)}\n")
        if os.path.exists(dst):
            f.write(f"Contents of {dst}:\n")
            f.write(str(os.listdir(dst)) + "\n")
    else:
        f.write("Source not found\n")
