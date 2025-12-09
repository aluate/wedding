#!/usr/bin/env python3
"""
Monitor Vercel deployment until it builds successfully.
Runs continuously, checking every 15 seconds until deployment is READY.
"""

import os
import sys
import time
from datetime import datetime

try:
    import httpx
except ImportError:
    print("ERROR: httpx not installed. Run: pip install httpx")
    sys.exit(1)

# Configuration
PROJECT_NAME = "wedding"
VERCEL_API = "https://api.vercel.com"
CHECK_INTERVAL = 15  # Check every 15 seconds
MAX_CHECKS = 120  # Max 30 minutes (120 * 15s)

def get_vercel_token():
    """Get Vercel token from environment."""
    token = os.environ.get("VERCEL_TOKEN")
    if not token:
        print("⚠️  VERCEL_TOKEN not set. Monitoring via dashboard only.")
        print("   Set VERCEL_TOKEN to enable API monitoring.")
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
        print(f"❌ Error fetching deployment: {e}")
        return None

def format_timestamp(ts):
    """Format timestamp for display."""
    try:
        dt = datetime.fromtimestamp(ts / 1000)
        return dt.strftime("%H:%M:%S")
    except:
        return "N/A"

def monitor_deployment():
    """Monitor deployment until it's ready or fails."""
    token = get_vercel_token()
    
    print("\n" + "=" * 70)
    print(f"🚀 MONITORING VERCEL DEPLOYMENT: {PROJECT_NAME}")
    print("=" * 70)
    print(f"Checking every {CHECK_INTERVAL} seconds...")
    print(f"Max duration: {MAX_CHECKS * CHECK_INTERVAL // 60} minutes")
    print("=" * 70 + "\n")
    
    if not token:
        print("📊 Manual monitoring mode:")
        print(f"   Dashboard: https://vercel.com/dashboard")
        print(f"   Project: {PROJECT_NAME}\n")
        print("⏳ Waiting for deployment to complete...")
        print("   (Set VERCEL_TOKEN for API-based monitoring)\n")
        return
    
    check_count = 0
    last_state = None
    
    while check_count < MAX_CHECKS:
        check_count += 1
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        deployment = get_latest_deployment(token)
        
        if not deployment:
            print(f"[{timestamp}] ⚠️  No deployment found. Waiting...")
            time.sleep(CHECK_INTERVAL)
            continue
        
        state = deployment.get("readyState", "UNKNOWN")
        url = deployment.get("url", "N/A")
        created_at = deployment.get("createdAt", 0)
        
        # Only print when state changes
        if state != last_state:
            print(f"[{timestamp}] Status: {state}")
            if url and url != "N/A":
                print(f"         URL: https://{url}")
            last_state = state
        
        # Check final states
        if state == "READY":
            print("\n" + "=" * 70)
            print("✅ DEPLOYMENT SUCCESSFUL!")
            print("=" * 70)
            print(f"Site is live at: https://{url}")
            print(f"Deployment completed at: {format_timestamp(created_at)}")
            print("=" * 70 + "\n")
            return True
            
        elif state == "ERROR" or state == "CANCELED":
            print("\n" + "=" * 70)
            print(f"❌ DEPLOYMENT FAILED: {state}")
            print("=" * 70)
            print(f"Check Vercel dashboard for details:")
            print(f"  https://vercel.com/dashboard")
            print("=" * 70 + "\n")
            return False
            
        elif state in ["BUILDING", "QUEUED", "INITIALIZING"]:
            # Continue monitoring
            pass
        else:
            print(f"[{timestamp}] ⚠️  Unknown state: {state}")
        
        time.sleep(CHECK_INTERVAL)
    
    print("\n" + "=" * 70)
    print("⏱️  MAXIMUM MONITORING TIME REACHED")
    print("=" * 70)
    print(f"Checked {check_count} times over {check_count * CHECK_INTERVAL // 60} minutes")
    print("Check Vercel dashboard manually:")
    print(f"  https://vercel.com/dashboard")
    print("=" * 70 + "\n")
    return False

if __name__ == "__main__":
    try:
        success = monitor_deployment()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Monitoring interrupted by user")
        sys.exit(1)
