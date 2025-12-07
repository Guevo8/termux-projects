import requests
import json
import time

URL = "http://127.0.0.1:8000/projects"

# Payload without created_at and updated_at
payload = {
    "id": "test-project-1",
    "name": "Test Project",
    "type": "other",
    "description": "A test project to verify bug",
    "tiers": {
        "T0_foundation": {},
        "T1_core": {}
    }
}

try:
    print(f"Sending POST request to {URL} with payload:")
    print(json.dumps(payload, indent=2))

    response = requests.post(URL, json=payload)

    print(f"\nResponse Code: {response.status_code}")
    print(f"Response Body: {response.text}")

    if response.status_code == 200:
        print("\nSUCCESS: Project created successfully.")
    else:
        print("\nFAILURE: Project creation failed.")

except Exception as e:
    print(f"\nERROR: {e}")
