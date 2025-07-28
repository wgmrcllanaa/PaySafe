#!/usr/bin/env python3
"""
Test script to verify that the Flask API correctly handles clipboard data from Android app
"""

import requests
import json

# Test the API with clipboard format
def test_clipboard_format():
    url = "http://localhost:5001/predict"
    
    # Test data - a suspicious message
    test_data = {
        "clipboard": "Congratulations! You've won $10,000! Click here to claim your prize now..."
    }
    
    print("Testing clipboard format...")
    print(f"URL: {url}")
    print(f"Data: {json.dumps(test_data, indent=2)}")
    
    try:
        response = requests.post(url, json=test_data, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: Status={result.get('status')}, Probability={result.get('probability')}%")
        else:
            print(f"❌ ERROR: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ CONNECTION ERROR: {e}")
    except json.JSONDecodeError as e:
        print(f"❌ JSON PARSE ERROR: {e}")

# Test the API with message format (for comparison)
def test_message_format():
    url = "http://localhost:5001/predict"
    
    # Test data - a suspicious message
    test_data = {
        "message": "Congratulations! You've won $10,000! Click here to claim your prize now..."
    }
    
    print("\nTesting message format...")
    print(f"URL: {url}")
    print(f"Data: {json.dumps(test_data, indent=2)}")
    
    try:
        response = requests.post(url, json=test_data, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: Status={result.get('status')}, Probability={result.get('probability')}%")
        else:
            print(f"❌ ERROR: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ CONNECTION ERROR: {e}")
    except json.JSONDecodeError as e:
        print(f"❌ JSON PARSE ERROR: {e}")

if __name__ == "__main__":
    print("🧪 Testing Flask API compatibility with Android clipboard format")
    print("=" * 60)
    
    test_clipboard_format()
    test_message_format()
    
    print("\n" + "=" * 60)
    print("✅ Test completed!") 