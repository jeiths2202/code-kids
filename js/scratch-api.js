// CodeKids - Scratch API 연동 스크립트

class CodeKidsScratchAPI {
    constructor() {
        this.baseURL = '/api';
        this.studentId = this.getCurrentStudentId();
        this.authToken = this.getAuthToken();
        this.projectCache = new Map();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        console.log('CodeKids Scratch API 초기화 완료 🎨');
    }
    
    // =================
    // 인증 및 사용자 관리
    // =================
    
    getCurrentStudentId() {
        // 실제 환경에서는 JWT 토큰이나 세션에서 추출
        return localStorage.getItem('codekids_student_id') || 'student_001';
    }
    
    getAuthToken() {
        // 실제 환경에서는 보안 토큰 사용
        return localStorage.getItem('codekids_auth_token') || 'demo_token';
    }
    
    async validateSession() {
        try {
            const response = await fetch(`${this.baseURL}/auth/validate`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            if (!response.ok) {
                throw new Error('세션이 만료되었습니다.');
            }
            
            return await response.json();
        } catch (error) {
            console.error('세션 검증 실패:', error);
            this.handleAuthError();
            return false;
        }
    }
    
    // =================
    // 프로젝트 관리
    // =================
    
    async createProject(projectData) {
        try {
            this.showNotification('프로젝트를 생성하고 있어요...', 'info');
            
            const payload = {
                student_id: this.studentId,
                title: projectData.title || '제목 없는 프로젝트',
                description: projectData.description || '',
                technology: '스크래치',
                status: '진행중',
                progress_percentage: 0,
                start_date: new Date().toISOString(),
                scratch_data: projectData.scratchData || this.getEmptyProjectData(projectData.template),
                metadata: JSON.stringify({
                    template: projectData.template || 'blank',
                    created_with: 'CodeKids Scratch Editor',
                    version: '1.0.0'
                })
            };
            
            // 시뮬레이션: RESTful Table API 사용
            const response = await this.simulateAPICall('POST', '/tables/projects', payload);
            
            if (response.success) {
                this.showNotification('새 프로젝트가 생성되었어요! 🎉', 'success');
                this.updateProjectCache(response.data);
                
                // 대시보드에 활동 기록
                await this.logActivity({
                    activity_type: '프로젝트생성',
                    title: `새 프로젝트 시작: ${payload.title}`,
                    description: `${payload.technology} 프로젝트를 생성했습니다.`,
                    xp_earned: 25,
                    metadata: JSON.stringify({ project_id: response.data.id })
                });
                
                return response.data;
            } else {
                throw new Error(response.message);
            }
            
        } catch (error) {
            console.error('프로젝트 생성 실패:', error);
            this.showNotification('프로젝트 생성에 실패했어요. 다시 시도해 주세요.', 'error');
            throw error;
        }
    }
    
    async saveProject(projectId, scratchData, metadata = {}) {
        try {
            this.showNotification('프로젝트를 저장하고 있어요...', 'info');
            this.updateSaveStatus('saving');
            
            const updateData = {
                scratch_data: scratchData,
                progress_percentage: this.calculateProgress(scratchData),
                last_modified: new Date().toISOString(),
                metadata: JSON.stringify({
                    ...metadata,
                    last_saved_with: 'CodeKids Scratch Editor',
                    save_count: (metadata.save_count || 0) + 1
                })
            };
            
            // 시뮬레이션: RESTful Table API 사용
            const response = await this.simulateAPICall('PUT', `/tables/projects/${projectId}`, updateData);
            
            if (response.success) {
                this.showNotification('프로젝트가 저장되었어요! 💾', 'success');
                this.updateSaveStatus('saved');
                this.updateProjectCache(response.data);
                
                // 학습 세션 기록
                await this.recordLearningSession({
                    course_type: '스크래치',
                    session_type: '프로젝트',
                    duration_minutes: 15, // 실제로는 세션 시간 계산
                    xp_earned: 50
                });
                
                // 자동 백업 (5분마다)
                this.scheduleAutoSave(projectId, scratchData);
                
                return response.data;
            } else {
                throw new Error(response.message);
            }
            
        } catch (error) {
            console.error('프로젝트 저장 실패:', error);
            this.showNotification('저장에 실패했어요. 네트워크를 확인해 주세요.', 'error');
            this.updateSaveStatus('error');
            
            // 로컬 스토리지에 임시 저장
            this.saveToLocalStorage(projectId, scratchData);
            throw error;
        }
    }
    
    async loadProject(projectId) {
        try {
            this.showNotification('프로젝트를 불러오고 있어요...', 'info');
            
            // 캐시 확인
            if (this.projectCache.has(projectId)) {
                const cachedProject = this.projectCache.get(projectId);
                this.showNotification('프로젝트를 불러왔어요! 📂', 'success');
                return cachedProject;
            }
            
            // 시뮬레이션: RESTful Table API 사용
            const response = await this.simulateAPICall('GET', `/tables/projects/${projectId}`);
            
            if (response.success) {
                this.showNotification('프로젝트를 불러왔어요! 📂', 'success');
                this.updateProjectCache(response.data);
                
                // 최근 접근 프로젝트 업데이트
                this.updateRecentProjects(projectId);
                
                return response.data;
            } else {
                throw new Error(response.message);
            }
            
        } catch (error) {
            console.error('프로젝트 로드 실패:', error);
            this.showNotification('프로젝트를 불러오는데 실패했어요.', 'error');
            
            // 로컬 스토리지에서 복구 시도
            const localProject = this.loadFromLocalStorage(projectId);
            if (localProject) {
                this.showNotification('로컬 백업에서 복구했어요! ⚡', 'info');
                return localProject;
            }
            
            throw error;
        }
    }
    
    async getStudentProjects(filter = 'all', limit = 10, offset = 0) {
        try {
            let queryParams = `student_id=${this.studentId}&limit=${limit}&offset=${offset}`;
            
            // 필터 적용
            switch(filter) {
                case 'recent':
                    queryParams += '&sort=last_modified&order=desc';
                    break;
                case 'shared':
                    queryParams += '&status=공유됨';
                    break;
                case 'completed':
                    queryParams += '&status=완료';
                    break;
            }
            
            // 시뮬레이션: RESTful Table API 사용
            const response = await this.simulateAPICall('GET', `/tables/projects?${queryParams}`);
            
            if (response.success) {
                // 캐시 업데이트
                response.data.forEach(project => {
                    this.updateProjectCache(project);
                });
                
                return response.data;
            } else {
                throw new Error(response.message);
            }
            
        } catch (error) {
            console.error('프로젝트 목록 로드 실패:', error);
            this.showNotification('프로젝트 목록을 불러오는데 실패했어요.', 'error');
            
            // 로컬 캐시에서 반환
            return Array.from(this.projectCache.values()).filter(project => {
                return project.student_id === this.studentId;
            }).slice(offset, offset + limit);
        }
    }

    async getSampleProjects() {
        try {
            // 시뮬레이션: RESTful Table API 사용
            const response = await this.simulateAPICall('GET', '/tables/sample_projects');

            if (response.success) {
                return response.data;
            } else {
                throw new Error(response.message);
            }

        } catch (error) {
            console.error('샘플 프로젝트 목록 로드 실패:', error);

            // 폴백: 로컬 샘플 프로젝트 데이터 반환
            return this.getLocalSampleProjects();
        }
    }

    getLocalSampleProjects() {
        // samples 폴더의 프로젝트들을 시뮬레이션
        return [
            {
                id: 'sample_minecraft',
                title: 'Minecraft',
                description: '마인크래프트 스타일의 블록 게임 프로젝트',
                filename: 'Minecraft.sb3',
                type: 'sample',
                category: '게임',
                difficulty: '중급',
                size: 16406689,
                thumbnail: '/static/assets/sample-thumbnails/minecraft.png',
                created_date: '2024-01-15',
                author: 'Scratch Foundation',
                downloads: 1542,
                rating: 4.8,
                tags: ['게임', '마인크래프트', '블록', '3D'],
                features: ['캐릭터 움직임', '블록 파괴/생성', '인벤토리 시스템']
            },
            {
                id: 'sample_snake',
                title: 'Snake Game',
                description: '클래식 스네이크 게임의 스크래치 버전',
                filename: 'Snake Game.sb3',
                type: 'sample',
                category: '게임',
                difficulty: '초급',
                size: 7346316,
                thumbnail: '/static/assets/sample-thumbnails/snake.png',
                created_date: '2024-01-10',
                author: 'Scratch Foundation',
                downloads: 2847,
                rating: 4.6,
                tags: ['게임', '스네이크', '클래식', '간단'],
                features: ['키보드 조작', '점수 시스템', '충돌 감지']
            },
            {
                id: 'sample_mario',
                title: 'Super Mario Vivacious',
                description: '슈퍼 마리오 스타일의 플랫폼 액션 게임',
                filename: 'Super Mario Vivacious.sb3',
                type: 'sample',
                category: '게임',
                difficulty: '고급',
                size: 115511380,
                thumbnail: '/static/assets/sample-thumbnails/mario.png',
                created_date: '2024-01-20',
                author: 'Scratch Foundation',
                downloads: 3924,
                rating: 4.9,
                tags: ['게임', '마리오', '플랫폼', '액션'],
                features: ['복잡한 레벨 디자인', '다양한 적', '파워업 시스템', '음향 효과']
            }
        ];
    }

    async loadSampleProject(sampleId) {
        try {
            this.showNotification('샘플 프로젝트를 불러오고 있어요...', 'info');

            const samples = await this.getSampleProjects();
            const sample = samples.find(s => s.id === sampleId);

            if (!sample) {
                throw new Error('샘플 프로젝트를 찾을 수 없습니다.');
            }

            // 샘플 프로젝트 파일 다운로드 시뮬레이션
            const projectData = await this.downloadSampleFile(sample.filename);

            this.showNotification(`${sample.title} 프로젝트가 로드되었어요! 🎉`, 'success');

            // 분석 데이터 기록
            await this.logActivity({
                activity_type: '샘플로드',
                title: `샘플 프로젝트 로드: ${sample.title}`,
                description: `${sample.difficulty} 난이도 ${sample.category} 샘플을 불러왔습니다.`,
                xp_earned: 10,
                metadata: JSON.stringify({
                    sample_id: sampleId,
                    sample_title: sample.title,
                    category: sample.category,
                    difficulty: sample.difficulty
                })
            });

            return {
                id: `sample_${Date.now()}`,
                title: `${sample.title} (샘플)`,
                description: sample.description,
                scratch_data: projectData,
                type: 'sample',
                original_sample: sample,
                loaded_date: new Date().toISOString()
            };

        } catch (error) {
            console.error('샘플 프로젝트 로드 실패:', error);
            this.showNotification('샘플 프로젝트를 불러오는데 실패했어요.', 'error');
            throw error;
        }
    }

    async downloadSampleFile(filename) {
        try {
            // 실제 환경에서는 samples 폴더에서 파일을 다운로드
            // 현재는 시뮬레이션 데이터 반환
            const response = await this.simulateAPICall('GET', `/tables/sample_files/${filename}`);

            if (response.success) {
                return response.data;
            } else {
                // 폴백: 기본 프로젝트 데이터 반환
                return this.getEmptyProjectData('blank');
            }

        } catch (error) {
            console.error('샘플 파일 다운로드 실패:', error);
            return this.getEmptyProjectData('blank');
        }
    }

    async shareProject(projectId, shareOptions) {
        try {
            this.showNotification('프로젝트를 공유하고 있어요...', 'info');
            
            const shareData = {
                status: shareOptions.public ? '공유됨' : '비공개',
                share_permission: shareOptions.remixAllowed || false,
                share_message: shareOptions.message || '',
                shared_date: new Date().toISOString(),
                metadata: JSON.stringify({
                    shared_by: this.studentId,
                    share_settings: shareOptions
                })
            };
            
            // 시뮬레이션: RESTful Table API 사용
            const response = await this.simulateAPICall('PATCH', `/tables/projects/${projectId}`, shareData);
            
            if (response.success) {
                this.showNotification('프로젝트가 공유되었어요! 🌟', 'success');
                this.updateProjectCache(response.data);
                
                // 공유 활동 기록
                await this.logActivity({
                    activity_type: '프로젝트공유',
                    title: `프로젝트 공유: ${response.data.title}`,
                    description: '다른 학생들과 작품을 공유했습니다.',
                    xp_earned: 75,
                    metadata: JSON.stringify({ project_id: projectId, share_options: shareOptions })
                });
                
                return response.data;
            } else {
                throw new Error(response.message);
            }
            
        } catch (error) {
            console.error('프로젝트 공유 실패:', error);
            this.showNotification('공유에 실패했어요. 다시 시도해 주세요.', 'error');
            throw error;
        }
    }
    
    // =================
    // 학습 데이터 관리
    // =================
    
    async recordLearningSession(sessionData) {
        try {
            const payload = {
                student_id: this.studentId,
                course_type: sessionData.course_type || '스크래치',
                session_type: sessionData.session_type || '프로젝트',
                duration_minutes: sessionData.duration_minutes || 0,
                xp_earned: sessionData.xp_earned || 0,
                completed_tasks: sessionData.completed_tasks || 1,
                session_date: new Date().toISOString(),
                metadata: JSON.stringify(sessionData.metadata || {})
            };
            
            // 시뮬레이션: RESTful Table API 사용
            const response = await this.simulateAPICall('POST', '/tables/learning_sessions', payload);
            
            if (response.success) {
                // 실시간으로 대시보드 업데이트
                this.notifyDashboardUpdate('learning_session', response.data);
                return response.data;
            }
            
        } catch (error) {
            console.error('학습 세션 기록 실패:', error);
        }
    }
    
    async logActivity(activityData) {
        try {
            const payload = {
                student_id: this.studentId,
                activity_type: activityData.activity_type,
                title: activityData.title,
                description: activityData.description,
                xp_earned: activityData.xp_earned || 0,
                activity_date: new Date().toISOString(),
                metadata: activityData.metadata || '{}'
            };
            
            // 시뮬레이션: RESTful Table API 사용
            const response = await this.simulateAPICall('POST', '/tables/daily_activities', payload);
            
            if (response.success) {
                // XP 업데이트 애니메이션
                this.showXPGain(payload.xp_earned);
                return response.data;
            }
            
        } catch (error) {
            console.error('활동 로그 실패:', error);
        }
    }
    
    // =================
    // 유틸리티 함수
    // =================
    
    calculateProgress(scratchData) {
        if (!scratchData || !scratchData.targets) return 0;
        
        // 스크래치 프로젝트의 복잡도 기반 진행률 계산
        let score = 0;
        const targets = scratchData.targets;
        
        targets.forEach(target => {
            if (target.blocks) {
                const blockCount = Object.keys(target.blocks).length;
                score += Math.min(blockCount * 2, 50); // 블록당 2점, 최대 50점
            }
            
            if (target.costumes && target.costumes.length > 1) {
                score += 10; // 커스텀 스프라이트 10점
            }
            
            if (target.sounds && target.sounds.length > 0) {
                score += 5; // 사운드 사용 5점
            }
        });
        
        return Math.min(score, 100);
    }
    
    getEmptyProjectData(template = 'blank') {
        const baseProject = {
            targets: [
                {
                    isStage: true,
                    name: 'Stage',
                    variables: {},
                    lists: {},
                    broadcasts: {},
                    blocks: {},
                    comments: {},
                    currentCostume: 0,
                    costumes: [
                        {
                            name: 'backdrop1',
                            dataFormat: 'svg',
                            assetId: 'cd21514d0531fdffb22204e0ec5ed84a',
                            md5ext: 'cd21514d0531fdffb22204e0ec5ed84a.svg',
                            rotationCenterX: 240,
                            rotationCenterY: 180
                        }
                    ],
                    sounds: [],
                    volume: 100,
                    layerOrder: 0
                }
            ],
            monitors: [],
            extensions: [],
            meta: {
                semver: '3.0.0',
                vm: '1.0.0',
                agent: 'CodeKids Scratch Editor'
            }
        };
        
        // 템플릿별 추가 설정
        switch(template) {
            case 'game':
                baseProject.targets.push({
                    isStage: false,
                    name: 'Player',
                    variables: {},
                    lists: {},
                    broadcasts: {},
                    blocks: {},
                    comments: {},
                    currentCostume: 0,
                    costumes: [
                        {
                            name: 'player1',
                            dataFormat: 'svg',
                            assetId: '09dc888b0b7df19f70d81588ae73420e',
                            md5ext: '09dc888b0b7df19f70d81588ae73420e.svg',
                            rotationCenterX: 47,
                            rotationCenterY: 55
                        }
                    ],
                    sounds: [],
                    volume: 100,
                    x: 0,
                    y: 0,
                    size: 100,
                    direction: 90,
                    draggable: false,
                    rotationStyle: 'all around',
                    visible: true
                });
                break;
        }
        
        return baseProject;
    }
    
    // =================
    // 로컬 스토리지 관리
    // =================
    
    saveToLocalStorage(projectId, scratchData) {
        try {
            const backupKey = `scratch_backup_${projectId}`;
            const backupData = {
                projectId,
                scratchData,
                timestamp: Date.now(),
                studentId: this.studentId
            };
            
            localStorage.setItem(backupKey, JSON.stringify(backupData));
            console.log('로컬 백업 저장 완료:', backupKey);
        } catch (error) {
            console.error('로컬 저장 실패:', error);
        }
    }
    
    loadFromLocalStorage(projectId) {
        try {
            const backupKey = `scratch_backup_${projectId}`;
            const backupData = localStorage.getItem(backupKey);
            
            if (backupData) {
                const parsed = JSON.parse(backupData);
                if (parsed.studentId === this.studentId) {
                    return {
                        id: projectId,
                        scratch_data: parsed.scratchData,
                        title: '로컬 백업 (복구됨)',
                        status: '진행중',
                        last_modified: new Date(parsed.timestamp).toISOString()
                    };
                }
            }
            
            return null;
        } catch (error) {
            console.error('로컬 로드 실패:', error);
            return null;
        }
    }
    
    // =================
    // UI 업데이트 함수
    // =================
    
    showNotification(message, type = 'info', duration = 3000) {
        // 기존 알림 제거
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-auto text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 자동 제거
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        return icons[type] || icons.info;
    }
    
    updateSaveStatus(status) {
        const statusElement = document.getElementById('project-status');
        if (statusElement) {
            const statusConfig = {
                ready: { icon: 'fa-circle text-green-500', text: '준비됨' },
                saving: { icon: 'fa-circle text-yellow-500 status-pulse', text: '저장 중...' },
                saved: { icon: 'fa-check-circle text-green-500', text: '저장됨' },
                error: { icon: 'fa-exclamation-circle text-red-500', text: '오류' }
            };
            
            const config = statusConfig[status] || statusConfig.ready;
            statusElement.innerHTML = `
                <i class="fas ${config.icon} mr-1 text-xs"></i>
                ${config.text}
            `;
            
            // 마지막 저장 시간 업데이트
            if (status === 'saved') {
                const lastSavedElement = document.getElementById('last-saved');
                if (lastSavedElement) {
                    lastSavedElement.textContent = `마지막 저장: ${new Date().toLocaleTimeString('ko-KR')}`;
                    lastSavedElement.classList.remove('hidden');
                }
            }
        }
    }
    
    showXPGain(xpAmount) {
        if (xpAmount <= 0) return;
        
        const xpNotification = document.createElement('div');
        xpNotification.className = 'fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold animate-bounce';
        xpNotification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-star"></i>
                <span>+${xpAmount} XP</span>
            </div>
        `;
        
        document.body.appendChild(xpNotification);
        
        setTimeout(() => {
            xpNotification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => xpNotification.remove(), 300);
        }, 2000);
    }
    
    // =================
    // 이벤트 관리
    // =================
    
    setupEventListeners() {
        // 페이지 언로드 시 자동 저장
        window.addEventListener('beforeunload', (e) => {
            const currentProject = this.getCurrentProject();
            if (currentProject && currentProject.hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '저장하지 않은 변경사항이 있습니다. 정말 나가시겠어요?';
            }
        });
        
        // 네트워크 상태 변경 감지
        window.addEventListener('online', () => {
            this.showNotification('인터넷에 다시 연결되었어요! 🌐', 'success');
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('인터넷 연결이 끊어졌어요. 로컬에 저장됩니다.', 'warning');
        });
    }
    
    notifyDashboardUpdate(eventType, data) {
        // 대시보드가 열려있다면 실시간 업데이트
        const dashboardWindow = window.open('', 'codekids_dashboard');
        if (dashboardWindow && !dashboardWindow.closed) {
            dashboardWindow.postMessage({
                type: 'UPDATE_DATA',
                eventType,
                data
            }, '*');
        }
    }
    
    // =================
    // API 시뮬레이션
    // =================
    
    async simulateAPICall(method, endpoint, data = null) {
        // 실제 환경에서는 fetch() 사용
        return new Promise((resolve) => {
            setTimeout(() => {
                // 특별 처리: 샘플 프로젝트 관련 엔드포인트
                if (endpoint === '/tables/sample_projects') {
                    resolve({
                        success: true,
                        data: [
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
                        ],
                        message: 'Sample projects loaded successfully'
                    });
                    return;
                }

                if (endpoint.startsWith('/tables/sample_files/')) {
                    const filename = endpoint.split('/').pop();
                    resolve({
                        success: true,
                        data: {
                            filename: filename,
                            url: `/scratch-editor/scratch-gui/samples/${filename}`,
                            content: 'Sample project data would be loaded here',
                            filesize: filename === 'Minecraft.sb3' ? '2.1MB' :
                                     filename === 'Snake Game.sb3' ? '1.8MB' : '3.2MB'
                        },
                        message: 'Sample file loaded successfully'
                    });
                    return;
                }

                // 특별 처리: 프로젝트 목록 요청
                if (method === 'GET' && endpoint.startsWith('/tables/projects')) {
                    resolve({
                        success: true,
                        data: [
                            {
                                id: 'project_001',
                                title: '미로 탈출 로봇',
                                technology: 'Scratch',
                                status: '완료됨',
                                progress_percentage: 100,
                                created_at: '2024-12-15T10:00:00Z',
                                updated_at: '2024-12-20T14:30:00Z'
                            },
                            {
                                id: 'project_002',
                                title: '숫자 맞추기 게임',
                                technology: 'Scratch',
                                status: '진행중',
                                progress_percentage: 65,
                                created_at: '2024-12-18T09:15:00Z',
                                updated_at: '2024-12-20T16:45:00Z'
                            },
                            {
                                id: 'project_003',
                                title: '간단한 애니메이션',
                                technology: 'Scratch',
                                status: '시작전',
                                progress_percentage: 0,
                                created_at: '2024-12-19T11:20:00Z',
                                updated_at: '2024-12-19T11:20:00Z'
                            }
                        ],
                        message: 'Projects loaded successfully'
                    });
                    return;
                }

                // 일반적인 API 호출 시뮬레이션
                const success = Math.random() > 0.1; // 90% 성공률

                if (success) {
                    resolve({
                        success: true,
                        data: {
                            id: `item_${Date.now()}`,
                            ...data,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        },
                        message: 'Success'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Network error (simulated)',
                        error_code: 'NETWORK_ERROR'
                    });
                }
            }, Math.random() * 1000 + 500); // 0.5-1.5초 지연
        });
    }
    
    // =================
    // 캐시 관리
    // =================
    
    updateProjectCache(project) {
        this.projectCache.set(project.id, project);
        
        // 캐시 크기 제한 (최대 50개 프로젝트)
        if (this.projectCache.size > 50) {
            const firstKey = this.projectCache.keys().next().value;
            this.projectCache.delete(firstKey);
        }
    }
    
    clearCache() {
        this.projectCache.clear();
        console.log('프로젝트 캐시가 정리되었습니다.');
    }
    
    // =================
    // 자동 저장 관리
    // =================
    
    scheduleAutoSave(projectId, scratchData) {
        // 기존 자동 저장 취소
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }
        
        // 5분마다 자동 저장
        this.autoSaveTimer = setTimeout(() => {
            this.saveToLocalStorage(projectId, scratchData);
            console.log('자동 백업 완료:', projectId);
        }, 5 * 60 * 1000);
    }
    
    // =================
    // 유틸리티
    // =================
    
    getCurrentProject() {
        // 현재 열려있는 프로젝트 정보 반환
        return window.currentProject || null;
    }
    
    updateRecentProjects(projectId) {
        let recent = JSON.parse(localStorage.getItem('recent_projects') || '[]');
        recent = recent.filter(id => id !== projectId);
        recent.unshift(projectId);
        recent = recent.slice(0, 10); // 최대 10개
        localStorage.setItem('recent_projects', JSON.stringify(recent));
    }
    
    async syncOfflineData() {
        // 오프라인 중 저장된 데이터를 서버와 동기화
        const backupKeys = Object.keys(localStorage).filter(key => key.startsWith('scratch_backup_'));
        
        for (const key of backupKeys) {
            try {
                const backupData = JSON.parse(localStorage.getItem(key));
                await this.saveProject(backupData.projectId, backupData.scratchData);
                localStorage.removeItem(key);
            } catch (error) {
                console.error('백업 동기화 실패:', key, error);
            }
        }
    }
    
    handleAuthError() {
        this.showNotification('로그인이 필요합니다. 로그인 페이지로 이동합니다.', 'warning');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);
    }
}

// 전역 객체로 노출
window.CodeKidsAPI = new CodeKidsScratchAPI();

// 브라우저 환경에서만 실행
if (typeof window !== 'undefined') {
    window.CodeKidsScratchAPI = CodeKidsScratchAPI;
}

console.log('CodeKids Scratch API 스크립트 로드 완료! 🚀');