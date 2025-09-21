// CodeKids - Scratch 에디터 통합 스크립트

class CodeKidsScratchEditor {
    constructor() {
        this.currentProject = null;
        this.unsavedChanges = false;
        this.autoSaveInterval = null;

        // API 초기화 (지연 로딩)
        this.api = null;
        this.initializeAPI();
        
        // DOM 요소 참조
        this.elements = {
            tutorialBtn: document.getElementById('tutorial-btn'),
            fullscreenBtn: document.getElementById('fullscreen-btn'),
            projectName: document.getElementById('project-name'),
            scratchContainer: document.getElementById('scratch-container'),
            scratchLoading: document.getElementById('scratch-loading')
        };
        
        this.modals = {
            loadProject: document.getElementById('load-project-modal')
        };
        
        console.log('🔍 initializeEditor 호출 예정...');
        try {
            this.initializeEditor();
            console.log('CodeKids Scratch Editor 초기화 완료! 🎨');
        } catch (error) {
            console.error('❌ initializeEditor 실행 중 오류:', error);
        }
    }

    // =====================
    // API 초기화
    // =====================

    initializeAPI() {
        // API가 이미 로드되어 있는지 확인
        if (window.CodeKidsAPI) {
            this.api = window.CodeKidsAPI;
            return;
        }

        // API 로딩 대기 (최대 5초)
        let attempts = 0;
        const maxAttempts = 50; // 100ms * 50 = 5초

        const waitForAPI = () => {
            if (window.CodeKidsAPI) {
                this.api = window.CodeKidsAPI;
                console.log('✅ CodeKids API 연결 완료');
                return;
            }

            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(waitForAPI, 100);
            } else {
                console.warn('⚠️ CodeKids API 로딩 실패 - 폴백 모드로 실행');
                this.createFallbackAPI();
            }
        };

