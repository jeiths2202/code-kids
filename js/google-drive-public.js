// Google Drive Public Access Manager
// 선생님이 미리 인증한 토큰을 사용하여 학생들이 로그인 없이 접근
class GoogleDrivePublicAPI {
    constructor() {
        this.clientId = '129459484885-49jhhorvjq9cbd1nhjnf4qlrslqchdj7.apps.googleusercontent.com';
        this.discoveryDoc = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
        this.scopes = 'https://www.googleapis.com/auth/drive.readonly';
        this.folderId = '1rEMeET9wqGR2Ky-fefFm6BumbXsRBi77';

        this.tokenClient = null;
        this.accessToken = null;
        this.gapiInited = false;
        this.gisInited = false;

        // 저장된 토큰 확인
        this.loadStoredToken();
        this.init();
    }

    // 초기화
    async init() {
        console.log('🔧 Google Drive Public API 초기화 시작...');

        try {
            // GAPI 로드
            await this.loadGoogleAPI();

            // Google API Client 초기화
            await this.initializeGapiClient();

            // Google Identity Services 초기화
            this.initializeGIS();

            console.log('✅ Google Drive Public API 초기화 완료');

            // 저장된 토큰이 있으면 자동으로 파일 목록 로드
            if (this.accessToken) {
                this.checkTokenAndLoadFiles();
            }

        } catch (error) {
            console.error('❌ 초기화 실패:', error);
        }
    }

    // Google API 스크립트 로드
    loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                gapi.load('client', () => resolve());
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Google API Client 초기화
    async initializeGapiClient() {
        await gapi.client.init({
            discoveryDocs: [this.discoveryDoc],
        });
        this.gapiInited = true;
        console.log('✅ Google API Client 초기화 완료');
    }

