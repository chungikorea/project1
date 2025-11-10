#!/bin/bash
# Render 배포용 빌드 스크립트

echo "🔧 환경변수를 config.js로 변환 중..."

# 환경변수가 설정되어 있는지 확인
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ 오류: SUPABASE_URL 또는 SUPABASE_ANON_KEY 환경변수가 설정되지 않았습니다."
    echo "Render 대시보드에서 Environment Variables를 설정해주세요."
    exit 1
fi

# config.js 파일 생성
cat > js/config.js << EOF
// 이 파일은 빌드 시 자동 생성됩니다
// Render 환경변수에서 값을 가져옵니다
window.ENV_CONFIG = {
    SUPABASE_URL: '${SUPABASE_URL}',
    SUPABASE_ANON_KEY: '${SUPABASE_ANON_KEY}'
};
EOF

echo "✅ config.js 파일이 생성되었습니다."
echo "📦 빌드 완료!"

