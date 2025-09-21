// 미로 탈출 로봇 프로젝트 JavaScript

class MazeRobot {
    constructor() {
        this.maze = [
            [1,1,1,1,1,1,1,1,1,1],
            [1,0,1,0,0,0,0,0,0,1],
            [1,0,1,0,1,1,1,0,0,1],
            [1,0,0,0,1,0,0,0,0,1],
            [1,0,1,0,1,0,1,1,0,1],
            [1,0,1,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1]
        ];

        this.robotX = 1;
        this.robotY = 1;
        this.targetX = 8;
        this.targetY = 5;
        this.moveCount = 0;
        this.isGameComplete = false;
        this.isAutoSolving = false;

        this.init();
    }

    init() {
        this.createMazeGrid();
        this.setupEventListeners();
        this.setupTabs();
        this.updateGameStatus();
        this.handleHashNavigation();
    }

    // 미로 그리드 생성
    createMazeGrid() {
        const mazeGrid = document.getElementById('maze-grid');
        mazeGrid.innerHTML = '';

        for (let y = 0; y < this.maze.length; y++) {
            for (let x = 0; x < this.maze[y].length; x++) {
                const cell = document.createElement('div');
                cell.className = 'maze-cell w-8 h-8 border border-gray-300 flex items-center justify-center text-sm';
                cell.dataset.x = x;
                cell.dataset.y = y;

                if (this.maze[y][x] === 1) {
                    // 벽
                    cell.style.backgroundColor = '#374151';
                    cell.innerHTML = '🧱';
                } else {
                    // 빈 공간
                    cell.style.backgroundColor = '#f9fafb';
                }

                // 시작점
                if (x === 1 && y === 1) {
                    cell.style.backgroundColor = '#dbeafe';
                    cell.innerHTML = '🏁';
                }

                // 목표점
                if (x === this.targetX && y === this.targetY) {
                    cell.style.backgroundColor = '#dcfce7';
                    cell.innerHTML = '🎯';
                }

                // 로봇 위치
                if (x === this.robotX && y === this.robotY) {
                    cell.innerHTML = '🤖';
                    cell.style.backgroundColor = '#fef3c7';
                }

                mazeGrid.appendChild(cell);
            }
        }
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 방향 버튼들
        document.getElementById('move-up').addEventListener('click', () => this.moveRobot(0, -1));
        document.getElementById('move-down').addEventListener('click', () => this.moveRobot(0, 1));
        document.getElementById('move-left').addEventListener('click', () => this.moveRobot(-1, 0));
        document.getElementById('move-right').addEventListener('click', () => this.moveRobot(1, 0));

        // 키보드 입력
        document.addEventListener('keydown', (e) => {
            if (this.isAutoSolving || this.isGameComplete) return;

            switch(e.key) {
                case 'ArrowUp':
                    this.moveRobot(0, -1);
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    this.moveRobot(0, 1);
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    this.moveRobot(-1, 0);
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    this.moveRobot(1, 0);
                    e.preventDefault();
                    break;
            }
        });

        // 컨트롤 버튼들
        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('auto-solve-btn').addEventListener('click', () => this.autoSolve());
    }

    // 로봇 이동
    moveRobot(deltaX, deltaY) {
        if (this.isAutoSolving || this.isGameComplete) return;

        const newX = this.robotX + deltaX;
        const newY = this.robotY + deltaY;

        // 경계 및 벽 체크
        if (newX < 0 || newX >= this.maze[0].length ||
            newY < 0 || newY >= this.maze.length ||
            this.maze[newY][newX] === 1) {
            // 벽에 부딪힘 효과
            this.showCollisionEffect();
            return false;
        }

        // 이동 가능
        this.robotX = newX;
        this.robotY = newY;
        this.moveCount++;

        this.createMazeGrid();
        this.updateGameStatus();

        // 목표 도달 체크
        if (this.robotX === this.targetX && this.robotY === this.targetY) {
            this.completeGame();
        }

        return true;
    }

    // 충돌 효과
    showCollisionEffect() {
        const robotCell = document.querySelector(`[data-x="${this.robotX}"][data-y="${this.robotY}"]`);
        if (robotCell) {
            robotCell.style.animation = 'shake 0.3s ease-in-out';
            setTimeout(() => {
                robotCell.style.animation = '';
            }, 300);
        }
    }

    // 게임 완료
    completeGame() {
        this.isGameComplete = true;
        const statusElement = document.getElementById('game-status');
        statusElement.textContent = '🎉 완료!';
        statusElement.className = 'text-green-600 font-bold';

        // 축하 메시지
        setTimeout(() => {
            alert(`🎉 축하합니다! 미로 탈출 성공!\n\n총 이동 횟수: ${this.moveCount}번\n획득 포인트: 100점`);
        }, 500);

        // 컨트롤 버튼 비활성화
        this.disableControlButtons();
    }

    // 게임 초기화
    resetGame() {
        this.robotX = 1;
        this.robotY = 1;
        this.moveCount = 0;
        this.isGameComplete = false;
        this.isAutoSolving = false;

        this.createMazeGrid();
        this.updateGameStatus();
        this.enableControlButtons();
    }

    // 자동 해결
    async autoSolve() {
        if (this.isAutoSolving || this.isGameComplete) return;

        this.isAutoSolving = true;
        this.disableControlButtons();

        const statusElement = document.getElementById('game-status');
        statusElement.textContent = '🧠 자동 탐색 중...';
        statusElement.className = 'text-blue-600';

        const path = this.findShortestPath();

        if (path) {
            await this.animatePath(path);
        } else {
            alert('경로를 찾을 수 없습니다!');
            this.isAutoSolving = false;
            this.enableControlButtons();
        }
    }

