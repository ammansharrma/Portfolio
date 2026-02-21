import shutil
import os

def copy_mockups():
    base_src = r"c:\Users\ASUS\Desktop\Kiro test\src\assets\Mockups"
    base_dst = r"c:\Users\ASUS\Desktop\Kiro test\public\images"
    
    mapping = {
        "vidhaanai": "vidhaanai",
        "product_designer": "product_designer",
        "ratna": "ratna"
    }
    
    for src_dir, dst_dir in mapping.items():
        src_path = os.path.join(base_src, src_dir)
        dst_path = os.path.join(base_dst, dst_dir)
        
        if not os.path.exists(dst_path):
            os.makedirs(dst_path)
            
        if os.path.exists(src_path):
            for file in os.listdir(src_path):
                if file.endswith(".png"):
                    shutil.copy2(os.path.join(src_path, file), os.path.join(dst_path, file))
                    print(f"Copied {file} to {dst_dir}")

if __name__ == "__main__":
    copy_mockups()
