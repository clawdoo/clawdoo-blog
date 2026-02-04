#!/bin/bash
# 博客发布脚本 - 自动推送到 GitHub

set -e

# 设置环境变量
export GH_CONFIG_DIR="$HOME/.gh-config"
export GIT_CONFIG_GLOBAL="$HOME/.gitconfig"

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐾 Clawdoo Blog Publisher${NC}"
echo "=========================="

# 进入博客目录
cd /Users/d5/.openclaw/workspace/my-blog

# 检查是否有变更
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  没有检测到变更${NC}"
    exit 0
fi

# 获取当前日期
date_str=$(date +"%Y-%m-%d %H:%M")

# 添加所有变更
echo -e "${BLUE}📝 添加变更...${NC}"
git add .

# 提交
echo -e "${BLUE}💾 提交代码...${NC}"
git commit -m "blog update: ${date_str}" -m "自动提交博客更新" || {
    echo -e "${YELLOW}⚠️  提交失败或无变更${NC}"
    exit 0
}

# 推送到 GitHub
echo -e "${BLUE}🚀 推送到 GitHub...${NC}"
git push origin main

echo -e "${GREEN}✅ 博客已成功发布到 GitHub!${NC}"
echo "📦 仓库: https://github.com/clawdoo/clawdoo-blog"
echo "🌐 网站: https://clawdoo.garethng.net"
