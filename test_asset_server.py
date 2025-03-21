import requests
import json

def test_sprite_generation():
    url = 'http://localhost:5001/api/generate/sprite'
    headers = {'Content-Type': 'application/json'}
    data = {
        'prompt': 'player',
        'size': [64, 64]
    }
    
    response = requests.post(url, headers=headers, json=data)
    print('Sprite Generation Response:')
    print(json.dumps(response.json(), indent=2))

def test_ui_generation():
    url = 'http://localhost:5001/api/generate/ui'
    headers = {'Content-Type': 'application/json'}
    data = {
        'type': 'button',
        'size': [200, 50]
    }
    
    response = requests.post(url, headers=headers, json=data)
    print('\nUI Generation Response:')
    print(json.dumps(response.json(), indent=2))

if __name__ == '__main__':
    print('Testing Asset Generator Server...\n')
    test_sprite_generation()
    test_ui_generation() 