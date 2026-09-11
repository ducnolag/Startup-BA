try {
    $code = Get-Content 'D:\Startup-BA\apps\watermark-remover\app.py' -Raw
    $errors = $null
    $null = [System.Management.Automation.Language.Parser]::ParseInput($code, [ref]$errors, [ref]$null)
    if ($errors) {
        Write-Host "PowerShell-like parse errors:"
        foreach ($e in $errors) {
            Write-Host "  $($e.Extent.StartLineNumber): $($e.Message)"
        }
    } else {
        Write-Host "OK (PS-style parse)"
    }
} catch {
    Write-Host "PS parse error: $($_.Exception.Message)"
}

# Use cmd to call python
$pyCheck = @"
import ast
import sys
try:
    with open(r'D:\Startup-BA\apps\watermark-remover\app.py') as f:
        ast.parse(f.read())
    print('Python AST parse OK')
except SyntaxError as e:
    print('SyntaxError: line', e.lineno, '-', e.msg)
    sys.exit(1)
"@

$temp = 'D:\Startup-BA\scripts\_check_py.py'
$pyCheck | Out-File -FilePath $temp -Encoding ASCII
$out = & python $temp 2>&1
Write-Host $out
Remove-Item $temp -ErrorAction SilentlyContinue
