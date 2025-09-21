# CodeKids 교육 플랫폼

한국 학생들을 위한 코딩 교육 플랫폼입니다. Scratch 블록 코딩부터 Python, 웹 개발까지 단계별 학습을 제공합니다.

## 🌟 주요 기능

- **Scratch 프로그래밍**: 드래그 앤 드롭 블록 코딩 (Google Cloud 34.69.106.118:3000)
- **Google Drive 연동**: 프로젝트 저장 및 공유 (폴더 제한 보안)
- **실시간 대시보드**: 학습 진도 및 성과 분석
- **프로젝트 갤러리**: 학생 작품 공유 및 다운로드

## 🚀 기술 스택

### 프론트엔드 (Vercel)
- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS
- Chart.js for 데이터 시각화
- Font Awesome 아이콘

### 백엔드 (Vercel 서버리스)
- Google Drive API 연동 (보안 처리)
- 환경변수를 통한 API 키 보호
- 폴더 제한 접근 제어

### 외부 서비스
- SheepTester Scratch GUI (안정적인 Scratch 에디터)
- Scratch.mit.edu (공식 Scratch 에디터)
- Google Drive API v3

## 🏗️ 아키텍처

```
학생 브라우저 (모바일/데스크톱)
    ↓
Vercel Frontend (정적 파일 호스팅)
    ↓
Google Drive API (서버리스 함수를 통한 보안 접근)
    ↓
외부 Scratch GUI (SheepTester/Scratch.mit.edu)
```

### 🔄 프로젝트 로드 플로우

1. **프로젝트 선택**: 학생이 Google Drive 프로젝트 선택
2. **파일 다운로드**: 브라우저에 .sb3 파일 자동 다운로드
3. **디바이스별 안내**:
   - 📱 **모바일**: 단계별 가이드 모달 표시
   - 🖥️ **데스크톱**: Scratch 에디터 자동 열기 + 안내
4. **수동 로드**: 사용자가 Scratch GUI에서 "파일에서 로드" 클릭

## 🎯 프로젝트 개요

CodeKids는 초등학교 3학년부터 중학교 3학년까지의 학생들을 대상으로 하는 코딩 교육 플랫폼입니다. Scratch 블록 코딩부터 시작하여 단계적으로 프로그래밍 개념을 익힐 수 있도록 설계된 웹 기반 학습 환경을 제공합니다.

### 핵심 목표
- 🎮 **게임형 학습**: 레벨업, 배지, 랭킹 시스템으로 학습 동기 부여
- 🧩 **직관적 인터페이스**: 드래그 앤 드롭 기반의 블록 코딩부터 텍스트 코딩까지
- 🚀 **실전 프로젝트**: 게임, 웹사이트, 앱 개발 등 실제 작품 제작
- 📊 **진도 추적**: 실시간 학습 진도 및 성과 분석

## ✅ 현재 구현된 기능

### 1. 메인페이지 (index.html)
- **히어로 섹션**: 임팩트 있는 메인 메시지와 CTA 버튼
- **기능 소개**: 게임형 학습, 블록 코딩, 실전 프로젝트 강조
- **강의 카테고리**: 초급(스크래치) → 중급(파이썬) → 고급(웹개발) 로드맵
- **학습 통계**: 1,000+ 수강생, 50+ 강의, 200+ 실습문제, 98% 만족도
- **오늘의 챌린지**: 미로 탈출 로봇 만들기 등 일일 코딩 과제
- **학생 작품 갤러리**: 실제 학생들이 만든 프로젝트 전시

### 2. 학습 분석 대시보드 (dashboard.html)
- **실시간 학습 통계**: 총 학습시간, 완료 프로젝트, 현재 레벨, 연속 학습일수
- **Chart.js 기반 시각화**: 주간 학습시간, 언어별 분포, 월별 진도 차트
- **성취 시스템**: 획득 배지, 경험치(XP) 추적, 레벨링 시스템
- **활동 피드**: 최근 활동 내역, 프로젝트 진행 상황, 학습 추천
- **반응형 대시보드**: 모바일부터 데스크톱까지 최적화된 데이터 시각화

