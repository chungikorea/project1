document.addEventListener('DOMContentLoaded', () => {

// *** Supabase 설정 정보 (환경변수에서 로드) ***
const SUPABASE_URL = window.ENV_CONFIG?.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.ENV_CONFIG?.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('환경변수가 설정되지 않았습니다. config.js 파일을 확인하세요.');
}

const TABLE_NAME = 'MEDICA_2025';
const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let totalCount = 0;
let currentSearchTerm = '';
let currentSearchField = 'name'; // 기본값을 name으로 설정

// Supabase 초기화
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM 요소
const cheongAiBtn = document.getElementById('cheong-ai-btn');
const mainCenter = document.getElementById('main-center');
const homeBtn = document.getElementById('home-btn');
const leftMenu = document.getElementById('left-menu');
const rightContent = document.getElementById('right-content');
const menuItems = document.querySelectorAll('.menu-item');
const dataBody = document.getElementById('data-body');
const paginationContainer = document.getElementById('pagination');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchField = document.getElementById('search-field'); // 추가: select box

// *** 이벤트 리스너 ***

// 1. 청AI 버튼 클릭: 메뉴 토글
cheongAiBtn.addEventListener('click', () => {
    mainCenter.classList.add('hidden');
    leftMenu.classList.add('open');
    document.querySelector('.menu-item[data-project="project1"]').click();
    rightContent.classList.add('menu-open');
});

// 2. 메뉴 항목 클릭
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        menuItems.forEach(i => i.classList.remove('active'));
        e.target.classList.add('active');

        if (e.target.dataset.project === 'project1') {
            rightContent.classList.add('active');
            if (leftMenu.classList.contains('open')) {
                rightContent.classList.add('menu-open');
            }
            currentPage = 1;
            currentSearchTerm = '';
            searchInput.value = '';
            searchField.value = 'name'; // select box도 초기화
            currentSearchField = 'name';
            fetchDataAndRender();
        } else {
            rightContent.classList.remove('active');
            rightContent.classList.remove('menu-open');
        }
    });
});

// 3. 홈 버튼 클릭: 청AI 화면으로 복귀
homeBtn.addEventListener('click', () => {
    mainCenter.classList.remove('hidden');
    leftMenu.classList.remove('open');
    rightContent.classList.remove('active');
    rightContent.classList.remove('menu-open');
}); 

// 4. 검색 버튼 클릭
searchBtn.addEventListener('click', () => {
    currentSearchTerm = searchInput.value.trim();
    currentSearchField = searchField.value; // 선택된 필드 저장
    currentPage = 1;
    fetchDataAndRender();
});

// 5. Enter 키로 검색 (편의성 추가)
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// 6. 페이지 버튼 클릭 (동적 생성되므로 이벤트 위임)
paginationContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('page-btn') && 
        !e.target.classList.contains('current-page') && 
        !e.target.classList.contains('disabled')) {
        const newPage = parseInt(e.target.dataset.page);
        if (newPage > 0 && newPage <= Math.ceil(totalCount / ITEMS_PER_PAGE)) {
            currentPage = newPage;
            fetchDataAndRender();
        }
    }
});


// *** Supabase 데이터 가져오기 함수 ***

async function fetchDataAndRender() {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE - 1;

    let query = supabaseClient
        .from(TABLE_NAME)
        .select('*', { count: 'exact' })
        .order('no', { ascending: true });

    // 검색 조건 추가 - 선택된 필드에 따라 다르게 검색
    if (currentSearchTerm) {
        if (currentSearchField === 'no') {
            // no은 숫자 필드이므로 정확한 일치 검색
            const noValue = parseInt(currentSearchTerm);
            if (!isNaN(noValue)) {
                query = query.eq('no', noValue);
            }
        } else {
            // name, e_mail은 문자열이므로 부분 일치 검색
            query = query.ilike(currentSearchField, `%${currentSearchTerm}%`);
        }
    }

    query = query.range(start, end);

    const { data, count, error } = await query;

    if (error) {
        console.error('Error fetching data:', error);
        dataBody.innerHTML = `<tr><td colspan="7">데이터를 불러오는 데 오류가 발생했습니다: ${error.message}</td></tr>`;
        totalCount = 0;
        renderPagination();
        return;
    }

    totalCount = count;
    renderTable(data);
    renderPagination();
}

// *** 테이블 렌더링 함수 ***

function renderTable(data) {
    dataBody.innerHTML = '';

    if (!data || data.length === 0) {
        dataBody.innerHTML = `<tr><td colspan="7">검색 결과가 없습니다.</td></tr>`;
        return;
    }

    data.forEach(item => {
        const row = dataBody.insertRow();
        row.insertCell().textContent = item.no; 
        row.insertCell().textContent = item.name || '';
        row.insertCell().textContent = item.role || '';
        row.insertCell().textContent = item.department || '';
        row.insertCell().textContent = item.e_mail || '';
        row.insertCell().textContent = item.phone || '';
        row.insertCell().textContent = item.exhibitor || '';
    });
}

// *** 페이지네이션 렌더링 함수 ***

function renderPagination() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    if (totalPages <= 1) return;

    const maxVisiblePages = 10;
    
    // 현재 페이지가 속한 블록 계산 (1~10은 블록1, 11~20은 블록2, ...)
    const currentBlock = Math.ceil(currentPage / maxVisiblePages);
    
    // 블록의 시작과 끝 페이지 계산
    const startPage = (currentBlock - 1) * maxVisiblePages + 1;
    const endPage = Math.min(currentBlock * maxVisiblePages, totalPages);

    // << 버튼 (맨 처음으로)
    const firstBtn = createPageButton('<<', 1);
    if (currentPage === 1) {
        firstBtn.classList.add('disabled');
    }
    paginationContainer.appendChild(firstBtn);

    // < 버튼 (이전 페이지)
    const prevBtn = createPageButton('<', currentPage - 1);
    if (currentPage === 1) {
        prevBtn.classList.add('disabled');
    }
    paginationContainer.appendChild(prevBtn);

    // 페이지 번호들
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = createPageButton(i, i);
        if (i === currentPage) {
            pageBtn.classList.add('current-page');
        }
        paginationContainer.appendChild(pageBtn);
    }

    // > 버튼 (다음 페이지)
    const nextBtn = createPageButton('>', currentPage + 1);
    if (currentPage === totalPages) {
        nextBtn.classList.add('disabled');
    }
    paginationContainer.appendChild(nextBtn);

    // >> 버튼 (맨 마지막으로)
    const lastBtn = createPageButton('>>', totalPages);
    if (currentPage === totalPages) {
        lastBtn.classList.add('disabled');
    }
    paginationContainer.appendChild(lastBtn);
}

// *** 페이지 버튼 생성 헬퍼 함수 ***

function createPageButton(text, page) {
    const btn = document.createElement('div');
    btn.classList.add('page-btn');
    btn.dataset.page = page;
    btn.textContent = text;
    return btn;
}

// 초기 로드 코드 제거 (자동으로 데이터 로드하지 않음)
// document.querySelector('.menu-item[data-project="project1"]').click();

});