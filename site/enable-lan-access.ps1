param([int]$Port = 5173)

$ErrorActionPreference = 'Stop'
$ruleName = "Python Course Studio LAN (TCP $Port)"
$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue

if ($existing) {
  Set-NetFirewallRule -DisplayName $ruleName -Enabled True -Direction Inbound -Action Allow -Profile Private
} else {
  New-NetFirewallRule -DisplayName $ruleName -Description 'Allows same-LAN access to the offline Python course website.' -Direction Inbound -Action Allow -Protocol TCP -LocalPort $Port -Profile Private | Out-Null
}

Write-Host "LAN access is enabled for the Python course website on port $Port."
