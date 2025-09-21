// CodeKids 클라우드 프로젝트 관리 모듈

class CloudProjectManager {
    constructor() {
        this.modal = document.getElementById('cloud-project-modal');
        this.projectsGrid = document.getElementById('cloud-projects-grid');
        this.searchInput = document.getElementById('cloud-search');
        this.sortSelect = document.getElementById('cloud-sort');

        this.currentCategory = 'all';
        this.projects = [];
        this.filteredProjects = [];
        this.googleDriveProjects = [];

        this.init();
    }

    init() {
        // DOM이 완전히 로드된 후 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.loadProjectsData();
            });
        } else {
            this.setupEventListeners();
            this.loadProjectsData();
        }
    }

    setupEventListeners() {
        console.log('🔧 setupEventListeners 호출됨');

        // 모달 참조 설정
        this.modal = document.getElementById('cloud-projects-modal');
        this.gridContainer = document.getElementById('cloud-projects-grid');

        console.log('🔍 모달 요소 상태:', !!this.modal);
        console.log('🔍 그리드 컨테이너 상태:', !!this.gridContainer);

        // 카테고리 필터 버튼들
        document.querySelectorAll('.cloud-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setCategory(btn.dataset.category);
                this.updateFilterButtons(btn);
            });
        });

        // 검색 입력
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                this.filterProjects();
            });
        }

        // 정렬 선택
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => {
                this.sortProjects();
            });
        }

        // 모달 닫기 (배경 클릭)
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }
    }


    // 샘플 프로젝트 데이터 로드
    async loadProjectsData() {
        // 기본 샘플 프로젝트 로드
        await this.loadSampleProjects();

        // Google Drive 프로젝트 로드 시도
        await this.loadGoogleDriveProjects();

        // 모든 프로젝트 통합
        this.projects = [...this.sampleProjects, ...this.googleDriveProjects];

        this.filterProjects();
        this.renderProjects();
    }

    async loadSampleProjects() {
        // 샘플 프로젝트 데이터
        this.sampleProjects = [
            {
                id: 'cloud_001',
                title: 'Super Mario Vivacious',
                description: '슈퍼마리오 스타일의 플랫폼 게임. 점프와 달리기로 레벨을 클리어하세요!',
                category: 'game',
                difficulty: '고급',
                author: 'CodeKids',
                rating: 4.9,
                downloads: 3456,
                fileSize: '3.2MB',
                thumbnail: 'mario.png',
                filePath: '/cloud-projects/files/Super Mario Vivacious.sb3',
                tags: ['플랫폼', '어드벤처', '마리오', '게임'],
                createdAt: '2024-01-15',
                isLargeFile: false
            },
            {
                id: 'cloud_002',
                title: 'Snake Game',
                description: '클래식 뱀 게임. 먹이를 먹고 성장하며 최고 점수에 도전하세요!',
                category: 'game',
                difficulty: '초급',
                author: 'CodeKids',
                rating: 4.5,
                downloads: 2234,
                fileSize: '1.8MB',
                thumbnail: 'snake.png',
                filePath: '/cloud-projects/files/Snake Game.sb3',
                tags: ['아케이드', '클래식', '뱀', '게임'],
                createdAt: '2024-01-20'
            },
            {
                id: 'cloud_003',
                title: 'Minecraft',
                description: '마인크래프트 스타일의 어드벤처 게임. 블록을 파괴하고 건설하세요!',
                category: 'game',
                difficulty: '중급',
                author: 'CodeKids',
                rating: 4.8,
                downloads: 4567,
                fileSize: '2.1MB',
                thumbnail: 'minecraft.png',
                filePath: '/cloud-projects/files/Minecraft.sb3',
                tags: ['샌드박스', '건설', '마인크래프트', '어드벤처'],
                createdAt: '2024-01-18'
            },
            {
                id: 'cloud_004',
                title: '춤추는 고양이',
                description: '음악에 맞춰 춤추는 귀여운 고양이 애니메이션',
                category: 'animation',
                difficulty: '초급',
                author: 'CodeKids',
                rating: 4.5,
                downloads: 892,
                fileSize: '1.8MB',
                thumbnail: 'dancing-cat.png',
                filePath: '/cloud-projects/files/dancing-cat.sb3',
                tags: ['애니메이션', '음악', '춤', '고양이'],
                createdAt: '2024-01-20'
            },
            {
                id: 'cloud_003',
                title: '구구단 게임',
                description: '재미있게 구구단을 배우는 교육 게임',
                category: 'education',
                difficulty: '초급',
                author: 'CodeKids',
                rating: 4.9,
                downloads: 2156,
                fileSize: '1.5MB',
                thumbnail: 'multiplication.png',
                filePath: '/cloud-projects/files/multiplication-game.sb3',
                tags: ['교육', '수학', '구구단'],
                createdAt: '2024-01-18'
            },
            {
                id: 'cloud_004',
                title: '우주 탐험',
                description: '우주선을 조종하여 행성을 탐험하는 게임',
                category: 'game',
                difficulty: '고급',
                author: 'CodeKids',
                rating: 4.7,
                downloads: 1567,
                fileSize: '3.2MB',
                thumbnail: 'space-adventure.png',
                filePath: '/cloud-projects/files/space-adventure.sb3',
                tags: ['우주', '탐험', '어드벤처'],
                createdAt: '2024-01-22'
            },
            {
                id: 'cloud_005',
                title: '피아노 연주',
                description: '키보드로 피아노를 연주할 수 있는 앱',
                category: 'art',
                difficulty: '중급',
                author: 'CodeKids',
                rating: 4.6,
                downloads: 1023,
                fileSize: '2.1MB',
                thumbnail: 'piano.png',
                filePath: '/cloud-projects/files/piano-player.sb3',
                tags: ['음악', '피아노', '악기'],
                createdAt: '2024-01-25'
            },
            {
                id: 'cloud_006',
                title: '그림판',
                description: '마우스로 그림을 그릴 수 있는 그림판',
                category: 'art',
                difficulty: '초급',
                author: 'CodeKids',
                rating: 4.4,
                downloads: 789,
                fileSize: '1.2MB',
                thumbnail: 'paint.png',
                filePath: '/cloud-projects/files/paint-app.sb3',
                tags: ['그림', '예술', '창작'],
                createdAt: '2024-01-28'
            },
            {
                id: 'cloud_007',
                title: '공룡 러너',
                description: '장애물을 피해 달리는 러닝 게임',
                category: 'game',
                difficulty: '중급',
                author: 'CodeKids',
                rating: 4.8,
                downloads: 1892,
                fileSize: '2.5MB',
                thumbnail: 'dino-runner.png',
                filePath: '/cloud-projects/files/dino-runner.sb3',
                tags: ['러닝', '공룡', '아케이드'],
                createdAt: '2024-02-01'
            },
            {
                id: 'cloud_008',
                title: '영어 단어 퀴즈',
                description: '영어 단어를 재미있게 배우는 퀴즈',
                category: 'education',
                difficulty: '초급',
                author: 'CodeKids',
                rating: 4.7,
                downloads: 1456,
                fileSize: '1.7MB',
                thumbnail: 'english-quiz.png',
                filePath: '/cloud-projects/files/english-quiz.sb3',
                tags: ['영어', '교육', '퀴즈'],
                createdAt: '2024-02-05'
            },
            {
                id: 'cloud_009',
                title: '파티클 효과',
                description: '아름다운 파티클 애니메이션',
                category: 'animation',
                difficulty: '고급',
                author: 'CodeKids',
                rating: 4.9,
                downloads: 967,
                fileSize: '2.8MB',
                thumbnail: 'particles.png',
                filePath: '/cloud-projects/files/particle-effects.sb3',
                tags: ['파티클', '효과', '애니메이션'],
                createdAt: '2024-02-08'
            },
            {
                id: 'cloud_010',
                title: '시계 만들기',
                description: '현재 시간을 보여주는 디지털 시계',
                category: 'education',
                difficulty: '중급',
                author: 'CodeKids',
                rating: 4.3,
                downloads: 634,
                fileSize: '1.1MB',
                thumbnail: 'clock.png',
                filePath: '/cloud-projects/files/digital-clock.sb3',
                tags: ['시계', '시간', '교육'],
                createdAt: '2024-02-10'
            }
        ];
    }

    // Google Drive 프로젝트 로드
    async loadGoogleDriveProjects() {
        try {
            console.log('📁 Google Drive 프로젝트 검색 중...');

            // Google Drive API가 초기화되었는지 확인
            if (!window.googleDriveAPI || !window.googleDriveAPI.isInitialized) {
                console.log('⏳ Google Drive API 초기화 대기 중...');
                return;
            }

            // 로그인 상태 확인
            if (!window.googleDriveAPI.isSignedIn) {
                console.log('🔐 Google Drive 로그인이 필요합니다');
                this.googleDriveProjects = [];
                return;
            }

            // Scratch 프로젝트 검색
            const driveProjects = await window.googleDriveAPI.searchScratchProjects();
            this.googleDriveProjects = driveProjects;

            console.log(`✅ Google Drive에서 ${driveProjects.length}개 프로젝트를 발견했습니다`);

        } catch (error) {
            console.error('❌ Google Drive 프로젝트 로드 실패:', error);
            this.googleDriveProjects = [];
        }
    }

    // Google Drive 연결 처리 (학생 모드와 선생님 모드 통합)
    async connectGoogleDrive() {
        try {
            console.log('🔐 Google Drive 연결 시도...');

            // 새로운 Public API 사용
            if (window.googleDrivePublicAPI) {
                const api = window.googleDrivePublicAPI;

                // 이미 토큰이 있는지 확인
                if (api.isPublicAccessReady()) {
                    console.log('✅ 기존 토큰으로 접근');
                    await api.loadGoogleDriveProjects();
                    this.showNotification('Google Drive 프로젝트를 불러왔습니다! 🎉', 'success');
                } else {
                    console.log('🔑 선생님 인증 필요');
                    const success = await api.authenticateTeacher();

                    if (success) {
                        console.log('✅ 인증 성공');
                        this.showNotification('Google Drive가 연결되었습니다! 🎉', 'success');
                    } else {
                        throw new Error('인증에 실패했습니다');
                    }
                }

                // 프로젝트 목록 업데이트
                this.googleDriveProjects = api.projects || [];
                this.projects = [...this.sampleProjects, ...this.googleDriveProjects];
                this.filterProjects();
                this.renderProjects();

            } else if (window.googleDriveAPI) {
                // 기존 API 폴백
                const success = await window.googleDriveAPI.signIn();

                if (success) {
                    console.log('✅ Google Drive 연결 성공');
                    await this.loadGoogleDriveProjects();
                    this.projects = [...this.sampleProjects, ...this.googleDriveProjects];
                    this.filterProjects();
                    this.renderProjects();
                    this.showNotification('Google Drive가 성공적으로 연결되었습니다! 🎉', 'success');
                } else {
                    throw new Error('Google Drive 로그인에 실패했습니다');
                }
            } else {
                throw new Error('Google Drive API가 로드되지 않았습니다');
            }

        } catch (error) {
            console.error('❌ Google Drive 연결 실패:', error);
            this.showNotification('Google Drive 연결에 실패했습니다. 다시 시도해주세요.', 'error');
        }
    }

    // 알림 표시
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white max-w-sm transition-all duration-300 ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
        }`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' :
                    'fa-info-circle'
                }"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // 3초 후 자동 제거
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showCloudModal() {
        console.log('📱 showCloudModal 호출됨');
        console.log('🔍 modal 상태:', !!this.modal);

        if (this.modal) {
            console.log('✅ 모달 요소 발견, 표시 중...');
            this.modal.classList.remove('hidden');
            this.renderProjects();
            console.log('📋 프로젝트 렌더링 완료');
        } else {
            console.error('❌ 모달 요소를 찾을 수 없습니다');
            console.log('🔍 DOM에서 모달 검색 중...');
            const modal = document.getElementById('cloud-projects-modal');
            console.log('📦 cloud-projects-modal 요소:', !!modal);
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
        }
    }

    setCategory(category) {
        this.currentCategory = category;
        this.filterProjects();
    }

    updateFilterButtons(activeBtn) {
        document.querySelectorAll('.cloud-filter-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-purple-500', 'text-white');
            btn.classList.add('text-gray-600');
        });

        activeBtn.classList.add('active', 'bg-purple-500', 'text-white');
        activeBtn.classList.remove('text-gray-600');
    }

    filterProjects() {
        const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase() : '';

        this.filteredProjects = this.projects.filter(project => {
            const matchesCategory = this.currentCategory === 'all' || project.category === this.currentCategory;
            const matchesSearch = !searchTerm ||
                project.title.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchTerm));

            return matchesCategory && matchesSearch;
        });

        this.sortProjects();
    }

    sortProjects() {
        const sortBy = this.sortSelect ? this.sortSelect.value : 'popular';

        switch(sortBy) {
            case 'popular':
                this.filteredProjects.sort((a, b) => b.downloads - a.downloads);
                break;
            case 'newest':
                this.filteredProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'name':
                this.filteredProjects.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
                break;
        }

        this.renderProjects();
    }

    renderProjects() {
        if (!this.projectsGrid) return;

        const gridContainer = this.projectsGrid.querySelector('.grid');
        if (!gridContainer) return;

        // 로딩 및 빈 상태 숨기기
        const loadingEl = document.getElementById('cloud-loading');
        const emptyEl = document.getElementById('cloud-empty');

        if (loadingEl) loadingEl.classList.add('hidden');
        if (emptyEl) emptyEl.classList.add('hidden');

        if (this.filteredProjects.length === 0) {
            gridContainer.innerHTML = '';
            if (emptyEl) emptyEl.classList.remove('hidden');
            return;
        }

        gridContainer.innerHTML = this.filteredProjects.map(project => this.createProjectCard(project)).join('');

        // 프로젝트 카드 클릭 이벤트
        gridContainer.querySelectorAll('.cloud-project-card').forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.dataset.projectId;
                const project = this.projects.find(p => p.id === projectId);
                if (project) {
                    this.loadProject(project);
                }
            });
        });
    }

    createProjectCard(project) {
        const categoryColors = {
            game: 'from-purple-400 to-pink-400',
            animation: 'from-blue-400 to-cyan-400',
            education: 'from-green-400 to-emerald-400',
            art: 'from-yellow-400 to-orange-400',
            google_drive: 'from-blue-500 to-green-500'
        };

        const categoryLabels = {
            game: '게임',
            animation: '애니메이션',
            education: '교육',
            art: '예술',
            google_drive: 'Google Drive'
        };

        const categoryIcons = {
            game: 'fa-gamepad',
            animation: 'fa-film',
            education: 'fa-graduation-cap',
            art: 'fa-palette',
            google_drive: 'fab fa-google-drive'
        };

        const difficultyColors = {
            '초급': 'bg-green-100 text-green-600',
            '중급': 'bg-yellow-100 text-yellow-600',
            '고급': 'bg-red-100 text-red-600'
        };

        const largeFileWarning = project.isLargeFile ?
            `<div class="flex items-center space-x-1 text-orange-600 text-xs mt-1">
                <i class="fas fa-exclamation-triangle"></i>
                <span>큰 파일 (${project.fileSize})</span>
            </div>` : '';

        return `
            <div class="cloud-project-card bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" data-project-id="${project.id}">
                <div class="aspect-video bg-gradient-to-br ${categoryColors[project.category]} flex items-center justify-center relative">
                    <i class="fas ${categoryIcons[project.category]} text-white text-4xl"></i>
                    ${project.isLargeFile ? '<div class="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">📦 대용량</div>' : ''}
                    ${project.source === 'google_drive' ? '<div class="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center"><i class="fab fa-google-drive mr-1"></i>Drive</div>' : ''}
                </div>
                <div class="p-4">
                    <h4 class="font-semibold text-gray-800 mb-1">${project.title}</h4>
                    <p class="text-sm text-gray-600 mb-2 line-clamp-2">${project.description}</p>
                    ${largeFileWarning}
                    <div class="flex items-center justify-between text-xs mt-2">
                        <div class="flex items-center space-x-2">
                            <span class="bg-purple-100 text-purple-600 px-2 py-1 rounded">${categoryLabels[project.category]}</span>
                            <span class="${difficultyColors[project.difficulty]} px-2 py-1 rounded">${project.difficulty}</span>
                        </div>
                        <div class="flex items-center space-x-2 text-gray-500">
                            <span><i class="fas fa-star text-yellow-400"></i> ${project.rating}</span>
                            <span><i class="fas fa-download"></i> ${this.formatDownloads(project.downloads)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    formatDownloads(count) {
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'k';
        }
        return count.toString();
    }

    async loadProject(project) {
        console.log('클라우드 프로젝트 로드:', project);

        // 로딩 표시
        this.showLoading();

        try {
            let file = null;

            // Google Drive 프로젝트인지 확인
            if (project.source === 'google_drive' && project.driveFileId) {
                console.log('📁 Google Drive 파일 다운로드:', project.title);

                // Google Drive API로 파일 다운로드
                file = await window.googleDriveAPI.downloadFile(
                    project.driveFileId,
                    `${project.title}.sb3`
                );

                console.log('✅ Google Drive 파일 다운로드 완료');

            } else {
                // 로컬 파일 처리
                const projectUrl = `${window.location.origin}${project.filePath}`;
                console.log('프로젝트 파일 URL:', projectUrl);

                const response = await fetch(projectUrl);

                if (!response.ok) {
                    console.log(`파일을 찾을 수 없습니다 (${response.status}). 데모 모드로 전환합니다.`);
                    this.loadDemoProject(project);
                    return;
                }

                // 응답을 File 객체로 변환
                const arrayBuffer = await response.arrayBuffer();
                file = new File([arrayBuffer], `${project.title}.sb3`, {
                    type: 'application/x.scratch.sb3'
                });
            }

            // Scratch 에디터에 프로젝트 로드
            if (window.codekidsEditor) {
                // 클라우드 프로젝트를 새 프로젝트로 로드
                window.codekidsEditor.currentProject = {
                    id: null, // 새 프로젝트
                    title: `${project.title} (클라우드)`,
                    technology: 'Scratch',
                    status: '진행중',
                    cloud_source: project.id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                window.codekidsEditor.unsavedChanges = true;
                window.codekidsEditor.updateUI();

                console.log(`파일 로드 성공: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

                // Scratch GUI가 연결되어 있는지 확인
                const iframe = document.getElementById('scratch-iframe');
                if (iframe && iframe.src && iframe.src.includes('localhost:8601')) {
                    // URL 방식으로 프로젝트 로드 시도
                    const fullProjectURL = `${window.location.origin}${project.filePath}`;
                    console.log('프로젝트 URL 전달:', fullProjectURL);
                    window.codekidsEditor.waitForScratchGUIAndLoadFile(file, fullProjectURL);
                } else {
                    // Scratch GUI가 없을 때는 파일 다운로드 제공
                    this.offerDirectDownload(file, project);
                }

                // 성공 메시지
                if (window.codekidsEditor.api) {
                    window.codekidsEditor.api.showNotification(
                        `클라우드 프로젝트 "${project.title}"을 불러왔습니다! 🌟`,
                        'success'
                    );
                }
            }

            // 모달 닫기
            this.closeModal();

        } catch (error) {
            console.error('프로젝트 로드 실패:', error);
            this.loadDemoProject(project);
        } finally {
            this.hideLoading();
        }
    }

    loadDemoProject(project) {
        // 데모 모드: 프로젝트 정보만 표시
        if (window.codekidsEditor) {
            window.codekidsEditor.currentProject = {
                id: null,
                title: `${project.title} (데모)`,
                technology: 'Scratch',
                status: '진행중',
                description: project.description,
                cloud_source: project.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            window.codekidsEditor.unsavedChanges = true;
            window.codekidsEditor.updateUI();

            if (window.codekidsEditor.api) {
                window.codekidsEditor.api.showNotification(
                    `"${project.title}" 프로젝트를 준비했습니다. 실제 파일은 서버 설정 후 사용 가능합니다. 📦`,
                    'info'
                );
            }
        }

        this.closeModal();
    }

    showLoading() {
        const loadingEl = document.getElementById('cloud-loading');
        const gridContainer = this.projectsGrid?.querySelector('.grid');

        if (loadingEl) loadingEl.classList.remove('hidden');
        if (gridContainer) gridContainer.style.display = 'none';
    }

    hideLoading() {
        const loadingEl = document.getElementById('cloud-loading');
        const gridContainer = this.projectsGrid?.querySelector('.grid');

        if (loadingEl) loadingEl.classList.add('hidden');
        if (gridContainer) gridContainer.style.display = '';
    }

    offerDirectDownload(file, project) {
        // 파일 다운로드 링크 생성
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // URL 정리
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        console.log(`파일 다운로드 시작: ${file.name}`);

        if (window.codekidsEditor && window.codekidsEditor.api) {
            window.codekidsEditor.api.showNotification(
                `"${project.title}" 파일이 다운로드됩니다. Scratch 3.0에서 파일을 열어보세요! 📁`,
                'success'
            );
        }
    }
}

// 전역 인스턴스 생성
window.cloudProjectsManager = new CloudProjectManager();

console.log('Cloud Projects Manager 초기화 완료! ☁️');