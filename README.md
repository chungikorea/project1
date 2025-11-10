# 청AI - Simple Project Hub

Supabase를 활용한 심플한 데이터 관리 웹 애플리케이션

## 🚀 로컬 개발 환경 설정

### 1. 환경변수 설정

```bash
# config.example.js를 config.js로 복사
cp js/config.example.js js/config.js
```

### 2. config.js 파일 수정

`js/config.js` 파일을 열어서 실제 Supabase 정보를 입력하세요:

```javascript
window.ENV_CONFIG = {
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-anon-key-here'
};
```

### 3. 브라우저에서 실행

`index.html` 파일을 브라우저로 열거나, 로컬 서버를 실행하세요:

```bash
# Python 3 사용 시
python -m http.server 8080

# Node.js 사용 시
npx serve
```

## 🌐 Render에 배포하기

### 방법 1: Static Site 배포 (권장)

1. **Render 대시보드에서 New Static Site 선택**

2. **Git 저장소 연결**

3. **환경변수 설정**
   - Render 대시보드 → Environment → Add Environment Variable
   - 다음 변수들을 추가:
     ```
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_ANON_KEY=your-anon-key-here
     ```

4. **Build Command** (선택사항):
   ```bash
   echo "window.ENV_CONFIG = { SUPABASE_URL: '$SUPABASE_URL', SUPABASE_ANON_KEY: '$SUPABASE_ANON_KEY' };" > js/config.js
   ```

5. **Publish Directory**: 
   ```
   .
   ```

### 방법 2: 수동 배포

1. 로컬에서 `js/config.js` 파일을 실제 값으로 작성
2. Render에 배포
3. 배포 후 환경변수는 Render 대시보드에서 관리

## 📂 프로젝트 구조

```
home/
├── css/
│   └── style.css           # 스타일시트
├── js/
│   ├── config.js          # 환경변수 (Git 제외됨)
│   ├── config.example.js  # 환경변수 템플릿
│   └── script.js          # 메인 JavaScript
├── index.html             # 메인 HTML
├── .gitignore            # Git 무시 파일
└── README.md             # 이 파일
```

## 🔒 보안 주의사항

- `js/config.js` 파일은 절대 Git에 커밋하지 마세요
- `.gitignore`에 `js/config.js`가 포함되어 있는지 확인하세요
- Supabase anon key는 공개되어도 안전하지만, Row Level Security(RLS)를 반드시 설정하세요

## 🛠 기능

- ✅ Supabase 데이터 조회
- ✅ 페이지네이션 (10개씩 블록 방식)
- ✅ 다중 필드 검색 (no, name, role, department, e_mail, phone, exhibitor)
- ✅ 반응형 UI

## 📝 데이터베이스 테이블 구조

```sql
-- MEDICA_2025 테이블
CREATE TABLE MEDICA_2025 (
  no INT,
  name TEXT,
  role TEXT,
  department TEXT,
  e_mail TEXT,
  phone TEXT,
  exhibitor TEXT
);
```

## 🐛 문제 해결

### "환경변수가 설정되지 않았습니다" 에러

1. `js/config.js` 파일이 존재하는지 확인
2. `index.html`에서 `config.js`가 로드되는지 확인
3. 브라우저 콘솔에서 `window.ENV_CONFIG` 확인

### Supabase 연결 오류

1. Supabase URL과 Anon Key가 올바른지 확인
2. Supabase 프로젝트가 Paused 상태가 아닌지 확인
3. 테이블 이름이 `MEDICA_2025`와 일치하는지 확인
4. Row Level Security 정책 확인

## 📞 문의

문제가 있거나 개선 사항이 있으면 이슈를 등록해주세요!