    // Google Identity Services 초기화
    initializeGIS() {
        // GIS 스크립트가 이미 로드되었는지 확인
        if (!window.google || !window.google.accounts) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.onload = () => this.setupTokenClient();
            document.head.appendChild(script);
        } else {
            this.setupTokenClient();
        }
    }

    // 토큰 클라이언트 설정
    setupTokenClient() {
        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: this.clientId,
            scope: this.scopes,
            callback: (response) => {
                if (response.error !== undefined) {
                    console.error('❌ 토큰 에러:', response.error);
                    return;
                }

                this.accessToken = response.access_token;
                this.saveToken(response.access_token);
                console.log('✅ 새 액세스 토큰 획득');

                // 토큰 획득 후 자동으로 파일 목록 로드
                this.loadGoogleDriveProjects();
            },
        });

        this.gisInited = true;
        console.log('✅ Google Identity Services 초기화 완료');
    }

    // 토큰 저장 (세션 스토리지 사용)
    saveToken(token) {
        // 보안을 위해 sessionStorage 사용 (브라우저 탭 닫으면 삭제)
        sessionStorage.setItem('gdrive_token', token);
        sessionStorage.setItem('gdrive_token_time', Date.now().toString());
    }

    // 저장된 토큰 로드
    loadStoredToken() {
        const token = sessionStorage.getItem('gdrive_token');
        const tokenTime = sessionStorage.getItem('gdrive_token_time');

        if (token && tokenTime) {
            // 토큰이 1시간 이내인 경우에만 사용
            const elapsed = Date.now() - parseInt(tokenTime);
            if (elapsed < 3600000) { // 1시간
                this.accessToken = token;
                console.log('✅ 저장된 토큰 로드 완료');
                return true;
            }
        }

        return false;
    }

    // 토큰 확인 및 파일 로드
    async checkTokenAndLoadFiles() {
        if (!this.accessToken) {
            console.log('토큰이 없습니다.');
            return;
        }

        try {
            gapi.client.setToken({ access_token: this.accessToken });
            await this.loadGoogleDriveProjects();
        } catch (error) {
            if (error.status === 401) {
                console.log('토큰이 만료되었습니다. 재인증이 필요합니다.');
                this.accessToken = null;
                sessionStorage.removeItem('gdrive_token');
                sessionStorage.removeItem('gdrive_token_time');
            }
        }
    }

    // 선생님 인증 (최초 1회만 필요)
    async authenticateTeacher() {
        if (!this.gisInited || !this.tokenClient) {
            console.error('❌ 초기화가 완료되지 않았습니다');
            return false;
        }

        console.log('🔐 선생님 인증 시작...');

        return new Promise((resolve) => {
            // 기존 콜백 저장
            const originalCallback = this.tokenClient.callback;

            // 임시 콜백 설정
            this.tokenClient.callback = (response) => {
                if (response.error !== undefined) {
                    console.error('❌ 인증 실패:', response.error);
                    resolve(false);
                    return;
                }

                this.accessToken = response.access_token;
                this.saveToken(response.access_token);
                console.log('✅ 선생님 인증 성공');

                // 원래 콜백 복원
                this.tokenClient.callback = originalCallback;

                // 인증 성공 후 파일 목록 로드
                this.loadGoogleDriveProjects().then(() => resolve(true));
            };

            // 인증 팝업 표시
            this.tokenClient.requestAccessToken({ prompt: 'consent' });
        });
    }

    // Google Drive 프로젝트 로드 (학생들이 사용)
    async loadGoogleDriveProjects() {
        if (!this.accessToken) {
            console.log('⚠️ 토큰이 없습니다. 선생님 인증이 필요합니다.');
            return [];
        }

        try {
            console.log('📁 Google Drive 프로젝트 로드 중...');

            // 토큰 설정
            gapi.client.setToken({ access_token: this.accessToken });

            // Scratch 파일 검색
            const query = `'${this.folderId}' in parents and (name contains '.sb3' or name contains '.sb2' or name contains '.sb') and trashed=false`;

            const response = await gapi.client.drive.files.list({
                q: query,
                pageSize: 50,
                fields: 'files(id, name, size, modifiedTime, webViewLink, thumbnailLink, description)',
                orderBy: 'modifiedTime desc'
            });

            const files = response.result.files || [];
            console.log(`✅ ${files.length}개의 Scratch 프로젝트 발견`);

            // CloudProjectManager 형식으로 변환
            const projects = files.map(file => this.formatProject(file));

            // CloudProjectManager가 있으면 업데이트
            if (window.cloudProjectsManager) {
                window.cloudProjectsManager.googleDriveProjects = projects;
                window.cloudProjectsManager.renderProjects();
            }

            return projects;

        } catch (error) {
            console.error('❌ 프로젝트 로드 실패:', error);

            if (error.status === 401) {
                // 토큰 만료
                this.accessToken = null;
                sessionStorage.removeItem('gdrive_token');
                console.log('토큰이 만료되었습니다. 재인증이 필요합니다.');
            }

            return [];
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
            description: file.description || 'CodeKids 전용 폴더의 Scratch 프로젝트',
            category: 'google_drive',
            difficulty: '사용자 프로젝트',
            author: 'CodeKids Drive',
            rating: 0,
            downloads: 0,
            fileSize: fileSize,
            thumbnail: file.thumbnailLink || 'drive-file.png',
            filePath: null,
            driveFileId: file.id,
            webViewLink: file.webViewLink,
            tags: ['CodeKids', 'Scratch', '전용 폴더'],
            createdAt: createdDate,
            source: 'google_drive'
        };
    }

    // 파일 다운로드
    async downloadFile(fileId, fileName) {
        if (!this.accessToken) {
            throw new Error('인증이 필요합니다');
        }

        try {
            console.log('📥 파일 다운로드 중:', fileName);

            gapi.client.setToken({ access_token: this.accessToken });

            const response = await gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media'
            });

            // Base64 -> Blob 변환
            const binaryString = atob(response.body);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const blob = new Blob([bytes], { type: 'application/x.scratch.sb3' });
            const file = new File([blob], fileName, { type: 'application/x.scratch.sb3' });

            console.log('✅ 다운로드 완료:', fileName);
            return file;

        } catch (error) {
            console.error('❌ 다운로드 실패:', error);
            throw error;
        }
    }

    // 공개 접근 상태 확인
    isPublicAccessReady() {
        return this.gapiInited && this.gisInited && !!this.accessToken;
    }

    // 상태 정보
    getStatus() {
        return {
            initialized: this.gapiInited && this.gisInited,
            authenticated: !!this.accessToken,
            tokenAge: this.getTokenAge()
        };
    }

    // 토큰 나이 확인 (분 단위)
    getTokenAge() {
        const tokenTime = sessionStorage.getItem('gdrive_token_time');
        if (!tokenTime) return null;

        const age = Date.now() - parseInt(tokenTime);
        return Math.floor(age / 60000); // 분 단위
    }
}

// 전역 인스턴스 생성
window.googleDrivePublicAPI = new GoogleDrivePublicAPI();

console.log('📁 Google Drive Public API 모듈 로드 완료!');