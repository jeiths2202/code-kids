# 🚀 CodeKids Platform 배포 가이드

## 보안 아키텍처

```
학생 브라우저 → Vercel 서버리스 함수 → Google Drive API
                    ↑
              (환경변수에 저장된
               API 키와 토큰 사용)
```

**핵심 보안 특징:**
- ✅ Client ID와 Secret이 클라이언트에 노출되지 않음
- ✅ Refresh Token이 서버에만 저장됨
- ✅ 학생들은 로그인 없이 사용 가능
- ✅ 모든 민감한 정보는 환경변수로 관리

## Step 1: Refresh Token 획득

1. `http://localhost:8888/get-refresh-token.html` 열기
2. 가이드에 따라 Google OAuth Playground에서 Refresh Token 획득
3. 다음 정보 준비:
   - Client ID (이미 있음)
   - Client Secret (Google Cloud Console에서 확인)
   - Refresh Token (OAuth Playground에서 획득)

## Step 2: Vercel 환경변수 설정

### 옵션 A: Vercel CLI 사용

```bash
# 환경변수 추가 (각각 실행)
vercel env add GOOGLE_CLIENT_ID
# 입력: 129459484885-49jhhorvjq9cbd1nhjnf4qlrslqchdj7.apps.googleusercontent.com

vercel env add GOOGLE_CLIENT_SECRET
# 입력: GOCSPX-... (Google Cloud Console에서 복사)

vercel env add GOOGLE_REFRESH_TOKEN
# 입력: 1//0... (OAuth Playground에서 복사)

vercel env add GOOGLE_DRIVE_FOLDER_ID
# 입력: 1rEMeET9wqGR2Ky-fefFm6BumbXsRBi77
```

### 옵션 B: Vercel Dashboard 사용

1. https://vercel.com 로그인
2. 프로젝트 선택 → Settings → Environment Variables
3. 다음 변수 추가:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REFRESH_TOKEN`
   - `GOOGLE_DRIVE_FOLDER_ID`

## Step 3: 배포

```bash
# 프로덕션 배포
vercel --prod
```

## Step 4: 테스트

배포 후 URL: `https://your-app.vercel.app/editor.html`

1. "클라우드 프로젝트 갤러리" 클릭
2. Google Drive 프로젝트가 자동으로 표시됨
3. 학생들은 로그인 없이 바로 사용 가능

## 로컬 개발 테스트

```bash
# Vercel 개발 서버 실행 (환경변수 자동 로드)
vercel dev
```

브라우저에서 `http://localhost:3000` 접속

## 문제 해결

### 환경변수 확인
```bash
vercel env ls
```

### 로그 확인
```bash
vercel logs
```

### 일반적인 문제

1. **"Server configuration error"**
   - 환경변수가 설정되지 않음
   - 해결: Vercel Dashboard에서 환경변수 확인

2. **"Failed to get access token"**
   - Refresh Token이 만료되거나 잘못됨
   - 해결: OAuth Playground에서 새 토큰 획득

3. **"Failed to load projects"**
   - Google Drive 폴더 접근 권한 문제
   - 해결: 폴더 공유 설정 확인

## 보안 체크리스트

- [ ] Client Secret이 클라이언트 코드에 없음
- [ ] Refresh Token이 환경변수에만 저장됨
- [ ] API 엔드포인트에 rate limiting 설정
- [ ] CORS 설정 확인
- [ ] HTTPS 사용 확인

## 유지보수

### Refresh Token 갱신
Refresh Token은 장기간 유효하지만, 만료되면:
1. OAuth Playground에서 새 토큰 획득
2. Vercel 환경변수 업데이트
3. 재배포

### 폴더 변경
다른 Google Drive 폴더 사용 시:
1. `GOOGLE_DRIVE_FOLDER_ID` 환경변수 업데이트
2. 폴더 공유 설정 확인

---

**중요:** 이 설정이 완료되면 학생들은 선생님의 Google Drive에 있는 Scratch 프로젝트를 로그인 없이 안전하게 사용할 수 있습니다!