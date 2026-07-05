# Start GoharTwin v0.1 (backend + frontend)

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "Starting GoharTwin v0.1..." -ForegroundColor Cyan

# Backend
Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "cd '$Root\backend'; python main.py"
)

Start-Sleep -Seconds 3

# Frontend
Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "cd '$Root\frontend'; npm install; npm run dev"
)

Write-Host ""
Write-Host "  UI:  http://localhost:5173" -ForegroundColor Green
Write-Host "  API: http://localhost:8000" -ForegroundColor Green
Write-Host ""
