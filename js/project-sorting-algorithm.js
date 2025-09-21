// 정렬 알고리즘 프로젝트 JavaScript

class SortingVisualizer {
    constructor() {
        this.originalArray = [];
        this.currentArray = [];
        this.isAnimating = false;
        this.animationSpeed = 300;

        this.init();
    }

    init() {
        this.generateRandomArray();
        this.setupEventListeners();
        this.setupTabs();
        this.handleHashNavigation();
    }

    // 랜덤 배열 생성
    generateRandomArray() {
        const arraySize = 10;
        this.originalArray = [];
        for (let i = 0; i < arraySize; i++) {
            this.originalArray.push(Math.floor(Math.random() * 90) + 10);
        }
        this.currentArray = [...this.originalArray];
        this.renderVisualization();
    }

    // 시각화 렌더링
    renderVisualization() {
        const container = document.getElementById('sorting-visualization');
        container.innerHTML = '';

        this.currentArray.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'sorting-bar';
            bar.style.cssText = `
                width: 30px;
                height: ${value * 3}px;
                background: linear-gradient(to top, #8B5CF6, #A78BFA);
                border-radius: 4px 4px 0 0;
                display: flex;
                align-items: end;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: bold;
                padding-bottom: 4px;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            `;
            bar.textContent = value;
            bar.dataset.index = index;
            container.appendChild(bar);
        });
    }

    // 막대 하이라이트
    highlightBars(indices, color = '#EF4444') {
        const bars = document.querySelectorAll('.sorting-bar');
        bars.forEach((bar, index) => {
            if (indices.includes(index)) {
                bar.style.borderColor = color;
                bar.style.background = `linear-gradient(to top, ${color}, ${color}AA)`;
            } else {
                bar.style.borderColor = 'transparent';
                bar.style.background = 'linear-gradient(to top, #8B5CF6, #A78BFA)';
            }
        });
    }

    // 배열 초기화
    resetArray() {
        if (this.isAnimating) return;
        this.currentArray = [...this.originalArray];
        this.renderVisualization();
        this.updateAlgorithmInfo('');
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 새 데이터 생성
        document.getElementById('generate-btn').addEventListener('click', () => {
            if (!this.isAnimating) {
                this.generateRandomArray();
            }
        });

        // 초기화
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetArray();
        });

        // 정렬 알고리즘 버튼들
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.isAnimating) {
                    const algorithm = e.target.dataset.algorithm;
                    this.runSortingAlgorithm(algorithm);
                }
            });
        });
    }

    // 정렬 알고리즘 실행
    async runSortingAlgorithm(algorithm) {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.disableSortButtons();

        switch (algorithm) {
            case 'bubble':
                await this.bubbleSort();
                break;
            case 'selection':
                await this.selectionSort();
                break;
            case 'insertion':
                await this.insertionSort();
                break;
            case 'quick':
                await this.quickSort(0, this.currentArray.length - 1);
                break;
        }

        this.isAnimating = false;
        this.enableSortButtons();
        this.highlightBars([]);
    }

    // 버블 정렬
    async bubbleSort() {
        this.updateAlgorithmInfo('버블 정렬', '인접한 두 원소를 비교하여 순서가 잘못되어 있으면 교환합니다.');
        const n = this.currentArray.length;

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                // 비교할 원소들 하이라이트
                this.highlightBars([j, j + 1], '#EF4444');
                await this.sleep(this.animationSpeed);

                if (this.currentArray[j] > this.currentArray[j + 1]) {
                    // 교환
                    [this.currentArray[j], this.currentArray[j + 1]] = [this.currentArray[j + 1], this.currentArray[j]];
                    this.highlightBars([j, j + 1], '#10B981');
                    this.renderVisualization();
                    await this.sleep(this.animationSpeed);
                }
            }
        }
    }

    // 선택 정렬
    async selectionSort() {
        this.updateAlgorithmInfo('선택 정렬', '최솟값을 찾아서 맨 앞과 교환하는 방식입니다.');
        const n = this.currentArray.length;

        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            this.highlightBars([i], '#F59E0B');

            for (let j = i + 1; j < n; j++) {
                this.highlightBars([i, j, minIdx], '#EF4444');
                await this.sleep(this.animationSpeed / 2);

                if (this.currentArray[j] < this.currentArray[minIdx]) {
                    minIdx = j;
                }
            }

            if (minIdx !== i) {
                [this.currentArray[i], this.currentArray[minIdx]] = [this.currentArray[minIdx], this.currentArray[i]];
                this.highlightBars([i, minIdx], '#10B981');
                this.renderVisualization();
                await this.sleep(this.animationSpeed);
            }
        }
    }

    // 삽입 정렬
    async insertionSort() {
        this.updateAlgorithmInfo('삽입 정렬', '각 원소를 이미 정렬된 부분의 적절한 위치에 삽입합니다.');
        const n = this.currentArray.length;

        for (let i = 1; i < n; i++) {
            let key = this.currentArray[i];
            let j = i - 1;

            this.highlightBars([i], '#F59E0B');
            await this.sleep(this.animationSpeed);

            while (j >= 0 && this.currentArray[j] > key) {
                this.highlightBars([j, j + 1], '#EF4444');
                this.currentArray[j + 1] = this.currentArray[j];
                this.renderVisualization();
                await this.sleep(this.animationSpeed);
                j--;
            }

            this.currentArray[j + 1] = key;
            this.highlightBars([j + 1], '#10B981');
            this.renderVisualization();
            await this.sleep(this.animationSpeed);
        }
    }

    // 퀵 정렬
    async quickSort(low, high) {
        if (low < high) {
            this.updateAlgorithmInfo('퀵 정렬', '피벗을 기준으로 분할하여 재귀적으로 정렬합니다.');
            let pi = await this.partition(low, high);
            await this.quickSort(low, pi - 1);
            await this.quickSort(pi + 1, high);
        }
    }

    // 퀵 정렬 분할
    async partition(low, high) {
        let pivot = this.currentArray[high];
        let i = low - 1;

        this.highlightBars([high], '#F59E0B');
        await this.sleep(this.animationSpeed);

        for (let j = low; j < high; j++) {
            this.highlightBars([j, high], '#EF4444');
            await this.sleep(this.animationSpeed / 2);

            if (this.currentArray[j] < pivot) {
                i++;
                [this.currentArray[i], this.currentArray[j]] = [this.currentArray[j], this.currentArray[i]];
                this.highlightBars([i, j], '#10B981');
                this.renderVisualization();
                await this.sleep(this.animationSpeed);
            }
        }

        [this.currentArray[i + 1], this.currentArray[high]] = [this.currentArray[high], this.currentArray[i + 1]];
        this.renderVisualization();
        await this.sleep(this.animationSpeed);

        return i + 1;
    }

    // 알고리즘 정보 업데이트
    updateAlgorithmInfo(name, description) {
        const infoDiv = document.getElementById('algorithm-info');
        if (name && description) {
            infoDiv.innerHTML = `
                <h4 class="font-bold text-gray-800 mb-2">${name}</h4>
                <p class="text-gray-600 text-sm">${description}</p>
            `;
        } else {
            infoDiv.innerHTML = `
                <h4 class="font-bold text-gray-800 mb-2">알고리즘 정보</h4>
                <p class="text-gray-600 text-sm">정렬 알고리즘을 선택하면 여기에 설명이 표시됩니다.</p>
            `;
        }
    }

    // 정렬 버튼 비활성화
    disableSortButtons() {
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
    }

    // 정렬 버튼 활성화
    enableSortButtons() {
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        });
    }

    // 딜레이 함수
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 탭 설정
    setupTabs() {
        // 메인 탭
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.showTab(tab);
            });
        });

        // 코드 언어 탭
        document.querySelectorAll('.code-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.showCodeTab(lang);
            });
        });
    }

    // 탭 표시
    showTab(activeTab) {
        // 탭 버튼 스타일 업데이트
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.dataset.tab === activeTab) {
                btn.classList.add('active', 'text-purple-600', 'border-purple-600');
                btn.classList.remove('text-gray-600');
            } else {
                btn.classList.remove('active', 'text-purple-600', 'border-purple-600');
                btn.classList.add('text-gray-600');
            }
        });

        // 탭 내용 표시/숨김
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
        // 코드 탭 버튼 스타일 업데이트
        document.querySelectorAll('.code-tab-btn').forEach(btn => {
            if (btn.dataset.lang === activeLang) {
                btn.classList.add('active', 'text-green-600', 'border-green-600');
                btn.classList.remove('text-gray-600');
            } else {
                btn.classList.remove('active', 'text-green-600', 'border-green-600');
                btn.classList.add('text-gray-600');
            }
        });

        // 코드 내용 표시/숨김
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
function downloadTemplate() {
    // 실제로는 서버에서 파일을 제공해야 하지만, 여기서는 시뮬레이션
    const link = document.createElement('a');
    link.href = 'samples/sorting_algorithm_template.sb3';
    link.download = 'sorting_algorithm_template.sb3';
    link.click();

    // 사용자에게 알림
    alert('정렬 알고리즘 템플릿을 다운로드합니다!\n\n포함된 내용:\n• 기본 프로젝트 구조\n• 변수 설정\n• 시각화 스프라이트\n• 예제 알고리즘 블록');
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new SortingVisualizer();
});

// 해시 변경 감지
window.addEventListener('hashchange', () => {
    const visualizer = new SortingVisualizer();
    visualizer.handleHashNavigation();
});