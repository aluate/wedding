#!/usr/bin/env python3
"""
Automated deployment monitor and fixer for wedding site.
Monitors Vercel deployment and can auto-fix common issues.
"""

import os
import sys
import time
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

try:
    from infra.providers.vercel_client import VercelClient
    from infra.utils.yaml_loader import load_provider_configs, load_config
except ImportError:
    print("ERROR: Otto infrastructure tools not found.")
    print("Make sure you're running from the workspace root.")
    sys.exit(1)

PROJECT_NAME = "wedding"
MAX_CHECKS = 20  # Check for 10 minutes (every 30 seconds)

def get_vercel_client():
    """Get configured Vercel client."""
    try:
        config = load_config()
        provider_configs = load_provider_configs(config, "prod")
        vercel_config = provider_configs.get("vercel", {})
        
        if not vercel_config:
            print("ERROR: Vercel config not found in infra/providers/vercel.yaml")
            return None
            
        client = VercelClient(vercel_config, env="prod", dry_run=False)
        return client
    except Exception as e:
        print(f"ERROR setting up Vercel client: {e}")
        return None

def check_deployment_status(client):
    """Check latest deployment status."""
    try:
        projects = client.projects
        if PROJECT_NAME not in projects:
            print(f"WARNING: Project '{PROJECT_NAME}' not found in Vercel config")
            return None
            
        project_config = projects[PROJECT_NAME]
        project_id = project_config.get("project_id", PROJECT_NAME)
        
        # Get deployments
        deployments = client._list_deployments(project_id, limit=1)
        
        if not deployments:
            return None
            
        latest = deployments[0]
        return {
            "state": latest.get("readyState", "UNKNOWN"),
            "url": latest.get("url", "N/A"),
            "id": latest.get("uid", "N/A"),
            "created": latest.get("createdAt", "N/A"),
        }
    except Exception as e:
        print(f"Error checking deployment: {e}")
        return None

def get_deployment_logs(client, deployment_id):
    """Get logs for a deployment."""
    try:
        logs = client.get_deployment_logs(deployment_id)
        return logs
    except Exception as e:
        print(f"Error fetching logs: {e}")
        return []

def analyze_logs_for_errors(logs):
    """Analyze logs to find build errors."""
    errors = []
    
    for log_entry in logs:
        log_text = str(log_entry).lower()
        
        # Check for common error patterns
        if "error" in log_text or "failed" in log_text:
            errors.append(log_entry)
            
    return errors

def monitor_deployment():
    """Monitor deployment and report status."""
    print("=" * 60)
    print("MONITORING VERCEL DEPLOYMENT")
    print("=" * 60)
    print(f"Project: {PROJECT_NAME}")
    print()
    
    # Check for Vercel token
    if not os.environ.get("VERCEL_TOKEN"):
        print("WARNING: VERCEL_TOKEN not set!")
        print("I can't check deployment status automatically.")
        print()
        print("To enable monitoring:")
        print("  1. Get token from: https://vercel.com/account/tokens")
        print("  2. Set it: $env:VERCEL_TOKEN='your_token_here'")
        print("  3. Run this script again")
        print()
        print("Or check manually at: https://vercel.com/dashboard")
        return
    
    client = get_vercel_client()
    if not client:
        return
    
    print("Checking deployment status...")
    print()
    
    check_count = 0
    last_state = None
    
    while check_count < MAX_CHECKS:
        status = check_deployment_status(client)
        
        if not status:
            print("No deployment found yet. Waiting...")
            time.sleep(30)
            check_count += 1
            continue
        
        state = status["state"]
        
        # Only print if state changed
        if state != last_state:
            print(f"Status: {state}")
            print(f"URL: {status['url']}")
            
            if state == "READY":
                print()
                print("=" * 60)
                print("✅ DEPLOYMENT SUCCESSFUL!")
                print("=" * 60)
                print(f"Site is live at: https://{status['url']}")
                return
            elif state == "ERROR" or state == "CANCELED":
                print()
                print("=" * 60)
                print("❌ DEPLOYMENT FAILED!")
                print("=" * 60)
                print("Fetching error logs...")
                
                logs = get_deployment_logs(client, status["id"])
                if logs:
                    print("\nRecent errors:")
                    error_logs = analyze_logs_for_errors(logs)
                    for error in error_logs[-5:]:  # Last 5 errors
                        print(f"  {error}")
                
                print("\nCheck full logs at:")
                print(f"  https://vercel.com/dashboard")
                return
            elif state == "BUILDING" or state == "QUEUED":
                print("Waiting for build to complete...")
            
            last_state = state
        
        time.sleep(30)  # Check every 30 seconds
        check_count += 1
    
    print()
    print("Monitoring timeout. Check status manually:")
    print("  https://vercel.com/dashboard")

if __name__ == "__main__":
    monitor_deployment()

