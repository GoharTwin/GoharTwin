# Unified release build — branding, frontend, PyInstaller API, Electron portable EXE
$ErrorActionPreference = "Stop"
$Root = (Resolve-Path "$PSScriptRoot\..").Path
$Version = "0.3.0"
$StagingBackend = Join-Path $Root "release\staging\backend"
$PyWork = Join-Path $Root "release\staging\pyinstaller-work"
$ElectronBuild = Join-Path $Root "release\output\electron-build"
$FinalOutput = Join-Path $Root "release\output"
$FinalExe = Join-Path $FinalOutput "GoharTwin-$Version-portable.exe"
$Python = Join-Path $Root "backend\.venv\Scripts\python.exe"

function Write-Step($msg) {
    Write-Host "`n=== $msg ===" -ForegroundColor Cyan
}

function Wait-Health($timeoutSec = 60) {
    $deadline = (Get-Date).AddSeconds($timeoutSec)
    while ((Get-Date) -lt $deadline) {
        try {
            $r = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/v1/health" -UseBasicParsing -TimeoutSec 3
            if ($r.StatusCode -eq 200) { return $true }
        } catch {}
        Start-Sleep -Seconds 1
    }
    return $false
}

function Stop-GoharTwinProcesses {
    Get-Process -Name "GoharTwin","gohartwin-api","electron" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Step "GoharTwin release build v$Version"

if (-not (Test-Path $Python)) {
    throw "Python venv not found at backend\.venv. Run: python -m venv backend\.venv"
}

Write-Step "1/6 Sync branding"
node "$Root\scripts\sync-branding.mjs"

Write-Step "2/6 Build frontend"
Push-Location "$Root\frontend"
npm install --no-fund --no-audit
npm run build
Pop-Location

Write-Step "3/6 Build standalone API (PyInstaller)"
New-Item -ItemType Directory -Force -Path $StagingBackend | Out-Null
New-Item -ItemType Directory -Force -Path $PyWork | Out-Null
Push-Location "$Root\backend"
$env:HTTP_PROXY = ""
$env:HTTPS_PROXY = ""
$env:ALL_PROXY = ""
$pyiCheck = & $Python -m pip show pyinstaller 2>$null
if (-not $pyiCheck) {
    & $Python -m pip install -r requirements-build.txt -q
}
& $Python -m PyInstaller gohartwin-api.spec --distpath $StagingBackend --workpath $PyWork --noconfirm
Pop-Location

$ApiExe = Join-Path $StagingBackend "gohartwin-api.exe"
if (-not (Test-Path $ApiExe)) {
    throw "PyInstaller did not produce gohartwin-api.exe at $ApiExe"
}
Write-Host "API executable: $ApiExe" -ForegroundColor Green

Write-Step "4/6 Quick API smoke test"
Stop-GoharTwinProcesses
$env:GOHARTWIN_ROOT = $Root
$apiProc = Start-Process -FilePath $ApiExe -PassThru -WindowStyle Hidden -WorkingDirectory $Root
try {
    if (-not (Wait-Health 45)) {
        throw "Bundled API failed health check"
    }
    Write-Host "API health check passed" -ForegroundColor Green
} finally {
    Stop-Process -Id $apiProc.Id -Force -ErrorAction SilentlyContinue
    Stop-GoharTwinProcesses
}

Write-Step "5/6 Build Electron portable"
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
Push-Location "$Root\desktop"
npm install --no-fund --no-audit
npm run dist
Pop-Location

$PortableBuilt = Get-ChildItem "$ElectronBuild\GoharTwin-*-portable.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $PortableBuilt) {
    throw "electron-builder did not produce a portable EXE in $ElectronBuild"
}

Write-Step "6/6 Copy final artifact"
New-Item -ItemType Directory -Force -Path $FinalOutput | Out-Null
Copy-Item $PortableBuilt.FullName $FinalExe -Force
Write-Host "Portable EXE: $FinalExe" -ForegroundColor Green
Write-Host "Size: $([math]::Round((Get-Item $FinalExe).Length / 1MB, 1)) MB"

Write-Step "Verify unpacked Electron app"
Stop-GoharTwinProcesses
$UnpackedExe = Join-Path $ElectronBuild "win-unpacked\GoharTwin.exe"
if (Test-Path $UnpackedExe) {
    $appProc = Start-Process -FilePath $UnpackedExe -PassThru -WindowStyle Hidden
    try {
        if (-not (Wait-Health 90)) {
            throw "Electron app failed health check"
        }
        Write-Host "Electron launch verification passed" -ForegroundColor Green
    } finally {
        Stop-Process -Id $appProc.Id -Force -ErrorAction SilentlyContinue
        Stop-GoharTwinProcesses
    }
}

Write-Host "`nRelease build complete." -ForegroundColor Green
Write-Host "Deliverable: $FinalExe"
