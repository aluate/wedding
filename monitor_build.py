#!/usr/bin/env python3
"""Continuously monitor Vercel deployment until it succeeds or fails."""

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
        print("ERROR: VERCEL_TOKEN environment variable not set!")
        print("")
        print("To enable monitoring, set VERCEL_TOKEN:")
        print("  Windows PowerShell: $env:VERCEL_TOKEN='your_token_here'")
        print("")
        print("Get token from: https://vercel.com/account/tokens")
        return None
    return token

def get_latest_deployment(token):
    """Get the latest deployment for the project."""
    url = f"{VERCEL_API}/v6/deployments"
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
            deployments = response.json().get("deployments", [])
            return deployments[0] if deployments else None
    except Exception as e:
        print(f"Error fetching deployment: {e}")
        return None

def get_deployment_logs(token, deployment_id, limit=50):
    """Get recent logs for a deployment."""
    url = f"{VERCEL_API}/v2/deployments/{deployment_id}/events"
    headers = {
        "Authorization": f"Bearer {token}",
    }
    params = {
        "limit": limit,
    }
    
    try:
        with httpx.Client() as client:
            response = client.get(url, headers=headers, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"Error fetching logs: {e}")
        return None

def monitor_deployment():
    """Monitor deployment until completion."""
    token = get_vercel_token()
    
    if not token:
        print("\n" + "=" * 60)
        print("MONITORING DISABLED - VERCEL_TOKEN not set")
        print("=" * 60)
        print("\nI cannot automatically monitor without VERCEL_TOKEN.")
        print("However, I'll check periodically for any errors you report.")
        print("\nTo enable automatic monitoring:")
        print("  1. Get token from: https://vercel.com/account/tokens")
        print("  2. Set: $env:VERCEL_TOKEN='your_token_here'")
        print("  3. Run this script again")
        return
    
    print("\n" + "=" * 60)
    print(f"MONITORING DEPLOYMENT: {PROJECT_NAME}")
    print("=" * 60)
    print("\nMonitoring build status...")
    print("(This will check every 10 seconds until complete)")
    print()
    
    last_state = None
    check_count = 0
    
    while True:
        check_count += 1
        deployment = get_latest_deployment(token)
        
        if not deployment:
            print(f"Check {check_count}: No deployment found yet...")
            time.sleep(10)
            continue
        
        state = deployment.get("readyState", "UNKNOWN")
        deployment_id = deployment.get("uid", "")
        url = deployment.get("url", "N/A")
        
        # Only print if state changed
        if state != last_state:
            print(f"\n[{time.strftime('%H:%M:%S')}] Status: {state}")
            last_state = state
            
            if state == "READY":
                print("\n" + "=" * 60)
                print("✅ DEPLOYMENT SUCCESSFUL!")
                print("=" * 60)
                print(f"\nSite is live at: https://{url}")
                print(f"Deployment ID: {deployment_id}")
                print("\nDeployment completed successfully!")
                break
                
            elif state in ["ERROR", "CANCELED"]:
                print("\n" + "=" * 60)
                print(f"❌ DEPLOYMENT FAILED: {state}")
                print("=" * 60)
                print(f"\nFetching error logs...")
                
                logs = get_deployment_logs(token, deployment_id)
                if logs:
                    print("\nRecent build errors:")
                    print("-" * 60)
                    # Look for error entries
                    for entry in logs.get("logs", []):
                        if "error" in str(entry).lower() or "failed" in str(entry).lower():
                            print(f"  {entry}")
                    
                print("\n" + "-" * 60)
                print("Check full logs at:")
                print(f"  https://vercel.com/dashboard")
                print(f"\nDeployment ID: {deployment_id}")
                break
                
            elif state in ["BUILDING", "QUEUED"]:
                print(f"  Build in progress... (deployment: {deployment_id[:8]}...)")
        
        # Check every 10 seconds
        time.sleep(10)
        
        # Timeout after 10 minutes of checking
        if check_count > 60:
            print("\n⏰ Monitoring timeout (10 minutes)")
            print("Deployment may still be in progress.")
            print(f"Check manually: https://vercel.com/dashboard")
            break

if __name__ == "__main__":
    try:
        monitor_deployment()
    except KeyboardInterrupt:
        print("\n\nMonitoring stopped by user.")
        sys.exit(0)

