// CodeKids - 고양이 케어 게임 프로젝트 페이지 JavaScript

class CatCareProject {
    constructor() {
        this.gameUrl = 'http://localhost:8601/projects/cat-care-game';
        this.scratchProjectFile = '/samples/cat-care-game.sb3';
        this.currentTab = 'blocks';

        this.initializeEventListeners();
        this.initializeCodeTabs();
        this.handleURLHash();

        console.log('고양이 케어 게임 프로젝트 페이지 초기화 완료! 🐱');
    }

    initializeEventListeners() {
        // 게임 실행 버튼
        const playBtn = document.getElementById('play-game-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.runGame());
        }

        // 소스코드 보기 버튼
        const sourceBtn = document.getElementById('view-source-btn');
        if (sourceBtn) {
            sourceBtn.addEventListener('click', () => this.viewSourceCode());
        }

        // 편집하기 버튼 (코딩 실험실로 이동)
        const editBtn = document.getElementById('edit-project-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.editProject());
        }

        // 게임 닫기 버튼
        const closeGameBtn = document.getElementById('close-game-btn');
        if (closeGameBtn) {
            closeGameBtn.addEventListener('click', () => this.closeGame());
        }

        // 소스코드 닫기 버튼
        const closeSourceBtn = document.getElementById('close-source-btn');
        if (closeSourceBtn) {
            closeSourceBtn.addEventListener('click', () => this.closeSourceCode());
        }
    }

