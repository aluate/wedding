# Wedding Site Deployment Script
# Automates deployment to Vercel using Otto

param(
    [string]$GitHubUser = "",
    [string]$GitHubRepo = "wedding",
    [string]$VercelProject = "wedding",
    [string]$Domain = "solsticeof26.com",
    [switch]$SkipGit,
    [switch]$DryRun
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 Wedding Site Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Run this from apps/wedding directory." -ForegroundColor Red
    exit 1
}

$weddingDir = Get-Location

# Step 1: Git Setup (optional)
if (-not $SkipGit) {
    Write-Host "📦 Step 1: Git Repository Setup" -ForegroundColor Yellow
    Write-Host "----------------------------------------" -ForegroundColor Gray
    
    if (-not (Test-Path ".git")) {
        Write-Host "Initializing git repository..." -ForegroundColor Gray
        git init
        git add .
        git commit -m "Initial wedding website - Karl & Brit's Solstice of '26"
        Write-Host "✅ Git repository initialized" -ForegroundColor Green
    } else {
        Write-Host "✅ Git repository already initialized" -ForegroundColor Green
    }
    
    if ($GitHubUser -ne "") {
        $repoUrl = "https://github.com/$GitHubUser/$GitHubRepo.git"
        Write-Host ""
        Write-Host "📤 To push to GitHub, run:" -ForegroundColor Yellow
        Write-Host "   git remote add origin $repoUrl" -ForegroundColor Gray
        Write-Host "   git branch -M main" -ForegroundColor Gray
        Write-Host "   git push -u origin main" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host "⏭️  Skipping git setup" -ForegroundColor Gray
}

Write-Host ""

# Step 2: Deploy with Otto
Write-Host "🚀 Step 2: Deploying to Vercel with Otto" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray

# Navigate to workspace root for Otto commands
$workspaceRoot = Split-Path (Split-Path $weddingDir -Parent) -Parent
Set-Location $workspaceRoot

$dryRunFlag = if ($DryRun) { "--dry-run" } else { "" }
$repoParam = if ($GitHubUser -ne "") { "--repo $GitHubUser/$GitHubRepo" } else { "--repo YOUR_USERNAME/$GitHubRepo" }

Write-Host "Running Otto deployment command..." -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "🔍 DRY RUN MODE - No changes will be made" -ForegroundColor Cyan
    Write-Host ""
}

# Build the command
$ottoCmd = "python tools/infra.py setup-vercel-project --project $VercelProject $repoParam --root-dir apps/wedding --framework nextjs $dryRunFlag"

Write-Host "Command: $ottoCmd" -ForegroundColor Gray
Write-Host ""

# Execute the command
Invoke-Expression $ottoCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Deployment failed. Check the error messages above." -ForegroundColor Red
    Set-Location $weddingDir
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment command completed!" -ForegroundColor Green

# Step 3: Domain Configuration (optional)
if ($Domain -ne "") {
    Write-Host ""
    Write-Host "🌐 Step 3: Configure Custom Domain" -ForegroundColor Yellow
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host ""
    Write-Host "To configure domain, run:" -ForegroundColor Gray
    Write-Host "   python tools/infra.py configure-domain --project $VercelProject --domain $Domain" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then update DNS records at your domain registrar." -ForegroundColor Gray
}

# Return to wedding directory
Set-Location $weddingDir

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Deployment script completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Check Vercel dashboard for deployment status" -ForegroundColor Gray
Write-Host "  2. Test the site at the Vercel URL" -ForegroundColor Gray
Write-Host "  3. Configure custom domain if needed" -ForegroundColor Gray
Write-Host ""

