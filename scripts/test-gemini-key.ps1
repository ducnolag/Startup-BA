$ErrorActionPreference = 'Continue'

# Read key
$lines = Get-Content 'D:\Startup-BA\.env.local'
$keyLine = $lines | Where-Object { $_ -match 'NEXT_PUBLIC_GEMINI_API_KEY' } | Select-Object -First 1
$key = ($keyLine -replace "^[^=]*=", "") -replace "'", ""
$key = $key.Trim()

Write-Host "Key prefix: $($key.Substring(0, [Math]::Min(15, $key.Length)))"
Write-Host "Key length: $($key.Length)"
Write-Host "Key looks like AIza key: $($key.StartsWith('AIza'))"

# Try to list models
$url = "https://generativelanguage.googleapis.com/v1beta/models?key=$key"
try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15 -Method GET
    Write-Host "HTTP Status: $($response.StatusCode)"
    Write-Host "Body (first 2000 chars):"
    Write-Host $response.Content.Substring(0, [Math]::Min(2000, $response.Content.Length))
} catch {
    Write-Host "Error type: $($_.Exception.GetType().FullName)"
    Write-Host "Error message: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode
        Write-Host "HTTP Status: $statusCode"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        Write-Host "Body: $body"
    }
}
