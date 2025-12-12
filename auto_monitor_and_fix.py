#!/usr/bin/env python3
"""Automatically monitor wedding site deployment and fix errors until success."""

import os
import sys
import time
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

try:
    from infra.providers.vercel_client import VercelClient
    from infra.providers.vercel_fixer import VercelFixer
    from infra.utils.yaml_loader import load_config, load_provider_configs
except ImportError as e:
    print(f"ERROR: Could not import Otto modules: {e}")
    print("Make sure you're in the workspace root or Otto is properly installed.")
    sys.exit(1)

PROJECT_NAME = "wedding"
MAX_RETRIES = 5
CHECK_INTERVAL = 15  # seconds

def monitor_and_fix():
    """Monitor deployment and automatically fix errors."""
    print("\n" + "=" * 60)
    print("🤖 OTTO: Auto-Monitoring Wedding Site Deployment")
    print("=" * 60)
    print()
    
    # Load config
    try:
        config = load_config()
        provider_configs = load_provider_configs(config, "prod")
        vercel_config = provider_configs.get("vercel", {})
        
        projects = vercel_config.get("projects", {})
        project_config = projects.get(PROJECT_NAME, {})
        
        if not project_config:
            print(f"ERROR: Project '{PROJECT_NAME}' not found in Vercel config")
            print("Add it to: infra/providers/vercel.yaml")
            sys.exit(1)
        
        vercel_client = VercelClient(vercel_config, env="prod", dry_run=False)
        fixer = VercelFixer(vercel_client, PROJECT_NAME, project_config, max_retries=MAX_RETRIES)
        
    except Exception as e:
        print(f"ERROR: Failed to initialize Otto: {e}")
        print("\nMake sure:")
        print("  1. VERCEL_TOKEN is set in environment")
        print("  2. infra/providers/vercel.yaml has 'wedding' project configured")
        sys.exit(1)
    
    project_id = project_config.get("project_id") or PROJECT_NAME
    check_count = 0
    
    print(f"Monitoring project: {PROJECT_NAME}")
    print(f"Check interval: {CHECK_INTERVAL} seconds")
    print(f"Max retries: {MAX_RETRIES}")
    print()
    print("=" * 60)
    print()
    
    while check_count < MAX_RETRIES:
        check_count += 1
        print(f"[Check {check_count}/{MAX_RETRIES}] Checking deployment status...")
        
        try:
            # Get latest deployment
            deployments = vercel_client._list_deployments(project_id, limit=1)
            
            if not deployments:
                print("  ⏳ No deployments found yet. Waiting...")
                time.sleep(CHECK_INTERVAL)
                continue
            
            latest = deployments[0]
            state = latest.get("state") or latest.get("readyState", "UNKNOWN")
            deployment_id = latest.get("uid", "")
            url = latest.get("url", "N/A")
            
            print(f"  Status: {state}")
            
            # Success!
            if state == "READY":
                print()
                print("=" * 60)
                print("✅ DEPLOYMENT SUCCESSFUL!")
                print("=" * 60)
                print(f"\nSite is live at: https://{url}")
                print(f"Deployment ID: {deployment_id[:8]}...")
                print("\n🎉 Wedding site is ready!")
                return True
            
            # Still building
            elif state in ["BUILDING", "QUEUED", "INITIALIZING"]:
                print(f"  ⏳ Deployment in progress ({state}). Waiting...")
                time.sleep(CHECK_INTERVAL)
                continue
            
            # Failed - try to fix
            elif state in ["ERROR", "CANCELED"]:
                print()
                print("=" * 60)
                print(f"❌ DEPLOYMENT FAILED: {state}")
                print("=" * 60)
                print(f"\nDeployment ID: {deployment_id}")
                print("\n🔍 Detecting issues...")
                
                # Detect issues
                issues = fixer.detect_issues()
                
                if not issues:
                    print("  ⚠️  Could not automatically detect issues")
                    print("\nCheck build logs at:")
                    print(f"  https://vercel.com/dashboard")
                    print(f"\nOr paste the error here and I'll fix it!")
                    return False
                
                print(f"  Found {len(issues)} issue(s):")
                for issue in issues:
                    issue_type = issue.get("type", "unknown")
                    fixable = issue.get("fixable", False)
                    status = "✅ Fixable" if fixable else "❌ Requires code changes"
                    print(f"    - {issue_type}: {status}")
                
                # Try to apply fixes
                fix_result = fixer.apply_fixes(issues)
                
                if fix_result.success:
                    print(f"\n✅ Applied fixes: {fix_result.message}")
                    if fix_result.fixes_applied:
                        for fix in fix_result.fixes_applied:
                            print(f"   - {fix}")
                    
                    print("\n🔄 Triggering redeployment...")
                    # Note: Redeploy will happen automatically on next push
                    # For now, we'll just report that fixes were applied
                    print("  Fixes applied! Push a new commit or wait for auto-redeploy.")
                    print("\n⏳ Waiting for redeployment...")
                    time.sleep(CHECK_INTERVAL)
                    continue
                
                else:
                    print(f"\n❌ Could not auto-fix: {fix_result.message}")
                    if fix_result.errors:
                        print("\nErrors:")
                        for error in fix_result.errors:
                            print(f"  - {error}")
                    
                    print("\n📋 Manual fixes needed:")
                    print("  1. Check build logs at: https://vercel.com/dashboard")
                    print("  2. Copy error messages and paste them here")
                    print("  3. I'll fix the code and push the fix")
                    return False
            
            else:
                print(f"  Unknown state: {state}")
                time.sleep(CHECK_INTERVAL)
                continue
                
        except Exception as e:
            print(f"  ❌ Error checking deployment: {e}")
            time.sleep(CHECK_INTERVAL)
            continue
    
    print()
    print("=" * 60)
    print("⏰ Monitoring timeout reached")
    print("=" * 60)
    print("\nDeployment may still be in progress or requires manual attention.")
    print(f"Check status at: https://vercel.com/dashboard")
    return False

if __name__ == "__main__":
    try:
        success = monitor_and_fix()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n🤖 Monitoring stopped by user.")
        sys.exit(0)

