// Google Drive Secure API Client
// 모든 민감한 정보는 서버에서 처리되며, 클라이언트에는 노출되지 않습니다

class GoogleDriveSecureAPI {
    constructor() {
        // API 엔드포인트 (배포 환경에 따라 자동 설정)
        this.apiEndpoint = window.location.hostname === 'localhost'
            ? '/api/drive-files'  // 로컬 개발
            : '/api/drive-files'; // Vercel 배포

        this.projects = [];
        this.isLoading = false;

        console.log('🔒 Google Drive Secure API 초기화 완료');
    }

    // 파일 목록 가져오기 (학생들이 로그인 없이 사용)
    async loadProjects() {
        if (this.isLoading) return this.projects;

        this.isLoading = true;
        console.log('📁 프로젝트 목록 로드 중...');

        try {
            const response = await fetch(`${this.apiEndpoint}?action=list`);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                console.log(`✅ ${data.files.length}개의 프로젝트 로드 완료`);

                // CloudProjectManager 형식으로 변환
                this.projects = data.files.map(file => this.formatProject(file));

                // CloudProjectManager에 업데이트
                if (window.cloudProjectsManager) {
                    console.log('📤 CloudProjectManager에 프로젝트 전달:', this.projects.length);
                    window.cloudProjectsManager.googleDriveProjects = this.projects;
                    window.cloudProjectsManager.projects = [
                        ...window.cloudProjectsManager.sampleProjects,
                        ...this.projects
                    ];
                    window.cloudProjectsManager.filterProjects();
                    window.cloudProjectsManager.renderProjects();
                } else {
                    console.warn('⚠️ CloudProjectManager가 아직 로드되지 않음');
                }

                return this.projects;
            } else {
                throw new Error(data.message || 'Failed to load projects');
            }

        } catch (error) {
            console.error('❌ 프로젝트 로드 실패:', error);

            // 사용자 친화적 에러 메시지
            if (window.cloudProjectsManager) {
                window.cloudProjectsManager.showNotification(
                    '프로젝트를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.',
                    'error'
                );
            }

            return [];
        } finally {
            this.isLoading = false;
        }
    }

    // 파일 다운로드 (학생들이 사용)
    async downloadFile(fileId, fileName) {
        console.log('📥 파일 다운로드 중:', fileName);

        try {
            const response = await fetch(`${this.apiEndpoint}?action=download&fileId=${fileId}`);

            if (!response.ok) {
                throw new Error(`Download failed: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Base64 -> Blob 변환
                const binaryString = atob(data.data);
                const bytes = new Uint8Array(binaryString.length);

                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                const blob = new Blob([bytes], { type: data.mimeType });
                const file = new File([blob], fileName, { type: data.mimeType });

                console.log('✅ 다운로드 완료:', fileName);
                return file;
            } else {
                throw new Error(data.message || 'Download failed');
            }

        } catch (error) {
            console.error('❌ 다운로드 실패:', error);

            if (window.cloudProjectsManager) {
                window.cloudProjectsManager.showNotification(
                    '파일을 다운로드할 수 없습니다. 다시 시도해주세요.',
                    'error'
                );
            }

            throw error;
        }
    }

    // 프로젝트 포맷 변환
    formatProject(file) {
        const fileSize = file.size ? `${(file.size / (1024 * 1024)).toFixed(1)}MB` : '알 수 없음';
        const createdDate = file.modifiedTime ?
            new Date(file.modifiedTime).toLocaleDateString('ko-KR') : '알 수 없음';

        return {
            id: `gdrive_${file.id}`,
            title: file.name.replace(/\.(sb3|sb2|sb)$/, ''),
            description: file.description || 'CodeKids Scratch 프로젝트',
            category: 'google_drive',
            difficulty: '사용자 프로젝트',
            author: 'CodeKids',
            rating: 0,
            downloads: 0,
            fileSize: fileSize,
            thumbnail: file.thumbnailLink || '/images/scratch-default.png',
            filePath: null,
            driveFileId: file.id,
            webViewLink: file.webViewLink,
            tags: ['Scratch', 'CodeKids'],
            createdAt: createdDate,
            source: 'google_drive',
            secure: true // 보안 API 사용 표시
        };
    }

    // 자동 로드 (페이지 로드 시)
    async autoLoad() {
        console.log('🚀 자동 프로젝트 로드 시작...');

        // 약간의 지연 후 로드 (다른 컴포넌트 초기화 대기)
        setTimeout(async () => {
            await this.loadProjects();

            if (this.projects.length > 0) {
                console.log('✅ 프로젝트 자동 로드 완료');

                if (window.cloudProjectsManager) {
                    // 약간의 지연 후 UI 업데이트 확인
                    setTimeout(() => {
                        window.cloudProjectsManager.showNotification(
                            `Google Drive에서 ${this.projects.length}개의 프로젝트를 자동 로드했습니다!`,
                            'success'
                        );
                    }, 500);
                }
            } else {
                console.log('ℹ️ 로드된 프로젝트가 없음');
            }
        }, 1000);
    }

    // 연결 상태 확인 (항상 true 반환 - 서버가 처리)
    isConnected() {
        return true;
    }

    // 상태 정보
    getStatus() {
        return {
            connected: true,
            projectCount: this.projects.length,
            serverBased: true,
            secure: true
        };
    }
}

// 전역 인스턴스 생성
window.googleDriveSecureAPI = new GoogleDriveSecureAPI();

// 페이지 로드 시 자동으로 프로젝트 로드
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.googleDriveSecureAPI.autoLoad();
    });
} else {
    window.googleDriveSecureAPI.autoLoad();
}

console.log('🔒 Google Drive Secure API 모듈 로드 완료!');