    initializeCodeTabs() {
        const tabButtons = document.querySelectorAll('.code-tab-btn');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchCodeTab(tabName);
            });
        });
    }

    // 게임 실행 기능
    async runGame() {
        const gameContainer = document.getElementById('game-container');
        const gameIframe = document.getElementById('game-iframe');
        const gameLoading = document.getElementById('game-loading');

        // 컨테이너 표시
        gameContainer.classList.remove('hidden');

        // 로딩 상태 표시
        gameLoading.classList.remove('hidden');
        gameIframe.classList.add('hidden');

        // 게임 실행 알림
        this.showNotification('🎮 고양이 케어 게임을 실행하고 있습니다...', 'info');

        try {
            // 실제 환경에서는 Scratch GUI에서 프로젝트를 실행
            await this.loadGameInScratch();

            // 게임 로딩 완료 후 iframe 표시
            setTimeout(() => {
                gameLoading.classList.add('hidden');
                gameIframe.classList.remove('hidden');
                this.showNotification('🎉 게임이 실행되었습니다! 고양이를 돌봐주세요!', 'success');
            }, 2000);

        } catch (error) {
            console.error('게임 실행 실패:', error);
            gameLoading.innerHTML = `
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-3"></i>
                    <p class="text-red-600 font-semibold">게임 실행에 실패했습니다</p>
                    <p class="text-gray-600 text-sm mt-2">Scratch GUI 서버가 실행 중인지 확인해주세요</p>
                    <button onclick="window.catCareProject.runGame()" class="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600">
                        다시 시도
                    </button>
                </div>
            `;
            this.showNotification('❌ 게임 실행에 실패했습니다', 'error');
        }
    }

    // Scratch GUI에서 게임 로드
    async loadGameInScratch() {
        try {
            // Scratch GUI 서버 확인
            const response = await fetch('http://localhost:8601');
            if (!response.ok) {
                throw new Error('Scratch GUI 서버에 연결할 수 없습니다');
            }

            // 샘플 프로젝트 파일을 Scratch GUI에 로드
            const scratchIframe = document.getElementById('game-iframe');

            // 프로젝트 파일을 포함한 URL로 설정
            const gameUrl = `http://localhost:8601?project=${encodeURIComponent(this.scratchProjectFile)}`;
            scratchIframe.src = gameUrl;

            console.log('고양이 케어 게임을 Scratch GUI에 로드 중:', gameUrl);

        } catch (error) {
            console.error('Scratch GUI 로드 실패:', error);

            // 폴백: 데모 게임 화면 표시
            this.showDemoGame();
        }
    }

    // 데모 게임 화면 표시 (폴백)
    showDemoGame() {
        const gameIframe = document.getElementById('game-iframe');
        const gameLoading = document.getElementById('game-loading');

        // 데모 HTML 생성
        const demoHTML = `
            <div class="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                <div class="text-center p-8">
                    <div class="relative mb-6">
                        <div class="w-32 h-32 bg-pink-300 rounded-full mx-auto flex items-center justify-center">
                            <i class="fas fa-cat text-white text-5xl"></i>
                        </div>
                        <div class="absolute top-0 right-0 w-8 h-8 bg-red-400 rounded-full flex items-center justify-center animate-pulse">
                            <i class="fas fa-heart text-white text-sm"></i>
                        </div>
                    </div>

                    <h3 class="text-2xl font-bold text-gray-800 mb-4">고양이 케어 게임 데모</h3>
                    <p class="text-gray-600 mb-6">실제 게임에서는 고양이를 클릭하여<br>먹이를 주고 놀아줄 수 있어요!</p>

                    <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
                        <button class="demo-btn bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors">
                            <i class="fas fa-utensils mb-2"></i><br>먹이주기
                        </button>
                        <button class="demo-btn bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
                            <i class="fas fa-gamepad mb-2"></i><br>놀아주기
                        </button>
                        <button class="demo-btn bg-cyan-500 text-white p-3 rounded-lg hover:bg-cyan-600 transition-colors">
                            <i class="fas fa-bath mb-2"></i><br>씻기기
                        </button>
                        <button class="demo-btn bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-colors">
                            <i class="fas fa-bed mb-2"></i><br>재우기
                        </button>
                    </div>

                    <div class="mt-6 p-4 bg-white rounded-lg shadow-md">
                        <div class="flex justify-between text-sm">
                            <span>행복도: <span id="happiness-demo">85</span>%</span>
                            <span>건강도: <span id="health-demo">92</span>%</span>
                        </div>
                        <div class="mt-2 bg-gray-200 rounded-full h-2">
                            <div class="bg-green-500 h-2 rounded-full" style="width: 88%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 데모 HTML을 iframe에 설정
        gameLoading.classList.add('hidden');
        gameIframe.classList.remove('hidden');

        // iframe에 내용 쓰기
        const iframeDoc = gameIframe.contentDocument || gameIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>고양이 케어 게임 데모</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
            </head>
            <body class="font-sans">
                ${demoHTML}
                <script>
                    // 데모 인터랙션
                    document.querySelectorAll('.demo-btn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            this.style.transform = 'scale(0.95)';
                            setTimeout(() => this.style.transform = 'scale(1)', 150);

                            // 상태 변화 시뮬레이션
                            const happiness = document.getElementById('happiness-demo');
                            const health = document.getElementById('health-demo');
                            if (happiness && health) {
                                happiness.textContent = Math.min(100, parseInt(happiness.textContent) + Math.floor(Math.random() * 10) + 1);
                                health.textContent = Math.min(100, parseInt(health.textContent) + Math.floor(Math.random() * 5) + 1);
                            }
                        });
                    });
                </script>
            </body>
            </html>
        `);
        iframeDoc.close();
    }

    // 소스코드 보기 기능
    viewSourceCode() {
        const sourceContainer = document.getElementById('source-container');
        sourceContainer.classList.remove('hidden');

        // 소스코드 보기 알림
        this.showNotification('💻 프로젝트 소스코드를 표시합니다', 'info');

        // 스크롤하여 소스코드 영역으로 이동
        sourceContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // 편집하기 기능 (코딩 실험실로 이동)
    editProject() {
        this.showNotification('✏️ 코딩 실험실로 이동합니다...', 'info');

        // 코딩 실험실로 이동하면서 고양이 케어 게임 프로젝트 로드
        setTimeout(() => {
            const editorUrl = `editor.html?project=cat-care-game`;
            window.location.href = editorUrl;
        }, 1000);
    }

    // 게임 닫기
    closeGame() {
        const gameContainer = document.getElementById('game-container');
        gameContainer.classList.add('hidden');

        // iframe 정리
        const gameIframe = document.getElementById('game-iframe');
        gameIframe.src = '';

        this.showNotification('게임이 종료되었습니다', 'info');
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
            btn.classList.remove('active', 'bg-blue-100', 'text-blue-700');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        });

        // 모든 탭 내용 숨기기
        document.querySelectorAll('.code-tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // 선택된 탭 활성화
        const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active', 'bg-blue-100', 'text-blue-700');
            selectedBtn.classList.remove('bg-gray-100', 'text-gray-700');
        }

        // 선택된 탭 내용 표시
        const selectedContent = document.getElementById(`${tabName}-tab`);
        if (selectedContent) {
            selectedContent.classList.remove('hidden');
        }

        this.currentTab = tabName;
    }

    // URL 해시 처리
    handleURLHash() {
        const hash = window.location.hash.substring(1); // # 제거

        if (hash === 'run') {
            // 페이지 로드 후 게임 실행
            setTimeout(() => {
                this.runGame();
            }, 500);
        } else if (hash === 'source') {
            // 페이지 로드 후 소스코드 보기
            setTimeout(() => {
                this.viewSourceCode();
            }, 500);
        }
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
    window.catCareProject = new CatCareProject();
});

console.log('고양이 케어 게임 프로젝트 페이지 스크립트 로드 완료! 🐾');