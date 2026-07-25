param(
  [int]$Port = 5173
)

$ErrorActionPreference = 'Stop'
$serverScript = Join-Path $PSScriptRoot 'offline-server.ps1'
$healthUrl = "http://127.0.0.1:$Port/__course_health"

function Test-CourseHost {
  try {
    $response = Invoke-WebRequest -UseBasicParsing $healthUrl -TimeoutSec 2
    return $response.StatusCode -eq 200 -and $response.Content -match 'python-course-studio'
  } catch {
    return $false
  }
}

if (Test-CourseHost) {
  exit 0
}

if (-not (Test-Path -LiteralPath $serverScript -PathType Leaf)) {
  throw 'The local course server script is missing.'
}

$powershellPath = Join-Path $PSHOME 'powershell.exe'
$arguments = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$serverScript`" -Port $Port -NoBrowser -Quiet"
Start-Process -FilePath $powershellPath -ArgumentList $arguments -WindowStyle Hidden
