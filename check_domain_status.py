#!/usr/bin/env python3
"""Check domain configuration status for wedding site."""

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
DOMAIN = "britandkarl.com"

try:
    import httpx
except ImportError:
    print("ERROR: httpx not installed")
    sys.exit(1)

def check_domain_status():
    """Check domain configuration status."""
    token = os.environ.get("VERCEL_TOKEN")
    
    if not token:
        print("ERROR: VERCEL_TOKEN not found in .env file")
        return
    
    print("=" * 60)
    print("CHECKING DOMAIN CONFIGURATION STATUS")
    print("=" * 60)
    print(f"Project: {PROJECT_NAME}")
    print(f"Domain: {DOMAIN}")
    print()
    
    headers = {
        "Authorization": f"Bearer {token}",
    }
    
    # First, get project info
    print("1. Getting project information...")
    try:
        project_url = f"https://api.vercel.com/v9/projects/{PROJECT_NAME}"
        with httpx.Client() as client:
            project_response = client.get(project_url, headers=headers, timeout=30)
            
            if project_response.status_code == 404:
                print(f"   ERROR: Project '{PROJECT_NAME}' not found in Vercel")
                return
            
            project_response.raise_for_status()
            project = project_response.json()
            project_id = project.get("id") or PROJECT_NAME
            
            print(f"   Project ID: {project_id}")
    except Exception as e:
        print(f"   ERROR: {e}")
        return
    
    print()
    print("2. Checking domain configuration...")
    
    # Check domain configuration
    try:
        domain_url = f"https://api.vercel.com/v5/domains/{DOMAIN}/config"
        with httpx.Client() as client:
            domain_response = client.get(domain_url, headers=headers, timeout=30)
            
            if domain_response.status_code == 404:
                print(f"   WARNING: Domain '{DOMAIN}' not found in Vercel")
                print()
                print("   Domain may not be added yet.")
                print("   Add it in Vercel Dashboard:")
                print(f"   Settings → Domains → Add → {DOMAIN}")
                return
            
            domain_response.raise_for_status()
            domain_config = domain_response.json()
            
            # Parse domain configuration
            misconfigured = domain_config.get("misconfigured", False)
            nameservers = domain_config.get("nameservers", [])
            verification = domain_config.get("verification", {})
            intent = domain_config.get("intent", "park")
            configured_by = domain_config.get("configuredBy", {})
            
            print(f"   Misconfigured: {misconfigured}")
            print(f"   Intent: {intent}")
            
            if nameservers:
                print(f"   Nameservers: {', '.join(nameservers)}")
            
            print()
            
            # Check verification status
            if verification:
                verified = verification.get("verified", False)
                print(f"   Verified: {verified}")
                
                if not verified:
                    print("   ⚠️  Domain not verified yet")
                    
                    # Check if we need to verify
                    if misconfigured:
                        print()
                        print("=" * 60)
                        print("DNS ISSUE DETECTED")
                        print("=" * 60)
                        print()
                        print("Domain is MISCONFIGURED. Here's what to check:")
                        print()
                        print("1. Check Cloudflare DNS Records:")
                        print("   - Go to Cloudflare Dashboard")
                        print("   - DNS → Records")
                        print("   - Verify you have:")
                        print("     * A record: @ → 76.76.21.21 (or IP from Vercel)")
                        print("     * CNAME: www → cname.vercel-dns.com")
                        print()
                        print("2. Check Proxy Status:")
                        print("   - Both records should have Proxy ON (orange cloud)")
                        print()
                        print("3. Check SSL/TLS in Cloudflare:")
                        print("   - SSL/TLS → Set to 'Full'")
                        print()
                        print("4. Wait for DNS Propagation:")
                        print("   - Can take 10-30 minutes")
                        print("   - Check status in Vercel dashboard")
            
            # Check domain assignment to project
            print()
            print("3. Checking domain assignment...")
            
            # List all domains for the project
            project_domains_url = f"https://api.vercel.com/v5/projects/{project_id}/domains"
            with httpx.Client() as client:
                domains_response = client.get(project_domains_url, headers=headers, timeout=30)
                domains_response.raise_for_status()
                project_domains = domains_response.json()
                
                domain_found = False
                for domain_info in project_domains.get("domains", []):
                    if domain_info.get("name") == DOMAIN:
                        domain_found = True
                        print(f"   ✅ Domain is assigned to project")
                        print(f"   Status: {domain_info.get('verification', {}).get('status', 'unknown')}")
                        break
                
                if not domain_found:
                    print(f"   ⚠️  Domain not assigned to project yet")
                    print(f"   Add it in Vercel Dashboard:")
                    print(f"   Settings → Domains → Add → {DOMAIN}")
            
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 403:
            print("   ERROR: Invalid token or insufficient permissions")
        elif e.response.status_code == 404:
            print(f"   Domain '{DOMAIN}' not found - needs to be added first")
        else:
            print(f"   ERROR: HTTP {e.response.status_code}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    print()
    print("=" * 60)
    print("NEXT STEPS")
    print("=" * 60)
    print()
    print("1. If domain not added: Add it in Vercel Dashboard")
    print("2. If misconfigured: Check Cloudflare DNS records")
    print("3. If verified but not working: Wait for DNS propagation (10-30 min)")
    print()
    print("Check full status at: https://vercel.com/dashboard")
    print()

if __name__ == "__main__":
    check_domain_status()

