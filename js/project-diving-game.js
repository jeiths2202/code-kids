// 잠수 게임 프로젝트 JavaScript

class DivingGame {
    constructor() {
        this.gameArea = document.getElementById('game-area');
        this.diver = document.getElementById('diver');
        this.treasuresContainer = document.getElementById('treasures');
        this.obstaclesContainer = document.getElementById('obstacles');

        // 게임 상태
        this.gameRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.lives = 3;
        this.time = 60;

        // 다이버 상태
        this.diverState = {
            x: 200,
            y: 100,
            vx: 0,
            vy: 0,
            width: 32,
            height: 32
        };

        // 물리 상수
        this.gravity = 0.3;
        this.buoyancy = -0.15;
        this.waterResistance = 0.95;
        this.airResistance = 0.98;
        this.moveSpeed = 1.5;

        // 게임 객체들
        this.treasures = [];
        this.obstacles = [];

        // 키 입력 상태
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            space: false
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTabs();
        this.createObstacles();
        this.createTreasures();
        this.updateUI();
        this.handleHashNavigation();
    }

    setupEventListeners() {
        // 게임 컨트롤 버튼
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetGame();
        });

        // 키보드 입력
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });

        // 게임 영역 포커스 (키보드 입력을 위해)
        this.gameArea.setAttribute('tabindex', '0');
        this.gameArea.focus();
    }

    handleKeyDown(e) {
        switch(e.code) {
            case 'ArrowUp':
                this.keys.up = true;
                e.preventDefault();
                break;
            case 'ArrowDown':
                this.keys.down = true;
                e.preventDefault();
                break;
            case 'ArrowLeft':
                this.keys.left = true;
                e.preventDefault();
                break;
            case 'ArrowRight':
                this.keys.right = true;
                e.preventDefault();
                break;
            case 'Space':
                this.keys.space = true;
                this.togglePause();
                e.preventDefault();
                break;
        }
    }

    handleKeyUp(e) {
        switch(e.code) {
            case 'ArrowUp':
                this.keys.up = false;
                break;
            case 'ArrowDown':
                this.keys.down = false;
                break;
            case 'ArrowLeft':
                this.keys.left = false;
                break;
            case 'ArrowRight':
                this.keys.right = false;
                break;
            case 'Space':
                this.keys.space = false;
                break;
        }
    }

    startGame() {
        if (this.gameRunning) return;

        this.gameRunning = true;
        this.isPaused = false;
        document.getElementById('game-message').classList.add('hidden');
        document.getElementById('start-btn').disabled = true;

        this.gameLoop = setInterval(() => {
            if (!this.isPaused) {
                this.update();
            }
        }, 16); // 약 60 FPS

        this.timer = setInterval(() => {
            if (!this.isPaused && this.gameRunning) {
                this.time--;
                this.updateUI();
                if (this.time <= 0) {
                    this.gameOver('시간 종료!');
                }
            }
        }, 1000);
    }

    update() {
        this.updateDiverMovement();
        this.updatePhysics();
        this.checkCollisions();
        this.updateDiverPosition();
        this.updateUI();
    }

    updateDiverMovement() {
        // 키 입력에 따른 이동
        if (this.keys.left) {
            this.diverState.vx -= this.moveSpeed;
        }
        if (this.keys.right) {
            this.diverState.vx += this.moveSpeed;
        }
        if (this.keys.up) {
            this.diverState.vy -= this.moveSpeed;
        }
        if (this.keys.down) {
            this.diverState.vy += this.moveSpeed;
        }
    }

    updatePhysics() {
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        const surfaceLevel = 64; // 수면 높이
        const bottomLevel = gameAreaRect.height - 64; // 해저 높이

        // 중력과 부력 적용
        if (this.diverState.y < surfaceLevel) {
            // 수면 위 - 중력만 적용
            this.diverState.vy += this.gravity;
            this.diverState.vx *= this.airResistance;
            this.diverState.vy *= this.airResistance;
        } else {
            // 물 속 - 중력과 부력 모두 적용
            this.diverState.vy += this.gravity + this.buoyancy;
            this.diverState.vx *= this.waterResistance;
            this.diverState.vy *= this.waterResistance;
        }

        // 위치 업데이트
        this.diverState.x += this.diverState.vx;
        this.diverState.y += this.diverState.vy;

        // 경계 검사
        if (this.diverState.x < 0) {
            this.diverState.x = 0;
            this.diverState.vx = 0;
        }
        if (this.diverState.x > gameAreaRect.width - this.diverState.width) {
            this.diverState.x = gameAreaRect.width - this.diverState.width;
            this.diverState.vx = 0;
        }
        if (this.diverState.y < 0) {
            this.diverState.y = 0;
            this.diverState.vy = 0;
        }
        if (this.diverState.y > bottomLevel) {
            this.diverState.y = bottomLevel;
            this.diverState.vy = 0;
        }
    }

    updateDiverPosition() {
        this.diver.style.left = `${this.diverState.x}px`;
        this.diver.style.top = `${this.diverState.y}px`;

        // 다이버가 물 속에 있는지 표시
        if (this.diverState.y > 64) {
            this.diver.style.filter = 'hue-rotate(180deg)';
        } else {
            this.diver.style.filter = 'none';
        }
    }

    createObstacles() {
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        this.obstacles = [];

        // 바위 장애물들을 무작위로 배치
        for (let i = 0; i < 8; i++) {
            const obstacle = {
                x: Math.random() * (gameAreaRect.width - 40),
                y: 100 + Math.random() * (gameAreaRect.height - 200),
                width: 30,
                height: 30
            };

            this.obstacles.push(obstacle);

            const obstacleElement = document.createElement('div');
            obstacleElement.className = 'absolute w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center';
            obstacleElement.style.left = `${obstacle.x}px`;
            obstacleElement.style.top = `${obstacle.y}px`;
            obstacleElement.innerHTML = '🪨';
            this.obstaclesContainer.appendChild(obstacleElement);
        }
    }

    createTreasures() {
        this.treasures = [];
        this.spawnTreasure();
        this.spawnTreasure();
        this.spawnTreasure();
    }

    spawnTreasure() {
        if (this.treasures.length >= 5) return; // 최대 5개

        const gameAreaRect = this.gameArea.getBoundingClientRect();
        const treasure = {
            x: Math.random() * (gameAreaRect.width - 30),
            y: 80 + Math.random() * (gameAreaRect.height - 160),
            width: 25,
            height: 25,
            value: 10
        };

        this.treasures.push(treasure);

        const treasureElement = document.createElement('div');
        treasureElement.className = 'absolute w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse';
        treasureElement.style.left = `${treasure.x}px`;
        treasureElement.style.top = `${treasure.y}px`;
        treasureElement.innerHTML = '💰';
        this.treasuresContainer.appendChild(treasureElement);
    }

    checkCollisions() {
        const diverRect = {
            x: this.diverState.x,
            y: this.diverState.y,
            width: this.diverState.width,
            height: this.diverState.height
        };

        // 보물 충돌 검사
        this.treasures.forEach((treasure, index) => {
            if (this.isColliding(diverRect, treasure)) {
                this.collectTreasure(index);
            }
        });

        // 장애물 충돌 검사
        this.obstacles.forEach(obstacle => {
            if (this.isColliding(diverRect, obstacle)) {
                this.hitObstacle();
            }
        });
    }

    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    collectTreasure(index) {
        const treasure = this.treasures[index];
        this.score += treasure.value;

        // 보물 제거
        this.treasures.splice(index, 1);
        this.treasuresContainer.children[index].remove();

        // 새 보물 생성
        setTimeout(() => {
            this.spawnTreasure();
        }, 1000);

        this.updateUI();
    }

    hitObstacle() {
        if (Date.now() - (this.lastHit || 0) < 1000) return; // 1초 무적시간

        this.lastHit = Date.now();
        this.lives--;
        this.updateUI();

        // 다이버를 안전한 위치로 이동
        this.diverState.x = 200;
        this.diverState.y = 100;
        this.diverState.vx = 0;
        this.diverState.vy = 0;

        if (this.lives <= 0) {
            this.gameOver('생명이 모두 소진되었습니다!');
        }
    }

    togglePause() {
        if (!this.gameRunning) return;

        this.isPaused = !this.isPaused;
        const message = document.getElementById('game-message');

        if (this.isPaused) {
            message.innerHTML = '일시정지<br><small>스페이스바를 다시 누르면 계속됩니다</small>';
            message.classList.remove('hidden');
        } else {
            message.classList.add('hidden');
        }
    }

    gameOver(reason) {
        this.gameRunning = false;
        this.isPaused = false;

        clearInterval(this.gameLoop);
        clearInterval(this.timer);

        const message = document.getElementById('game-message');
        message.innerHTML = `
            게임 종료!<br>
            <div class="text-lg mt-4">${reason}</div>
            <div class="text-lg mt-2">최종 점수: ${this.score}</div>
            <button class="bg-green-500 text-white px-4 py-2 rounded-lg mt-4" onclick="location.reload()">
                다시 시작
            </button>
        `;
        message.classList.remove('hidden');

        document.getElementById('start-btn').disabled = false;
    }

    resetGame() {
        this.gameRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.lives = 3;
        this.time = 60;

        this.diverState.x = 200;
        this.diverState.y = 100;
        this.diverState.vx = 0;
        this.diverState.vy = 0;

        // 기존 게임 루프 정리
        if (this.gameLoop) clearInterval(this.gameLoop);
        if (this.timer) clearInterval(this.timer);

        // 보물과 장애물 재생성
        this.treasuresContainer.innerHTML = '';
        this.obstaclesContainer.innerHTML = '';
        this.createObstacles();
        this.createTreasures();

        this.updateUI();
        this.updateDiverPosition();

        document.getElementById('game-message').innerHTML = '게임을 시작하려면 시작 버튼을 클릭하세요!';
        document.getElementById('game-message').classList.remove('hidden');
        document.getElementById('start-btn').disabled = false;
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('time').textContent = this.time;
    }

    // 탭 시스템
    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.showTab(tab);
            });
        });

        document.querySelectorAll('.code-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.showCodeTab(lang);
            });
        });
    }

    showTab(activeTab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.dataset.tab === activeTab) {
                btn.classList.add('active', 'text-blue-600', 'border-blue-600');
                btn.classList.remove('text-gray-600');
            } else {
                btn.classList.remove('active', 'text-blue-600', 'border-blue-600');
                btn.classList.add('text-gray-600');
            }
        });

        document.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === `${activeTab}-tab`) {
                content.classList.remove('hidden');
                content.classList.add('active');
            } else {
                content.classList.add('hidden');
                content.classList.remove('active');
            }
        });
    }

    showCodeTab(activeLang) {
        document.querySelectorAll('.code-tab-btn').forEach(btn => {
            if (btn.dataset.lang === activeLang) {
                btn.classList.add('active', 'text-green-600', 'border-green-600');
                btn.classList.remove('text-gray-600');
            } else {
                btn.classList.remove('active', 'text-green-600', 'border-green-600');
                btn.classList.add('text-gray-600');
            }
        });

        document.querySelectorAll('.code-content').forEach(content => {
            if (content.id === `${activeLang}-code`) {
                content.classList.remove('hidden');
                content.classList.add('active');
            } else {
                content.classList.add('hidden');
                content.classList.remove('active');
            }
        });
    }

    handleHashNavigation() {
        const hash = window.location.hash.substring(1);
        if (hash === 'run' || hash === 'demo') {
            this.showTab('demo');
        } else if (hash === 'source') {
            this.showTab('source');
        } else if (hash === 'tutorial') {
            this.showTab('tutorial');
        }
    }
}

// 템플릿 다운로드 함수
function downloadDivingGameTemplate() {
    alert('잠수 게임 템플릿을 다운로드합니다!\n\n포함된 내용:\n• 다이버 스프라이트\n• 배경 및 환경 설정\n• 기본 물리 시스템\n• 보물 및 장애물 예제\n• 게임 UI 템플릿');

    // 실제 파일 다운로드 시뮬레이션
    const link = document.createElement('a');
    link.href = 'samples/diving_game_template.sb3';
    link.download = 'diving_game_template.sb3';
    link.click();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new DivingGame();
});

// 해시 변경 감지
window.addEventListener('hashchange', () => {
    const game = new DivingGame();
    game.handleHashNavigation();
});