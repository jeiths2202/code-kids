// CodeKids - 디지털 아트 갤러리 프로젝트 페이지 JavaScript

class ArtGalleryProject {
    constructor() {
        this.currentTab = 'index';
        this.currentDevice = 'desktop';
        this.galleryWebsite = null;

        this.initializeEventListeners();
        this.initializeCodeTabs();
        this.handleURLHash();

        console.log('디지털 아트 갤러리 프로젝트 페이지 초기화 완료! 🎨');
    }

    initializeEventListeners() {
        // 웹사이트 방문 버튼
        const viewSiteBtn = document.getElementById('view-site-btn');
        if (viewSiteBtn) {
            viewSiteBtn.addEventListener('click', () => this.viewWebsite());
        }

        // 소스코드 보기 버튼
        const sourceBtn = document.getElementById('view-source-btn');
        if (sourceBtn) {
            sourceBtn.addEventListener('click', () => this.viewSourceCode());
        }

        // 편집하기 버튼
        const editBtn = document.getElementById('edit-project-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.editProject());
        }

        // 웹사이트 닫기 버튼
        const closeWebsiteBtn = document.getElementById('close-website-btn');
        if (closeWebsiteBtn) {
            closeWebsiteBtn.addEventListener('click', () => this.closeWebsite());
        }

        // 소스코드 닫기 버튼
        const closeSourceBtn = document.getElementById('close-source-btn');
        if (closeSourceBtn) {
            closeSourceBtn.addEventListener('click', () => this.closeSourceCode());
        }

        // 디바이스 전환 버튼
        const deviceButtons = ['mobile', 'tablet', 'desktop'];
        deviceButtons.forEach(device => {
            const btn = document.getElementById(`device-${device}`);
            if (btn) {
                btn.addEventListener('click', () => this.switchDevice(device));
            }
        });
    }

