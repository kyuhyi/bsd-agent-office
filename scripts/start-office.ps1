$ErrorActionPreference = 'Stop'
$officeRoot = Split-Path -Parent $PSScriptRoot
$officeUrl = 'http://127.0.0.1:43140'
try {
  $officeHealth = Invoke-WebRequest -Uri "$officeUrl/office-api/session" -TimeoutSec 3 -UseBasicParsing
  if ($officeHealth.StatusCode -eq 200) { Start-Process $officeUrl; exit 0 }
} catch {}
$officeData = Join-Path $officeRoot '.office'
New-Item -ItemType Directory -Path $officeData -Force | Out-Null
$officeNode = (Get-Command node.exe).Source
Start-Process -FilePath $officeNode -ArgumentList 'services/server.mjs' -WorkingDirectory $officeRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $officeData 'server.log') -RedirectStandardError (Join-Path $officeData 'server-error.log')
for ($officeAttempt = 0; $officeAttempt -lt 40; $officeAttempt++) {
  Start-Sleep -Milliseconds 500
  try {
    $officeHealth = Invoke-WebRequest -Uri "$officeUrl/office-api/session" -TimeoutSec 2 -UseBasicParsing
    if ($officeHealth.StatusCode -eq 200) { Start-Process $officeUrl; exit 0 }
  } catch {}
}
throw '사무실이 시작되지 않았습니다. .office/server-error.log를 확인해주세요.'
