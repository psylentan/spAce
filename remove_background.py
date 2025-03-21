from PIL import Image
import numpy as np

def remove_background(input_path, output_path):
    # Open the image
    img = Image.open(input_path)
    
    # Convert to RGBA if not already
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Convert to numpy array
    data = np.array(img)
    
    # Create alpha mask (light background becomes transparent)
    # More aggressive threshold for white/light gray removal
    r, g, b, a = data.T
    light_areas = (r > 220) & (g > 220) & (b > 220)
    data[..., 3] = 255
    data[..., 3][light_areas.T] = 0
    
    # Convert back to PIL Image
    result = Image.fromarray(data)
    
    # Calculate new size while maintaining aspect ratio
    target_height = 256  # Larger initial size for better quality
    aspect_ratio = result.width / result.height
    target_width = int(target_height * aspect_ratio)
    
    # Resize with high-quality settings
    result = result.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Save with maximum quality
    result.save(output_path, 'PNG', optimize=False, quality=100)
    print(f'Background removed and saved to {output_path}')
    return output_path

if __name__ == '__main__':
    input_path = 'generated_ship.png'
    output_path = 'player_ship.png'
    remove_background(input_path, output_path) 