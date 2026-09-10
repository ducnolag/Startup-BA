@echo off
REM =============================================================================
REM agent_runner/run.bat — Launch script for Toolify agent runner
REM
REM Usage:
REM   run.bat                 # Uses existing ANTHROPIC_API_KEY from environment
REM   run.bat <api_key>       # Sets ANTHROPIC_API_KEY temporarily
REM =============================================================================

setlocal enabledelayedexpansion

cd /d "%~dp0"

REM Check for API key argument
if not "%~1"=="" (
    set "ANTHROPIC_API_KEY=%~1"
) else (
    if "%ANTHROPIC_API_KEY%"=="" (
        echo WARNING: ANTHROPIC_API_KEY not set.
        echo Set it as environment variable or pass as argument.
        echo Example: run.bat sk-ant-...
        echo.
    )
)

REM Get the path to the venv Python
set "SCRIPT_DIR=%~dp0"
set "VENV_PYTHON=%SCRIPT_DIR%..\.venv\Scripts\python.exe"

REM Check if venv Python exists
if exist "%VENV_PYTHON%" (
    set "PYTHON=%VENV_PYTHON%"
) else (
    REM Fallback to system Python
    set "PYTHON=python"
)

echo Starting Toolify Agent Runner...
echo Python: %PYTHON%
echo API Key configured: %ANTHROPIC_API_KEY:~0,20%...
echo.

REM Run the agent runner
"%PYTHON%" -m agent_runner.runner

endlocal
