# 보안 가이드 (Security Guide)

## 🔒 환경변수 설정

이 프로젝트는 민감한 정보를 환경변수로 관리합니다.

### 로컬 개발 환경

1. `.env.example`을 복사하여 `.env` 파일 생성:
```bash
cp .env.example .env
```

2. `.env` 파일에 실제 값 입력:
```env
GOOGLE_CLIENT_ID=your_actual_google_client_id
```

### 배포 환경

#### Vercel 배포시
```bash
vercel env add GOOGLE_CLIENT_ID
```

#### Netlify 배포시
```
Site settings → Environment variables → Add variable
```

## ⚠️ 보안 주의사항

- **절대 Git에 API 키나 시크릿을 커밋하지 마세요**
- 모든 민감한 정보는 환경변수 사용
- `.env` 파일은 `.gitignore`에 포함됨

## 🛡️ 현재 보안 설정

✅ Google Client ID: 환경변수 처리 완료
✅ .gitignore: 민감한 파일 제외 설정
✅ .env.example: 환경변수 가이드 제공