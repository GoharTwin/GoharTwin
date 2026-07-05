# Desktop launcher — uses the same unified build as web (no manual copy steps)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "=== GoharTwin desktop build ===" -ForegroundColor Cyan
& "$PSScriptRoot\build-all.ps1"

Write-Host "Starting GoharTwin desktop..."
python desktop\launcher.py
