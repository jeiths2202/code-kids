// CodeKids - 초중등학생 코딩앱 메인 JavaScript

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('CodeKids 앱이 로드되었습니다! 🚀');

    // 초기화 함수들 실행
    initializeAnimations();
    initializeNavigation();
    initializeScrollEffects();
    initializeInteractiveElements();
    initializeStatistics();
    initializeMobileMenu();
    initializeAuth();

    // 페이지 로딩 완료 메시지
    showWelcomeMessage();
});

// 인증 관련 초기화
function initializeAuth() {
    // 로그인 상태 체크
    setTimeout(() => {
        if (window.googleAuth) {
            setupAuthCallbacks();
            if (googleAuth.isLoggedIn()) {
                showPersonalizedContent();
            }
        }
    }, 1000);
}

// 인증 콜백 설정
function setupAuthCallbacks() {
    // 로그인 성공시 실행될 함수들
    window.onAuthSuccess = () => {
        showLoginSuccessMessage();
        showPersonalizedContent();
    };

    // 로그아웃시 실행될 함수들
    window.onAuthSignOut = () => {
        showLogoutMessage();
        hidePersonalizedContent();
    };
}

// 1. 애니메이션 초기화
function initializeAnimations() {
    // 페이지 진입 시 요소들에 애니메이션 클래스 추가
    const animatedElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons, .hero-stats');
    
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // 카드 호버 애니메이션 향상
    const cards = document.querySelectorAll('.bg-white');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// 2. 네비게이션 초기화
function initializeNavigation() {
    // 부드러운 스크롤 네비게이션
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = 80; // 헤더 높이 고려
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 활성 네비게이션 링크 표시
                updateActiveNavLink(this);
            }
        });
    });
}

// 3. 스크롤 효과 초기화
function initializeScrollEffects() {
    // 스크롤에 따른 헤더 스타일 변경
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // 헤더 배경 투명도 조절
        if (currentScrollY > 50) {
            header.classList.add('bg-opacity-95', 'backdrop-blur-md');
        } else {
            header.classList.remove('bg-opacity-95', 'backdrop-blur-md');
        }
        
        // 헤더 숨김/표시 (모바일)
        if (window.innerWidth <= 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
        
        // 스크롤 애니메이션 트리거
        handleScrollAnimations();
    });
    
    // 초기 스크롤 애니메이션 체크
    handleScrollAnimations();
}

// 4. 스크롤 애니메이션 처리
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

// 5. 인터랙티브 요소 초기화
function initializeInteractiveElements() {
    // 버튼 클릭 이벤트
    initializeButtons();
    
    // 카드 클릭 이벤트
    initializeCards();
    
    // 아이콘 애니메이션
    initializeIcons();
    
    // 툴팁 기능
    initializeTooltips();
}

// 6. 버튼 초기화
function initializeButtons() {
    // 메인 CTA 버튼들
    const ctaButtons = document.querySelectorAll('button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 리플 효과
            createRippleEffect(e, this);
            
            // 버튼별 액션
            const buttonText = this.textContent.trim();
            handleButtonClick(buttonText);
        });
        
        // 버튼 호버 효과
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });
}

// 7. 카드 초기화
function initializeCards() {
    const courseCards = document.querySelectorAll('#courses .bg-white');
    const projectCards = document.querySelectorAll('#projects .bg-white');
    
    // 강의 카드 클릭 이벤트
    courseCards.forEach((card, index) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const courseTitle = this.querySelector('h4').textContent;
            showCourseModal(courseTitle, index);
        });
    });
    
    // 프로젝트 카드 클릭 이벤트
    projectCards.forEach((card, index) => {
        const playButton = card.querySelector('button');
        if (playButton) {
            playButton.addEventListener('click', function(e) {
                e.stopPropagation();
                const projectTitle = card.querySelector('h4').textContent;
                showProjectDemo(projectTitle, index);
            });
        }
    });
}

