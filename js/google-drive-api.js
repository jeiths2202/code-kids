// Google Drive API 연동 클래스
class GoogleDriveAPI {
    constructor() {
        this.clientId = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';
        this.apiKey = process.env.GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY_HERE';
        this.discoveryDoc = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
        this.scopes = 'https://www.googleapis.com/auth/drive.readonly';

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
            await this.gapi.load('auth2:client', async () => {
                await this.gapi.client.init({
                    apiKey: this.apiKey,
                    clientId: this.clientId,
                    discoveryDocs: [this.discoveryDoc],
                    scope: this.scopes
                });

                this.isInitialized = true;
                this.isSignedIn = this.gapi.auth2.getAuthInstance().isSignedIn.get();

                console.log('✅ Google Drive API 초기화 완료');
                console.log('🔐 로그인 상태:', this.isSignedIn);
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
            if (!this.isInitialized) {
                throw new Error('Google Drive API가 초기화되지 않았습니다');
            }

            const authInstance = this.gapi.auth2.getAuthInstance();
            await authInstance.signIn();

            this.isSignedIn = true;
            console.log('✅ Google Drive 로그인 성공');

            return true;
        } catch (error) {
            console.error('❌ Google Drive 로그인 실패:', error);
            return false;
        }
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

    // Scratch 프로젝트 파일 검색
    async searchScratchProjects() {
        try {
            if (!this.isSignedIn) {
                throw new Error('Google Drive에 로그인이 필요합니다');
            }

            console.log('🔍 Google Drive에서 Scratch 프로젝트 검색 중...');

            const response = await this.gapi.client.drive.files.list({
                q: "name contains '.sb3' or name contains '.sb2' or name contains '.sb'",
                pageSize: 50,
                fields: 'nextPageToken, files(id, name, size, modifiedTime, webViewLink, thumbnailLink, description)'
            });

            const files = response.result.files || [];
            console.log(`📁 발견된 Scratch 파일: ${files.length}개`);

            return files.map(file => this.formatScratchProject(file));

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
            description: file.description || 'Google Drive에서 가져온 Scratch 프로젝트',
            category: 'google_drive',
            difficulty: '사용자 프로젝트',
            author: '나의 Google Drive',
            rating: 0,
            downloads: 0,
            fileSize: fileSize,
            thumbnail: file.thumbnailLink || 'drive-file.png',
            filePath: null, // Google Drive는 직접 URL 사용
            driveFileId: file.id,
            webViewLink: file.webViewLink,
            tags: ['Google Drive', 'Scratch', '내 프로젝트'],
            createdAt: createdDate,
            source: 'google_drive'
        };
    }

    // Google Drive 파일 다운로드
    async downloadFile(fileId, fileName) {
        try {
            console.log('📥 Google Drive 파일 다운로드:', fileName);

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