param(
  [int]$Port = 5173,
  [switch]$NoBrowser,
  [switch]$Quiet
)

$ErrorActionPreference = 'Stop'
$siteRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'dist'))

if ($Port -lt 1 -or $Port -gt 65535) {
  if (-not $Quiet) { Write-Host 'The configured port must be between 1 and 65535.' -ForegroundColor Red }
  exit 1
}

if (-not (Test-Path -LiteralPath (Join-Path $siteRoot 'index.html') -PathType Leaf)) {
  if (-not $Quiet) {
    Write-Host 'The course website has not been built. Run pnpm build in this folder first.' -ForegroundColor Red
    Read-Host 'Press Enter to close'
  }
  exit 1
}

if ($null -eq ('CourseLanServer' -as [type])) {
  Add-Type -TypeDefinition @'
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

public sealed class CourseLanServer : IDisposable
{
    private readonly string root;
    private readonly TcpListener listener;

    public CourseLanServer(string siteRoot, int port)
    {
        root = Path.GetFullPath(siteRoot);
        listener = new TcpListener(IPAddress.Any, port);
    }

    public void Start()
    {
        listener.Start(256);
    }

    public void ServeForever()
    {
        while (true)
        {
            var client = listener.AcceptTcpClient();
            Task.Run(() => HandleClient(client));
        }
    }

    private async Task HandleClient(TcpClient client)
    {
        using (client)
        using (var stream = client.GetStream())
        using (var reader = new StreamReader(stream, Encoding.ASCII, false, 4096, true))
        {
            try
            {
                var requestLine = await reader.ReadLineAsync();
                if (String.IsNullOrWhiteSpace(requestLine)) return;
                string headerLine;
                do { headerLine = await reader.ReadLineAsync(); } while (!String.IsNullOrEmpty(headerLine));

                var parts = requestLine.Split(' ');
                var method = parts.Length > 0 ? parts[0] : "";
                if (parts.Length < 2 || (method != "GET" && method != "HEAD"))
                {
                    await SendText(stream, 405, "Method Not Allowed");
                    return;
                }

                var rawPath = parts[1].Split('?')[0];
                if (String.Equals(rawPath, "/__course_health", StringComparison.OrdinalIgnoreCase))
                {
                    await SendJson(stream, "{\"service\":\"python-course-studio\",\"status\":\"ready\"}");
                    return;
                }
                var relativePath = Uri.UnescapeDataString(rawPath).TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
                if (String.IsNullOrWhiteSpace(relativePath)) relativePath = "index.html";

                var candidate = Path.GetFullPath(Path.Combine(root, relativePath));
                if (!candidate.StartsWith(root, StringComparison.OrdinalIgnoreCase) || !File.Exists(candidate))
                    candidate = Path.Combine(root, "index.html");

                var extension = Path.GetExtension(candidate).ToLowerInvariant();
                var contentType = MimeType(extension);
                var fileInfo = new FileInfo(candidate);
                var cacheControl = String.Equals(Path.GetFileName(candidate), "index.html", StringComparison.OrdinalIgnoreCase)
                    ? "no-cache"
                    : "public, max-age=86400";
                var header = "HTTP/1.1 200 OK\r\n" +
                    "Content-Type: " + contentType + "\r\n" +
                    "Content-Length: " + fileInfo.Length + "\r\n" +
                    "Cache-Control: " + cacheControl + "\r\n" +
                    "Connection: close\r\n\r\n";
                var headerBytes = Encoding.ASCII.GetBytes(header);
                await stream.WriteAsync(headerBytes, 0, headerBytes.Length);
                if (method == "HEAD") return;

                using (var file = new FileStream(candidate, FileMode.Open, FileAccess.Read, FileShare.Read, 65536, true))
                    await file.CopyToAsync(stream, 65536);
            }
            catch
            {
                // A browser may close a preloaded resource request; no course state is affected.
            }
        }
    }

    private static async Task SendText(NetworkStream stream, int status, string text)
    {
        var body = Encoding.UTF8.GetBytes(text);
        var header = "HTTP/1.1 " + status + " " + text + "\r\n" +
            "Content-Type: text/plain; charset=utf-8\r\n" +
            "Content-Length: " + body.Length + "\r\nConnection: close\r\n\r\n";
        var headerBytes = Encoding.ASCII.GetBytes(header);
        await stream.WriteAsync(headerBytes, 0, headerBytes.Length);
        await stream.WriteAsync(body, 0, body.Length);
    }

    private static async Task SendJson(NetworkStream stream, string json)
    {
        var body = Encoding.UTF8.GetBytes(json);
        var header = "HTTP/1.1 200 OK\r\n" +
            "Content-Type: application/json; charset=utf-8\r\n" +
            "Cache-Control: no-store\r\n" +
            "Content-Length: " + body.Length + "\r\nConnection: close\r\n\r\n";
        var headerBytes = Encoding.ASCII.GetBytes(header);
        await stream.WriteAsync(headerBytes, 0, headerBytes.Length);
        await stream.WriteAsync(body, 0, body.Length);
    }

    private static string MimeType(string extension)
    {
        switch (extension)
        {
            case ".html": return "text/html; charset=utf-8";
            case ".css": return "text/css; charset=utf-8";
            case ".js":
            case ".mjs": return "text/javascript; charset=utf-8";
            case ".json":
            case ".map": return "application/json; charset=utf-8";
            case ".wasm": return "application/wasm";
            case ".svg": return "image/svg+xml";
            case ".png": return "image/png";
            case ".zip": return "application/zip";
            case ".whl": return "application/octet-stream";
            default: return "application/octet-stream";
        }
    }

    public void Dispose()
    {
        listener.Stop();
    }
}
'@ -Language CSharp
}

