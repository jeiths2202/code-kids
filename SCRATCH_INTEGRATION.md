# Scratch Foundation GUI 통합 가이드

> **CodeKids 플랫폼에 공식 Scratch GUI를 통합하는 완전한 가이드**

## 📋 개요

이 문서는 MIT Scratch Foundation의 공식 scratch-gui 저장소를 CodeKids 플랫폼에 통합하는 방법을 제시합니다. 22년차 시스템 엔지니어의 DX 경험을 바탕으로 레거시 시스템을 현대적인 웹 플랫폼으로 전환하는 아키텍처를 적용합니다.

## 🔧 기술 스택 및 요구사항

### 기본 요구사항
- **Node.js**: v16.x 이상
- **npm**: v8.x 이상 
- **Git**: 최신 버전
- **모던 브라우저**: Chrome 80+, Firefox 75+, Safari 13+

### 개발 환경
```bash
# Node.js 버전 확인
node --version  # v16.x 이상

# npm 버전 확인  
npm --version   # v8.x 이상
```

## 🚀 Step 1: Scratch GUI 클론 및 설정

### 1.1 저장소 클론
```bash
# CodeKids 프로젝트 루트 디렉토리에서 실행
mkdir scratch-editor
cd scratch-editor

# Scratch Foundation 공식 저장소 클론
git clone https://github.com/scratchfoundation/scratch-gui.git
cd scratch-gui

# 의존성 설치
npm install
```

### 1.2 개발 서버 실행 테스트
```bash
# 개발 모드로 실행
npm start

# 빌드 테스트
npm run build
```

### 1.3 브랜치 관리 전략
```bash
# CodeKids 커스터마이징을 위한 별도 브랜치 생성
git checkout -b codekids-integration
git push -u origin codekids-integration

# 원본 저장소 추적용 upstream 설정
git remote add upstream https://github.com/scratchfoundation/scratch-gui.git
```

## 🔧 Step 2: CodeKids 플랫폼 통합

### 2.1 프로젝트 구조 수정
```
CodeKids/
├── index.html              # 메인 페이지
├── dashboard.html          # 대시보드
├── editor.html            # 코딩 실험실 페이지 (새로 생성)
├── scratch-editor/        # Scratch GUI 서브모듈
│   └── scratch-gui/
├── css/
├── js/
└── README.md
```

### 2.2 에디터 페이지 생성
```html
<!-- editor.html -->
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>코딩 실험실 - CodeKids</title>
    <!-- CodeKids 공통 스타일 -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/editor.css">
</head>
<body>
    <!-- CodeKids 헤더 -->
    <header id="codekids-header">
        <!-- 네비게이션 및 사용자 정보 -->
    </header>
    
    <!-- Scratch GUI 컨테이너 -->
    <div id="scratch-container">
        <!-- Scratch GUI가 마운트될 영역 -->
    </div>
    
    <!-- CodeKids 통합 스크립트 -->
    <script src="js/scratch-integration.js"></script>
</body>
</html>
```

### 2.3 Scratch GUI 커스터마이징

#### webpack.config.js 수정
```javascript
// scratch-gui/webpack.config.js
const path = require('path');

module.exports = {
    // 기존 설정...
    
    // CodeKids 통합을 위한 추가 설정
    externals: {
        'codekids-api': 'CodeKidsAPI'
    },
    
    // 빌드 출력 경로를 CodeKids 프로젝트로 설정
    output: {
        path: path.resolve(__dirname, '../../dist/scratch'),
        filename: 'scratch-gui.js',
        publicPath: '/scratch/'
    },
    
    // 개발 서버 설정
    devServer: {
        port: 8602,
        host: '0.0.0.0',
        // CORS 허용 (CodeKids 메인 서버와의 통신)
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }
};
```

#### 브랜딩 커스터마이징
```javascript
// src/lib/brand.js (새로 생성)
export const CODEKIDS_BRAND = {
    name: 'CodeKids 코딩 실험실',
    logo: '/images/codekids-logo.png',
    colors: {
        primary: '#4F46E5',
        secondary: '#06B6D4',
        accent: '#F59E0B'
    },
    // 한국어 로케일 기본 설정
    defaultLocale: 'ko'
};
```

#### GUI 컴포넌트 수정
```jsx
// src/components/menu-bar/menu-bar.jsx 커스터마이징
import { CODEKIDS_BRAND } from '../../lib/brand';

// 로고 및 브랜딩 요소 수정
const MenuBar = props => (
    <Box className={styles.menuBar}>
        <div className={styles.logoSection}>
            <img src={CODEKIDS_BRAND.logo} alt={CODEKIDS_BRAND.name} />
            <span>{CODEKIDS_BRAND.name}</span>
        </div>
        {/* 기존 메뉴 요소들... */}
    </Box>
);
```