    // BFS로 최단 경로 찾기
    findShortestPath() {
        const queue = [{x: this.robotX, y: this.robotY, path: []}];
        const visited = new Set();
        const directions = [
            {x: 0, y: -1},  // 북
            {x: 1, y: 0},   // 동
            {x: 0, y: 1},   // 남
            {x: -1, y: 0}   // 서
        ];

        while (queue.length > 0) {
            const current = queue.shift();
            const key = `${current.x},${current.y}`;

            if (visited.has(key)) continue;
            visited.add(key);

            // 목표 지점 도달
            if (current.x === this.targetX && current.y === this.targetY) {
                return current.path;
            }

            // 4방향 탐색
            for (let dir of directions) {
                const newX = current.x + dir.x;
                const newY = current.y + dir.y;
                const newKey = `${newX},${newY}`;

                if (this.canMove(newX, newY) && !visited.has(newKey)) {
                    queue.push({
                        x: newX,
                        y: newY,
                        path: [...current.path, {x: newX, y: newY}]
                    });
                }
            }
        }

        return null; // 경로를 찾을 수 없음
    }

    // 이동 가능 여부 확인
    canMove(x, y) {
        return x >= 0 && x < this.maze[0].length &&
               y >= 0 && y < this.maze.length &&
               this.maze[y][x] === 0;
    }

    // 경로 애니메이션
    async animatePath(path) {
        for (let step of path) {
            this.robotX = step.x;
            this.robotY = step.y;
            this.moveCount++;

            this.createMazeGrid();
            this.updateGameStatus();

            // 목표 도달 체크
            if (this.robotX === this.targetX && this.robotY === this.targetY) {
                this.completeGame();
                return;
            }

            // 0.5초 대기
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    // 게임 상태 업데이트
    updateGameStatus() {
        document.getElementById('robot-position').textContent = `(${this.robotX}, ${this.robotY})`;
        document.getElementById('move-count').textContent = this.moveCount;

        if (!this.isGameComplete && !this.isAutoSolving) {
            document.getElementById('game-status').textContent = '진행 중';
            document.getElementById('game-status').className = 'text-blue-600';
        }
    }

    // 컨트롤 버튼 비활성화
    disableControlButtons() {
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
        document.getElementById('auto-solve-btn').disabled = true;
        document.getElementById('auto-solve-btn').style.opacity = '0.5';
    }

    // 컨트롤 버튼 활성화
    enableControlButtons() {
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        });
        document.getElementById('auto-solve-btn').disabled = false;
        document.getElementById('auto-solve-btn').style.opacity = '1';
    }

    // 탭 설정
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

    // 탭 표시
    showTab(activeTab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.dataset.tab === activeTab) {
                btn.classList.add('active', 'text-indigo-600', 'border-indigo-600');
                btn.classList.remove('text-gray-600');
            } else {
                btn.classList.remove('active', 'text-indigo-600', 'border-indigo-600');
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

    // 코드 탭 표시
    showCodeTab(activeLang) {
        document.querySelectorAll('.code-tab-btn').forEach(btn => {
            if (btn.dataset.lang === activeLang) {
                btn.classList.add('active', 'text-indigo-600', 'border-indigo-600');
                btn.classList.remove('text-gray-600');
            } else {
                btn.classList.remove('active', 'text-indigo-600', 'border-indigo-600');
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

    // URL 해시 기반 네비게이션
    handleHashNavigation() {
        const hash = window.location.hash.substring(1);
        if (hash === 'challenge' || hash === 'run') {
            this.showTab('challenge');
        } else if (hash === 'solution') {
            this.showTab('solution');
        } else if (hash === 'source') {
            this.showTab('source');
        }
    }
}

// 템플릿 다운로드 함수
function downloadMazeTemplate() {
    alert('미로 탈출 로봇 템플릿을 다운로드합니다!\n\n포함된 내용:\n• 로봇 스프라이트\n• 미로 배경\n• 벽 감지 시스템\n• 기본 이동 로직\n• 오른손 법칙 예제');

    // 실제 파일 다운로드 시뮬레이션
    const link = document.createElement('a');
    link.href = 'samples/maze_robot_template.sb3';
    link.download = 'maze_robot_template.sb3';
    link.click();
}

// 힌트 보기 함수
function showHints() {
    const hints = `
🧩 스크래치 구현 힌트:

1️⃣ 벽 감지하기:
   • "검은색에 닿았는가?" 블록 사용
   • 이동하기 전에 벽 체크하기

2️⃣ 방향 관리하기:
   • "방향" 변수로 0도, 90도, 180도, 270도 관리
   • "90도 돌기" 블록으로 방향 변경

3️⃣ 오른손 법칙:
   • 오른쪽 벽을 따라 이동
   • 막다른 길에서는 뒤돌아서 계속

4️⃣ 이동 횟수 세기:
   • "이동 횟수" 변수 만들기
   • 이동할 때마다 1씩 증가

5️⃣ 목표 지점 확인:
   • "초록색에 닿았는가?" 로 목표 지점 확인
   • 도달하면 "모든 스크립트 정지"
    `;

    alert(hints);
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
    }

    .maze-cell {
        transition: all 0.2s ease;
    }

    .maze-cell:hover {
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new MazeRobot();
});

// 해시 변경 감지
window.addEventListener('hashchange', () => {
    const robot = new MazeRobot();
    robot.handleHashNavigation();
});