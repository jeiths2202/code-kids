// 구글 로그인 인증 시스템

class GoogleAuth {
    constructor() {
        this.clientId = '633114454750-pr7fjfh35kknv3ih56p4gni3darrd845.apps.googleusercontent.com'; // 실제 구글 클라이언트 ID로 교체 필요
        this.isSignedIn = false;
        this.currentUser = null;
        this.isInitialized = false;

        this.init();
    }

    async init() {
        try {
            // 로컬 스토리지에서 사용자 정보 확인
            const savedUser = localStorage.getItem('codekids_user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
                this.isSignedIn = true;
                this.updateUI();
                return;
            }

            // 구글 라이브러리 로드 시뮬레이션 (실제로는 gapi 라이브러리 사용)
            await this.loadGoogleAPI();
            this.setupGoogleAuth();
            this.isInitialized = true;
        } catch (error) {
            console.error('구글 인증 초기화 실패:', error);
            this.showFallbackLogin();
        }
    }

    async loadGoogleAPI() {
        // 실제 환경에서는 Google API 라이브러리를 로드
        // 여기서는 시뮬레이션을 위한 가짜 구현
        return new Promise((resolve) => {
            setTimeout(() => {
                window.gapi = {
                    load: (api, callback) => callback(),
                    auth2: {
                        init: () => ({
                            isSignedIn: {
                                get: () => this.isSignedIn,
                                listen: (callback) => this.signInListener = callback
                            },
                            currentUser: {
                                get: () => ({
                                    getBasicProfile: () => ({
                                        getName: () => this.currentUser?.name || '',
                                        getEmail: () => this.currentUser?.email || '',
                                        getImageUrl: () => this.currentUser?.picture || ''
                                    })
                                })
                            },
                            signIn: () => this.simulateGoogleSignIn(),
                            signOut: () => this.signOut()
                        })
                    }
                };
                resolve();
            }, 1000);
        });
    }

    setupGoogleAuth() {
        // 실제 환경에서는 구글 API 초기화
        this.authInstance = window.gapi.auth2.init({
            client_id: this.clientId
        });

        this.updateUI();
    }

    // 구글 로그인 시뮬레이션 (실제로는 구글 OAuth 팝업)
    async simulateGoogleSignIn() {
        return new Promise((resolve) => {
            // 실제 구글 로그인 팝업을 시뮬레이션
            const userData = this.showGoogleLoginSimulator();
            if (userData) {
                this.currentUser = userData;
                this.isSignedIn = true;
                localStorage.setItem('codekids_user', JSON.stringify(userData));
                this.updateUI();
                if (this.signInListener) {
                    this.signInListener(true);
                }
            }
            resolve(userData);
        });
    }

    // 구글 로그인 시뮬레이터 (실제로는 구글 팝업)
    showGoogleLoginSimulator() {
        const demoUsers = [
            {
                name: '김민수',
                email: 'minsu.kim@gmail.com',
                picture: 'https://via.placeholder.com/40/4F46E5/FFFFFF?text=김',
                grade: '중학교 1학년',
                points: 850,
                completedProjects: 12
            },
            {
                name: '이지은',
                email: 'jieun.lee@gmail.com',
                picture: 'https://via.placeholder.com/40/06B6D4/FFFFFF?text=이',
                grade: '초등학교 6학년',
                points: 920,
                completedProjects: 8
            },
            {
                name: '박서준',
                email: 'seojun.park@gmail.com',
                picture: 'https://via.placeholder.com/40/10B981/FFFFFF?text=박',
                grade: '중학교 2학년',
                points: 1250,
                completedProjects: 15
            }
        ];

        const selectedUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];

        // 실제로는 구글 로그인 팝업이 여기에 표시됨
        const confirmed = confirm(`CodeKids에 로그인하시겠습니까?\n\n구글 계정: ${selectedUser.email}\n이름: ${selectedUser.name}`);

