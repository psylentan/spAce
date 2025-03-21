import requests
import json
import os
from PIL import Image
import io
import base64

def generate_ship():
    url = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image'
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer sk-PBm1Vn2suVZ9BEli5favpu9oXSlgSKw9Wp6aoaPuaXo4NJe1'
    }
    
    data = {
        'text_prompts': [{
            'text': 'A sleek, futuristic spaceship on a pure white background, top-down view, 2D game asset style, clean lines, minimalist design, centered composition',
            'weight': 1
        }],
        'cfg_scale': 7,
        'height': 1024,
        'width': 1024,
        'samples': 1,
        'steps': 30,
        'style_preset': 'digital-art'
    }
    
    print('Sending request to Stability AI...')
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        # Save the generated image
        image_data = response.json()['artifacts'][0]['base64']
        image = Image.open(io.BytesIO(base64.b64decode(image_data)))
        
        # Save with white background
        output_path = 'generated_ship.png'
        image.save(output_path, 'PNG')
        print(f'Ship generated and saved to {output_path}')
        return output_path
    else:
        print('Error generating image:', response.text)
        return None

if __name__ == '__main__':
    print('Generating spaceship...')
    generate_ship() 