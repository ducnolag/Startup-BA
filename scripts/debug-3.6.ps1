$ErrorActionPreference = 'Continue'

# Read key
$lines = Get-Content 'D:\Startup-BA\.env.local'
$keyLine = $lines | Where-Object { $_ -match 'NEXT_PUBLIC_GEMINI_API_KEY' } | Select-Object -First 1
$key = ($keyLine -replace "^[^=]*=", "") -replace "'", ""
$key = $key.Trim()

$body = @{
    contents = @(
        @{
            parts = @(
                @{ text = "OK" }
            )
        }
    )
    generationConfig = @{
        maxOutputTokens = 10
        temperature = 0
    }
} | ConvertTo-Json -Depth 10

$target = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + $key
Write-Host "URL length: $($target.Length)"
Write-Host "URL: $($target.Substring(0, 80))..."

try {
    $response = Invoke-WebRequest -Uri $target -UseBasicParsing -TimeoutSec 30 -Method POST -ContentType 'application/json' -Body $body
    Write-Host "OK: $($response.StatusCode)"
    Write-Host $response.Content.Substring(0, [Math]::Min(500, $response.Content.Length))
} catch {
    Write-Host "Exception type: $($_.Exception.GetType().FullName)"
    Write-Host "Exception message: $($_.Exception.Message)"
    if ($_.Exception.InnerException) {
        Write-Host "Inner exception: $($_.Exception.InnerException.Message)"
    }
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode
        Write-Host "HTTP Status: $statusCode"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        Write-Host "Body: $body"
    }
}