## 📡 Step 3: CodeKids API 통합

### 3.1 프로젝트 저장/로드 API 연동

#### API 엔드포인트 설계
```javascript
// js/scratch-api.js
class ScratchProjectAPI {
    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
        this.studentId = this.getCurrentStudentId();
    }
    
    // 프로젝트 저장
    async saveProject(projectData) {
        const response = await fetch(`${this.baseURL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify({
                student_id: this.studentId,
                title: projectData.title || '제목 없는 프로젝트',
                scratch_data: projectData.data,
                technology: '스크래치',
                status: '진행중',
                progress_percentage: 0
            })
        });
        
        return await response.json();
    }
    
    // 프로젝트 로드
    async loadProject(projectId) {
        const response = await fetch(`${this.baseURL}/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${this.getAuthToken()}`
            }
        });
        
        return await response.json();
    }
    
    // 학생 프로젝트 목록 조회
    async getStudentProjects() {
        const response = await fetch(`${this.baseURL}/projects?student_id=${this.studentId}`, {
            headers: {
                'Authorization': `Bearer ${this.getAuthToken()}`
            }
        });
        
        return await response.json();
    }
    
    // 프로젝트 공유/게시
    async shareProject(projectId, shareOptions) {
        const response = await fetch(`${this.baseURL}/projects/${projectId}/share`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify(shareOptions)
        });
        
        return await response.json();
    }
    
    // 유틸리티 메서드들
    getCurrentStudentId() {
        // 세션에서 학생 ID 추출
        return localStorage.getItem('codekids_student_id') || 'student_001';
    }
    
    getAuthToken() {
        // JWT 토큰 추출
        return localStorage.getItem('codekids_auth_token') || '';
    }
}

// 전역 객체로 노출
window.CodeKidsAPI = new ScratchProjectAPI();
```

### 3.2 Scratch GUI 내부 연동

#### 프로젝트 저장 기능 통합
```javascript
// scratch-gui/src/lib/project-saver.js (새로 생성)
import {connect} from 'react-redux';
import {saveProjectSb3} from './sb3-downloader';

const saveToCodeKids = async (projectData, projectTitle) => {
    try {
        // CodeKids API를 통한 저장
        if (window.CodeKidsAPI) {
            const result = await window.CodeKidsAPI.saveProject({
                title: projectTitle,
                data: projectData
            });
            
            // 성공 알림
            window.dispatchEvent(new CustomEvent('codekids:project-saved', {
                detail: { projectId: result.id, title: projectTitle }
            }));
            
            return result;
        }
    } catch (error) {
        console.error('CodeKids 프로젝트 저장 실패:', error);
        // 로컬 저장으로 폴백
        saveProjectSb3(projectData, projectTitle);
    }
};

export default saveToCodeKids;
```

#### 메뉴 바 커스터마이징
```jsx
// scratch-gui/src/containers/menu-bar.jsx 수정
const MenuBar = props => {
    const handleSaveToCodeKids = () => {
        const {projectData, projectTitle} = props;
        saveToCodeKids(projectData, projectTitle);
    };
    
    return (
        <MenuBarComponent
            {...props}
            onSaveToCodeKids={handleSaveToCodeKids}
            showCodeKidsFeatures={window.CodeKidsAPI !== undefined}
        />
    );
};
```

## 🎨 Step 4: UI/UX 커스터마이징

### 4.1 CodeKids 테마 적용

#### CSS 변수 오버라이드
```css
/* css/editor.css */
:root {
    /* CodeKids 브랜드 컬러로 Scratch 기본 컬러 오버라이드 */
    --ui-primary: #4F46E5;
    --ui-secondary: #06B6D4;
    --ui-tertiary: #F59E0B;
    --ui-modal-overlay: rgba(15, 23, 42, 0.8);
    --ui-white: #ffffff;
    --ui-dark-gray: #1e293b;
    
    /* 한국어 폰트 적용 */
    --font-family-sans: 'Noto Sans KR', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* Scratch GUI 컨테이너 스타일링 */
#scratch-container {
    height: calc(100vh - 80px); /* CodeKids 헤더 높이 제외 */
    width: 100%;
    position: relative;
}

