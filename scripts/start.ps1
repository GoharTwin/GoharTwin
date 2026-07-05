# Start GoharTwin v0.2 (backend + frontend)

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "Starting GoharTwin v0.2..." -ForegroundColor Cyan

# Backend (uses the project venv)
Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "cd '$Root\backend'; .\.venv\Scripts\python.exe main.py"
)

Start-Sleep -Seconds 3

# Frontend
Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "cd '$Root\frontend'; npm install; npm run dev"
)

Write-Host ""
Write-Host "  UI:  http://127.0.0.1:5173" -ForegroundColor Green
Write-Host "  API: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host ""