### 3. 데이터 관리 시스템
- **RESTful Table API**: 학습 데이터 CRUD 작업 완전 지원
- **5개 핵심 테이블**: 학생, 학습세션, 프로젝트, 성취, 일일활동
- **실시간 데이터 동기화**: 대시보드와 메인 시스템 간 실시간 연동
- **성능 최적화**: 페이지네이션, 인덱싱, 캐싱 전략

### 4. Scratch Foundation GUI 통합 및 샘플 프로젝트 시스템
- **완전한 통합 가이드**: 공식 scratch-gui 저장소 클론 및 커스터마이징 방법
- **브랜딩 시스템**: CodeKids 테마 적용 및 한국어 현지화
- **API 연동 설계**: 프로젝트 저장/로드, 공유 기능 구조
- **샘플 프로젝트 시스템**:
  - 미리 제작된 Scratch 프로젝트 (`Minecraft.sb3`, `Snake Game.sb3`, `Super Mario Vivacious.sb3`)
  - 난이도별 분류 (초급/중급/고급) 및 카테고리 시스템
  - 원클릭 프로젝트 로드 및 복사본 생성 기능
  - 샘플 프로젝트 전용 필터링 및 검색 시스템
- **성능 모니터링**: 사용자 행동 분석 및 최적화 전략

### 5. 반응형 UI/UX 시스템
- **모바일 퍼스트**: 스마트폰부터 데스크톱까지 완벽 지원
- **다크모드 지원**: 사용자 환경 설정에 따른 자동 테마 변경
- **접근성 최적화**: 고대비 모드, 키보드 네비게이션, 스크린 리더 지원
- **성능 최적화**: 지연 로딩, 이미지 최적화, 디바운싱 적용

### 6. 인터랙티브 기능
- **애니메이션 시스템**: CSS3 + JavaScript 기반 부드러운 전환 효과
- **모달 시스템**: 강의 상세 정보, 프로젝트 미리보기, 회원가입 폼
- **네비게이션**: 부드러운 스크롤, 활성 메뉴 표시, 모바일 햄버거 메뉴
- **피드백 시스템**: 리플 효과, 호버 애니메이션, 알림 토스트

## 🌐 현재 기능별 URI 구조

### 메인 페이지 섹션
- `/` - 메인 히어로 섹션
- `/#features` - 주요 기능 소개
- `/#courses` - 강의 카테고리 (스크래치, 파이썬, 웹개발)
- `/#practice` - 오늘의 코딩 챌린지
- `/#projects` - 학생 작품 갤러리

### 학습 분석 대시보드
- `/dashboard.html` - 메인 대시보드
- **주요 차트**: 주간 학습시간, 언어별 분포, 월별 진도
- **실시간 통계**: 학습시간, 완료 프로젝트, 레벨, 연속일수
- **활동 추적**: 최근 활동, 진행중 프로젝트, 성취 배지

### RESTful API 엔드포인트
- `GET /tables/students` - 학생 정보 조회
- `GET /tables/learning_sessions` - 학습 세션 데이터
- `GET /tables/projects` - 프로젝트 관리
- `GET /tables/achievements` - 성취 및 배지 시스템
- `GET /tables/daily_activities` - 일일 활동 로그
- `GET /tables/sample_projects` - 샘플 프로젝트 목록 조회
- `GET /tables/sample_files/{filename}` - 샘플 프로젝트 파일 다운로드

### 인터랙티브 요소
- **강의 카드 클릭** → 강의 상세 모달 표시
- **프로젝트 카드 클릭** → 작품 미리보기 모달
- **CTA 버튼** → 회원가입/체험 모달
- **챌린지 버튼** → 실습 안내 모달
- **차트 인터랙션** → 드릴다운, 필터링, 실시간 업데이트
- **샘플 프로젝트 시스템**:
  - **필터 탭** → 전체/최근작업/공유됨/샘플 프로젝트 분류
  - **샘플 카드 클릭** → 난이도별 샘플 프로젝트 즉시 로드
  - **검색 기능** → 샘플 프로젝트 이름 및 설명 통합 검색

