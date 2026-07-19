#!/usr/bin/env bash
# 학습 페이지 → 인쇄용 PDF 생성 (WSL에서 Windows Chrome 사용). 콘텐츠 수정 후 재실행해 pdf/ 갱신.
set -e
CHROME="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
BASE="https://axis.tesorae.com"
declare -A PAGES=(
  [warmup]="/modules/warmup.html"
  [module-0]="/modules/00-orientation.html"
  [module-1]="/modules/01-hardware.html"
  [module-2]="/modules/02-how-llm-works.html"
  [module-3]="/modules/03-quantization.html"
  [module-4]="/modules/04-serving-engines.html"
  [module-5]="/modules/05-rag-agent.html"
  [module-6]="/modules/06-evaluation.html"
  [module-7]="/modules/07-hw-ecosystem.html"
  [glossary]="/modules/09-glossary.html"
  [selfcheck]="/modules/08-selfcheck.html"
)
for name in "${!PAGES[@]}"; do
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
    --print-to-pdf="C:\\Users\\hana\\_axis_pdf.pdf" "$BASE${PAGES[$name]}" 2>/dev/null
  cp /mnt/c/Users/hana/_axis_pdf.pdf "pdf/axis-$name.pdf"
  echo "pdf/axis-$name.pdf ✓"
done
rm -f /mnt/c/Users/hana/_axis_pdf.pdf
