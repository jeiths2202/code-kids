# Google OAuth 설정 가이드

## 현재 문제
- **에러**: 403: access_denied
- **원인**: OAuth 앱이 테스트 모드이며 shin.jeiths@gmail.com이 테스트 사용자로 등록되지 않음

## 즉시 해결 방법

### Google Cloud Console에서 설정:

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com/
   - 프로젝트: code-kids 선택

2. **OAuth consent screen 설정**
   - 왼쪽 메뉴: APIs & Services → OAuth consent screen
   - Publishing status: Testing 확인

3. **테스트 사용자 추가** ⭐ 중요
   - Test users 섹션에서 "+ ADD USERS" 클릭
   - 추가할 이메일:
     - shin.jeiths@gmail.com
     - 기타 테스트할 Gmail 계정들
   - Save 클릭

4. **OAuth 2.0 Client ID 확인**
   - APIs & Services → Credentials
   - Web application (code-kids) 확인
   - Authorized JavaScript origins에 포함되어야 함:
     - http://localhost:8888
     - http://localhost:8000
     - https://codekids-platform-*.vercel.app (배포용)

## 대안: 새 프로젝트 생성 (선택사항)

만약 위 방법이 작동하지 않으면:

1. **새 Google Cloud 프로젝트 생성**
   - 프로젝트 이름: codekids-test
   - OAuth consent screen 설정
   - 새 Client ID 생성

2. **Google Drive API 활성화**
   - APIs & Services → Library
   - "Google Drive API" 검색
   - Enable 클릭

## 테스트 확인

설정 완료 후:
1. 브라우저 캐시 삭제 (Ctrl+Shift+Delete)
2. http://localhost:8888/gis-test.html 접속
3. "Google Drive 로그인" 클릭
4. shin.jeiths@gmail.com으로 로그인

## 프로덕션 배포 시

나중에 모든 사용자가 사용하려면:
- OAuth consent screen에서 "PUBLISH APP" 클릭
- Google 심사 과정 거쳐야 함 (몇 주 소요)
- 또는 내부 사용자만 사용 (G Suite 도메인 필요)

## 문제 해결

여전히 안 되면 확인할 사항:
1. Client ID가 올바른지
2. JavaScript origins이 정확한지
3. Google Drive API가 enabled 상태인지
4. 테스트 사용자 이메일이 정확히 추가되었는지

---

**현재 Client ID**: 129459484885-49jhhorvjq9cbd1nhjnf4qlrslqchdj7.apps.googleusercontent.com
**대상 폴더**: 1rEMeET9wqGR2Ky-fefFm6BumbXsRBi77