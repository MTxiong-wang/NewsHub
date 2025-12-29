#!/bin/bash

# NewsHub 快速启动脚本

echo "🚀 NewsHub 本地开发环境启动"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo ""

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    echo ""
fi

# 启动开发服务器
echo "🎯 启动开发服务器..."
echo "   访问地址: http://localhost:3000"
echo ""
npm run dev
