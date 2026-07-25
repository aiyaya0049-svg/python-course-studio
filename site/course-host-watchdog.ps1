param([int]$Port = 5173)

$ErrorActionPreference = 'SilentlyContinue'
$startupScript = Join-Path $PSScriptRoot 'course-host-startup.ps1'
$healthUrl = "http://127.0.0.1:$Port/__course_health"
$mutex = New-Object System.Threading.Mutex($false, 'Local\PythonCourseStudioWatchdog')
if (-not $mutex.WaitOne(0, $false)) { exit 0 }

try {
  while ($true) {
    $ready = $false
    try {
      $response = Invoke-WebRequest -UseBasicParsing $healthUrl -TimeoutSec 2
      $ready = $response.StatusCode -eq 200 -and $response.Content -match 'python-course-studio'
    } catch {}
    if (-not $ready) { & $startupScript -Port $Port }
    Start-Sleep -Seconds 15
  }
} finally {
  $mutex.ReleaseMutex()
  $mutex.Dispose()
}