        if (confirmed) {
            return selectedUser;
        }
        return null;
    }

    // 로그아웃
    async signOut() {
        this.isSignedIn = false;
        this.currentUser = null;
        localStorage.removeItem('codekids_user');
        this.updateUI();

        if (this.signInListener) {
            this.signInListener(false);
        }
    }

    // UI 업데이트
    updateUI() {
        this.updateHeaderUI();
        this.updateLoginButtons();
        this.updateUserDashboard();
    }

    // 헤더 UI 업데이트
    updateHeaderUI() {
        const loginBtn = document.querySelector('.login-btn');
        const userMenu = document.querySelector('.user-menu');

        if (this.isSignedIn && this.currentUser) {
            // 로그인된 상태
            if (loginBtn) {
                loginBtn.style.display = 'none';
            }

            if (userMenu) {
                userMenu.style.display = 'flex';
                userMenu.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <div class="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-2">
                            <img src="${this.currentUser.picture}" alt="${this.currentUser.name}" class="w-8 h-8 rounded-full">
                            <div class="hidden md:block">
                                <div class="text-sm font-semibold text-gray-700">${this.currentUser.name}</div>
                                <div class="text-xs text-gray-500">${this.currentUser.points} 포인트</div>
                            </div>
                        </div>
                        <div class="relative">
                            <button class="dropdown-btn text-gray-600 hover:text-primary" onclick="toggleUserDropdown()">
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                                <a href="dashboard.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <i class="fas fa-chart-bar mr-2"></i>대시보드
                                </a>
                                <a href="profile.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <i class="fas fa-user mr-2"></i>프로필
                                </a>
                                <a href="settings.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <i class="fas fa-cog mr-2"></i>설정
                                </a>
                                <hr class="my-1">
                                <button onclick="googleAuth.signOut()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                    <i class="fas fa-sign-out-alt mr-2"></i>로그아웃
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }
        } else {
            // 로그인 안된 상태
            if (loginBtn) {
                loginBtn.style.display = 'block';
                loginBtn.innerHTML = `
                    <button onclick="googleAuth.signIn()" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>로그인</span>
                    </button>
                `;
            }

            if (userMenu) {
                userMenu.style.display = 'none';
            }
        }
    }

    // 로그인 버튼들 업데이트
    updateLoginButtons() {
        const loginButtons = document.querySelectorAll('.google-login-btn');
        loginButtons.forEach(btn => {
            if (this.isSignedIn) {
                btn.style.display = 'none';
            } else {
                btn.style.display = 'block';
                btn.onclick = () => this.signIn();
            }
        });
    }

    // 사용자 대시보드 업데이트
    updateUserDashboard() {
        const dashboardElements = document.querySelectorAll('.user-dashboard');
        dashboardElements.forEach(element => {
            if (this.isSignedIn && this.currentUser) {
                element.innerHTML = `
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <div class="flex items-center space-x-4 mb-6">
                            <img src="${this.currentUser.picture}" alt="${this.currentUser.name}" class="w-16 h-16 rounded-full">
                            <div>
                                <h3 class="text-xl font-bold text-gray-800">${this.currentUser.name}</h3>
                                <p class="text-gray-600">${this.currentUser.grade}</p>
                                <p class="text-sm text-gray-500">${this.currentUser.email}</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-blue-50 rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-blue-600">${this.currentUser.points}</div>
                                <div class="text-sm text-gray-600">획득 포인트</div>
                            </div>
                            <div class="bg-green-50 rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-green-600">${this.currentUser.completedProjects}</div>
                                <div class="text-sm text-gray-600">완료 프로젝트</div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                element.innerHTML = `
                    <div class="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <i class="fas fa-user-circle text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">로그인이 필요합니다</h3>
                        <p class="text-gray-600 mb-4">CodeKids의 모든 기능을 이용하려면 로그인해주세요</p>
                        <button onclick="googleAuth.signIn()" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                            <i class="fab fa-google mr-2"></i>
                            구글로 로그인
                        </button>
                    </div>
                `;
            }
        });
    }

    // 폴백 로그인 (구글 API 로드 실패시)
    showFallbackLogin() {
        console.log('구글 API를 사용할 수 없습니다. 시뮬레이션 모드로 전환합니다.');
        this.isInitialized = true;
        this.updateUI();
    }

    // 로그인 시도
    async signIn() {
        if (!this.isInitialized) {
            alert('로그인 시스템을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        // 구글 연동 확인 팝업
        const useGoogle = confirm('구글 계정으로 로그인하시겠습니까?\n\n"확인"을 클릭하면 구글 OAuth를 통해 로그인됩니다.\n"취소"를 클릭하면 로그인이 취소됩니다.');

        if (!useGoogle) {
            return; // 사용자가 취소한 경우
        }

        try {
            // 폴백: 시뮬레이션 로그인 (실제로는 구글 OAuth 사용)
            await this.simulateGoogleSignIn();
        } catch (error) {
            console.error('로그인 실패:', error);
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
    }

    // 사용자 정보 반환
    getUser() {
        return this.currentUser;
    }

    // 로그인 상태 확인
    isLoggedIn() {
        return this.isSignedIn;
    }

    // 권한 확인 (프리미엄 기능 등)
    checkPermission(feature) {
        if (!this.isSignedIn) {
            return false;
        }

        // 사용자 등급에 따른 권한 체크
        const permissions = {
            'premium_projects': this.currentUser.points >= 1000,
            'advanced_tutorials': this.currentUser.completedProjects >= 10,
            'scratch_editor': true, // 모든 로그인 사용자
            'community_features': true
        };

        return permissions[feature] || false;
    }
}

// 드롭다운 토글 함수
function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

// 클릭 외부 영역시 드롭다운 닫기
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('user-dropdown');
    const dropdownBtn = document.querySelector('.dropdown-btn');

    if (dropdown && !dropdown.contains(e.target) && !dropdownBtn?.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});

// 전역 인스턴스 생성
let googleAuth;

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', () => {
    googleAuth = new GoogleAuth();
});

// 페이지 이동시 로그인 상태 유지
window.addEventListener('beforeunload', () => {
    if (googleAuth && googleAuth.isLoggedIn()) {
        localStorage.setItem('codekids_user', JSON.stringify(googleAuth.getUser()));
    }
});