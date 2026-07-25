$ErrorActionPreference = 'Stop'
$startupFolder = [Environment]::GetFolderPath('Startup')
$shortcutPath = Join-Path $startupFolder 'PythonCourseStudioHost.lnk'
$startupScript = Join-Path $PSScriptRoot 'course-host-startup.ps1'
$startupVbs = Join-Path $PSScriptRoot 'course-host-startup.vbs'
$watchdogScript = Join-Path $PSScriptRoot 'course-host-watchdog.ps1'
$watchdogShortcutPath = Join-Path $startupFolder 'PythonCourseStudioWatchdog.lnk'
$healthUrl = 'http://127.0.0.1:5173/__course_health'

if (-not (Test-Path -LiteralPath $startupScript -PathType Leaf) -or -not (Test-Path -LiteralPath $startupVbs -PathType Leaf) -or -not (Test-Path -LiteralPath $watchdogScript -PathType Leaf)) {
  throw 'The persistent course host files are incomplete.'
}

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $startupVbs
$shortcut.WorkingDirectory = $PSScriptRoot
$shortcut.WindowStyle = 7
$shortcut.Description = 'Keeps the offline Python course website available after sign-in.'
$shortcut.Save()

$watchdogShortcut = $shell.CreateShortcut($watchdogShortcutPath)
$watchdogShortcut.TargetPath = Join-Path $PSHOME 'powershell.exe'
$watchdogShortcut.Arguments = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$watchdogScript`""
$watchdogShortcut.WorkingDirectory = $PSScriptRoot
$watchdogShortcut.WindowStyle = 7
$watchdogShortcut.Description = 'Restarts the offline Python course website if the local service stops.'
$watchdogShortcut.Save()

& $startupScript
$watchdogRunning = Get-CimInstance Win32_Process -Filter "Name = 'powershell.exe'" | Where-Object { $_.CommandLine -like '*course-host-watchdog.ps1*' }
if (-not $watchdogRunning) {
  Start-Process -FilePath (Join-Path $PSHOME 'powershell.exe') -ArgumentList "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$watchdogScript`"" -WindowStyle Hidden
}
for ($attempt = 0; $attempt -lt 20; $attempt += 1) {
  try {
    $response = Invoke-WebRequest -UseBasicParsing $healthUrl -TimeoutSec 2
    if ($response.StatusCode -eq 200 -and $response.Content -match 'python-course-studio') {
      exit 0
    }
  } catch {}
  Start-Sleep -Milliseconds 300
}

throw 'The persistent course host did not become ready on port 5173.'
