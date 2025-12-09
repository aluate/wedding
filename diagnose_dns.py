#!/usr/bin/env python3
"""Diagnose DNS configuration issues."""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))
from dotenv import load_dotenv

env_path = Path(__file__).parent.parent.parent / ".env"
if env_path.exists():
    load_dotenv(env_path)

PROJECT_NAME = "wedding"
DOMAIN = "britandkarl.com"

try:
    import httpx
except ImportError:
    print("ERROR: httpx not installed")
    sys.exit(1)

def diagnose():
    """Diagnose DNS configuration."""
    token = os.environ.get("VERCEL_TOKEN")
    
    if not token:
        print("ERROR: VERCEL_TOKEN not found")
        return
    
    print("=" * 60)
    print("DNS DIAGNOSIS")
    print("=" * 60)
    print(f"Domain: {DOMAIN}")
    print(f"Project: {PROJECT_NAME}")
    print()
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Check domain config
    print("1. Checking Vercel domain configuration...")
    try:
        config_url = f"https://api.vercel.com/v5/domains/{DOMAIN}/config"
        with httpx.Client() as client:
            response = client.get(config_url, headers=headers, timeout=30)
            
            if response.status_code == 404:
                print("   ERROR: Domain not found in Vercel")
                print("   ACTION: Add domain in Vercel Dashboard first")
                return
            
            response.raise_for_status()
            config = response.json()
            
            misconfigured = config.get("misconfigured", False)
            intent = config.get("intent", "unknown")
            
            print(f"   Status: {'MISCONFIGURED' if misconfigured else 'OK'}")
            print(f"   Intent: {intent}")
            
            if misconfigured:
                print()
                print("=" * 60)
                print("ISSUE DETECTED: Domain is MISCONFIGURED")
                print("=" * 60)
                print()
                print("This means DNS records in Cloudflare are not correct.")
                print()
                print("WHAT TO CHECK:")
                print()
                print("1. Go to Vercel Dashboard:")
                print("   - Settings -> Domains -> Click on britandkarl.com")
                print("   - You should see DNS records you need to add")
                print()
                print("2. Go to Cloudflare Dashboard:")
                print("   - DNS -> Records")
                print("   - Check you have these TWO records:")
                print()
                print("   RECORD 1 (Root domain):")
                print("     Type: A")
                print("     Name: @")
                print("     Content: [IP address from Vercel - usually 76.76.21.21]")
                print("     Proxy: ON (orange cloud)")
                print()
                print("   RECORD 2 (WWW):")
                print("     Type: CNAME")
                print("     Name: www")
                print("     Target: cname.vercel-dns.com")
                print("     Proxy: ON (orange cloud)")
                print()
                print("3. Common issues:")
                print("   - Missing one of the records")
                print("   - Wrong IP address")
                print("   - Proxy is OFF (should be ON)")
                print("   - Typos in target values")
                print()
                print("4. After fixing DNS:")
                print("   - Wait 10-30 minutes for propagation")
                print("   - Vercel will automatically detect when DNS is correct")
                
            else:
                print("   OK: Domain configuration looks good!")
                
    except Exception as e:
        print(f"   ERROR: {e}")
    
    print()
    print("=" * 60)
    print("QUICK FIX STEPS")
    print("=" * 60)
    print()
    print("1. Check Vercel for DNS records needed:")
    print("   https://vercel.com/dashboard")
    print()
    print("2. Verify Cloudflare DNS matches exactly")
    print()
    print("3. Make sure Proxy is ON for both records")
    print()
    print("4. Wait 10-30 minutes")
    print()

if __name__ == "__main__":
    diagnose()

