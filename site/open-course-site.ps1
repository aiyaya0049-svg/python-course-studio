param(
  [ValidateSet('teacher', 'student')]
  [string]$Role = 'teacher'
)

$ErrorActionPreference = 'Stop'
$port = 5173
$startupScript = Join-Path $PSScriptRoot 'course-host-startup.ps1'
$healthUrl = "http://127.0.0.1:$port/__course_health"

function Test-CourseHost {
  try {
    $response = Invoke-WebRequest -UseBasicParsing $healthUrl -TimeoutSec 2
    return $response.StatusCode -eq 200 -and $response.Content -match 'python-course-studio'
  } catch {
    return $false
  }
}

function Wait-CourseHost {
  for ($attempt = 0; $attempt -lt 20; $attempt += 1) {
    if (Test-CourseHost) { return $true }
    Start-Sleep -Milliseconds 300
  }
  return $false
}

if (-not (Test-CourseHost)) {
  & $startupScript -Port $port

  if (-not (Wait-CourseHost)) {
    throw 'The course website could not start. Another application may already be using port 5173.'
  }
}

Start-Process "http://127.0.0.1:$port/#/$Role"
