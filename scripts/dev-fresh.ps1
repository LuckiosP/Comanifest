# Stop dev servers on 3000/3001, clear .next, start dev.
$ErrorActionPreference = "SilentlyContinue"

foreach ($port in 3000, 3001) {
  $connections = netstat -ano | Select-String ":$port\s.*LISTENING"
  foreach ($line in $connections) {
    $processId = ($line -split "\s+")[-1]
    if ($processId -match "^\d+$") {
      Write-Host "Stopping process $processId on port $port..."
      taskkill /PID $processId /F | Out-Null
    }
  }
}

Start-Sleep -Seconds 2

if (Test-Path ".next") {
  Write-Host "Removing .next cache..."
  Remove-Item -Recurse -Force ".next"
}

Write-Host "Starting dev server..."
npm.cmd run dev
