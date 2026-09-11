$ErrorActionPreference = 'Continue'

# Read key
$lines = Get-Content 'D:\Startup-BA\.env.local'
$keyLine = $lines | Where-Object { $_ -match 'NEXT_PUBLIC_GEMINI_API_KEY' } | Select-Object -First 1
$key = ($keyLine -replace "^[^=]*=", "") -replace "'", ""
$key = $key.Trim()

# Save full response to file
$url = "https://generativelanguage.googleapis.com/v1beta/models?key=$key"
try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15 -Method GET
    $response.Content | Out-File -FilePath 'D:\Startup-BA\scripts\gemini-models.json' -Encoding UTF8
    Write-Host "Saved to gemini-models.json"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# Parse and list all model names + display names
$json = Get-Content 'D:\Startup-BA\scripts\gemini-models.json' -Raw | ConvertFrom-Json
Write-Host "`n=== Available models (name -> displayName) ==="
foreach ($m in $json.models) {
    Write-Host "$($m.name) | $($m.displayName) | methods=$($m.supportedGenerationMethods -join ',')"
}

Write-Host "`n=== Models with 'flash' in name ==="
foreach ($m in $json.models) {
    if ($m.name -like "*flash*") {
        Write-Host "$($m.name) | $($m.displayName)"
    }
}

Write-Host "`n=== Models with 'gemini-3' in name (preview/generation) ==="
foreach ($m in $json.models) {
    if ($m.name -like "*gemini-3*") {
        Write-Host "$($m.name) | $($m.displayName)"
    }
}