/* 스크래치 스테이지 영역 커스터마이징 */
.scratch-gui .stage-wrapper {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 블록 팔레트 한국어 최적화 */
.scratch-gui .blocklyText {
    font-family: var(--font-family-sans) !important;
    font-size: 12px;
}

/* 코드 영역 스타일 개선 */
.scratch-gui .blocklyWorkspace {
    background: #f8fafc;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
    #scratch-container {
        height: calc(100vh - 60px);
    }
    
    .scratch-gui .gui {
        min-width: 100%;
    }
}
```

### 4.2 한국어 현지화

#### 언어팩 확장
```javascript
// scratch-gui/src/lib/locale-ko.js
const messages = {
    'gui.menuBar.saveToCodeKids': 'CodeKids에 저장',
    'gui.menuBar.loadFromCodeKids': 'CodeKids에서 불러오기',
    'gui.menuBar.shareProject': '프로젝트 공유',
    'gui.projectLoader.myProjects': '내 프로젝트',
    'gui.projectLoader.recentProjects': '최근 프로젝트',
    'gui.tutorial.codekidsWelcome': 'CodeKids 스크래치에 오신 것을 환영합니다!',
    // ... 추가 번역
};

export default messages;
```

#### 튜토리얼 콘텐츠 한국어화
```json
// scratch-gui/src/lib/tutorials-ko.json
{
    "getting-started": {
        "name": "시작하기",
        "steps": [
            {
                "title": "스프라이트 움직이기",
                "description": "고양이를 움직여보세요!",
                "image": "/tutorial/move-sprite-ko.gif"
            }
        ]
    }
}
```

## 🔄 Step 5: 빌드 및 배포 설정

### 5.1 자동화된 빌드 스크립트

#### package.json 스크립트
```json
{
  "scripts": {
    "build:scratch": "cd scratch-editor/scratch-gui && npm run build",
    "dev:scratch": "cd scratch-editor/scratch-gui && npm start",
    "build:codekids": "npm run build:scratch && npm run copy:assets",
    "copy:assets": "cp -r scratch-editor/scratch-gui/build/* ./dist/scratch/",
    "deploy": "npm run build:codekids && npm run deploy:static"
  }
}
```

#### 빌드 자동화 스크립트
```bash
#!/bin/bash
# scripts/build-scratch.sh

echo "🚀 CodeKids Scratch 에디터 빌드 시작..."

# 1. Scratch GUI 의존성 업데이트
cd scratch-editor/scratch-gui
npm install
npm audit fix

# 2. CodeKids 커스터마이징 적용
echo "📝 CodeKids 브랜딩 적용 중..."
npm run customize:codekids

# 3. 프로덕션 빌드
echo "🔨 프로덕션 빌드 중..."
npm run build:production

