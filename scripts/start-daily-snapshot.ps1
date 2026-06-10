$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$runner = Join-Path $root "scripts\run-daily-snapshot-server.cmd"
$pidFile = Join-Path $root ".daily-snapshot-server.pid"

if (-not (Test-Path -LiteralPath (Join-Path $root "dist\index.html"))) {
    Write-Host "dist is missing. Run pnpm run build first." -ForegroundColor Yellow
    exit 1
}

$existing = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($existing) {
    Write-Host "Daily Snapshot is already running on http://127.0.0.1:8080/daily-snapshot"
    Write-Host "PID: $($existing.OwningProcess)"
    Set-Content -LiteralPath $pidFile -Value $existing.OwningProcess
    exit 0
}

$process = Start-Process -FilePath $runner -WorkingDirectory $root -WindowStyle Minimized -PassThru
Start-Sleep -Seconds 3

$statusCode = $null
try {
    $statusCode = (Invoke-WebRequest -Uri "http://127.0.0.1:8080/daily-snapshot" -UseBasicParsing -TimeoutSec 5).StatusCode
}
catch {
    Write-Host "Server failed to start: $($_.Exception.Message)" -ForegroundColor Red
    if ($process -and -not $process.HasExited) {
        Stop-Process -Id $process.Id -Force
    }
    exit 1
}

$connection = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object -First 1
$serverPid = if ($connection) { $connection.OwningProcess } else { $process.Id }
Set-Content -LiteralPath $pidFile -Value $serverPid
Write-Host "Daily Snapshot is running: http://127.0.0.1:8080/daily-snapshot"
Write-Host "PID: $serverPid, HTTP: $statusCode"
