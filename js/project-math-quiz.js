// CodeKids - 수학 퀴즈 앱 프로젝트 페이지 JavaScript

class MathQuizProject {
    constructor() {
        this.currentTab = 'main';
        this.mathQuizApp = null;

        this.initializeEventListeners();
        this.initializeCodeTabs();
        this.handleURLHash();

        console.log('수학 퀴즈 앱 프로젝트 페이지 초기화 완료! 🧮');
    }

    initializeEventListeners() {
        // 앱 실행 버튼
        const playBtn = document.getElementById('play-app-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.runApp());
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

        // 앱 닫기 버튼
        const closeAppBtn = document.getElementById('close-app-btn');
        if (closeAppBtn) {
            closeAppBtn.addEventListener('click', () => this.closeApp());
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

    // URL 해시 처리
    handleURLHash() {
        const hash = window.location.hash.substring(1); // # 제거

        if (hash === 'run') {
            // 페이지 로드 후 앱 실행
            setTimeout(() => {
                this.runApp();
            }, 500);
        } else if (hash === 'source') {
            // 페이지 로드 후 소스코드 보기
            setTimeout(() => {
                this.viewSourceCode();
            }, 500);
        }
    }

    // 앱 실행 기능
    async runApp() {
        const appContainer = document.getElementById('app-container');
        const appLoading = document.getElementById('app-loading');
        const mathQuizApp = document.getElementById('math-quiz-app');

        // 컨테이너 표시
        appContainer.classList.remove('hidden');

        // 로딩 상태 표시
        appLoading.classList.remove('hidden');
        mathQuizApp.classList.add('hidden');

        // 앱 실행 알림
        this.showNotification('🧮 수학 퀴즈 앱을 실행하고 있습니다...', 'info');

        try {
            // 수학 퀴즈 앱 로드
            await this.loadMathQuizApp();

            // 앱 로딩 완료 후 표시
            setTimeout(() => {
                appLoading.classList.add('hidden');
                mathQuizApp.classList.remove('hidden');
                this.showNotification('🎉 수학 퀴즈 앱이 실행되었습니다! 문제를 풀어보세요!', 'success');
            }, 2000);

        } catch (error) {
            console.error('앱 실행 실패:', error);
            this.showDemoApp();
            this.showNotification('✨ 데모 버전으로 실행됩니다', 'info');
        }
    }

    // 수학 퀴즈 앱 로드
    async loadMathQuizApp() {
        // 실제 환경에서는 파이썬 앱을 웹으로 변환하거나 웹 버전으로 구현
        this.showDemoApp();
    }

    // 데모 수학 퀴즈 앱 표시
    showDemoApp() {
        const mathQuizApp = document.getElementById('math-quiz-app');

        // 데모 앱 HTML 생성
        const demoHTML = `
            <div class="h-full bg-gradient-to-br from-green-50 to-teal-50 p-6">
                <div class="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
                    <!-- 앱 헤더 -->
                    <div class="text-center mb-6">
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">🧮 수학 퀴즈 앱</h3>
                        <div class="flex justify-between text-sm text-gray-600">
                            <span>점수: <span id="demo-score">0</span>점</span>
                            <span>문제: <span id="demo-question-num">1</span>/10</span>
                            <span>난이도: <span id="demo-difficulty">쉬움</span></span>
                        </div>
                    </div>

                    <!-- 문제 영역 -->
                    <div class="bg-blue-50 rounded-lg p-6 mb-6 text-center flex-1 flex items-center justify-center">
                        <div>
                            <div class="text-3xl font-bold text-blue-800 mb-4" id="demo-question">
                                7 + 5 = ?
                            </div>
                            <input type="number" id="demo-answer"
                                   class="w-24 p-3 text-xl text-center border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                   placeholder="답">
                        </div>
                    </div>

                    <!-- 버튼 영역 -->
                    <div class="space-y-3">
                        <div class="flex space-x-3">
                            <button id="demo-submit" class="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                                ✓ 답안 제출
                            </button>
                            <button id="demo-next" class="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors" disabled>
                                ▶ 다음 문제
                            </button>
                        </div>
                        <div class="grid grid-cols-4 gap-2">
                            <button class="operation-btn bg-orange-100 text-orange-800 py-2 rounded-lg text-sm font-semibold hover:bg-orange-200" data-op="addition">
                                덧셈
                            </button>
                            <button class="operation-btn bg-red-100 text-red-800 py-2 rounded-lg text-sm font-semibold hover:bg-red-200" data-op="subtraction">
                                뺄셈
                            </button>
                            <button class="operation-btn bg-purple-100 text-purple-800 py-2 rounded-lg text-sm font-semibold hover:bg-purple-200" data-op="multiplication">
                                곱셈
                            </button>
                            <button class="operation-btn bg-indigo-100 text-indigo-800 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-200" data-op="division">
                                나눗셈
                            </button>
                        </div>
                    </div>

                    <!-- 진행률 표시 -->
                    <div class="mt-4">
                        <div class="bg-gray-200 rounded-full h-2">
                            <div id="demo-progress" class="bg-green-500 h-2 rounded-full transition-all duration-300" style="width: 10%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        mathQuizApp.innerHTML = demoHTML;

        // 데모 앱 인터랙션 초기화
        this.initializeDemoApp();
    }

    // 데모 앱 인터랙션 초기화
    initializeDemoApp() {
        let currentQuestion = 1;
        let score = 0;
        let difficulty = 1;
        let currentProblem = null;

        // 현재 문제 생성
        const generateProblem = (operation = 'addition') => {
            let num1, num2, answer, questionText;

            switch (operation) {
                case 'addition':
                    num1 = Math.floor(Math.random() * 20) + 1;
                    num2 = Math.floor(Math.random() * 20) + 1;
                    answer = num1 + num2;
                    questionText = `${num1} + ${num2} = ?`;
                    break;
                case 'subtraction':
                    num1 = Math.floor(Math.random() * 30) + 10;
                    num2 = Math.floor(Math.random() * num1) + 1;
                    answer = num1 - num2;
                    questionText = `${num1} - ${num2} = ?`;
                    break;
                case 'multiplication':
                    num1 = Math.floor(Math.random() * 12) + 1;
                    num2 = Math.floor(Math.random() * 12) + 1;
                    answer = num1 * num2;
                    questionText = `${num1} × ${num2} = ?`;
                    break;
                case 'division':
                    num2 = Math.floor(Math.random() * 12) + 1;
                    answer = Math.floor(Math.random() * 12) + 1;
                    num1 = num2 * answer;
                    questionText = `${num1} ÷ ${num2} = ?`;
                    break;
            }

            return { num1, num2, answer, questionText, operation };
        };

        // 초기 문제 생성
        currentProblem = generateProblem();
        document.getElementById('demo-question').textContent = currentProblem.questionText;

        // 답안 제출
        const submitBtn = document.getElementById('demo-submit');
        const nextBtn = document.getElementById('demo-next');
        const answerInput = document.getElementById('demo-answer');

        const checkAnswer = () => {
            const userAnswer = parseInt(answerInput.value);

            if (isNaN(userAnswer)) {
                this.showNotification('숫자를 입력해주세요!', 'warning');
                return;
            }

            if (userAnswer === currentProblem.answer) {
                score += 10;
                this.showNotification('🎉 정답입니다!', 'success');
                document.getElementById('demo-score').textContent = score;
            } else {
                this.showNotification(`❌ 틀렸습니다. 정답: ${currentProblem.answer}`, 'error');
            }

            submitBtn.disabled = true;
            nextBtn.disabled = false;
            answerInput.disabled = true;
        };

        const nextQuestion = () => {
            if (currentQuestion >= 10) {
                this.showNotification(`🏆 퀴즈 완료! 최종 점수: ${score}점`, 'success');
                return;
            }

            currentQuestion++;
            const operations = ['addition', 'subtraction', 'multiplication', 'division'];
            const randomOperation = operations[Math.floor(Math.random() * operations.length)];

            currentProblem = generateProblem(randomOperation);

            document.getElementById('demo-question').textContent = currentProblem.questionText;
            document.getElementById('demo-question-num').textContent = currentQuestion;
            document.getElementById('demo-progress').style.width = `${(currentQuestion / 10) * 100}%`;

            // 난이도 증가
            if (currentQuestion % 3 === 0 && difficulty < 4) {
                difficulty++;
                const difficultyNames = ['쉬움', '보통', '어려움', '매우 어려움'];
                document.getElementById('demo-difficulty').textContent = difficultyNames[difficulty - 1];
            }

            answerInput.value = '';
            answerInput.disabled = false;
            answerInput.focus();
            submitBtn.disabled = false;
            nextBtn.disabled = true;
        };

        // 이벤트 리스너
        submitBtn.addEventListener('click', checkAnswer);
        nextBtn.addEventListener('click', nextQuestion);
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !submitBtn.disabled) {
                checkAnswer();
            }
        });

        // 연산 타입 버튼
        document.querySelectorAll('.operation-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const operation = btn.dataset.op;
                currentProblem = generateProblem(operation);
                document.getElementById('demo-question').textContent = currentProblem.questionText;
                answerInput.value = '';
                answerInput.focus();
            });
        });

        // 초기 포커스
        answerInput.focus();
    }

    // 소스코드 보기 기능
    viewSourceCode() {
        const sourceContainer = document.getElementById('source-container');
        sourceContainer.classList.remove('hidden');

        // 소스코드 보기 알림
        this.showNotification('💻 파이썬 소스코드를 표시합니다', 'info');

        // 스크롤하여 소스코드 영역으로 이동
        sourceContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // 편집하기 기능
    editProject() {
        this.showNotification('✏️ 파이썬 개발 환경으로 이동합니다...', 'info');

        // 실제로는 파이썬 IDE나 온라인 편집기로 이동
        setTimeout(() => {
            this.showNotification('💡 실제 환경에서는 파이썬 IDE로 연결됩니다', 'info');
        }, 1000);
    }

    // 앱 닫기
    closeApp() {
        const appContainer = document.getElementById('app-container');
        appContainer.classList.add('hidden');

        this.showNotification('앱이 종료되었습니다', 'info');
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
    window.mathQuizProject = new MathQuizProject();
});

console.log('수학 퀴즈 앱 프로젝트 페이지 스크립트 로드 완료! 🔢');