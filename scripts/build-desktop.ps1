# Build frontend then launch portable runtime
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Building frontend..."
Set-Location frontend
npm run build
Set-Location ..

Write-Host "Starting GoharTwin..."
python desktop\launcher.py