# 4. 빌드 파일 복사
echo "📁 빌드 파일 복사 중..."
cd ../../
mkdir -p dist/scratch
cp -r scratch-editor/scratch-gui/build/* dist/scratch/

echo "✅ 빌드 완료!"
```

### 5.2 Docker 컨테이너화

#### Dockerfile
```dockerfile
# Dockerfile.scratch
FROM node:16-alpine AS builder

WORKDIR /app

# Scratch GUI 빌드
COPY scratch-editor/scratch-gui/package*.json ./scratch-gui/
RUN cd scratch-gui && npm ci --only=production

COPY scratch-editor/scratch-gui ./scratch-gui/
RUN cd scratch-gui && npm run build

# Nginx 서빙
FROM nginx:alpine
COPY --from=builder /app/scratch-gui/build /usr/share/nginx/html/scratch
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose 설정
```yaml
# docker-compose.yml
version: '3.8'
services:
  codekids-web:
    build: .
    ports:
      - "3000:80"
    volumes:
      - ./dist:/usr/share/nginx/html
    environment:
      - NODE_ENV=production
      
  scratch-editor:
    build:
      context: .
      dockerfile: Dockerfile.scratch
    ports:
      - "8602:80"
    depends_on:
      - codekids-web
```

## 📊 Step 6: 모니터링 및 분석

### 6.1 사용자 행동 분석

#### 코딩 실험실 이벤트 추적
```javascript
// js/scratch-analytics.js
class ScratchAnalytics {
    constructor() {
        this.initializeTracking();
    }
    
    initializeTracking() {
        // 프로젝트 생성/저장 추적
        window.addEventListener('codekids:project-saved', this.trackProjectSave);
        window.addEventListener('codekids:project-shared', this.trackProjectShare);
        
        // 블록 사용 패턴 추적
        this.trackBlockUsage();
        
        // 세션 시간 추적
        this.startSession();
    }
    
    trackProjectSave(event) {
        const {projectId, title, duration} = event.detail;
        
        // CodeKids 대시보드로 데이터 전송
        fetch('/api/analytics/scratch/save', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                event: 'project_save',
                projectId,
                title,
                duration,
                timestamp: Date.now()
            })
        });
    }
    
    trackBlockUsage() {
        // Scratch 블록 팔레트 클릭 이벤트 감지
        document.addEventListener('click', (event) => {
            const blockElement = event.target.closest('.blocklyDraggable');
            if (blockElement) {
                const blockType = blockElement.getAttribute('data-id');
                this.logBlockUsage(blockType);
            }
        });
    }
    
    logBlockUsage(blockType) {
        // 블록 사용 통계 수집
        const usage = JSON.parse(localStorage.getItem('scratch_block_usage') || '{}');
        usage[blockType] = (usage[blockType] || 0) + 1;
        localStorage.setItem('scratch_block_usage', JSON.stringify(usage));
    }
}

// 초기화
new ScratchAnalytics();
```

### 6.2 성능 모니터링

#### 로딩 시간 및 성능 측정
```javascript
// js/scratch-performance.js
class ScratchPerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            blockCount: 0,
            memoryUsage: 0
        };
        
        this.startMonitoring();
    }
    
    startMonitoring() {
        // 페이지 로드 시간 측정
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now();
            this.reportMetrics();
        });
        
        // 메모리 사용량 모니터링 (5분마다)
        setInterval(() => {
            if (performance.memory) {
                this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
                this.checkPerformance();
            }
        }, 5 * 60 * 1000);
    }
    
    checkPerformance() {
        // 성능 임계값 확인
        if (this.metrics.memoryUsage > 100 * 1024 * 1024) { // 100MB
            console.warn('높은 메모리 사용량 감지:', this.metrics.memoryUsage);
            this.suggestOptimization();
        }
    }
    
    suggestOptimization() {
        // 사용자에게 최적화 제안
        const notification = document.createElement('div');
        notification.className = 'performance-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>프로젝트가 복잡해졌네요! 성능 향상을 위해 저장하고 새로 시작하는 것을 권장합니다.</span>
                <button onclick="this.parentElement.parentElement.remove()">확인</button>
            </div>
        `;
        document.body.appendChild(notification);
    }
    
    reportMetrics() {
        // 성능 데이터를 서버로 전송
        fetch('/api/analytics/scratch/performance', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.metrics)
        });
    }
}

new ScratchPerformanceMonitor();
```

## 🔄 Step 7: 업데이트 및 유지보수

### 7.1 Scratch Foundation 업스트림 동기화

#### 정기 업데이트 스크립트
```bash
#!/bin/bash
# scripts/update-scratch.sh

echo "🔄 Scratch Foundation 업데이트 확인 중..."

cd scratch-editor/scratch-gui

# 원본 저장소에서 최신 변경사항 가져오기
git fetch upstream

# 새 릴리스 태그 확인
LATEST_TAG=$(git ls-remote --tags upstream | grep -v '\^{}' | tail -n1 | cut -d'/' -f3)
CURRENT_TAG=$(git describe --tags --exact-match HEAD 2>/dev/null || echo "none")

if [ "$LATEST_TAG" != "$CURRENT_TAG" ]; then
    echo "📦 새 버전 발견: $LATEST_TAG"
    echo "현재 버전: $CURRENT_TAG"
    
    # 백업 브랜치 생성
    git checkout -b backup-$(date +%Y%m%d-%H%M%S)
    git checkout codekids-integration
    
    # 새 버전으로 업데이트
    git merge upstream/$LATEST_TAG
    
    # 충돌 해결 및 테스트 필요 알림
    echo "⚠️  업데이트 완료. 충돌 해결 및 테스트를 진행하세요."
    echo "🧪 테스트 명령: npm run test:codekids"
else
    echo "✅ 최신 버전입니다."
fi
```

### 7.2 호환성 테스트 자동화

#### 테스트 스위트
```javascript
// tests/scratch-integration.test.js
const puppeteer = require('puppeteer');

describe('Scratch Editor Integration', () => {
    let browser, page;
    
    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });
    
    afterAll(async () => {
        await browser.close();
    });
    
    test('에디터가 정상적으로 로드되는지 확인', async () => {
        await page.goto('http://localhost:3000/editor.html');
        
        // Scratch GUI 로딩 대기
        await page.waitForSelector('.scratch-gui', {timeout: 10000});
        
        // CodeKids 브랜딩 확인
        const logoExists = await page.$('.codekids-logo');
        expect(logoExists).toBeTruthy();
    });
    
    test('프로젝트 저장 기능 테스트', async () => {
        // 블록 추가
        await page.click('.blocklyTreeLabel:contains("동작")');
        await page.drag('.blocklyDraggable[data-id="motion_movesteps"]', '.blocklyWorkspace');
        
        // 저장 버튼 클릭
        await page.click('[data-testid="save-to-codekids"]');
        
        // 저장 완료 확인
        await page.waitForSelector('.save-success-notification');
    });
    
    test('모바일 반응형 확인', async () => {
        await page.setViewport({width: 375, height: 667}); // iPhone 6/7/8 크기
        
        // 모바일 레이아웃 확인
        const mobileLayout = await page.$('.scratch-gui.mobile-layout');
        expect(mobileLayout).toBeTruthy();
    });
});
```

## 📈 Step 8: 성과 측정 및 최적화

### 8.1 주요 지표 정의

```javascript
// KPI 대시보드 설계
const SCRATCH_KPIS = {
    // 사용자 참여도
    engagement: {
        dailyActiveUsers: 0,
        averageSessionDuration: 0,
        projectsCreatedPerUser: 0,
        returnRate: 0
    },
    
    // 학습 효과
    learning: {
        completedTutorials: 0,
        advancedBlockUsage: 0,
        projectComplexity: 0,
        peerSharing: 0
    },
    
    // 기술적 성능
    technical: {
        loadTime: 0,
        errorRate: 0,
        uptime: 99.9,
        mobileUsageRate: 0
    }
};
```

### 8.2 A/B 테스트 설정

```javascript
// js/scratch-ab-test.js
class ScratchABTest {
    constructor() {
        this.variant = this.getVariant();
        this.applyVariant();
    }
    
    getVariant() {
        // 사용자 ID 기반 일관된 배리언트 할당
        const userId = this.getUserId();
        const hash = this.hashCode(userId);
        return hash % 2 === 0 ? 'A' : 'B';
    }
    
    applyVariant() {
        if (this.variant === 'B') {
            // B 그룹: 새로운 튜토리얼 시스템
            this.enableNewTutorialSystem();
        }
        
        // 실험 참여 로깅
        this.logExperimentParticipation();
    }
    
    enableNewTutorialSystem() {
        // 개선된 튜토리얼 UI 적용
        document.body.classList.add('variant-b-tutorial');
    }
}
```

## 🔒 보안 고려사항

### 8.1 사용자 프로젝트 보안

```javascript
// 프로젝트 데이터 검증
const validateScratchProject = (projectData) => {
    // 악성 코드 패턴 검사
    const maliciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i
    ];
    
    const projectString = JSON.stringify(projectData);
    
    for (const pattern of maliciousPatterns) {
        if (pattern.test(projectString)) {
            throw new Error('프로젝트에 허용되지 않는 코드가 포함되어 있습니다.');
        }
    }
    
    return true;
};
```

### 8.2 데이터 개인정보 보호

```javascript
// 민감한 정보 필터링
const sanitizeProjectForSharing = (project) => {
    const sanitized = {...project};
    
    // 개인정보 제거
    delete sanitized.student_email;
    delete sanitized.ip_address;
    delete sanitized.device_info;
    
    // 공유 허용 여부 확인
    if (!sanitized.share_permission) {
        throw new Error('공유 권한이 없는 프로젝트입니다.');
    }
    
    return sanitized;
};
```

## 🎯 결론 및 다음 단계

### 성공 기준
- ✅ Scratch GUI가 CodeKids 플랫폼에 완전히 통합
- ✅ 한국어 현지화 완료 (95% 이상)
- ✅ 프로젝트 저장/로드 기능 구현
- ✅ 모바일 반응형 지원
- ✅ 성능 최적화 (로딩 시간 3초 이하)

### 향후 개발 계획
1. **AI 코딩 어시스턴트**: 블록 추천 시스템
2. **실시간 협업**: 다중 사용자 편집 기능
3. **고급 튜토리얼**: 단계별 프로젝트 가이드
4. **블록체인 연동**: NFT 작품 생성 기능

### 운영 체크리스트
- [ ] 일일 백업 자동화
- [ ] 주간 보안 점검
- [ ] 월간 성능 리포트
- [ ] 분기별 사용자 만족도 조사

---

**💡 Tip**: 이 가이드는 레거시 시스템의 DX 전환 경험을 바탕으로 작성되었습니다. 각 단계별로 충분한 테스트와 검증을 거쳐 안정적인 통합을 달성하시기 바랍니다.

**📞 지원**: 통합 과정에서 문제가 발생하면 CodeKids 개발팀(dev@codekids.kr)으로 연락하세요.

*최종 업데이트: 2024년 12월 20일*