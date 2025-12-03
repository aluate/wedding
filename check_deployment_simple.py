#!/usr/bin/env python3
"""Simple deployment checker - loads from .env, no emoji issues."""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from dotenv import load_dotenv

# Load .env file
env_path = Path(__file__).parent.parent.parent / ".env"
if env_path.exists():
    load_dotenv(env_path)

PROJECT_NAME = "wedding"

try:
    import httpx
except ImportError:
    print("ERROR: httpx not installed")
    sys.exit(1)

def check_deployment():
    """Check deployment status."""
    token = os.environ.get("VERCEL_TOKEN")
    
    if not token:
        print("ERROR: VERCEL_TOKEN not found in .env file")
        print("Make sure .env file exists with VERCEL_TOKEN=...")
        return
    
    print("=" * 60)
    print("CHECKING DEPLOYMENT STATUS")
    print("=" * 60)
    print(f"Project: {PROJECT_NAME}")
    print()
    
    # Get deployments
    url = "https://api.vercel.com/v6/deployments"
    headers = {
        "Authorization": f"Bearer {token}",
    }
    params = {
        "projectId": PROJECT_NAME,
        "limit": 1,
    }
    
    try:
        with httpx.Client() as client:
            response = client.get(url, headers=headers, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            deployments = data.get("deployments", [])
            
            if not deployments:
                print("No deployments found yet.")
                print("Check Vercel dashboard: https://vercel.com/dashboard")
                return
            
            latest = deployments[0]
            state = latest.get("readyState", "UNKNOWN")
            url_deploy = latest.get("url", "N/A")
            
            print(f"Latest Deployment:")
            print(f"  State: {state}")
            print(f"  URL: https://{url_deploy}")
            print(f"  Created: {latest.get('createdAt', 'N/A')}")
            print()
            
            if state == "READY":
                print("SUCCESS! Deployment is ready!")
                print(f"Site is live at: https://{url_deploy}")
            elif state == "BUILDING" or state == "QUEUED":
                print(f"Deployment in progress ({state})...")
                print("Check Vercel dashboard for real-time logs:")
                print("  https://vercel.com/dashboard")
            elif state == "ERROR" or state == "CANCELED":
                print(f"DEPLOYMENT FAILED ({state})")
                print()
                print("Fetching error logs...")
                
                # Get logs
                deploy_id = latest.get("uid")
                if deploy_id:
                    logs_url = f"https://api.vercel.com/v2/deployments/{deploy_id}/events"
                    try:
                        logs_response = client.get(logs_url, headers=headers, timeout=30)
                        logs_response.raise_for_status()
                        events = logs_response.json()
                        
                        print("\nRecent error logs:")
                        error_count = 0
                        for event in reversed(events):  # Most recent first
                            payload = event.get("payload", {})
                            if isinstance(payload, dict):
                                text = payload.get("text", "")
                                if text and ("error" in text.lower() or "failed" in text.lower()):
                                    print(f"  {text}")
                                    error_count += 1
                                    if error_count >= 5:  # Show last 5 errors
                                        break
                    except Exception as e:
                        print(f"Could not fetch logs: {e}")
                
                print("\nCheck full logs at: https://vercel.com/dashboard")
            else:
                print(f"Status: {state}")
                
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 403:
            print("ERROR: Invalid VERCEL_TOKEN or insufficient permissions")
        elif e.response.status_code == 404:
            print(f"ERROR: Project '{PROJECT_NAME}' not found")
            print("Make sure the project exists in Vercel")
        else:
            print(f"ERROR: HTTP {e.response.status_code}")
            print(e.response.text)
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    check_deployment()

