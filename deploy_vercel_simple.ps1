# Simple Vercel Deployment Script
# Uses Vercel API directly without emoji issues

param(
    [string]$VercelToken = "",
    [string]$ProjectName = "wedding",
    [string]$GitHubRepo = "aluate/wedding",
    [string]$RootDir = "apps/wedding"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploying Wedding Site to Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for Vercel token
if ([string]::IsNullOrEmpty($VercelToken)) {
    $VercelToken = $env:VERCEL_TOKEN
}

if ([string]::IsNullOrEmpty($VercelToken)) {
    Write-Host "ERROR: VERCEL_TOKEN not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set VERCEL_TOKEN environment variable:" -ForegroundColor Yellow
    Write-Host "  [Environment]::SetEnvironmentVariable('VERCEL_TOKEN', 'your_token_here', 'User')" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Or get your token from: https://vercel.com/account/tokens" -ForegroundColor Yellow
    exit 1
}

Write-Host "Using Vercel token: $($VercelToken.Substring(0, 10))..." -ForegroundColor Gray
Write-Host ""

# Step 1: Create/Get Vercel Project
Write-Host "Step 1: Creating Vercel project..." -ForegroundColor Yellow

$projectBody = @{
    name = $ProjectName
    framework = "nextjs"
    gitRepository = @{
        type = "github"
        repo = $GitHubRepo
    }
    rootDirectory = $RootDir
} | ConvertTo-Json -Depth 10

try {
    $headers = @{
        "Authorization" = "Bearer $VercelToken"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "https://api.vercel.com/v10/projects" -Method Post -Headers $headers -Body $projectBody
    Write-Host "SUCCESS: Project created: $($response.name)" -ForegroundColor Green
    Write-Host "Project ID: $($response.id)" -ForegroundColor Gray
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 409) {
        Write-Host "Project already exists. Continuing..." -ForegroundColor Yellow
    } else {
        Write-Host "ERROR: Failed to create project" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Step 2: Triggering deployment..." -ForegroundColor Yellow

# Deployment will happen automatically when connected to GitHub
Write-Host "Deployment will be triggered automatically by GitHub connection." -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment initiated!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Check Vercel dashboard: https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "  2. Your site will be at: https://$ProjectName.vercel.app" -ForegroundColor Gray
Write-Host "  3. To add custom domain, use Otto or Vercel dashboard" -ForegroundColor Gray
Write-Host ""

