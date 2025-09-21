// CodeKids - 학습 분석 대시보드 JavaScript

// 전역 변수
let weeklyChart, languageChart, monthlyChart;
let dashboardData = {};

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('CodeKids 대시보드 로드 시작 🚀');
    
    initializeDashboard();
});

// 대시보드 초기화
async function initializeDashboard() {
    try {
        showLoadingState();
        
        // 데이터 로드
        await loadDashboardData();
        
        // 차트 초기화
        initializeCharts();
        
        // 애니메이션 효과
        initializeAnimations();
        
        // 이벤트 리스너
        setupEventListeners();
        
        hideLoadingState();
        
        console.log('대시보드 초기화 완료 ✅');
        
    } catch (error) {
        console.error('대시보드 초기화 오류:', error);
        showErrorState();
    }
}

// 대시보드 데이터 로드 (시뮬레이션)
async function loadDashboardData() {
    // 실제 환경에서는 API 호출
    // const response = await fetch('/api/dashboard/student/{studentId}');
    // dashboardData = await response.json();
    
    // 시뮬레이션 데이터
    dashboardData = {
        stats: {
            totalHours: 48,
            completedProjects: 12,
            currentLevel: 7,
            streakDays: 15
        },
        weeklyHours: [
            { day: '월', hours: 2.5, date: '2024-12-16' },
            { day: '화', hours: 1.8, date: '2024-12-17' },
            { day: '수', hours: 3.2, date: '2024-12-18' },
            { day: '목', hours: 2.1, date: '2024-12-19' },
            { day: '금', hours: 4.0, date: '2024-12-20' },
            { day: '토', hours: 3.5, date: '2024-12-21' },
            { day: '일', hours: 2.8, date: '2024-12-22' }
        ],
        languageDistribution: [
            { language: '스크래치', hours: 28, percentage: 58.3, color: '#10B981' },
            { language: '파이썬', hours: 15, percentage: 31.3, color: '#4F46E5' },
            { language: 'HTML/CSS', hours: 5, percentage: 10.4, color: '#F59E0B' }
        ],
        monthlyProgress: [
            { month: '1월', projects: 2, hours: 12, challenges: 8 },
            { month: '2월', projects: 3, hours: 18, challenges: 12 },
            { month: '3월', projects: 1, hours: 8, challenges: 6 },
            { month: '4월', projects: 4, hours: 22, challenges: 15 },
            { month: '5월', projects: 2, hours: 16, challenges: 10 },
            { month: '6월', projects: 0, hours: 4, challenges: 3 }
        ],
        recentActivities: [
            {
                type: 'project_completed',
                title: '미로 탈출 로봇 프로젝트 완료',
                description: '스크래치로 구현한 AI 로봇 게임',
                xp: 100,
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            {
                type: 'lesson_completed',
                title: '파이썬 기초 레슨 3-2 완료',
                description: '조건문과 반복문 활용',
                xp: 75,
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
            },
            {
                type: 'badge_earned',
                title: '스크래치 마스터 배지 획득',
                description: '30개 프로젝트 완성 달성',
                xp: 200,
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            }
        ]
    };
    
    // 로딩 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
}

// 차트 초기화
function initializeCharts() {
    // Chart.js 기본 설정
    Chart.defaults.font.family = "'Noto Sans KR', sans-serif";
    Chart.defaults.color = '#6B7280';
    
    createWeeklyHoursChart();
    createLanguageDistributionChart();
    createMonthlyProgressChart();
}

// 주간 학습 시간 차트
function createWeeklyHoursChart() {
    const ctx = document.getElementById('weeklyHoursChart');
    if (!ctx) return;
    
    const data = dashboardData.weeklyHours;
    
    weeklyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.day),
            datasets: [{
                label: '학습 시간 (시간)',
                data: data.map(d => d.hours),
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4F46E5',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(79, 70, 229, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            const dayData = data[context[0].dataIndex];
                            return `${dayData.day}요일 (${dayData.date})`;
                        },
                        label: function(context) {
                            return `학습 시간: ${context.parsed.y}시간`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(107, 114, 128, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '시간';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    hoverBackgroundColor: '#4F46E5',
                    hoverBorderColor: '#ffffff'
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// 언어별 학습 분포 차트
function createLanguageDistributionChart() {
    const ctx = document.getElementById('languageDistChart');
    if (!ctx) return;
    
    const data = dashboardData.languageDistribution;
    
    languageChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(d => d.language),
            datasets: [{
                data: data.map(d => d.hours),
                backgroundColor: data.map(d => d.color),
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverBorderWidth: 4,
                hoverBorderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, index) => {
                                const hours = data.datasets[0].data[index];
                                const percentage = dashboardData.languageDistribution[index].percentage;
                                return {
                                    text: `${label} (${hours}시간, ${percentage}%)`,
                                    fillStyle: data.datasets[0].backgroundColor[index],
                                    strokeStyle: data.datasets[0].borderColor,
                                    lineWidth: data.datasets[0].borderWidth,
                                    index: index
                                };
                            });
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(79, 70, 229, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const languageData = data[context.dataIndex];
                            return [
                                `${languageData.language}`,
                                `학습 시간: ${languageData.hours}시간`,
                                `비율: ${languageData.percentage}%`
                            ];
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 2000
            }
        }
    });
}

// 월별 진도 차트
function createMonthlyProgressChart() {
    const ctx = document.getElementById('monthlyProgressChart');
    if (!ctx) return;
    
    const data = dashboardData.monthlyProgress;
    
    monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.month),
            datasets: [
                {
                    label: '완료한 프로젝트',
                    data: data.map(d => d.projects),
                    backgroundColor: '#10B981',
                    borderColor: '#059669',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false
                },
                {
                    label: '학습 시간',
                    data: data.map(d => d.hours),
                    backgroundColor: '#4F46E5',
                    borderColor: '#3730A3',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                    yAxisID: 'y1'
                },
                {
                    label: '도전 과제',
                    data: data.map(d => d.challenges),
                    backgroundColor: '#F59E0B',
                    borderColor: '#D97706',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(79, 70, 229, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label;
                            const value = context.parsed.y;
                            
                            if (label === '학습 시간') {
                                return `${label}: ${value}시간`;
                            } else {
                                return `${label}: ${value}개`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(107, 114, 128, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '개';
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '시간';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// 애니메이션 효과 초기화
function initializeAnimations() {
    // 통계 카운터 애니메이션
    animateCounters();
    
    // 프로그레스 바 애니메이션
    animateProgressBars();
    
    // 카드 진입 애니메이션
    animateCardEntrance();
}

// 카운터 애니메이션
function animateCounters() {
    const counters = [
        { element: document.getElementById('total-hours'), target: dashboardData.stats.totalHours, suffix: '' },
        { element: document.getElementById('completed-projects'), target: dashboardData.stats.completedProjects, suffix: '' },
        { element: document.getElementById('current-level'), target: dashboardData.stats.currentLevel, suffix: '' },
        { element: document.getElementById('streak-days'), target: dashboardData.stats.streakDays, suffix: '' }
    ];
    
    counters.forEach(counter => {
        if (counter.element) {
            animateCounter(counter.element, 0, counter.target, 2000, counter.suffix);
        }
    });
}

// 개별 카운터 애니메이션
function animateCounter(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    const startValue = start;
    const endValue = end;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 이징 함수 (easeOutExpo)
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        const currentValue = Math.round(startValue + (endValue - startValue) * easeOutExpo);
        element.textContent = currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// 프로그레스 바 애니메이션
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar-fill, [style*="width:"]');
    
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.classList.add('animate');
        }, index * 200);
    });
}

// 카드 진입 애니메이션
function animateCardEntrance() {
    const cards = document.querySelectorAll('.bg-white');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            observer.observe(card);
        }, index * 100);
    });
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 주간 선택 드롭다운
    const weekSelect = document.getElementById('week-select');
    if (weekSelect) {
        weekSelect.addEventListener('change', handleWeekChange);
    }
    
    // 차트 업데이트 버튼들
    const updateButtons = document.querySelectorAll('[data-chart-update]');
    updateButtons.forEach(button => {
        button.addEventListener('click', handleChartUpdate);
    });
    
    // 윈도우 리사이즈 이벤트
    window.addEventListener('resize', debounce(handleWindowResize, 300));
    
    // 실시간 데이터 업데이트 (5분마다)
    setInterval(updateRealTimeData, 5 * 60 * 1000);
}