$server = $null
try {
  $server = [CourseLanServer]::new($siteRoot, $Port)
  $server.Start()
} catch {
  if ($null -ne $server) { $server.Dispose() }
  if (-not $Quiet) {
    Write-Host "Unable to start the course website on port $Port." -ForegroundColor Red
    Read-Host 'Press Enter to close'
  }
  exit 1
}

$lanAddresses = [System.Net.NetworkInformation.NetworkInterface]::GetAllNetworkInterfaces() |
  Where-Object { $_.OperationalStatus -eq [System.Net.NetworkInformation.OperationalStatus]::Up } |
  ForEach-Object { $_.GetIPProperties().UnicastAddresses } |
  ForEach-Object { $_.Address } |
  Where-Object { $_.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork -and -not [System.Net.IPAddress]::IsLoopback($_) } |
  ForEach-Object { $_.IPAddressToString } |
  Select-Object -Unique

$teacherUrl = "http://127.0.0.1:$Port/#/teacher"
$studentUrl = "http://127.0.0.1:$Port/#/student"
if (-not $Quiet) {
  Write-Host ''
  Write-Host 'Course website is running. Internet access is not required.' -ForegroundColor Green
  Write-Host "Teacher on this computer: $teacherUrl"
  Write-Host "Student on this computer: $studentUrl"
  if ($lanAddresses) {
    Write-Host ''
    Write-Host 'LAN access for student devices on the same network:' -ForegroundColor Cyan
    foreach ($address in $lanAddresses) {
      Write-Host "Teacher: http://${address}:$Port/#/teacher"
      Write-Host "Student: http://${address}:$Port/#/student"
    }
    Write-Host 'If Windows asks for permission, allow access on Private networks.' -ForegroundColor Yellow
  }
  Write-Host 'The background service can remain active after the command window closes.'
}

if (-not $NoBrowser) {
  Start-Process $teacherUrl
}

try {
  $server.ServeForever()
} finally {
  if ($null -ne $server) { $server.Dispose() }
}
