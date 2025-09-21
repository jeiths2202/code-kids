# 🔧 OAuth redirect_uri_mismatch 에러 해결

## 문제
```
エラー 400: redirect_uri_mismatch
```

## 즉시 해결 방법

### 1. Google Cloud Console 접속
https://console.cloud.google.com/

### 2. APIs & Services → Credentials

### 3. OAuth 2.0 Client IDs에서 "code-kids" 클릭

### 4. Authorized redirect URIs 섹션에 추가:

```
https://developers.google.com/oauthplayground
```

### 5. SAVE 버튼 클릭

### 6. 1-2분 대기 (설정 반영 시간)

## 현재 설정되어야 할 내용:

### Authorized JavaScript origins:
- http://localhost:8888
- http://localhost:8000
- http://localhost:3000
- https://codekids-platform-*.vercel.app

### Authorized redirect URIs:
- https://developers.google.com/oauthplayground ← **이것을 추가!**

## 설정 후 테스트

1. OAuth Playground 다시 접속: https://developers.google.com/oauthplayground
2. 톱니바퀴 → "Use your own OAuth credentials" 체크
3. Client ID와 Secret 입력
4. Drive API v3 → `https://www.googleapis.com/auth/drive.readonly` 선택
5. Authorize APIs 클릭

이제 에러 없이 진행됩니다!

## 추가 팁

만약 여전히 안 되면:
- 브라우저 캐시 삭제 (Ctrl+Shift+Delete)
- 시크릿/인코그니토 모드로 시도
- 다른 Google 계정으로 로그아웃 후 재시도