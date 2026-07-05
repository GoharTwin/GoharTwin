# Unified build: branding sync → frontend production → ready for web + desktop
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "=== GoharTwin unified build ===" -ForegroundColor Cyan

Write-Host "[1/3] Sync branding from logo/logo.png..."
node scripts\sync-branding.mjs

Write-Host "[2/3] Build frontend..."
Set-Location frontend
npm run build
Set-Location ..

Write-Host "[3/3] Build complete." -ForegroundColor Green
Write-Host "  Web:    backend serves frontend/dist (python backend/main.py)"
Write-Host "  Dev:    cd frontend; npm run dev"
Write-Host "  Desktop: .\scripts\build-desktop.ps1"