## 🚧 미구현 기능 (향후 개발 계획)

### Phase 1: 사용자 시스템 (4주)
- [ ] 회원가입/로그인 시스템
- [ ] 학생/학부모 대시보드
- [ ] 학습 진도 추적 시스템
- [ ] 성취도 뱃지/레벨링 시스템

### Phase 2: 학습 콘텐츠 (8주)
- [x] 📋 **Scratch Foundation GUI 통합 가이드 완성**
- [ ] 스크래치 블록 에디터 실제 구현 (공식 scratch-gui 사용)
- [ ] 파이썬 온라인 IDE (Monaco Editor 기반)
- [ ] HTML/CSS/JS 코드 에디터 (CodeMirror 활용)
- [ ] 실시간 코드 실행 환경 (WebAssembly/Docker)

### Phase 3: 상호작용 기능 (6주)
- [ ] 실시간 채팅/질문답변
- [ ] 코드 리뷰 시스템
- [ ] 학생 간 프로젝트 공유
- [ ] 온라인 코딩 대회

### Phase 4: 관리 시스템 (4주)
- [ ] 강사용 관리 패널
- [ ] 학부모 모니터링 시스템
- [ ] 학습 분석 대시보드
- [ ] 결제/구독 시스템

## 🛠 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업, 접근성 최적화
- **CSS3**: Flexbox, Grid, 애니메이션, 반응형 디자인
- **JavaScript (ES6+)**: 모듈화, 비동기 처리, DOM 조작
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **Chart.js**: 데이터 시각화 및 대시보드 차트
- **Font Awesome**: 아이콘 시스템
- **Google Fonts**: 한국어 웹폰트 (Noto Sans KR)

### 데이터 관리
- **RESTful Table API**: CRUD 작업 및 데이터 관리
- **JSON 스키마**: 구조화된 학습 데이터 모델
- **실시간 동기화**: 대시보드와 메인 시스템 연동

### 통합 시스템
- **Scratch Foundation GUI**: MIT의 공식 스크래치 GUI (코딩 실험실에서 사용)
- **Node.js**: 빌드 도구 및 개발 환경
- **Webpack**: 모듈 번들링 및 최적화

### 개발 도구
- **Responsive Design**: 모바일부터 데스크톱까지 4단계 브레이크포인트
- **CSS Grid/Flexbox**: 현대적 레이아웃 시스템
- **IntersectionObserver**: 스크롤 애니메이션 최적화
- **Web Accessibility**: WCAG 2.1 AA 수준 준수

## 📁 프로젝트 구조

```
CodeKids/
├── index.html                    # 메인 페이지
├── dashboard.html               # 학습 분석 대시보드
├── css/
│   ├── style.css               # 메인 스타일시트
│   ├── responsive.css          # 반응형 디자인
│   └── dashboard.css           # 대시보드 전용 스타일
├── js/
│   ├── main.js                # 메인 JavaScript 로직
│   └── dashboard.js           # 대시보드 차트 및 데이터 처리
├── docs/
│   └── SCRATCH_INTEGRATION.md  # Scratch GUI 통합 가이드
└── README.md                   # 프로젝트 문서

# 향후 추가 예정 구조
scratch-editor/
└── scratch-gui/               # Scratch Foundation 공식 GUI
```

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: #4F46E5 (인디고) - 메인 브랜드 컬러
- **Secondary**: #06B6D4 (시안) - 보조 강조 컬러  
- **Accent**: #F59E0B (앰버) - 포인트 컬러
- **Success**: #10B981 (에메랄드) - 성공/완료 상태

### 타이포그래피
- **한글 폰트**: Noto Sans KR (300, 400, 500, 600, 700)
- **반응형 텍스트**: clamp() 함수로 유연한 크기 조정
- **가독성**: 충분한 행간, 대비비 4.5:1 이상 유지

