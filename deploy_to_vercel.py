#!/usr/bin/env python3
"""Simple Vercel deployment script - no emoji issues."""

import os
import sys
import json
from pathlib import Path

try:
    import httpx
except ImportError:
    print("ERROR: httpx not installed. Run: pip install httpx")
    sys.exit(1)

# Configuration
PROJECT_NAME = "wedding"
GITHUB_REPO = "aluate/wedding"
ROOT_DIR = "apps/wedding"
VERCEL_API = "https://api.vercel.com"

def get_vercel_token():
    """Get Vercel token from environment."""
    token = os.environ.get("VERCEL_TOKEN")
    if not token:
        print("ERROR: VERCEL_TOKEN environment variable not set!")
        print("")
        print("Get your token from: https://vercel.com/account/tokens")
        print("Then set it:")
        print("  Windows PowerShell: $env:VERCEL_TOKEN='your_token_here'")
        print("  Or create a .env file in workspace root with: VERCEL_TOKEN=your_token_here")
        sys.exit(1)
    return token

def create_vercel_project(token, project_name, github_repo, root_dir):
    """Create or get Vercel project."""
    url = f"{VERCEL_API}/v10/projects"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    
    # Parse GitHub repo
    parts = github_repo.split("/")
    if len(parts) != 2:
        print(f"ERROR: Invalid GitHub repo format: {github_repo}")
        print("Expected format: owner/repo")
        sys.exit(1)
    
    owner, repo = parts
    
    payload = {
        "name": project_name,
        "framework": "nextjs",
        "gitRepository": {
            "type": "github",
            "repo": repo,
            "org": owner,
        },
        "rootDirectory": root_dir,
    }
    
    print(f"Creating Vercel project: {project_name}")
    print(f"  GitHub repo: {github_repo}")
    print(f"  Root directory: {root_dir}")
    print("")
    
    try:
        with httpx.Client() as client:
            response = client.post(url, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 409:
                print(f"Project '{project_name}' already exists. Getting existing project...")
                # Get existing project
                get_url = f"{VERCEL_API}/v10/projects/{project_name}"
                get_response = client.get(get_url, headers=headers, timeout=30)
                if get_response.status_code == 200:
                    project = get_response.json()
                    print(f"SUCCESS: Using existing project")
                    return project
                else:
                    print(f"ERROR: Failed to get existing project")
                    sys.exit(1)
            
            response.raise_for_status()
            project = response.json()
            print(f"SUCCESS: Project created!")
            print(f"  Project ID: {project.get('id', 'N/A')}")
            print(f"  Project URL: https://vercel.com/{project.get('accountId', '')}/{project_name}")
            return project
            
    except httpx.HTTPStatusError as e:
        print(f"ERROR: Failed to create project")
        print(f"  Status: {e.response.status_code}")
        print(f"  Response: {e.response.text}")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)

def main():
    print("=" * 60)
    print("Vercel Deployment - Wedding Site")
    print("=" * 60)
    print("")
    
    token = get_vercel_token()
    print(f"Using Vercel token: {token[:10]}...")
    print("")
    
    project = create_vercel_project(token, PROJECT_NAME, GITHUB_REPO, ROOT_DIR)
    
    print("")
    print("=" * 60)
    print("DEPLOYMENT INITIATED!")
    print("=" * 60)
    print("")
    print("Next steps:")
    print(f"  1. Check Vercel dashboard: https://vercel.com/dashboard")
    print(f"  2. Your site will be at: https://{PROJECT_NAME}.vercel.app")
    print("  3. Deployment will start automatically")
    print("")
    print("To add custom domain:")
    print(f"  python tools/infra.py configure-domain --project {PROJECT_NAME} --domain solsticeof26.com")
    print("")

if __name__ == "__main__":
    main()

