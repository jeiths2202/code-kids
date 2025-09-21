// Google Drive API 연동 클래스
class GoogleDriveAPI {
    constructor() {
        this.clientId = '129459484885-49jhhorvjq9cbd1nhjnf4qlrslqchdj7.apps.googleusercontent.com';
        this.discoveryDoc = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
        this.scopes = 'https://www.googleapis.com/auth/drive.readonly';

        // 허용된 특정 폴더 ID (CodeKids 전용)
        this.allowedFolderId = '1rEMeET9wqGR2Ky-fefFm6BumbXsRBi77';
        this.folderName = 'CodeKids Scratch Projects';

        this.gapi = null;
        this.isInitialized = false;
        this.isSignedIn = false;

        this.init();
    }

    // Google API 초기화
    async init() {
        try {
            console.log('🔧 Google Drive API 초기화 시작...');

            // Google API 스크립트 로드
            await this.loadGoogleAPI();

            // GAPI 초기화
            await new Promise((resolve, reject) => {
                this.gapi.load('auth2:client', async () => {
                    try {
                        await this.gapi.client.init({
                            clientId: this.clientId,
                            discoveryDocs: [this.discoveryDoc],
                            scope: this.scopes,
                            plugin_name: 'CodeKids Platform'
                        });

                        this.isInitialized = true;
                        this.isSignedIn = this.gapi.auth2.getAuthInstance().isSignedIn.get();

                        console.log('✅ Google Drive API 초기화 완료');
                        console.log('🔐 로그인 상태:', this.isSignedIn);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
            });

        } catch (error) {
            console.error('❌ Google Drive API 초기화 실패:', error);
        }
    }

    // Google API 스크립트 동적 로드
    loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                this.gapi = window.gapi;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                this.gapi = window.gapi;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Google Drive 로그인
    async signIn() {
        try {
            // API 초기화 대기
            if (!this.isInitialized) {
                console.log('⏳ API 초기화 완료까지 대기 중...');
                await this.waitForInitialization();
            }

            if (!this.isInitialized) {
                throw new Error('Google Drive API가 초기화되지 않았습니다');
            }

            const authInstance = this.gapi.auth2.getAuthInstance();
            if (!authInstance) {
                throw new Error('Google Auth 인스턴스를 찾을 수 없습니다');
            }

            const user = await authInstance.signIn();
            if (user && authInstance.isSignedIn.get()) {
                this.isSignedIn = true;
                console.log('✅ Google Drive 로그인 성공');
                return true;
            } else {
                throw new Error('로그인이 취소되었거나 실패했습니다');
            }
        } catch (error) {
            console.error('❌ Google Drive 로그인 실패:', error);
            return false;
        }
    }

    // API 초기화 완료까지 대기하는 헬퍼 메서드
    async waitForInitialization(maxWait = 10000) {
        const startTime = Date.now();
        while (!this.isInitialized && (Date.now() - startTime) < maxWait) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.isInitialized;
    }

    // Google Drive 로그아웃
    async signOut() {
        try {
            if (this.isSignedIn) {
                const authInstance = this.gapi.auth2.getAuthInstance();
                await authInstance.signOut();
                this.isSignedIn = false;
                console.log('✅ Google Drive 로그아웃 완료');
            }
        } catch (error) {
            console.error('❌ Google Drive 로그아웃 실패:', error);
        }
    }

    // Scratch 프로젝트 파일 검색 (특정 폴더 내에서만)
    async searchScratchProjects() {
        try {
            if (!this.isSignedIn) {
                throw new Error('Google Drive에 로그인이 필요합니다');
            }

            console.log(`🔍 ${this.folderName} 폴더에서 Scratch 프로젝트 검색 중...`);

            // 먼저 허용된 폴더에 접근 권한이 있는지 확인
            try {
                await this.gapi.client.drive.files.get({
                    fileId: this.allowedFolderId,
                    fields: 'name, id'
                });
                console.log('✅ CodeKids 전용 폴더 접근 권한 확인됨');
            } catch (error) {
                throw new Error('CodeKids 전용 폴더에 접근할 수 없습니다. 폴더 공유 설정을 확인해주세요.');
            }

            // 특정 폴더 내에서만 Scratch 파일 검색
            const query = `'${this.allowedFolderId}' in parents and (name contains '.sb3' or name contains '.sb2' or name contains '.sb') and trashed=false`;

            const response = await this.gapi.client.drive.files.list({
                q: query,
                pageSize: 50,
                fields: 'nextPageToken, files(id, name, size, modifiedTime, webViewLink, thumbnailLink, description, parents)',
                orderBy: 'modifiedTime desc'
            });

            const files = response.result.files || [];
            console.log(`📁 ${this.folderName}에서 발견된 Scratch 파일: ${files.length}개`);

            // 폴더 ID 검증 (추가 보안)
            const validFiles = files.filter(file =>
                file.parents && file.parents.includes(this.allowedFolderId)
            );

            if (validFiles.length !== files.length) {
                console.warn('⚠️ 일부 파일이 허용된 폴더 외부에 있어 제외되었습니다.');
            }

            return validFiles.map(file => this.formatScratchProject(file));

        } catch (error) {
            console.error('❌ Scratch 프로젝트 검색 실패:', error);
            return [];
        }
    }

    // 파일 정보를 프로젝트 형식으로 변환
    formatScratchProject(file) {
        const fileSize = file.size ? `${(file.size / (1024 * 1024)).toFixed(1)}MB` : '알 수 없음';
        const createdDate = file.modifiedTime ?
            new Date(file.modifiedTime).toLocaleDateString('ko-KR') :
            '알 수 없음';

        return {
            id: `gdrive_${file.id}`,
            title: file.name.replace(/\.(sb3|sb2|sb)$/, ''),
            description: file.description || `CodeKids 전용 폴더의 Scratch 프로젝트`,
            category: 'google_drive',
            difficulty: '사용자 프로젝트',
            author: 'CodeKids Drive',
            rating: 0,
            downloads: 0,
            fileSize: fileSize,
            thumbnail: file.thumbnailLink || 'drive-file.png',
            filePath: null, // Google Drive는 직접 URL 사용
            driveFileId: file.id,
            webViewLink: file.webViewLink,
            tags: ['CodeKids', 'Scratch', '전용 폴더'],
            createdAt: createdDate,
            source: 'google_drive',
            folderRestricted: true // 폴더 제한 표시
        };
    }

    // Google Drive 파일 다운로드 (보안 검증 포함)
    async downloadFile(fileId, fileName) {
        try {
            console.log('📥 Google Drive 파일 다운로드:', fileName);

            // 보안 검증: 파일이 허용된 폴더에 있는지 확인
            const fileInfo = await this.gapi.client.drive.files.get({
                fileId: fileId,
                fields: 'parents, name'
            });

            if (!fileInfo.result.parents || !fileInfo.result.parents.includes(this.allowedFolderId)) {
                throw new Error('보안 위반: 허용되지 않은 폴더의 파일입니다.');
            }

            console.log('✅ 파일 보안 검증 완료:', fileInfo.result.name);

            const response = await this.gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media'
            });

            // Base64 디코딩하여 ArrayBuffer로 변환
            const binaryString = atob(response.body);
            const arrayBuffer = new ArrayBuffer(binaryString.length);
            const uint8Array = new Uint8Array(arrayBuffer);

            for (let i = 0; i < binaryString.length; i++) {
                uint8Array[i] = binaryString.charCodeAt(i);
            }

            // File 객체 생성
            const file = new File([arrayBuffer], fileName, {
                type: 'application/x.scratch.sb3'
            });

            console.log('✅ 파일 다운로드 완료:', fileName);
            return file;

        } catch (error) {
            console.error('❌ 파일 다운로드 실패:', error);
            throw error;
        }
    }

    // 현재 로그인 상태 확인
    getSignInStatus() {
        return {
            isInitialized: this.isInitialized,
            isSignedIn: this.isSignedIn
        };
    }

    // 사용자 정보 가져오기
    getUserInfo() {
        if (!this.isSignedIn) return null;

        try {
            const authInstance = this.gapi.auth2.getAuthInstance();
            const user = authInstance.currentUser.get();
            const profile = user.getBasicProfile();

            return {
                id: profile.getId(),
                name: profile.getName(),
                email: profile.getEmail(),
                imageUrl: profile.getImageUrl()
            };
        } catch (error) {
            console.error('❌ 사용자 정보 가져오기 실패:', error);
            return null;
        }
    }
}

// 전역 인스턴스 생성
window.googleDriveAPI = new GoogleDriveAPI();

console.log('📁 Google Drive API 모듈 로드 완료!');