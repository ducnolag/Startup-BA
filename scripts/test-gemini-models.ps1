$ErrorActionPreference = 'Continue'

# Read key
$lines = Get-Content 'D:\Startup-BA\.env.local'
$keyLine = $lines | Where-Object { $_ -match 'NEXT_PUBLIC_GEMINI_API_KEY' } | Select-Object -First 1
$key = ($keyLine -replace "^[^=]*=", "") -replace "'", ""
$key = $key.Trim()

# Use single quotes around URL to avoid PowerShell colon parsing
$models = @(
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-3-flash-preview',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
    'gemini-flash-lite-latest'
)

$body = @{
    contents = @(
        @{
            parts = @(
                @{ text = "Reply with just the word OK." }
            )
        }
    )
    generationConfig = @{
        maxOutputTokens = 10
        temperature = 0
    }
} | ConvertTo-Json -Depth 10

foreach ($m in $models) {
    # Use backtick to escape colon in URL, and pass via WebRequest Session
    $target = 'https://generativelanguage.googleapis.com/v1beta/models/' + $m + ':generateContent?key=' + $key
    try {
        $response = Invoke-WebRequest -Uri $target -UseBasicParsing -TimeoutSec 20 -Method POST -ContentType 'application/json' -Body $body
        $r = $response.Content | ConvertFrom-Json
        $text = $r.candidates[0].content.parts[0].text
        Write-Host "[$m] OK status=$($response.StatusCode) reply='$text'"
    } catch {
        $status = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 'N/A' }
        $errBody = ''
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errBody = $reader.ReadToEnd()
        }
        if ($errBody.Length -gt 200) { $errBody = $errBody.Substring(0, 200) + '...' }
        Write-Host "[$m] FAIL status=$status error=$errBody"
    }
    Start-Sleep -Milliseconds 800
}
