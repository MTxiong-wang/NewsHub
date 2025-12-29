@echo off
chcp 65001 >nul
echo.
echo 🚀 NewsHub 本地开发环境启动
echo.

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js 18+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%
echo.

REM 检查依赖
if not exist "node_modules\" (
    echo 📦 正在安装依赖...
    call npm install
    echo.
)

REM 启动开发服务器
echo 🎯 启动开发服务器...
echo    访问地址: http://localhost:3000
echo.
call npm run dev