### 애니메이션 원칙
- **자연스러운 움직임**: cubic-bezier(0.4, 0, 0.2, 1) 이징
- **성능 최적화**: transform, opacity 속성 우선 사용
- **접근성 고려**: prefers-reduced-motion 미디어 쿼리 지원

## 🚀 권장 개발 단계

### 1단계: 백엔드 API 설계 (2주)
```javascript
// RESTful API 엔드포인트 예시
GET    /api/courses          # 강의 목록
GET    /api/courses/:id      # 강의 상세
POST   /api/users/register   # 회원가입
POST   /api/users/login      # 로그인
GET    /api/users/progress   # 학습 진도
POST   /api/challenges       # 챌린지 제출
```

### 2단계: 사용자 인증 시스템 (1주)
- JWT 기반 토큰 인증
- 소셜 로그인 (구글, 네이버, 카카오)
- 학부모 승인 시스템

### 3단계: 학습 콘텐츠 시스템 (6주)
- 블록 에디터 (Blockly.js 통합)
- 코드 에디터 (Monaco Editor)
- 실행 환경 (WebAssembly/Docker)

### 4단계: 실시간 기능 (4주)
- WebSocket 기반 실시간 통신
- 화상 수업 시스템 (WebRTC)
- 실시간 코드 공유

## 🛠️ 개발 환경 설정

### 로컬 개발
```bash
# 정적 파일 서버 실행
python -m http.server 8000
# 또는
npx live-server
```

### 환경 변수 설정
```bash
# Vercel 환경 변수
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
```

### 기술 아키텍처
- **모듈화 설계**: HTML(구조), CSS(스타일), JS(동작) 분리
- **컴포넌트 기반**: 재사용 가능한 UI 컴포넌트 설계
- **모바일 최적화**: 반응형 디자인과 터치 인터페이스

### 성능 최적화
- **지연 로딩**: 뷰포트 진입 시 콘텐츠 로드
- **이미지 최적화**: WebP 포맷, 반응형 이미지
- **모바일 친화**: 터치 제스처와 모바일 다운로드 지원

## 🚀 배포

### Vercel 배포
1. GitHub 저장소와 Vercel 연결
2. 환경 변수 설정 (Google Drive API)
3. 자동 배포 활성화

### 주요 기능 테스트
- ✅ Google Drive 프로젝트 로드
- ✅ 모바일/데스크톱 파일 다운로드
- ✅ 외부 Scratch GUI 연동
- ✅ 반응형 UI 동작

## 📊 예상 비즈니스 모델

### 수익원
1. **구독형 서비스**: 월 29,000원 (무제한 강의 수강)
2. **개별 강의**: 강의당 15,000-50,000원
3. **1:1 멘토링**: 시간당 30,000원
4. **기업 연수**: B2B 패키지 상품

### 타겟 시장 분석 (일본 진출 고려)
- **한국 시장**: 초중등 사교육 시장 20조원 중 IT교육 5%
- **일본 시장**: 프로그래밍 교육 의무화로 급성장 중
- **경쟁 우위**: 한국의 우수한 IT교육 노하우 + 게임화 학습

## 🔧 배포 및 운영

### 개발 환경 설정
```bash
# 로컬 서버 실행 (Python)
python -m http.server 8000

# 또는 Node.js live-server
npx live-server
```

### 프로덕션 배포
- **CDN**: CloudFlare, AWS CloudFront
- **호스팅**: Vercel, Netlify (정적 사이트)
- **API 서버**: AWS EC2, Google Cloud Run
- **데이터베이스**: PostgreSQL, Redis (캐싱)

## 📈 성공 지표 (KPI)

### 단기 목표 (6개월)
- 회원가입자 1,000명
- 월간 활성 사용자 500명
- 강의 완주율 80%
- 학부모 만족도 90%

### 중장기 목표 (1년)
- 회원가입자 10,000명
- 월 매출 1억원
- 일본 시장 진출
- B2B 고객 100개 학교