// 주간 데이터 변경 처리
function handleWeekChange(event) {
    const selectedWeek = event.target.value;
    console.log('주간 데이터 변경:', selectedWeek);
    
    // 로딩 표시
    showChartLoading('weeklyHoursChart');
    
    // 새 데이터 로드 (시뮬레이션)
    setTimeout(() => {
        updateWeeklyChart(selectedWeek);
        hideChartLoading('weeklyHoursChart');
    }, 1000);
}

// 주간 차트 업데이트
function updateWeeklyChart(period) {
    if (!weeklyChart) return;
    
    // 시뮬레이션: 다른 주간 데이터
    const newData = period === '지난 주' ? 
        [1.5, 2.2, 2.8, 1.9, 3.5, 4.2, 2.1] : 
        period === '지난 달' ?
        [2.1, 1.8, 3.2, 2.5, 3.8, 3.1, 2.9] :
        dashboardData.weeklyHours.map(d => d.hours);
    
    weeklyChart.data.datasets[0].data = newData;
    weeklyChart.update('active');
}

// 차트 업데이트 처리
function handleChartUpdate(event) {
    const chartType = event.target.dataset.chartUpdate;
    console.log('차트 업데이트:', chartType);
    
    // 차트별 업데이트 로직 구현
    switch(chartType) {
        case 'language':
            refreshLanguageChart();
            break;
        case 'monthly':
            refreshMonthlyChart();
            break;
    }
}

