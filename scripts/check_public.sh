#!/usr/bin/env bash
# 대외 공개 게이트 — push 전 매번 실행. 하나라도 걸리면 push 금지.
# (원본: cop-axis 자료/시스템_아키텍처.md "외부 공개 체크리스트"를 기계화)
set -u
cd "$(dirname "$0")/.."
FAIL=0

check() {
    local label="$1" pattern="$2"
    local hits
    hits=$(grep -rniE "$pattern" --exclude-dir=.git --exclude-dir=scripts . 2>/dev/null | grep -v "qr-axis" || true)
    if [ -n "$hits" ]; then
        echo "❌ $label:"
        echo "$hits" | head -10
        FAIL=1
    else
        echo "✓ $label 없음"
    fi
}

check "기관 실명"        "한국특허정보원|특허정보원|KIPI"
check "개인 실명"        "고나래|narae"
check "개인 발표 귀속"   "6월 발표|6월 시연|6월 데모|6월 핸즈온|리더의 사전|리더가 올해|단독 사전 실증"
check "내부 인프라 식별" "100\.[0-9]+\.[0-9]+\.[0-9]+|192\.168\.|P100 [0-9]장|기할당"
# 발표덱: 실제 파일 존재 또는 HTML 내 링크만 검사 (문서의 설명 문구는 허용)
if [ -f deck.html ] || [ -f assets/deck.js ] \
   || grep -rn 'deck\.html\|deck\.js' --include="*.html" --exclude-dir=.git . >/dev/null 2>&1; then
    echo "❌ 발표덱 잔존 (deck 파일 또는 HTML 링크)"
    FAIL=1
else
    echo "✓ 발표덱 잔존 없음"
fi

if [ "$FAIL" -eq 1 ]; then
    echo; echo "위 항목을 제거하기 전에는 push 하지 말 것."
    exit 1
fi
echo; echo "게이트 통과 — push 가능."
