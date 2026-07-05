# Build GoharTwin portable desktop executable
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

Write-Host "Building frontend..."
Push-Location "$Root\frontend"
npm install
npm run build
Pop-Location

Write-Host "Installing desktop dependencies..."
Push-Location "$Root\desktop"
npm install
Write-Host "Running electron-builder (portable)..."
npm run dist
Pop-Location

Write-Host "Done. Check desktop\dist\ for GoharTwin portable exe."
