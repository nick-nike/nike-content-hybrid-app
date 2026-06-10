$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$pidFile = Join-Path $root ".daily-snapshot-server.pid"

$pids = @()
if (Test-Path -LiteralPath $pidFile) {
    $saved = Get-Content -LiteralPath $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($saved -match "^\d+$") {
        $pids += [int]$saved
    }
}

$connections = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
foreach ($connection in $connections) {
    if ($connection.OwningProcess -and ($pids -notcontains $connection.OwningProcess)) {
        $pids += $connection.OwningProcess
    }
}

if ($pids.Count -eq 0) {
    Write-Host "Daily Snapshot server is not running."
    exit 0
}

foreach ($pidValue in ($pids | Sort-Object -Unique)) {
    $process = Get-Process -Id $pidValue -ErrorAction SilentlyContinue
    if ($process) {
        Stop-Process -Id $pidValue -Force
        Write-Host "Stopped PID: $pidValue"
    }
}

if (Test-Path -LiteralPath $pidFile) {
    Remove-Item -LiteralPath $pidFile -Force
}

Write-Host "Daily Snapshot server stopped."