        waitForAPI();
    }

    createFallbackAPI() {
        // API가 로드되지 않은 경우 기본 폴백 제공
        this.api = {
            showNotification: (message, type) => {
                console.log(`[${type?.toUpperCase() || 'INFO'}] ${message}`);
            },
            getStudentProjects: async () => {
                // 기본 예시 프로젝트 반환
                return [
                    {
                        id: 'demo_001',
                        title: '예시 프로젝트',
                        technology: 'Scratch',
                        status: '진행중',
                        progress_percentage: 75,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ];
            },
            getSampleProjects: async () => {
                // 하드코딩된 샘플 프로젝트 반환
                return [
                    {
                        id: 'sample_minecraft',
                        title: 'Minecraft Adventure',
                        description: '마인크래프트 풍의 어드벤처 게임',
                        filename: 'Minecraft.sb3',
                        filesize: '2.1MB',
                        difficulty: '중급',
                        category: '게임',
                        thumbnail: '/static/sample-thumbnails/minecraft.png',
                        created_at: '2024-01-15T10:00:00Z'
                    },
                    {
                        id: 'sample_snake',
                        title: 'Snake Game',
                        description: '클래식 뱀 게임',
                        filename: 'Snake Game.sb3',
                        filesize: '1.8MB',
                        difficulty: '초급',
                        category: '게임',
                        thumbnail: '/static/sample-thumbnails/snake.png',
                        created_at: '2024-01-15T10:00:00Z'
                    },
                    {
                        id: 'sample_mario',
                        title: 'Super Mario Vivacious',
                        description: '슈퍼마리오 스타일 플랫폼 게임',
                        filename: 'Super Mario Vivacious.sb3',
                        filesize: '3.2MB',
                        difficulty: '고급',
                        category: '게임',
                        thumbnail: '/static/sample-thumbnails/mario.png',
                        created_at: '2024-01-15T10:00:00Z'
                    }
                ];
            },
            loadSampleProject: async (sampleId) => ({
                title: 'Sample Project',
                scratch_data: null
            })
        };
    }

    // =====================
    // 에디터 초기화
    // =====================
    
    initializeEditor() {
        console.log('🚀 initializeEditor 시작됨');
        console.log('🔍 document.readyState:', document.readyState);

        // DOM이 완전히 로드된 후 초기화
        if (document.readyState === 'loading') {
            console.log('⏳ DOM 로딩 중, DOMContentLoaded 대기...');
            document.addEventListener('DOMContentLoaded', () => {
                console.log('✅ DOMContentLoaded 이벤트 발생');
                this.setupEventListeners();
                this.setupKeyboardShortcuts();
                this.checkScratchGUIAvailability();
                this.loadLastProject();
            });
        } else {
            console.log('✅ DOM 이미 로드됨, 100ms 후 초기화 시작');
            // DOM이 이미 로드된 경우 즉시 실행
            setTimeout(() => {
                console.log('🔧 setTimeout 콜백 실행됨');
                this.setupEventListeners();
                this.setupKeyboardShortcuts();
                this.checkScratchGUIAvailability();
                this.loadLastProject();
            }, 100);
        }

        // 환영 메시지
        setTimeout(() => {
            this.showWelcomeMessage();
        }, 1000);
    }
    
    setupEventListeners() {
        console.log('🔧 setupEventListeners 호출됨 (scratch-integration.js)');

        // 툴바 버튼 이벤트
        this.elements.tutorialBtn?.addEventListener('click', () => this.showTutorial());
        this.elements.fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());

        // 클라우드 프로젝트 버튼 이벤트
        const cloudProjectsBtn = document.getElementById('cloud-projects-btn');
        if (cloudProjectsBtn) {
            console.log('✅ 클라우드 프로젝트 버튼 발견, 이벤트 리스너 등록');
            cloudProjectsBtn.addEventListener('click', () => {
                console.log('🖱️ 클라우드 버튼 클릭됨');
                this.openCloudProjects();
            });
        } else {
            console.error('❌ 클라우드 프로젝트 버튼을 찾을 수 없습니다');
            console.log('🔍 DOM 상태:', document.readyState);
            console.log('🔍 현재 시간:', new Date().toLocaleTimeString());

            // DOM이 완전히 로드된 후 다시 시도 (여러 번 시도)
            let attempts = 0;
            const maxAttempts = 10;

            const retryFindButton = () => {
                attempts++;
                console.log(`🔄 클라우드 버튼 찾기 시도 ${attempts}/${maxAttempts}`);

                const btn = document.getElementById('cloud-projects-btn');
                if (btn) {
                    console.log('✅ 지연 후 클라우드 프로젝트 버튼 발견');
                    btn.addEventListener('click', () => {
                        console.log('🖱️ 클라우드 버튼 클릭됨 (지연 등록)');
                        this.openCloudProjects();
                    });
                } else if (attempts < maxAttempts) {
                    console.log(`❌ 시도 ${attempts} 실패, 1초 후 재시도...`);
                    setTimeout(retryFindButton, 1000);
                } else {
                    console.error('❌ 최대 시도 횟수 초과, 클라우드 버튼을 찾을 수 없음');
                    console.log('🔍 현재 DOM 내 모든 버튼들:', Array.from(document.querySelectorAll('button')).map(b => ({ id: b.id, class: b.className })));
                }
            };

            setTimeout(retryFindButton, 500);
        }

        // 모달 관련 이벤트
        this.setupModalEvents();

        // 프로젝트 폼 이벤트
        this.setupFormEvents();

        // 자동 저장 설정 (2분마다)
        this.setupAutoSave();
    }
    
    setupModalEvents() {
        // 모든 모달 닫기 버튼
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('[id$="-modal"]');
                if (modal) {
                    this.closeModal(modal);
                }
            });
        });
        
        // 모달 배경 클릭으로 닫기
        Object.values(this.modals).forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.closeModal(modal);
                    }
                });
            }
        });
    }
    
    setupFormEvents() {
        // Form elements removed
        
        // 프로젝트 검색
        const projectSearch = document.getElementById('project-search');
        if (projectSearch) {
            projectSearch.addEventListener('input', (e) => {
                this.filterProjects(e.target.value);
            });
        }
        
        // 프로젝트 필터
        document.querySelectorAll('.project-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setProjectFilter(e.target.dataset.filter);
            });
        });
        
        // Form removed
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S: 저장
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveCurrentProject();
                this.showKeyboardHint('프로젝트 저장됨');
            }
            
            // Keyboard shortcut removed
            
            // Ctrl/Cmd + O: 프로젝트 열기
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault();
                this.showLoadProjectModal();
                this.showKeyboardHint('프로젝트 열기');
            }
            
            // F11: 전체화면
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
            
            // ESC: 모달 닫기
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }
    
    setupAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (this.currentProject && this.unsavedChanges) {
                this.saveCurrentProject(true); // 자동 저장 플래그
                console.log('자동 저장 실행');
            }
        }, 2 * 60 * 1000); // 2분마다
    }
    
    // =====================
    // 프로젝트 관리
    // =====================
    
    async createNewProject() {
        try {
            const formData = new FormData(document.getElementById('new-project-form'));
            const projectData = {
                title: formData.get('project-title') || '제목 없는 프로젝트',
                template: formData.get('template') || 'blank',
                description: `${formData.get('template')} 템플릿으로 생성된 프로젝트`
            };
            
            this.showLoadingState('새 프로젝트를 생성하고 있어요...');
            
            const project = await this.api.createProject(projectData);
            
            this.currentProject = project;
            this.unsavedChanges = false;
            this.updateUI();
            
            // Modal removed
            this.hideLoadingState();
            
            // Scratch GUI로 프로젝트 데이터 전달 (실제 구현 시 사용)
            this.loadProjectIntoScratchGUI(project);
            
        } catch (error) {
            console.error('프로젝트 생성 실패:', error);
            this.hideLoadingState();
        }
    }
    
    async saveCurrentProject(isAutoSave = false) {
        if (!this.currentProject) {
            if (!isAutoSave) {
                this.api.showNotification('저장할 프로젝트가 없어요.', 'warning');
            }
            return;
        }
        
        try {
            // Scratch GUI에서 프로젝트 데이터 가져오기 (실제 구현 시 사용)
            const scratchData = this.getScratchProjectData();
            
            const updatedProject = await this.api.saveProject(
                this.currentProject.id,
                scratchData,
                {
                    auto_save: isAutoSave,
                    editor_version: '1.0.0'
                }
            );
            
            this.currentProject = updatedProject;
            this.unsavedChanges = false;
            this.updateUI();
            
            if (!isAutoSave) {
                // 저장 성공 애니메이션
                this.animateSuccessfulSave();
            }
            
        } catch (error) {
            console.error('프로젝트 저장 실패:', error);
        }
    }
    
    async loadProject(projectId) {
        try {
            this.showLoadingState('프로젝트를 불러오고 있어요...');
            
            const project = await this.api.loadProject(projectId);
            
            this.currentProject = project;
            this.unsavedChanges = false;
            this.updateUI();
            
            this.hideLoadingState();
            this.closeModal(this.modals.loadProject);
            
            // Scratch GUI로 프로젝트 로드 (실제 구현 시 사용)
            this.loadProjectIntoScratchGUI(project);
            
        } catch (error) {
            console.error('프로젝트 로드 실패:', error);
            this.hideLoadingState();
        }
    }

    async loadSampleProject(sampleId) {
        try {
            this.showLoadingState('샘플 프로젝트를 불러오고 있어요...');

            const sampleProject = await this.api.loadSampleProject(sampleId);

            // 샘플 프로젝트는 현재 프로젝트가 아닌 임시 프로젝트로 로드
            this.currentProject = {
                id: null, // 새 프로젝트로 취급
                title: `${sampleProject.title} (복사본)`,
                technology: 'Scratch',
                status: '진행중',
                scratch_data: sampleProject.scratch_data || this.api.getEmptyProjectData('blank'),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            this.unsavedChanges = true; // 저장되지 않은 변경사항으로 표시
            this.updateUI();

            this.hideLoadingState();
            this.closeModal(this.modals.loadProject);

            // Scratch GUI로 샘플 프로젝트 로드
            this.loadProjectIntoScratchGUI(this.currentProject);

            this.api.showNotification(`${sampleProject.title} 샘플을 불러왔어요! 수정 후 저장해 주세요. 🎯`, 'success');

        } catch (error) {
            console.error('샘플 프로젝트 로드 실패:', error);
            this.hideLoadingState();
            this.api.showNotification('샘플 프로젝트를 불러오는 데 실패했어요.', 'error');
        }
    }

    async shareCurrentProject() {
        if (!this.currentProject) {
            this.api.showNotification('공유할 프로젝트가 없어요.', 'warning');
            return;
        }
        
        try {
            const formData = new FormData(document.getElementById('share-form'));
            const shareOptions = {
                public: formData.get('public-share') === 'on',
                remixAllowed: formData.get('remix-allowed') === 'on',
                message: formData.get('share-message') || ''
            };
            
            this.showLoadingState('프로젝트를 공유하고 있어요...');
            
            const sharedProject = await this.api.shareProject(this.currentProject.id, shareOptions);
            
            this.currentProject = sharedProject;
            this.updateUI();
            
            this.hideLoadingState();
            // Modal removed
            
            // 공유 링크 생성 및 표시
            this.showShareSuccess(sharedProject);
            
        } catch (error) {
            console.error('프로젝트 공유 실패:', error);
            this.hideLoadingState();
        }
    }
    
    // =====================
    // 프로젝트 목록 관리
    // =====================
    
    async loadProjectsList(filter = 'all') {
        try {
            let projects;
            if (filter === 'samples') {
                projects = await this.api.getSampleProjects();
                this.renderSampleProjectsList(projects);
            } else {
                projects = await this.api.getStudentProjects(filter, 20, 0);
                this.renderProjectsList(projects);
            }
        } catch (error) {
            console.error('프로젝트 목록 로드 실패:', error);
        }
    }
    
    renderProjectsList(projects) {
        const projectsList = document.getElementById('projects-list');
        if (!projectsList) return;

        // 샘플 프로젝트 제거 및 기존 프로젝트 보이기
        const sampleProjects = projectsList.querySelectorAll('.sample-project');
        sampleProjects.forEach(sample => sample.remove());

        const existingProjects = projectsList.querySelectorAll('.project-item:not(.dynamic-project):not(.sample-project)');
        existingProjects.forEach(project => project.style.display = 'block');

        // 기존 동적 프로젝트 제거
        const dynamicProjects = projectsList.querySelectorAll('.dynamic-project');
        dynamicProjects.forEach(project => project.remove());

        projects.forEach(project => {
            const projectElement = this.createProjectListItem(project);
            projectsList.appendChild(projectElement);
        });
    }
    
    createProjectListItem(project) {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-item dynamic-project border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer';
        projectDiv.dataset.projectId = project.id;
        
        const statusColor = this.getProjectStatusColor(project.status);
        const progress = project.progress_percentage || 0;
        const lastModified = new Date(project.updated_at || project.created_at).toLocaleDateString('ko-KR');
        
        projectDiv.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="project-thumbnail w-16 h-12 ${statusColor} rounded-lg flex items-center justify-center">
                        <i class="fas ${this.getProjectIcon(project.technology)} text-white"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-800">${project.title}</h4>
                        <p class="text-sm text-gray-600">${lastModified} 수정 • ${project.technology}</p>
                        <div class="flex items-center mt-1">
                            ${progress === 100 ? 
                                '<div class="flex text-yellow-400"><i class="fas fa-star text-xs"></i><i class="fas fa-star text-xs"></i><i class="fas fa-star text-xs"></i></div><span class="text-xs text-gray-500 ml-2">완료됨</span>' :
                                `<div class="w-24 h-2 bg-gray-200 rounded-full"><div class="h-2 bg-blue-500 rounded-full" style="width: ${progress}%"></div></div><span class="text-xs text-gray-500 ml-2">${progress}% 완료</span>`
                            }
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <button class="load-project-btn text-blue-600 hover:text-blue-800 text-sm font-medium" data-project-id="${project.id}">
                        ${progress === 100 ? '열기' : '계속하기'}
                    </button>
                </div>
            </div>
        `;
        
        // 로드 버튼 이벤트
        const loadBtn = projectDiv.querySelector('.load-project-btn');
        loadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.loadProject(project.id);
        });
        
        return projectDiv;
    }

    renderSampleProjectsList(sampleProjects) {
        const projectsList = document.getElementById('projects-list');
        if (!projectsList) return;

        // 기존 프로젝트 숨기기 및 동적 샘플 프로젝트 제거
        const existingProjects = projectsList.querySelectorAll('.project-item:not(.sample-project)');
        existingProjects.forEach(project => project.style.display = 'none');

        const dynamicSamples = projectsList.querySelectorAll('.sample-project');
        dynamicSamples.forEach(sample => sample.remove());

        sampleProjects.forEach(sample => {
            const sampleElement = this.createSampleProjectListItem(sample);
            projectsList.appendChild(sampleElement);
        });
    }

    createSampleProjectListItem(sample) {
        const sampleDiv = document.createElement('div');
        sampleDiv.className = 'project-item sample-project border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer';
        sampleDiv.dataset.sampleId = sample.id;

        const difficultyColor = {
            '초급': 'bg-green-100 text-green-600',
            '중급': 'bg-yellow-100 text-yellow-600',
            '고급': 'bg-red-100 text-red-600'
        }[sample.difficulty] || 'bg-blue-100 text-blue-600';

        sampleDiv.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="sample-thumbnail w-16 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <i class="fas fa-cube text-purple-600"></i>
                    </div>
                    <div>
                        <div class="flex items-center space-x-2 mb-1">
                            <h4 class="font-semibold text-gray-800">${sample.title}</h4>
                            <span class="px-2 py-1 text-xs rounded-full ${difficultyColor}">${sample.difficulty}</span>
                        </div>
                        <p class="text-sm text-gray-600">${sample.description}</p>
                        <div class="flex items-center mt-1 space-x-3">
                            <span class="text-xs text-gray-500">${sample.category}</span>
                            <span class="text-xs text-gray-500">• ${sample.filesize}</span>
                            <div class="flex text-yellow-400">
                                <i class="fas fa-download text-xs"></i>
                            </div>
                            <span class="text-xs text-gray-500">샘플</span>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <button class="load-sample-btn text-purple-600 hover:text-purple-800 text-sm font-medium" data-sample-id="${sample.id}">
                        불러오기
                    </button>
                </div>
            </div>
        `;

        // 샘플 로드 버튼 이벤트
        const loadBtn = sampleDiv.querySelector('.load-sample-btn');
        loadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.loadSampleProject(sample.id);
        });

        return sampleDiv;
    }

    filterProjects(searchQuery) {
        const projectItems = document.querySelectorAll('.project-item');
        
        projectItems.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const matches = title.includes(searchQuery.toLowerCase());
            
            item.style.display = matches ? 'block' : 'none';
        });
    }
    
    setProjectFilter(filter) {
        // 필터 버튼 스타일 업데이트
        document.querySelectorAll('.project-filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        
        // 프로젝트 목록 다시 로드
        this.loadProjectsList(filter);
    }
    
    // =====================
    // Scratch GUI 통합
    // =====================
    
    checkScratchGUIAvailability() {
        // 환경에 따라 Scratch GUI URL 결정
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const localScratchURL = 'http://localhost:8601';

        // Google Cloud 서버에 배포된 Scratch GUI
        const cloudScratchURL = 'http://34.69.106.118:3000';

        // 폴백 URL (현재는 공개 Scratch GUI)
        const fallbackScratchURL = 'https://scratch-gui.vercel.app/';

        console.log('🔍 Scratch GUI 서버 연결 확인 중...');

        if (isLocalhost) {
            // 로컬 개발환경: localhost:8601 시도
            fetch(localScratchURL)
                .then(response => {
                    if (response.ok) {
                        console.log('✅ 로컬 Scratch GUI 서버 연결 성공!');
                        this.enableScratchGUI(localScratchURL);
                    } else {
                        console.warn('⚠️ 로컬 서버 실패, Cloud Run 시도');
                        this.tryCloudRunGUI();
                    }
                })
                .catch(error => {
                    console.warn('❌ 로컬 Scratch GUI 서버 연결 실패, Cloud Run 시도:', error.message);
                    this.tryCloudRunGUI();
                });
        } else {
            // 배포환경: Google Cloud Run 우선 시도
            console.log('🌐 배포 환경: Google Cloud Run Scratch GUI 시도');
            this.tryCloudRunGUI();
        }
    }

    // 외부 Scratch GUI 사용
    tryCloudRunGUI() {
        // 더 이상 자체 호스팅 서버 불필요
        console.log('🎯 외부 Scratch GUI 서비스 사용으로 변경');

        // 외부 Scratch GUI 직접 사용 (연결 테스트 불필요)
        const externalScratchURLs = [
            'https://scratch.mit.edu/projects/editor/',           // 공식 MIT Scratch
            'https://sheeptester.github.io/scratch-gui/',        // GitHub Pages 호스팅 (안정적)
            'https://scratch-gui.vercel.app/',                   // Vercel 호스팅
            'https://editor.scratch-learn.org/'                 // 교육용 Scratch 에디터
        ];

        // SheepTester의 Scratch GUI 사용 (안정적이고 임베딩 친화적)
        const primaryScratchURL = externalScratchURLs[1];

        console.log('🌐 외부 Scratch GUI 사용:', primaryScratchURL);
        console.log('💡 Google Drive 프로젝트는 파일 다운로드 → Scratch GUI 로드 방식으로 연동');

        this.enableScratchGUI(primaryScratchURL);
    }
    
    enableScratchGUI(scratchURL) {
        const iframe = document.getElementById('scratch-iframe');
        const loadingDiv = document.getElementById('scratch-loading');

        if (iframe) {
            console.log('🚀 Scratch GUI 로딩 시작...');

            // iframe 로드 이벤트 설정
            iframe.onload = () => {
                console.log('🎉 Scratch GUI 로딩 완료!');

                // 로딩 화면 숨기고 Scratch GUI 표시
                if (loadingDiv) loadingDiv.style.display = 'none';
                this.elements.scratchContainer.classList.remove('hidden');

                // 프로젝트 상태 업데이트
                this.updateProjectStatus('connected', '연결됨');

                // AudioContext 초기화 (사용자 상호작용 후)
                this.setupAudioContextOnUserInteraction();

                if (this.api) {
                    this.api.showNotification('Scratch 에디터가 연결되었어요! 🎉', 'success');
                }
            };

            iframe.onerror = () => {
                console.error('❌ Scratch GUI 로딩 실패');
                this.showScratchPlaceholder();
            };

            // iframe src가 이미 HTML에 설정되어 있으므로 필요시에만 업데이트
            if (iframe.src !== scratchURL) {
                iframe.src = scratchURL;
            }
        }
    }
    
    showScratchPlaceholder() {
        const loadingDiv = document.getElementById('scratch-loading');

        this.elements.scratchContainer.classList.add('hidden');

        if (loadingDiv) {
            // 에러 메시지로 변경
            loadingDiv.innerHTML = `
                <div class="text-center max-w-2xl mx-auto px-6">
                    <div class="w-32 h-32 bg-red-500 rounded-full mx-auto mb-8 flex items-center justify-center">
                        <i class="fas fa-exclamation-triangle text-white text-4xl"></i>
                    </div>

                    <h2 class="text-3xl font-bold text-gray-800 mb-4">
                        Scratch GUI 연결 실패
                    </h2>

                    <p class="text-lg text-gray-600 mb-8">
                        Scratch GUI 서버(localhost:8601)에 연결할 수 없습니다.
                    </p>

                    <div class="bg-white rounded-2xl p-6 shadow-lg mb-8">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">해결 방법</h3>
                        <div class="space-y-3 text-left text-gray-600">
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-terminal text-blue-500 mt-1"></i>
                                <div>
                                    <p class="font-medium">1. 터미널에서 Scratch GUI 서버 시작:</p>
                                    <code class="text-sm bg-gray-100 px-2 py-1 rounded block mt-1">cd scratch-editor/scratch-gui && npm start</code>
                                </div>
                            </div>
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-sync text-green-500 mt-1"></i>
                                <div>
                                    <p class="font-medium">2. 서버 시작 후 이 페이지 새로고침</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onclick="window.location.reload()" class="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                            <i class="fas fa-sync mr-2"></i>
                            페이지 새로고침
                        </button>

                        <a href="SCRATCH_INTEGRATION.md" target="_blank" class="border-2 border-blue-500 text-blue-500 px-6 py-3 rounded-xl font-semibold hover:bg-blue-500 hover:text-white transition-colors">
                            <i class="fas fa-book mr-2"></i>
                            설정 가이드 보기
                        </a>
                    </div>
                </div>
            `;
            loadingDiv.style.display = 'flex';
        }
    }
    
    loadProjectIntoScratchGUI(project) {
        const iframe = document.getElementById('scratch-iframe');

        if (!iframe) {
            console.warn('Scratch iframe을 찾을 수 없습니다.');
            return;
        }

        // 샘플 프로젝트인 경우 실제 파일을 로드
        if (project && project.type === 'sample' && project.original_sample) {
            const sampleFilename = project.original_sample.filename;
            const sampleURL = `/scratch-editor/scratch-gui/samples/${sampleFilename}`;

            console.log(`샘플 프로젝트 로드 시도: ${sampleURL}`);

            // Scratch GUI에 파일 URL로 프로젝트 로드 요청
            this.loadScratchProjectFromURL(sampleURL);
        } else if (project && project.scratch_data) {
            // 일반 프로젝트 데이터가 있는 경우
            this.loadScratchProjectFromData(project.scratch_data);
        } else {
            console.log('새 빈 프로젝트 생성');
            this.loadNewScratchProject();
        }

        console.log('프로젝트 로드됨:', project?.title || 'New Project');
    }

    async loadScratchProjectFromURL(fileURL) {
        console.log(`샘플 파일 로드 시도: ${fileURL}`);

        const iframe = document.getElementById('scratch-iframe');
        if (!iframe) {
            console.warn('Scratch iframe을 찾을 수 없습니다.');
            return;
        }

        try {
            // 절대 URL로 변환
            const fullURL = new URL(fileURL, window.location.origin).href;
            console.log(`프로젝트 파일 URL: ${fullURL}`);

            // 파일을 fetch로 가져와서 Blob으로 변환
            const response = await fetch(fullURL);
            if (!response.ok) {
                throw new Error(`파일 로드 실패: ${response.status}`);
            }

            const blob = await response.blob();
            console.log(`파일 로드 성공: ${blob.size} bytes`);

            // File 객체로 변환
            const file = new File([blob], fileURL.split('/').pop(), { type: 'application/x.scratch.sb3' });

            // Scratch GUI가 로드된 후 파일을 전송
            this.waitForScratchGUIAndLoadFile(file);

            if (this.api) {
                this.api.showNotification('샘플 프로젝트를 로드하고 있습니다...', 'info');
            }

        } catch (error) {
            console.error('샘플 파일 로드 실패:', error);
            if (this.api) {
                this.api.showNotification('샘플 프로젝트 로드에 실패했습니다.', 'error');
            }
        }
    }

    // 서버 파일을 Scratch GUI에 로드하는 메서드 (URL 방식)
    async waitForScratchGUIAndLoadFile(file, projectUrl) {
        console.log('Scratch GUI 프로젝트 로드 시도:', file.name);

        try {
            // URL 방식으로 프로젝트 로드
            if (projectUrl) {
                console.log('URL 방식으로 프로젝트 로드 시도:', projectUrl);
                return await this.loadProjectByURL(projectUrl);
            }

            // 파일 방식으로 프로젝트 로드 (폴백)
            const iframe = document.getElementById('scratch-iframe');
            if (!iframe || !iframe.contentWindow) {
                console.error('Scratch GUI iframe을 찾을 수 없습니다');
                this.fallbackFileDownload(file);
                return false;
            }

            const success = await this.loadFileToScratchVM(file, iframe);

            if (!success) {
                console.log('VM 로드 실패, 대체 방법 시도');
                this.fallbackFileDownload(file);
            }

            return success;

        } catch (error) {
            console.error('파일 로드 실패:', error);
            this.fallbackFileDownload(file);
            return false;
        }
    }

    // URL을 통한 프로젝트 로드 방법
    async loadProjectByURL(projectUrl) {
        try {
            console.log('🔗 URL을 통한 프로젝트 로드:', projectUrl);

            // 방법 1: 직접 가상 파일 생성 및 드래그 앤 드롭 시뮬레이션
            const iframe = document.getElementById('scratch-iframe');
            if (iframe) {
                console.log('🎯 iframe 발견, 직접 파일 전달 방식 시도');

                // 파일을 다운로드하여 메모리에 로드 (localStorage 사용 안함)
                const response = await fetch(projectUrl);
                if (!response.ok) {
                    throw new Error(`파일 다운로드 실패: ${response.status}`);
                }

                const arrayBuffer = await response.arrayBuffer();
                const fileSizeMB = (arrayBuffer.byteLength / (1024 * 1024)).toFixed(2);
                console.log(`✅ 파일 다운로드 완료: ${fileSizeMB}MB`);

                // 큰 파일의 경우 localStorage 대신 직접 처리
                if (arrayBuffer.byteLength > 5 * 1024 * 1024) { // 5MB 이상
                    console.log('📦 큰 파일 감지, 직접 전달 방식 사용');

                    const fileName = projectUrl.split('/').pop();
                    const virtualFile = new File([arrayBuffer], fileName, {
                        type: 'application/x.scratch.sb3'
                    });

                    // 직접 가상 파일을 Scratch에 전달 시도
                    const success = await this.loadVirtualFileToScratch(virtualFile, arrayBuffer);

                    if (success) {
                        console.log('✅ 직접 파일 전달 방식 성공');
                        if (this.api) {
                            this.api.showNotification(
                                `프로젝트 "${fileName}"을 성공적으로 불러왔습니다! 🎉`,
                                'success'
                            );
                        }
                        return true;
                    } else {
                        console.log('❌ 직접 파일 전달 방식 실패, 다운로드 방식으로 전환');
                        return await this.provideBrowserLoadSolution(virtualFile);
                    }
                } else {
                    console.log('📦 작은 파일, 기본 방식 사용');
                    // 작은 파일은 기존 방식 사용
                    const fileName = projectUrl.split('/').pop();
                    const virtualFile = new File([arrayBuffer], fileName, {
                        type: 'application/x.scratch.sb3'
                    });

                    const success = await this.loadVirtualFileToScratch(virtualFile, arrayBuffer);

                    if (success) {
                        console.log('✅ 기본 방식 성공');
                        if (this.api) {
                            this.api.showNotification(
                                `프로젝트 "${fileName}"을 성공적으로 불러왔습니다! 🎉`,
                                'success'
                            );
                        }
                        return true;
                    }
                }
            }

            // 방법 2: 기존 방식 사용 (가상 파일 생성)
            console.log('🔄 가상 파일 방식으로 시도');

            // 직접 파일을 다운로드하여 메모리에 로드
            const response = await fetch(projectUrl);
            if (!response.ok) {
                throw new Error(`파일 다운로드 실패: ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            console.log('✅ 파일 메모리 로드 완료:', arrayBuffer.byteLength, 'bytes');

            // 브라우저의 File API로 가상 파일 생성
            const fileName = projectUrl.split('/').pop();
            const virtualFile = new File([arrayBuffer], fileName, {
                type: 'application/x.scratch.sb3'
            });

            // Scratch GUI에 직접 파일 데이터 전송
            const success = await this.loadVirtualFileToScratch(virtualFile, arrayBuffer);

            if (success) {
                if (this.api) {
                    this.api.showNotification(
                        `프로젝트 "${fileName}"을 성공적으로 불러왔습니다! 🎉`,
                        'success'
                    );
                }
                return true;
            } else {
                console.log('❌ 가상 파일 방식도 실패, 대체 방법 시도');

                // 방법 3: 사용자에게 직접 안내하고 파일 다운로드 제공
                return await this.provideBrowserLoadSolution(virtualFile);
            }

        } catch (error) {
            console.error('URL 방식 프로젝트 로드 실패:', error);
            return false;
        }
    }

    // ArrayBuffer를 Base64로 변환하는 헬퍼 함수
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    // 브라우저 로드 솔루션 제공 (개선된 사용자 경험)
    async provideBrowserLoadSolution(file) {
        console.log('📱 브라우저 로드 솔루션 제공');

        try {
            // 모바일 디바이스 감지
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            // 사용자에게 상황 설명하는 모달 표시
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4';

            const mobileInstructions = isMobile ? `
                <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <div class="flex items-center space-x-2 text-orange-700">
                        <i class="fas fa-mobile-alt"></i>
                        <span class="font-medium">모바일 디바이스 감지</span>
                    </div>
                    <p class="text-sm text-orange-600 mt-1">
                        모바일에서는 다운로드 후 Scratch 앱이나 웹 버전에서 파일을 열어주세요.
                    </p>
                </div>
            ` : '';

            modal.innerHTML = `
                <div class="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-screen overflow-y-auto">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-4">프로젝트 불러오기</h3>
                        ${mobileInstructions}
                        <p class="text-gray-600 mb-6 text-left">
                            보안상 이유로 파일이 자동으로 다운로드됩니다.<br><br>
                            ${isMobile ?
                                '<strong>📱 모바일 사용법:</strong><br>1. 아래 버튼을 터치하여 파일 다운로드<br>2. Scratch 앱 또는 웹에서 파일 열기<br>3. 프로젝트 편집 시작!' :
                                '<strong>💻 PC 사용법:</strong><br><strong>Scratch 에디터</strong>에서 <span class="bg-gray-100 px-2 py-1 rounded text-sm">파일 → 컴퓨터에서 가져오기</span>를 선택하여 다운로드된 파일을 업로드해주세요.'
                            }
                        </p>
                        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            <button id="download-project-btn" class="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium touch-manipulation">
                                📁 파일 다운로드 ${isMobile ? '(터치)' : ''}
                            </button>
                            <button id="close-modal-btn" class="flex-1 bg-gray-100 text-gray-700 px-6 py-4 rounded-lg hover:bg-gray-200 transition-colors font-medium touch-manipulation">
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // 버튼 이벤트 처리
            return new Promise((resolve) => {
                const downloadBtn = modal.querySelector('#download-project-btn');
                const closeBtn = modal.querySelector('#close-modal-btn');

                downloadBtn.onclick = () => {
                    // 파일 다운로드 실행
                    this.downloadFile(file);

                    // 성공 메시지 표시
                    if (this.api) {
                        this.api.showNotification(
                            `${file.name} 파일이 다운로드되었습니다. Scratch 에디터에서 업로드해주세요! 📁`,
                            'info'
                        );
                    }

                    document.body.removeChild(modal);
                    resolve(true);
                };

                closeBtn.onclick = () => {
                    document.body.removeChild(modal);
                    resolve(false);
                };

                // 모달 배경 클릭으로 닫기
                modal.onclick = (event) => {
                    if (event.target === modal) {
                        document.body.removeChild(modal);
                        resolve(false);
                    }
                };
            });

        } catch (error) {
            console.error('브라우저 로드 솔루션 실패:', error);
            // 기존 fallback 방식 사용
            this.fallbackFileDownload(file);
            return false;
        }
    }

    // 파일 다운로드 헬퍼
    downloadFile(file) {
        try {
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

            console.log('✅ 파일 다운로드 완료:', file.name);

        } catch (error) {
            console.error('파일 다운로드 실패:', error);
        }
    }

    // 가상 파일을 Scratch에 로드
    async loadVirtualFileToScratch(file, arrayBuffer) {
        try {
            const iframe = document.getElementById('scratch-iframe');
            if (!iframe) {
                console.error('Scratch iframe을 찾을 수 없습니다');
                return false;
            }

            // 방법 1: Scratch GUI의 파일 드롭 이벤트 시뮬레이션
            console.log('🎯 파일 드롭 이벤트 시뮬레이션 시작');

            // iframe 로드 완료까지 기다림
            await this.waitForIframeLoad(iframe);

            // 드래그 앤 드롭 시뮬레이션
            const success = await this.simulateFileDrop(iframe, file);

            if (success) {
                console.log('✅ 파일 드롭 성공');
                return true;
            }

            // 방법 2: 직접 VM 접근 (CORS 허용 시)
            console.log('🔄 VM 직접 접근 시도');
            return await this.directVMLoad(iframe, arrayBuffer);

        } catch (error) {
            console.error('가상 파일 로드 실패:', error);
            return false;
        }
    }

    // iframe 로드 완료 대기
    async waitForIframeLoad(iframe) {
        return new Promise((resolve) => {
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                resolve();
            } else {
                iframe.onload = () => resolve();
                // 타임아웃 설정 (5초)
                setTimeout(() => resolve(), 5000);
            }
        });
    }

    // 파일 드롭 시뮬레이션
    async simulateFileDrop(iframe, file) {
        try {
            const iframeDoc = iframe.contentDocument;
            if (!iframeDoc) {
                console.warn('iframe 문서에 접근할 수 없습니다');
                return false;
            }

            // Scratch GUI의 메인 영역 찾기
            const dropTarget = iframeDoc.body || iframeDoc.documentElement;

            // 드래그 앤 드롭 이벤트 생성
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            // 드롭 이벤트 발생
            const dropEvent = new DragEvent('drop', {
                bubbles: true,
                cancelable: true,
                dataTransfer: dataTransfer
            });

            dropTarget.dispatchEvent(dropEvent);
            console.log('파일 드롭 이벤트 전송 완료');

            // 잠시 대기하여 처리 시간 확보
            await new Promise(resolve => setTimeout(resolve, 2000));

            return true;

        } catch (error) {
            console.error('파일 드롭 시뮬레이션 실패:', error);
            return false;
        }
    }

    // VM 직접 로드 (CORS 허용 시)
    async directVMLoad(iframe, arrayBuffer) {
        try {
            const iframeWindow = iframe.contentWindow;

            // Scratch VM에 직접 접근
            if (iframeWindow.vm && iframeWindow.vm.loadProject) {
                console.log('VM 직접 접근 성공');
                await iframeWindow.vm.loadProject(arrayBuffer);
                return true;
            }

            return false;

        } catch (error) {
            console.log('VM 직접 접근 실패 (예상됨):', error.message);
            return false;
        }
    }

    // Scratch VM을 통한 직접 파일 로드
    async loadFileToScratchVM(file, iframe) {
        try {
            // ArrayBuffer로 파일 읽기
            const arrayBuffer = await file.arrayBuffer();

            // Scratch VM에 직접 접근 시도
            const iframeWindow = iframe.contentWindow;

            // 방법 1: VM이 전역으로 노출되어 있는 경우
            if (iframeWindow.vm && iframeWindow.vm.loadProject) {
                console.log('Scratch VM 발견, 직접 로드 시도');
                await iframeWindow.vm.loadProject(arrayBuffer);
                console.log('VM을 통한 프로젝트 로드 성공');
                return true;
            }

            // 방법 2: Redux store를 통한 접근
            if (iframeWindow.store && iframeWindow.store.dispatch) {
                console.log('Redux store 발견, 액션 디스패치 시도');

                // 파일 로드 액션 디스패치
                iframeWindow.store.dispatch({
                    type: 'LOAD_PROJECT_FROM_BUFFER',
                    buffer: arrayBuffer,
                    filename: file.name
                });

                console.log('Redux 액션 디스패치 완료');
                return true;
            }

            // 방법 3: postMessage를 통한 통신
            console.log('postMessage를 통한 파일 전송');
            iframeWindow.postMessage({
                type: 'LOAD_PROJECT_FROM_BUFFER',
                data: arrayBuffer,
                filename: file.name
            }, '*');

            return true;

        } catch (error) {
            console.error('Scratch VM 로드 실패:', error);
            return false;
        }
    }

    // 대체 방법: 파일 다운로드 제공
    fallbackFileDownload(file) {
        console.log('대체 방법: 파일 다운로드 제공');

        try {
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

            // 사용자에게 안내 메시지
            if (this.api) {
                this.api.showNotification(
                    `${file.name} 파일이 다운로드되었습니다. Scratch 에디터에서 "파일 → 컴퓨터에서 가져오기"를 선택하여 업로드해주세요.`,
                    'info'
                );
            }

            // 사용자 가이드 표시
            this.showFileUploadInstructions(file.name);

        } catch (error) {
            console.error('파일 다운로드 실패:', error);
        }
    }

    // 파일 업로드 안내 표시
    showFileUploadInstructions(filename) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                <div class="text-center">
                    <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <i class="fas fa-download text-blue-500 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-4">파일 다운로드 완료</h3>

                    <p class="text-gray-600 mb-4">
                        <strong>${filename}</strong> 파일이 다운로드되었습니다.
                    </p>

                    <div class="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                        <p class="text-sm text-blue-800 font-semibold mb-2">다음 단계:</p>
                        <ol class="text-sm text-blue-700 space-y-1">
                            <li>1. Scratch 에디터에서 "파일" 메뉴 클릭</li>
                            <li>2. "컴퓨터에서 가져오기" 선택</li>
                            <li>3. 다운로드된 ${filename} 파일 선택</li>
                        </ol>
                    </div>

                    <button onclick="this.parentElement.parentElement.remove()"
                            class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors w-full">
                        확인
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 배경 클릭으로 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // 자동 제거 (30초 후)
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
            }
        }, 30000);
    }



    loadScratchProjectFromData(projectData) {
        const iframe = document.getElementById('scratch-iframe');
        if (iframe && iframe.contentWindow) {
            // postMessage로 프로젝트 데이터 전송
            iframe.contentWindow.postMessage({
                type: 'LOAD_PROJECT',
                project: projectData
            }, '*');
        }
    }

    loadNewScratchProject() {
        const iframe = document.getElementById('scratch-iframe');
        if (!iframe) return;

        // 새 프로젝트를 위해 기본 URL로 리로드
        const baseURL = 'http://localhost:8601';
        console.log('새 Scratch 프로젝트 로드');
        iframe.src = baseURL;
    }
    
    getScratchProjectData() {
        // 실제 Scratch GUI에서 프로젝트 데이터 가져오기
        const iframe = document.getElementById('scratch-iframe');
        if (iframe && iframe.contentWindow) {
            // 메시지를 통해 프로젝트 데이터 요청
            iframe.contentWindow.postMessage({
                type: 'GET_PROJECT_DATA'
            }, '*');
            
            // 실제로는 Promise나 콜백을 통해 데이터 받음
            return this.currentProject?.scratch_data || {};
        }
        
        return {};
    }
    
    // =====================
    // UI 업데이트
    // =====================
    
    updateUI() {
        // 프로젝트 이름 업데이트
        if (this.elements.projectName && this.currentProject) {
            this.elements.projectName.textContent = this.currentProject.title;
        }

        // 변경사항 표시
        if (this.unsavedChanges && this.elements.projectName) {
            this.elements.projectName.textContent += ' *';
        }
    }

    updateProjectStatus(status, message) {
        // 프로젝트 상태 업데이트 (UI 요소가 있다면)
        const statusElement = document.getElementById('project-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `project-status ${status}`;
        }

        console.log(`프로젝트 상태: ${status} - ${message}`);
    }
    
    showLoadingState(message) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-overlay';
        loadingDiv.className = 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center';
        loadingDiv.innerHTML = `
            <div class="bg-white rounded-2xl p-8 text-center">
                <div class="loading-spinner mb-4"></div>
                <p class="text-gray-700">${message}</p>
            </div>
        `;
        
        document.body.appendChild(loadingDiv);
    }
    
    hideLoadingState() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }
    
    animateSuccessfulSave() {
        this.elements.saveProjectBtn.classList.add('btn-active');
        setTimeout(() => {
            this.elements.saveProjectBtn.classList.remove('btn-active');
        }, 200);
    }
    
    showKeyboardHint(message) {
        let hint = document.querySelector('.keyboard-hint');
        if (!hint) {
            hint = document.createElement('div');
            hint.className = 'keyboard-hint';
            document.body.appendChild(hint);
        }
        
        hint.textContent = message;
        hint.classList.add('show');
        
        setTimeout(() => {
            hint.classList.remove('show');
        }, 1500);
    }
    
    // =====================
    // 모달 관리
    // =====================
    
    // Method removed
    
    showLoadProjectModal() {
        this.showModal(this.modals.loadProject);
        this.loadProjectsList();

        // 검색 입력에 포커스
        const searchInput = document.getElementById('project-search');
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }
    }

    showFileUploadGuide() {
        // 안내 모달 생성
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                <div class="text-center">
                    <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <i class="fas fa-info-circle text-blue-500 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-4">컴퓨터에서 파일 가져오기</h3>

                    <div class="text-left mb-6">
                        <p class="text-gray-600 mb-4">
                            Scratch 에디터에서 직접 파일을 불러올 수 있습니다:
                        </p>

                        <div class="bg-blue-50 p-4 rounded-lg mb-4">
                            <ol class="text-sm text-blue-800 space-y-2">
                                <li><strong>1단계:</strong> Scratch 에디터 상단의 "파일" 메뉴 클릭</li>
                                <li><strong>2단계:</strong> "컴퓨터에서 가져오기" 선택</li>
                                <li><strong>3단계:</strong> .sb3 파일을 선택하여 업로드</li>
                            </ol>
                        </div>

                        <div class="bg-amber-50 p-3 rounded-lg">
                            <p class="text-xs text-amber-700">
                                <i class="fas fa-lightbulb mr-1"></i>
                                <strong>팁:</strong> Scratch 3.0에서 저장한 .sb3 파일만 지원됩니다.
                            </p>
                        </div>
                    </div>

                    <button onclick="this.parentElement.parentElement.remove()"
                            class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                        확인
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 5초 후 자동 제거 (사용자가 클릭하지 않을 경우)
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
            }
        }, 10000);

        // 배경 클릭으로 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Method removed
    
    showModal(modal) {
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('modal-enter');
            
            setTimeout(() => {
                modal.classList.remove('modal-enter');
                modal.classList.add('modal-enter-active');
            }, 10);
        }
    }
    
    closeModal(modal) {
        if (modal) {
            modal.classList.add('modal-exit');
            
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('modal-enter-active', 'modal-exit');
            }, 200);
        }
    }
    
    closeAllModals() {
        Object.values(this.modals).forEach(modal => {
            if (modal && !modal.classList.contains('hidden')) {
                this.closeModal(modal);
            }
        });
    }
    
    // =====================
    // 기능 구현
    // =====================
    
    openCloudProjects() {
        console.log('🚀 openCloudProjects 메서드 호출됨');
        console.log('📦 window.cloudProjectsManager 상태:', !!window.cloudProjectsManager);

        // 클라우드 프로젝트 모달 열기
        if (window.cloudProjectsManager) {
            console.log('✅ 클라우드 프로젝트 매니저 발견, 모달 열기 시도');
            window.cloudProjectsManager.showCloudModal();
            console.log('📱 클라우드 프로젝트 모달 열기 완료');
        } else {
            console.error('❌ 클라우드 프로젝트 매니저가 로드되지 않았습니다.');
            console.log('🔍 전역 객체 확인:', Object.keys(window).filter(key => key.includes('cloud')));

            if (this.api) {
                this.api.showNotification('클라우드 프로젝트를 불러오는 중입니다...', 'info');
            }

            // 클라우드 프로젝트 매니저가 아직 로드되지 않은 경우 다시 시도
            setTimeout(() => {
                console.log('⏰ 1초 후 재시도...');
                if (window.cloudProjectsManager) {
                    console.log('✅ 재시도 성공, 모달 열기');
                    window.cloudProjectsManager.showCloudModal();
                } else {
                    console.error('❌ 재시도 후에도 클라우드 프로젝트 매니저 없음');
                }
            }, 1000);
        }
    }

    showTutorial() {
        // 튜토리얼 시스템 (추후 구현)
        this.api.showNotification('튜토리얼 시스템을 준비중이에요! 📚', 'info');

        // 임시로 Scratch 공식 튜토리얼 링크 열기
        window.open('https://scratch.mit.edu/ideas', '_blank');
    }
    
    toggleFullscreen() {
        const body = document.body;
        
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                body.classList.add('fullscreen-mode');
                this.elements.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i><span class="hidden md:inline ml-2">전체화면 해제</span>';
            });
        } else {
            document.exitFullscreen().then(() => {
                body.classList.remove('fullscreen-mode');
                this.elements.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i><span class="hidden md:inline ml-2">전체화면</span>';
            });
        }
    }
    
    showShareSuccess(project) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
                <div class="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <i class="fas fa-check text-white text-3xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-800 mb-4">공유 완료!</h3>
                <p class="text-gray-600 mb-6">프로젝트가 CodeKids 갤러리에 공유되었어요.</p>
                <div class="bg-gray-100 rounded-lg p-4 mb-6">
                    <p class="text-sm text-gray-600 mb-2">공유 링크:</p>
                    <p class="text-blue-600 font-mono text-sm break-all">https://codekids.kr/gallery/${project.id}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    확인
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => modal.remove(), 10000); // 10초 후 자동 제거
    }
    
    showWelcomeMessage() {
        if (!localStorage.getItem('codekids_scratch_welcomed')) {
            const welcomeModal = document.createElement('div');
            welcomeModal.className = 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center';
            welcomeModal.innerHTML = `
                <div class="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 text-center">
                    <div class="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <i class="fas fa-rocket text-white text-3xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">CodeKids 스크래치에 오신 걸 환영해요! 🎉</h3>
                    <p class="text-gray-600 mb-6 leading-relaxed">
                        MIT Scratch Foundation의 공식 에디터로 나만의 창의적인 프로젝트를 만들어보세요!
                        <br><br>
                        게임, 애니메이션, 인터랙티브 스토리 등 무엇이든 가능해요.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-3 justify-center">
                        <button id="start-tutorial" class="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                            튜토리얼 시작
                        </button>
                        <button onclick="this.parentElement.parentElement.parentElement.remove(); localStorage.setItem('codekids_scratch_welcomed', 'true')" class="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
                            바로 시작하기
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(welcomeModal);
            
            const tutorialBtn = welcomeModal.querySelector('#start-tutorial');
            tutorialBtn.addEventListener('click', () => {
                welcomeModal.remove();
                this.showTutorial();
                localStorage.setItem('codekids_scratch_welcomed', 'true');
            });
        }
    }
    
    loadLastProject() {
        // 마지막으로 작업한 프로젝트 자동 로드
        const lastProjectId = localStorage.getItem('last_project_id');
        if (lastProjectId) {
            setTimeout(() => {
                this.loadProject(lastProjectId);
            }, 2000);
        }
    }
    
    // =====================
    // 유틸리티 함수
    // =====================
    
    getProjectStatusColor(status) {
        const colors = {
            '진행중': 'bg-blue-500',
            '완료': 'bg-green-500',
            '공유됨': 'bg-purple-500',
            '중단': 'bg-gray-500'
        };
        return colors[status] || 'bg-blue-500';
    }
    
    getProjectIcon(technology) {
        const icons = {
            '스크래치': 'fa-puzzle-piece',
            '파이썬': 'fa-snake',
            'HTML/CSS': 'fa-code',
            'JavaScript': 'fa-js'
        };
        return icons[technology] || 'fa-file-code';
    }
    
    // =====================
    // 정리 및 해제
    // =====================
    
    setupAudioContextOnUserInteraction() {
        // AudioContext 경고 방지를 위한 사용자 상호작용 대기
        let audioContextSetup = false;
        const setupAudio = () => {
            if (!audioContextSetup) {
                audioContextSetup = true;
                try {
                    // AudioContext가 있다면 resume 시도
                    if (window.AudioContext || window.webkitAudioContext) {
                        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        if (audioContext.state === 'suspended') {
                            audioContext.resume().catch(err => {
                                console.log('AudioContext resume failed:', err);
                            });
                        }
                    }
                    // iframe 내부의 AudioContext도 처리
                    const iframe = document.getElementById('scratch-iframe');
                    if (iframe && iframe.contentWindow) {
                        try {
                            iframe.contentWindow.postMessage({type: 'enableAudio'}, '*');
                        } catch (e) {
                            // Cross-origin 접근 제한 시 무시
                        }
                    }
                } catch (e) {
                    console.log('AudioContext setup skipped:', e.message);
                }
                // 이벤트 리스너 제거
                document.removeEventListener('click', setupAudio);
                document.removeEventListener('keydown', setupAudio);
                document.removeEventListener('touchstart', setupAudio);
            }
        };

        // 사용자 상호작용 이벤트에 리스너 등록
        document.addEventListener('click', setupAudio, { once: true });
        document.addEventListener('keydown', setupAudio, { once: true });
        document.addEventListener('touchstart', setupAudio, { once: true });
    }

    destroy() {
        // 자동 저장 정리
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        // 현재 프로젝트 ID 저장
        if (this.currentProject) {
            localStorage.setItem('last_project_id', this.currentProject.id);
        }

        console.log('CodeKids Scratch Editor 정리 완료');
    }
}

// 전역 에디터 인스턴스 생성
window.codekidsEditor = new CodeKidsScratchEditor();

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (window.codekidsEditor) {
        window.codekidsEditor.destroy();
    }
});

// 로그인 버튼용 "곧 업데이트 예정" 메시지 함수
function showComingSoonMessage() {
    // 모달 생성
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4';

    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-clock text-blue-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">로그인 기능</h3>
            <p class="text-gray-600 mb-6">
                로그인 기능은 <strong>곧 업데이트 예정</strong>입니다!<br>
                현재는 게스트 모드로 모든 기능을 이용하실 수 있습니다. 🎨
            </p>
            <button onclick="closeComingSoonModal()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium w-full">
                확인
            </button>
        </div>
    `;

    modal.id = 'coming-soon-modal';
    document.body.appendChild(modal);

    // 모달 배경 클릭으로 닫기
    modal.onclick = (event) => {
        if (event.target === modal) {
            closeComingSoonModal();
        }
    };
}

// 모달 닫기 함수
function closeComingSoonModal() {
    const modal = document.getElementById('coming-soon-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// 외부 스크립트에서 사용할 수 있도록 함수 노출
window.openScratchDemo = function() {
    window.open('https://scratch.mit.edu/projects/editor/', '_blank');
};

// 로그인 관련 함수들을 전역으로 노출
window.showComingSoonMessage = showComingSoonMessage;
window.closeComingSoonModal = closeComingSoonModal;

console.log('CodeKids Scratch Integration 스크립트 로드 완료! 🎨');