// 8. 아이콘 애니메이션 초기화
function initializeIcons() {
    const icons = document.querySelectorAll('i');
    
    icons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.classList.add('animated-icon');
            this.style.transform = 'scale(1.2) rotate(10deg)';
            this.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// 9. 통계 카운터 애니메이션
function initializeStatistics() {
    const stats = [
        { element: document.querySelectorAll('.text-3xl')[0], target: 1000, suffix: '+' },
        { element: document.querySelectorAll('.text-3xl')[1], target: 50, suffix: '+' },
        { element: document.querySelectorAll('.text-3xl')[2], target: 200, suffix: '+' },
        { element: document.querySelectorAll('.text-3xl')[3], target: 98, suffix: '%' }
    ];
    
    // 스크롤 시 카운터 애니메이션 실행
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    });
    
    stats.forEach(stat => {
        if (stat.element) {
            observer.observe(stat.element.parentElement);
        }
    });
}

// 10. 모바일 메뉴 초기화
function initializeMobileMenu() {
    const mobileMenuButton = document.querySelector('.md\\:hidden button');
    const mobileMenu = createMobileMenu();
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            toggleMobileMenu(mobileMenu);
        });
    }
}

// 유틸리티 함수들

// 리플 효과 생성
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    // 리플 애니메이션 CSS 추가
    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// 버튼 클릭 처리
function handleButtonClick(buttonText) {
    switch(buttonText) {
        case '지금 시작하기':
            showAlert('🎉 회원가입 페이지로 이동합니다!', 'success');
            break;
        case '체험해보기':
            showDemoModal();
            break;
        case '챌린지 도전하기':
            showAlert('🎯 로봇 미로 탈출 챌린지를 준비중입니다!', 'info');
            break;
        case '무료 체험 시작':
            showSignupForm();
            break;
        case '학부모 가이드':
            showParentGuide();
            break;
        default:
            showAlert('기능을 준비중입니다! 😊', 'info');
    }
}

// 강의 모달 표시
function showCourseModal(courseTitle, index) {
    const courses = [
        {
            title: '스크래치 기초',
            description: '블록 코딩으로 시작하는 첫 번째 프로그래밍 여행',
            duration: '12주',
            difficulty: '초급',
            topics: ['기본 블록 이해', '반복문과 조건문', '간단한 게임 만들기', '애니메이션 제작']
        },
        {
            title: '파이썬 입문',
            description: '텍스트 코딩의 기초부터 실전 프로젝트까지',
            duration: '16주',
            difficulty: '중급',
            topics: ['변수와 데이터 타입', '함수와 모듈', '웹 크롤링 기초', '간단한 앱 개발']
        },
        {
            title: '웹 개발',
            description: '나만의 웹사이트를 만들어보는 실전 과정',
            duration: '20주',
            difficulty: '고급',
            topics: ['HTML 구조 설계', 'CSS 스타일링', 'JavaScript 인터랙션', '반응형 웹 디자인']
        }
    ];
    
    const course = courses[index] || courses[0];
    showCustomModal(course.title, createCourseContent(course));
}

// 프로젝트 데모 표시
function showProjectDemo(projectTitle, index) {
    const projects = [
        {
            title: '고양이 케어 게임',
            author: '김민수',
            description: '스크래치로 제작한 가상 펫 키우기 시뮬레이션',
            features: ['펫 상태 관리', '미니게임', '아이템 수집', '레벨 시스템']
        },
        {
            title: '수학 퀴즈 앱',
            author: '이지은',
            description: '파이썬으로 개발한 교육용 수학 문제 생성기',
            features: ['난이도별 문제', '성취도 추적', '오답 분석', '학습 통계']
        },
        {
            title: '디지털 아트 갤러리',
            author: '박서준',
            description: 'HTML/CSS로 구현한 개인 포트폴리오 웹사이트',
            features: ['반응형 디자인', '작품 갤러리', '애니메이션 효과', 'SEO 최적화']
        }
    ];
    
    const project = projects[index] || projects[0];
    showCustomModal(`${project.title} - 작품 소개`, createProjectContent(project));
}

// 커스텀 모달 생성
function showCustomModal(title, content) {
    // 기존 모달 제거
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto mx-4 transform transition-all">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-gray-800">${title}</h3>
                <button class="close-modal text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 모달 닫기 이벤트
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('close-modal')) {
            modal.remove();
        }
    });
    
    // 애니메이션
    setTimeout(() => {
        modal.querySelector('.bg-white').style.transform = 'scale(1)';
        modal.style.opacity = '1';
    }, 10);
}

