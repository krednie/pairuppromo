import os
from PIL import Image

def setup_directories():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dirs = [
        os.path.join(base_dir, "portraits"),
        os.path.join(base_dir, "portraits", "masters"),
        os.path.join(base_dir, "svgs"),
    ]
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        print(f"Directory verified: {d}")

def convert_png_to_webp(filename):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    src_path = os.path.join(base_dir, "portraits", "masters", filename + ".png")
    dest_path = os.path.join(base_dir, "portraits", filename + ".webp")
    
    if not os.path.exists(src_path):
        print(f"Error: Source file does not exist: {src_path}")
        return False
        
    try:
        with Image.open(src_path) as img:
            # Check dimensions, if we need to resize to 1024x1024 as specified
            if img.size != (1024, 1024):
                img = img.resize((1024, 1024), Image.Resampling.LANCZOS)
            
            img.save(dest_path, "WEBP", quality=85)
            print(f"Converted {src_path} -> {dest_path} (quality 85)")
            return True
    except Exception as e:
        print(f"Error converting {filename}: {e}")
        return False

if __name__ == "__main__":
    setup_directories()