    initializeCodeTabs() {
        const tabButtons = document.querySelectorAll('.code-tab-btn');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab || e.target.closest('[data-tab]').dataset.tab;
                this.switchCodeTab(tabName);
            });
        });
    }

    // URL 해시 처리
    handleURLHash() {
        const hash = window.location.hash.substring(1);

        if (hash === 'run') {
            // 페이지 로드 후 웹사이트 실행
            setTimeout(() => {
                this.viewWebsite();
            }, 500);
        } else if (hash === 'source') {
            // 페이지 로드 후 소스코드 보기
            setTimeout(() => {
                this.viewSourceCode();
            }, 500);
        }
    }

    // 웹사이트 보기 기능
    async viewWebsite() {
        const websiteContainer = document.getElementById('website-container');
        const websiteLoading = document.getElementById('website-loading');
        const websiteIframe = document.getElementById('website-iframe');

        // 컨테이너 표시
        websiteContainer.classList.remove('hidden');

        // 로딩 상태 표시
        websiteLoading.classList.remove('hidden');
        websiteIframe.classList.add('hidden');

        // 웹사이트 실행 알림
        this.showNotification('🎨 디지털 아트 갤러리 웹사이트를 로딩하고 있습니다...', 'info');

        try {
            // 실제 HTML/CSS 웹사이트 로드
            await this.loadGalleryWebsite();

            // 웹사이트 로딩 완료 후 표시
            setTimeout(() => {
                websiteLoading.classList.add('hidden');
                websiteIframe.classList.remove('hidden');
                this.showNotification('🎉 웹사이트가 로드되었습니다! 반응형 디자인을 확인해보세요!', 'success');
            }, 2000);

        } catch (error) {
            console.error('웹사이트 로드 실패:', error);
            this.showDemoWebsite();
            this.showNotification('✨ 데모 웹사이트를 표시합니다', 'info');
        }
    }

    // 갤러리 웹사이트 로드
    async loadGalleryWebsite() {
        const websiteIframe = document.getElementById('website-iframe');

        // 데모 웹사이트 HTML 직접 주입
        this.showDemoWebsite();
    }

    // 데모 웹사이트 표시
    showDemoWebsite() {
        const websiteIframe = document.getElementById('website-iframe');

        // 완전한 HTML 웹사이트 생성
        const websiteHTML = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>박서준의 디지털 아트 갤러리</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Noto Sans KR', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        /* 헤더 */
        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .nav-menu {
            display: flex;
            gap: 2rem;
            list-style: none;
        }

        .nav-link {
            color: #333;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
        }

        .nav-link:hover {
            color: #667eea;
        }

        /* 히어로 섹션 */
        .hero {
            color: white;
            text-align: center;
            padding: 5rem 2rem;
        }

        .hero-title {
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: fadeInUp 0.8s ease;
        }

        .hero-subtitle {
            font-size: 1.25rem;
            opacity: 0.9;
            animation: fadeInUp 0.8s ease 0.2s both;
        }

        /* 갤러리 섹션 */
        .gallery {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .gallery-title {
            color: white;
            text-align: center;
            font-size: 2rem;
            margin-bottom: 3rem;
        }

        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .gallery-item {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
        }

        .gallery-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .gallery-image {
            width: 100%;
            height: 200px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
        }

        .gallery-info {
            padding: 1.5rem;
        }

        .gallery-title-item {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #333;
        }

        .gallery-desc {
            color: #666;
            line-height: 1.5;
        }

        /* 통계 섹션 */
        .stats {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            margin: 3rem 2rem;
            padding: 2rem;
            border-radius: 15px;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 2rem;
        }

        .stat-item {
            text-align: center;
            color: white;
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            display: block;
        }

        .stat-label {
            font-size: 1rem;
            opacity: 0.9;
        }

        /* 푸터 */
        .footer {
            background: rgba(0,0,0,0.2);
            color: white;
            text-align: center;
            padding: 2rem;
            margin-top: 4rem;
        }

        /* 애니메이션 */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* 반응형 디자인 */
        @media (max-width: 768px) {
            .nav-menu {
                display: none;
            }

            .hero-title {
                font-size: 2rem;
            }

            .gallery-grid {
                grid-template-columns: 1fr;
            }

            .stats {
                flex-direction: column;
                align-items: center;
            }
        }

        /* 다크모드 토글 */
        .dark-mode-toggle {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            cursor: pointer;
            transition: transform 0.3s;
        }

        .dark-mode-toggle:hover {
            transform: scale(1.1);
        }
    </style>
</head>
<body>
    <!-- 헤더 -->
    <header class="header">
        <nav class="nav-container">
            <div class="logo">🎨 Digital Art Gallery</div>
            <ul class="nav-menu">
                <li><a href="#home" class="nav-link">홈</a></li>
                <li><a href="#gallery" class="nav-link">갤러리</a></li>
                <li><a href="#about" class="nav-link">소개</a></li>
                <li><a href="#contact" class="nav-link">연락처</a></li>
            </ul>
        </nav>
    </header>

    <!-- 히어로 섹션 -->
    <section class="hero">
        <h1 class="hero-title">박서준의 디지털 아트 갤러리</h1>
        <p class="hero-subtitle">창의적인 디지털 아트와 웹 디자인의 세계</p>
    </section>

    <!-- 통계 -->
    <div class="stats">
        <div class="stat-item">
            <span class="stat-number">24</span>
            <span class="stat-label">작품</span>
        </div>
        <div class="stat-item">
            <span class="stat-number">156</span>
            <span class="stat-label">좋아요</span>
        </div>
        <div class="stat-item">
            <span class="stat-number">3</span>
            <span class="stat-label">카테고리</span>
        </div>
        <div class="stat-item">
            <span class="stat-number">100%</span>
            <span class="stat-label">반응형</span>
        </div>
    </div>

    <!-- 갤러리 -->
    <section class="gallery" id="gallery">
        <h2 class="gallery-title">작품 갤러리</h2>
        <div class="gallery-grid">
            <div class="gallery-item">
                <div class="gallery-image" style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4);">
                    🌅
                </div>
                <div class="gallery-info">
                    <h3 class="gallery-title-item">꿈의 풍경</h3>
                    <p class="gallery-desc">디지털 페인팅으로 표현한 환상적인 일출 풍경</p>
                </div>
            </div>

            <div class="gallery-item">
                <div class="gallery-image" style="background: linear-gradient(45deg, #667eea, #764ba2);">
                    🚀
                </div>
                <div class="gallery-info">
                    <h3 class="gallery-title-item">우주 탐험</h3>
                    <p class="gallery-desc">미래의 우주 여행을 상상하며 그린 일러스트</p>
                </div>
            </div>

            <div class="gallery-item">
                <div class="gallery-image" style="background: linear-gradient(45deg, #f093fb, #f5576c);">
                    🏙️
                </div>
                <div class="gallery-info">
                    <h3 class="gallery-title-item">미래 도시</h3>
                    <p class="gallery-desc">네온 빛으로 가득한 사이버펑크 도시</p>
                </div>
            </div>

            <div class="gallery-item">
                <div class="gallery-image" style="background: linear-gradient(45deg, #fa709a, #fee140);">
                    🦋
                </div>
                <div class="gallery-info">
                    <h3 class="gallery-title-item">나비의 꿈</h3>
                    <p class="gallery-desc">추상적인 나비를 표현한 디지털 아트</p>
                </div>
            </div>

            <div class="gallery-item">
                <div class="gallery-image" style="background: linear-gradient(45deg, #30cfd0, #330867);">
                    🌊
                </div>
                <div class="gallery-info">
                    <h3 class="gallery-title-item">깊은 바다</h3>
                    <p class="gallery-desc">신비로운 심해의 세계를 표현한 작품</p>
                </div>
            </div>

            <div class="gallery-item">
                <div class="gallery-image" style="background: linear-gradient(45deg, #a8edea, #fed6e3);">
                    🌸
                </div>
                <div class="gallery-info">
                    <h3 class="gallery-title-item">봄의 정원</h3>
                    <p class="gallery-desc">파스텔 톤으로 그린 봄꽃 일러스트</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 푸터 -->
    <footer class="footer">
        <p>&copy; 2024 박서준의 디지털 아트 갤러리</p>
        <p>Made with ❤️ at CodeKids</p>
    </footer>

    <!-- 다크모드 토글 -->
    <div class="dark-mode-toggle" onclick="toggleDarkMode()">🌙</div>

    <script>
        // 부드러운 스크롤
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // 갤러리 아이템 클릭 이벤트
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                const title = this.querySelector('.gallery-title-item').textContent;
                alert('작품 "' + title + '"를 클릭하셨습니다!\\n실제 웹사이트에서는 상세 페이지로 이동합니다.');
            });
        });

        // 다크모드 토글 (간단한 예시)
        function toggleDarkMode() {
            alert('다크모드 기능은 추가 개발이 필요합니다!');
        }

        // 페이지 로드 애니메이션
        window.addEventListener('load', () => {
            document.querySelectorAll('.gallery-item').forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.transition = 'all 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    </script>
</body>
</html>
        `;

        // iframe에 HTML 쓰기
        const iframeDoc = websiteIframe.contentDocument || websiteIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(websiteHTML);
        iframeDoc.close();
    }

    // 디바이스 전환
    switchDevice(device) {
        const websiteFrame = document.getElementById('website-frame');
        const websiteIframe = document.getElementById('website-iframe');

        // 모든 디바이스 버튼 비활성화 스타일 제거
        ['mobile', 'tablet', 'desktop'].forEach(d => {
            const btn = document.getElementById(`device-${d}`);
            if (btn) {
                btn.classList.remove('bg-white', 'bg-opacity-30');
                btn.classList.add('bg-white', 'bg-opacity-20');
            }
        });

        // 선택된 디바이스 버튼 활성화
        const selectedBtn = document.getElementById(`device-${device}`);
        if (selectedBtn) {
            selectedBtn.classList.remove('bg-opacity-20');
            selectedBtn.classList.add('bg-opacity-30');
        }

        // iframe 크기 조정
        switch(device) {
            case 'mobile':
                websiteFrame.style.width = '375px';
                websiteIframe.style.height = '667px';
                this.showNotification('📱 모바일 뷰로 전환되었습니다', 'info');
                break;
            case 'tablet':
                websiteFrame.style.width = '768px';
                websiteIframe.style.height = '600px';
                this.showNotification('📱 태블릿 뷰로 전환되었습니다', 'info');
                break;
            case 'desktop':
                websiteFrame.style.width = '100%';
                websiteIframe.style.height = '600px';
                this.showNotification('💻 데스크톱 뷰로 전환되었습니다', 'info');
                break;
        }

        this.currentDevice = device;
    }

    // 소스코드 보기 기능
    viewSourceCode() {
        const sourceContainer = document.getElementById('source-container');
        sourceContainer.classList.remove('hidden');

        // 소스코드 보기 알림
        this.showNotification('💻 HTML/CSS/JS 소스코드를 표시합니다', 'info');

        // 스크롤하여 소스코드 영역으로 이동
        sourceContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // 편집하기 기능
    editProject() {
        this.showNotification('✏️ 웹 개발 환경으로 이동합니다...', 'info');

        // 실제로는 온라인 코드 편집기나 개발 환경으로 이동
        setTimeout(() => {
            this.showNotification('💡 VS Code Online이나 CodePen으로 연결할 수 있습니다', 'info');
        }, 1000);
    }

    // 웹사이트 닫기
    closeWebsite() {
        const websiteContainer = document.getElementById('website-container');
        websiteContainer.classList.add('hidden');

        this.showNotification('웹사이트 미리보기가 종료되었습니다', 'info');
    }

    // 소스코드 닫기
    closeSourceCode() {
        const sourceContainer = document.getElementById('source-container');
        sourceContainer.classList.add('hidden');
    }

    // 코드 탭 전환
    switchCodeTab(tabName) {
        // 모든 탭 버튼 비활성화
        document.querySelectorAll('.code-tab-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-orange-100', 'text-orange-700', 'bg-blue-100', 'text-blue-700');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        });

        // 모든 탭 내용 숨기기
        document.querySelectorAll('.code-tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // 선택된 탭 활성화
        const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedBtn) {
            if (tabName === 'index' || tabName === 'gallery') {
                selectedBtn.classList.add('active', 'bg-orange-100', 'text-orange-700');
            } else {
                selectedBtn.classList.add('active', 'bg-blue-100', 'text-blue-700');
            }
            selectedBtn.classList.remove('bg-gray-100', 'text-gray-700');
        }

        // 선택된 탭 내용 표시
        const selectedContent = document.getElementById(`${tabName}-tab`);
        if (selectedContent) {
            selectedContent.classList.remove('hidden');
        }

        this.currentTab = tabName;
    }

    // 알림 표시
    showNotification(message, type = 'info') {
        const alertColors = {
            success: 'bg-green-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500',
            error: 'bg-red-500'
        };

        const alert = document.createElement('div');
        alert.className = `fixed top-4 right-4 z-50 ${alertColors[type]} text-white px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform max-w-sm`;
        alert.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="text-sm">${message}</span>
                <button class="text-white hover:text-gray-200 ml-auto">&times;</button>
            </div>
        `;

        document.body.appendChild(alert);

        // 애니메이션으로 표시
        setTimeout(() => alert.style.transform = 'translateX(0)', 100);

        // 자동 제거
        setTimeout(() => {
            alert.style.transform = 'translateX(100%)';
            setTimeout(() => alert.remove(), 300);
        }, 4000);

        // 클릭으로 제거
        alert.querySelector('button').addEventListener('click', () => {
            alert.style.transform = 'translateX(100%)';
            setTimeout(() => alert.remove(), 300);
        });
    }
}

// 페이지 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    window.artGalleryProject = new ArtGalleryProject();
});

console.log('디지털 아트 갤러리 프로젝트 페이지 스크립트 로드 완료! 🎨');