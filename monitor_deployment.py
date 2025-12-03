#!/usr/bin/env python3
"""Monitor Vercel deployment and check for errors."""

import os
import sys
import time
from pathlib import Path

try:
    import httpx
except ImportError:
    print("ERROR: httpx not installed. Run: pip install httpx")
    sys.exit(1)

# Configuration
PROJECT_NAME = "wedding"
VERCEL_API = "https://api.vercel.com"

def get_vercel_token():
    """Get Vercel token from environment."""
    token = os.environ.get("VERCEL_TOKEN")
    if not token:
        print("NOTE: VERCEL_TOKEN not set. Can't check via API.")
        print("Check deployment at: https://vercel.com/dashboard")
        return None
    return token

def get_deployments(token):
    """Get recent deployments for the project."""
    url = f"{VERCEL_API}/v6/deployments"
    headers = {
        "Authorization": f"Bearer {token}",
    }
    params = {
        "projectId": PROJECT_NAME,
        "limit": 5,
    }
    
    try:
        with httpx.Client() as client:
            response = client.get(url, headers=headers, params=params, timeout=30)
            response.raise_for_status()
            return response.json().get("deployments", [])
    except Exception as e:
        print(f"Error fetching deployments: {e}")
        return []

def get_deployment_logs(token, deployment_id):
    """Get logs for a deployment."""
    url = f"{VERCEL_API}/v2/deployments/{deployment_id}/events"
    headers = {
        "Authorization": f"Bearer {token}",
    }
    
    try:
        with httpx.Client() as client:
            response = client.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"Error fetching logs: {e}")
        return []

def check_deployment_status():
    """Check and display deployment status."""
    token = get_vercel_token()
    
    if not token:
        print("\n" + "=" * 60)
        print("MONITORING DEPLOYMENT")
        print("=" * 60)
        print("\nTo monitor via API, set VERCEL_TOKEN environment variable.")
        print("Otherwise, check manually:")
        print(f"  https://vercel.com/dashboard")
        print(f"\nLook for project: {PROJECT_NAME}")
        return
    
    print("\n" + "=" * 60)
    print(f"MONITORING DEPLOYMENT: {PROJECT_NAME}")
    print("=" * 60)
    print()
    
    deployments = get_deployments(token)
    
    if not deployments:
        print("No deployments found. Check Vercel dashboard:")
        print(f"  https://vercel.com/dashboard")
        return
    
    latest = deployments[0]
    state = latest.get("readyState", "UNKNOWN")
    url = latest.get("url", "N/A")
    
    print(f"Latest Deployment:")
    print(f"  State: {state}")
    print(f"  URL: {url}")
    print(f"  Created: {latest.get('createdAt', 'N/A')}")
    print()
    
    # Status indicators
    if state == "READY":
        print("✅ DEPLOYMENT SUCCESSFUL!")
        print(f"\nSite is live at: https://{url}")
    elif state == "BUILDING" or state == "QUEUED":
        print(f"⏳ Deployment in progress ({state})...")
        print("\nKeep monitoring or check Vercel dashboard for real-time logs:")
        print(f"  https://vercel.com/dashboard")
    elif state == "ERROR" or state == "CANCELED":
        print(f"❌ Deployment failed ({state})")
        print("\nCheck Vercel dashboard for error details:")
        print(f"  https://vercel.com/dashboard")
        
        # Try to get logs
        deployment_id = latest.get("uid")
        if deployment_id:
            print(f"\nFetching logs for deployment {deployment_id[:8]}...")
            logs = get_deployment_logs(token, deployment_id)
            if logs:
                print("\nRecent log entries:")
                for log in logs.get("logs", [])[-10:]:  # Last 10 log entries
                    print(f"  {log}")
    else:
        print(f"Status: {state}")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    check_deployment_status()