// 강의 콘텐츠 생성
function createCourseContent(course) {
    return `
        <div class="space-y-6">
            <p class="text-gray-600 text-lg">${course.description}</p>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="text-sm text-blue-600 font-semibold">수업 기간</div>
                    <div class="text-lg font-bold text-blue-800">${course.duration}</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                    <div class="text-sm text-green-600 font-semibold">난이도</div>
                    <div class="text-lg font-bold text-green-800">${course.difficulty}</div>
                </div>
            </div>
            
            <div>
                <h4 class="text-lg font-semibold mb-3 text-gray-800">주요 학습 내용</h4>
                <ul class="space-y-2">
                    ${course.topics.map(topic => `
                        <li class="flex items-center text-gray-600">
                            <i class="fas fa-check-circle text-green-500 mr-3"></i>
                            ${topic}
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="flex space-x-4 pt-4">
                <button class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    <i class="fas fa-play mr-2"></i>지금 시작하기
                </button>
                <button class="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    <i class="fas fa-info-circle mr-2"></i>자세히 보기
                </button>
            </div>
        </div>
    `;
}

// 프로젝트 콘텐츠 생성
function createProjectContent(project) {
    return `
        <div class="space-y-6">
            <div class="flex items-center space-x-3 text-gray-600">
                <i class="fas fa-user"></i>
                <span>제작자: ${project.author}</span>
            </div>
            
            <p class="text-gray-600 text-lg">${project.description}</p>
            
            <div>
                <h4 class="text-lg font-semibold mb-3 text-gray-800">주요 기능</h4>
                <div class="grid grid-cols-2 gap-3">
                    ${project.features.map(feature => `
                        <div class="flex items-center text-gray-600">
                            <i class="fas fa-star text-yellow-500 mr-2"></i>
                            ${feature}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-gray-100 p-6 rounded-lg text-center">
                <i class="fas fa-code text-4xl text-gray-400 mb-3"></i>
                <p class="text-gray-600">프로젝트 미리보기</p>
                <p class="text-sm text-gray-500 mt-2">실제 구현된 프로젝트를 체험해보세요!</p>
            </div>
            
            <div class="flex space-x-4 pt-4">
                <button class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    <i class="fas fa-play mr-2"></i>실행하기
                </button>
                <button class="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    <i class="fas fa-code mr-2"></i>소스코드 보기
                </button>
            </div>
        </div>
    `;
}

// 알림 표시
function showAlert(message, type = 'info') {
    const alertColors = {
        success: 'bg-green-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500'
    };
    
    const alert = document.createElement('div');
    alert.className = `fixed top-4 right-4 z-50 ${alertColors[type]} text-white px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform`;
    alert.innerHTML = `
        <div class="flex items-center space-x-3">
            <span>${message}</span>
            <button class="text-white hover:text-gray-200">&times;</button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // 애니메이션으로 표시
    setTimeout(() => alert.style.transform = 'translateX(0)', 100);
    
    // 자동 제거
    setTimeout(() => {
        alert.style.transform = 'translateX(full)';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
    
    // 클릭으로 제거
    alert.querySelector('button').addEventListener('click', () => {
        alert.style.transform = 'translateX(full)';
        setTimeout(() => alert.remove(), 300);
    });
}

// 카운터 애니메이션
function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (element.textContent.includes('%')) {
            element.textContent = Math.round(current) + '%';
        } else {
            element.textContent = Math.round(current) + '+';
        }
    }, 16);
}

// 활성 네비게이션 링크 업데이트
function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.classList.remove('text-blue-600', 'font-semibold');
        link.classList.add('text-gray-700');
    });
    
    activeLink.classList.remove('text-gray-700');
    activeLink.classList.add('text-blue-600', 'font-semibold');
}

// 환영 메시지
function showWelcomeMessage() {
    setTimeout(() => {
        showAlert('🎉 CodeKids에 오신 것을 환영합니다!', 'success');
    }, 1000);
}

// 데모 모달
function showDemoModal() {
    showCustomModal('CodeKids 체험하기', `
        <div class="text-center space-y-6">
            <div class="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto flex items-center justify-center">
                <i class="fas fa-play text-white text-4xl"></i>
            </div>
            <h4 class="text-2xl font-bold text-gray-800">체험 모드가 곧 출시됩니다!</h4>
            <p class="text-gray-600">스크래치 블록 코딩을 직접 체험해볼 수 있는 인터랙티브 데모를 준비중입니다.</p>
            <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-blue-800 font-semibold">미리 알림 신청하기</p>
                <p class="text-blue-600 text-sm mt-1">체험판 출시 소식을 가장 먼저 받아보세요!</p>
            </div>
            <button class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                알림 신청하기
            </button>
        </div>
    `);
}

// 회원가입 폼
function showSignupForm() {
    showCustomModal('무료 회원가입', `
        <form class="space-y-4">
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">학생 이름</label>
                <input type="text" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="이름을 입력하세요">
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">학년</label>
                <select class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>초등학교 3학년</option>
                    <option>초등학교 4학년</option>
                    <option>초등학교 5학년</option>
                    <option>초등학교 6학년</option>
                    <option>중학교 1학년</option>
                    <option>중학교 2학년</option>
                    <option>중학교 3학년</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">보호자 이메일</label>
                <input type="email" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="parent@example.com">
            </div>
            <div class="flex items-center space-x-2">
                <input type="checkbox" id="agree" class="w-4 h-4 text-blue-600">
                <label for="agree" class="text-sm text-gray-600">개인정보 처리방침에 동의합니다</label>
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                회원가입 완료
            </button>
        </form>
    `);
}

// 학부모 가이드
function showParentGuide() {
    showCustomModal('학부모 가이드', `
        <div class="space-y-6">
            <div class="bg-blue-50 p-6 rounded-lg">
                <h4 class="text-lg font-semibold text-blue-800 mb-3">CodeKids는 이런 점이 특별해요</h4>
                <ul class="space-y-2 text-blue-700">
                    <li>✓ 연령별 맞춤 커리큘럼</li>
                    <li>✓ 게임형 학습으로 재미있게</li>
                    <li>✓ 실시간 학습 진도 확인</li>
                    <li>✓ 전문 강사의 1:1 피드백</li>
                </ul>
            </div>
            
            <div>
                <h4 class="text-lg font-semibold text-gray-800 mb-3">자주 묻는 질문</h4>
                <div class="space-y-4">
                    <div class="border-l-4 border-blue-500 pl-4">
                        <h5 class="font-semibold text-gray-700">Q. 컴퓨터 경험이 없어도 괜찮나요?</h5>
                        <p class="text-gray-600 mt-1">네! 마우스 사용법부터 차근차근 알려드립니다.</p>
                    </div>
                    <div class="border-l-4 border-green-500 pl-4">
                        <h5 class="font-semibold text-gray-700">Q. 학습 시간은 얼마나 되나요?</h5>
                        <p class="text-gray-600 mt-1">주 2-3회, 회당 40분 정도가 적당합니다.</p>
                    </div>
                    <div class="border-l-4 border-purple-500 pl-4">
                        <h5 class="font-semibold text-gray-700">Q. 학습 진도를 확인할 수 있나요?</h5>
                        <p class="text-gray-600 mt-1">학부모 대시보드에서 실시간 진도를 확인하실 수 있습니다.</p>
                    </div>
                </div>
            </div>
            
            <button class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                상담 신청하기
            </button>
        </div>
    `);
}

// 모바일 메뉴 생성
function createMobileMenu() {
    const menu = document.createElement('div');
    menu.className = 'mobile-menu fixed top-16 left-0 right-0 bg-white shadow-lg transform -translate-y-full transition-transform z-40';
    menu.innerHTML = `
        <div class="p-4 space-y-4">
            <a href="#courses" class="block py-2 text-gray-700 font-semibold">강의</a>
            <a href="#practice" class="block py-2 text-gray-700 font-semibold">실습</a>
            <a href="#projects" class="block py-2 text-gray-700 font-semibold">프로젝트</a>
            <a href="#community" class="block py-2 text-gray-700 font-semibold">커뮤니티</a>
            <hr>
            <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">로그인</button>
        </div>
    `;
    
    document.body.appendChild(menu);
    return menu;
}

// 모바일 메뉴 토글
function toggleMobileMenu(menu) {
    if (menu.style.transform === 'translateY(0px)') {
        menu.style.transform = 'translateY(-100%)';
    } else {
        menu.style.transform = 'translateY(0px)';
    }
}

// 툴팁 초기화
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            showTooltip(e.target, e.target.dataset.tooltip);
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

// 툴팁 표시
function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-popup absolute z-50 bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
}

// 툴팁 숨기기
function hideTooltip() {
    const tooltip = document.querySelector('.tooltip-popup');
    if (tooltip) {
        tooltip.remove();
    }
}

// 전역 이벤트 리스너
document.addEventListener('keydown', function(e) {
    // ESC 키로 모달 닫기
    if (e.key === 'Escape') {
        const modal = document.querySelector('.custom-modal');
        if (modal) {
            modal.remove();
        }
    }
});

// 성능 최적화를 위한 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 스크롤 이벤트 디바운싱
const debouncedScrollHandler = debounce(handleScrollAnimations, 10);
window.addEventListener('scroll', debouncedScrollHandler);

// 로그인 성공 메시지
function showLoginSuccessMessage() {
    if (googleAuth && googleAuth.isLoggedIn()) {
        const user = googleAuth.getUser();
        setTimeout(() => {
            showAlert(`🎉 안녕하세요, ${user.name}님! 환영합니다!`, 'success');
        }, 500);
    }
}

// 로그아웃 메시지
function showLogoutMessage() {
    showAlert('👋 로그아웃되었습니다. 다음에 또 만나요!', 'info');
}

// 개인화된 콘텐츠 표시
function showPersonalizedContent() {
    if (!googleAuth || !googleAuth.isLoggedIn()) return;

    const user = googleAuth.getUser();

    // 개인화된 환영 메시지 추가
    addPersonalizedWelcome(user);

    // 추천 프로젝트 섹션 추가
    addRecommendedProjects(user);

    // 진행 현황 표시
    showProgressStatus(user);
}

// 개인화된 콘텐츠 숨기기
function hidePersonalizedContent() {
    const personalizedElements = document.querySelectorAll('.personalized-content');
    personalizedElements.forEach(element => {
        element.remove();
    });
}

// 개인화된 환영 메시지 추가
function addPersonalizedWelcome(user) {
    const heroSection = document.querySelector('.hero-title');
    if (heroSection) {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'personalized-content bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl mb-6';
        welcomeMessage.innerHTML = `
            <div class="flex items-center space-x-4">
                <img src="${user.picture}" alt="${user.name}" class="w-12 h-12 rounded-full border-2 border-white">
                <div>
                    <h3 class="font-bold text-lg">${user.name}님, 안녕하세요! 👋</h3>
                    <p class="text-blue-100">${user.grade} • ${user.points} 포인트 • ${user.completedProjects}개 프로젝트 완료</p>
                </div>
            </div>
        `;
        heroSection.parentNode.insertBefore(welcomeMessage, heroSection);
    }
}

// 추천 프로젝트 섹션 추가
function addRecommendedProjects(user) {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        const recommendedSection = document.createElement('div');
        recommendedSection.className = 'personalized-content mb-8';

        const recommendations = getPersonalizedRecommendations(user);

        recommendedSection.innerHTML = `
            <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8">
                <h3 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-star text-yellow-500 mr-2"></i>
                    ${user.name}님을 위한 추천 프로젝트
                </h3>
                <div class="grid md:grid-cols-2 gap-4">
                    ${recommendations.map(project => `
                        <div class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onclick="window.location.href='${project.url}'">
                            <div class="flex items-center space-x-3 mb-3">
                                <div class="w-10 h-10 ${project.color} rounded-lg flex items-center justify-center">
                                    <i class="${project.icon} text-white"></i>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-gray-800">${project.title}</h4>
                                    <p class="text-xs text-gray-500">${project.difficulty} • ${project.duration}</p>
                                </div>
                            </div>
                            <p class="text-sm text-gray-600 mb-3">${project.description}</p>
                            <div class="flex items-center justify-between">
                                <span class="text-xs bg-${project.matchColor}-100 text-${project.matchColor}-600 px-2 py-1 rounded-full">
                                    ${project.matchReason}
                                </span>
                                <button class="text-sm bg-primary text-white px-3 py-1 rounded-lg hover:bg-indigo-700">
                                    시작하기
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        projectsSection.parentNode.insertBefore(recommendedSection, projectsSection);
    }
}

// 개인화된 추천 시스템
function getPersonalizedRecommendations(user) {
    const allProjects = [
        {
            title: '미로 탈출 로봇',
            description: '논리적 사고와 알고리즘을 배우는 프로젝트',
            difficulty: '중급',
            duration: '30분',
            url: 'project-maze-robot.html',
            icon: 'fas fa-robot',
            color: 'bg-indigo-500',
            matchColor: 'indigo',
            matchReason: '논리 사고력 향상',
            points: 100,
            requiredPoints: 0
        },
        {
            title: '정렬 알고리즘 시각화',
            description: '데이터 정렬 방법을 시각적으로 학습',
            difficulty: '중급',
            duration: '45분',
            url: 'project-sorting-algorithm.html',
            icon: 'fas fa-sort-amount-up',
            color: 'bg-purple-500',
            matchColor: 'purple',
            matchReason: '알고리즘 학습',
            points: 80,
            requiredPoints: 300
        },
        {
            title: '잠수 게임',
            description: '물리 법칙을 활용한 재미있는 게임',
            difficulty: '중고급',
            duration: '60분',
            url: 'project-diving-game.html',
            icon: 'fas fa-swimmer',
            color: 'bg-blue-500',
            matchColor: 'blue',
            matchReason: '게임 개발',
            points: 120,
            requiredPoints: 500
        },
        {
            title: '고양이 케어 게임',
            description: '가상 펫을 돌보는 시뮬레이션',
            difficulty: '초급',
            duration: '25분',
            url: 'project-cat-care.html',
            icon: 'fas fa-cat',
            color: 'bg-pink-500',
            matchColor: 'pink',
            matchReason: '입문자 추천',
            points: 60,
            requiredPoints: 0
        }
    ];

    // 사용자 레벨에 맞는 프로젝트 필터링
    let filteredProjects = allProjects.filter(project =>
        user.points >= project.requiredPoints
    );

    // 포인트 기반 추천 로직
    if (user.points < 300) {
        // 초보자: 쉬운 프로젝트 우선
        filteredProjects = filteredProjects.filter(p => p.difficulty.includes('초급') || p.difficulty.includes('중급'));
    } else if (user.points < 800) {
        // 중급자: 중급 프로젝트 우선
        filteredProjects = filteredProjects.filter(p => !p.difficulty.includes('초급'));
    }

    // 최대 2개 추천
    return filteredProjects.slice(0, 2);
}

// 진행 현황 표시
function showProgressStatus(user) {
    const practiceSection = document.getElementById('practice');
    if (practiceSection) {
        const progressSection = document.createElement('div');
        progressSection.className = 'personalized-content mb-8';

        progressSection.innerHTML = `
            <div class="bg-white rounded-2xl shadow-lg p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <i class="fas fa-chart-line text-blue-500 mr-2"></i>
                    ${user.name}님의 학습 현황
                </h3>

                <div class="grid md:grid-cols-3 gap-4">
                    <div class="text-center p-4 bg-blue-50 rounded-xl">
                        <div class="text-2xl font-bold text-blue-600 mb-1">${user.points}</div>
                        <div class="text-sm text-gray-600">총 획득 포인트</div>
                        <div class="w-full bg-blue-200 rounded-full h-2 mt-2">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: ${Math.min(user.points / 10, 100)}%"></div>
                        </div>
                    </div>

                    <div class="text-center p-4 bg-green-50 rounded-xl">
                        <div class="text-2xl font-bold text-green-600 mb-1">${user.completedProjects}</div>
                        <div class="text-sm text-gray-600">완료한 프로젝트</div>
                        <div class="w-full bg-green-200 rounded-full h-2 mt-2">
                            <div class="bg-green-600 h-2 rounded-full" style="width: ${Math.min(user.completedProjects * 5, 100)}%"></div>
                        </div>
                    </div>

                    <div class="text-center p-4 bg-purple-50 rounded-xl">
                        <div class="text-2xl font-bold text-purple-600 mb-1">${getStudyStreak(user)}</div>
                        <div class="text-sm text-gray-600">연속 학습 일수</div>
                        <div class="w-full bg-purple-200 rounded-full h-2 mt-2">
                            <div class="bg-purple-600 h-2 rounded-full" style="width: ${Math.min(getStudyStreak(user) * 10, 100)}%"></div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 text-center">
                    <a href="dashboard.html" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center">
                        <i class="fas fa-chart-bar mr-2"></i>
                        상세 대시보드 보기
                    </a>
                </div>
            </div>
        `;

        practiceSection.parentNode.insertBefore(progressSection, practiceSection);
    }
}

// 학습 연속 일수 계산 (시뮬레이션)
function getStudyStreak(user) {
    // 실제로는 서버에서 가져올 데이터
    return Math.floor(user.points / 100) + 1;
}

console.log('CodeKids JavaScript 로드 완료! 🎨');