@echo off
cd /d "%~dp0"
title Internet Checker Setup

echo ============================================
echo   SKB / KT / LGU+ 통합 가용성 조회 도구
echo ============================================
echo.

REM ---- Node.js 설치 확인 ----
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [1/3] Node.js가 설치되어 있지 않습니다.
    echo        winget으로 설치를 시도합니다...
    echo.
    winget install OpenJS.NodeJS.LTS 2>&1
    if %errorlevel% equ 0 (
        echo Node.js 설치 완료.
        echo 설치를 완료하려면 setup.bat를 다시 실행해주세요.
    ) else (
        echo.
        echo winget 설치에 실패했습니다.
        echo https://nodejs.org 에서 LTS 버전을 직접 설치해주세요.
        echo.
        pause
        exit /b 1
    )
    exit /b 0
)

REM ---- npm install ----
echo [1/2] npm install 실행 중...
if not exist node_modules (
    call npm install
) else (
    echo       node_modules가 이미 존재합니다. (생략)
)

echo.
echo [2/2] 서버 시작 중...
echo.

start /B node server.js
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo ============================================
echo   http://localhost:3000 열렸습니다
echo   아무 키나 누르면 서버가 종료됩니다
echo ============================================
pause >nul
taskkill /f /im node.exe >nul 2>&1