// 윈도우 리사이즈 처리
function handleWindowResize() {
    // 모든 차트 리사이즈
    [weeklyChart, languageChart, monthlyChart].forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
}

// 실시간 데이터 업데이트
async function updateRealTimeData() {
    try {
        // 실제 환경에서는 API 호출
        console.log('실시간 데이터 업데이트 중...');
        
        // 통계 데이터 업데이트
        const currentHours = parseInt(document.getElementById('total-hours').textContent);
        if (Math.random() > 0.7) { // 30% 확률로 업데이트
            animateCounter(document.getElementById('total-hours'), currentHours, currentHours + 1, 1000);
        }
        
    } catch (error) {
        console.error('실시간 데이터 업데이트 오류:', error);
    }
}

// 유틸리티 함수들

// 로딩 상태 표시
function showLoadingState() {
    document.body.classList.add('loading');
    
    // 스켈레톤 로딩 표시
    const cards = document.querySelectorAll('.bg-white');
    cards.forEach(card => {
        card.style.opacity = '0.5';
    });
}

// 로딩 상태 숨김
function hideLoadingState() {
    document.body.classList.remove('loading');
    
    const cards = document.querySelectorAll('.bg-white');
    cards.forEach(card => {
        card.style.opacity = '1';
    });
}

// 에러 상태 표시
function showErrorState() {
    console.error('대시보드 로딩 실패');
    
    // 에러 메시지 표시
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg z-50';
    errorDiv.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-exclamation-triangle"></i>
            <span>데이터를 불러오는 중 오류가 발생했습니다.</span>
            <button onclick="location.reload()" class="underline hover:no-underline">새로고침</button>
        </div>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

// 차트 로딩 표시
function showChartLoading(chartId) {
    const canvas = document.getElementById(chartId);
    if (canvas) {
        const container = canvas.parentElement;
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-overlay';
        loadingDiv.innerHTML = '<div class="loading-spinner"></div>';
        container.appendChild(loadingDiv);
    }
}

// 차트 로딩 숨김
function hideChartLoading(chartId) {
    const canvas = document.getElementById(chartId);
    if (canvas) {
        const container = canvas.parentElement;
        const loadingDiv = container.querySelector('.loading-overlay');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
}

// 디바운스 함수
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

// 차트 새로고침 함수들
function refreshLanguageChart() {
    if (!languageChart) return;
    
    showChartLoading('languageDistChart');
    
    setTimeout(() => {
        // 새 데이터로 업데이트 (시뮬레이션)
        const newData = [30, 12, 8]; // 새로운 시간 데이터
        languageChart.data.datasets[0].data = newData;
        languageChart.update('active');
        hideChartLoading('languageDistChart');
    }, 800);
}

function refreshMonthlyChart() {
    if (!monthlyChart) return;
    
    showChartLoading('monthlyProgressChart');
    
    setTimeout(() => {
        // 현재 월 데이터 추가 (시뮬레이션)
        const currentMonth = new Date().toLocaleDateString('ko-KR', { month: 'long' });
        monthlyChart.data.labels.push(currentMonth);
        monthlyChart.data.datasets.forEach(dataset => {
            dataset.data.push(Math.floor(Math.random() * 10));
        });
        monthlyChart.update('active');
        hideChartLoading('monthlyProgressChart');
    }, 800);
}

// 데이터 내보내기 기능
function exportDashboardData() {
    const exportData = {
        stats: dashboardData.stats,
        weeklyHours: dashboardData.weeklyHours,
        languageDistribution: dashboardData.languageDistribution,
        monthlyProgress: dashboardData.monthlyProgress,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `codekids-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// 전역 함수로 노출
window.exportDashboardData = exportDashboardData;

console.log('CodeKids 대시보드 JavaScript 로드 완료! 📊');