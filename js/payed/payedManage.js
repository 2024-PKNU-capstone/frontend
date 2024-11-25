import { API_BASE_URL } from '../../config.js';

let currentPage = 0; // 현재 페이지 번호
let totalPages = Infinity; // 초기값 무한대로 설정
let isLoading = false; // 로딩 중인지 확인
let isPayedFilter = true; // 기본값: 미납부자
const userListDiv = document.getElementById('user-list');
const token = localStorage.getItem('accessToken');
const accessToken = `Bearer ${token}`;

let allUsers = []; // 전체 사용자 데이터를 저장


// 무한 스크롤 트리거 요소 추가
const loadMoreTrigger = document.createElement('div');
loadMoreTrigger.id = 'loadMoreTrigger';
userListDiv.after(loadMoreTrigger); // 유저 목록 아래에 트리거 요소 추가

// 확인 모달 요소
const confirmationModal = document.getElementById('confirmation-modal');
let selectedUser = null; // 선택된 사용자

document.addEventListener('DOMContentLoaded', () => {
    fetchUserList(currentPage, isPayedFilter); // 기본값: 미납부자

    // IntersectionObserver를 사용하여 무한 스크롤 구현
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && currentPage < totalPages && !isLoading) {
            fetchUserList(currentPage, isPayedFilter);
        }
    });

    observer.observe(loadMoreTrigger); // 트리거 요소 관찰 시작

    document.getElementById('filter-select').addEventListener('change', (event) => {
        const filterValue = event.target.value;
        isPayedFilter = filterValue === 'payed'; // true 또는 false 설정
    
        currentPage = 0; // 페이지 번호 초기화
        totalPages = Infinity; // 전체 페이지 초기화
        userListDiv.innerHTML = ''; // 기존 목록 초기화
        allUsers = []; // 사용자 목록 초기화
    
        fetchUserList(currentPage, isPayedFilter); // 필터 조건에 맞는 데이터 요청
       
    });

    // 검색 필터링 이벤트
    document.getElementById('search-input').addEventListener('input', filterUserList);

    // 모달 확인 버튼
    document.getElementById('confirm-btn').addEventListener('click', () => {
        if (selectedUser) {
            updatePayedInfo(selectedUser); // 납부자 인증 요청
        }
        confirmationModal.classList.add('hidden');
    });

    // 모달 취소 버튼
    document.getElementById('cancel-btn').addEventListener('click', () => {
        confirmationModal.classList.add('hidden');
    });
});

// 사용자 목록 요청 함수
function fetchUserList(page, isPayed) {
    if (isLoading || page >= totalPages) return; // 로딩 중이거나 마지막 페이지 초과 시 중단

    isLoading = true;

    const url = new URL(`${API_BASE_URL}/api/users/payed-users/${page}`);
    url.searchParams.append('isPayed', isPayed); // 납부자 필터 값 추가

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': accessToken
        }
    })
        .then(response => response.json())
        .then(data => {
            const users = data.data.users;
            totalPages = data.data.totalPages;

            if (users.length > 0) {
                allUsers = [...allUsers, ...users]; // 전체 사용자 목록 업데이트
                renderUserList(users); // 현재 페이지 사용자 목록 렌더링
                currentPage++; // 다음 페이지 설정
            } else if (currentPage === 0) {
                userListDiv.innerHTML = '<p>사용자가 없습니다.</p>';
            }
        })
        .catch(error => console.error('사용자 목록 요청 중 오류 발생:', error))
        .finally(() => (isLoading = false));
}

function addSlideAndCheckEvent(userContainer, user) {
    let startX;
    let isSliding = false;

    const userItem = userContainer.querySelector('.user-item');
    const checkBtn = userContainer.querySelector('.check-btn');

    // 슬라이드 시작
    userItem.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSliding = false;
    });

    // 슬라이드 중
    userItem.addEventListener('touchmove', (e) => {
        const diffX = e.touches[0].clientX - startX;

        // 슬라이드 임계값 확인 (30px 이상 이동 시 활성화)
        if (diffX < -30 && !isPayedFilter) {
            isSliding = true;
            userItem.style.transform = `translateX(${Math.max(diffX, -30)}px)`; // 최대 슬라이드 거리 제한
            checkBtn.style.display = 'block'; // 체크 버튼 표시
        }
    });

    // 슬라이드 끝
    userItem.addEventListener('touchend', () => {
        if (isSliding) {
            userItem.style.transform = `translateX(-30px)`; // 슬라이드 완료 상태 유지
            userItem.classList.add('slide-active'); // 슬라이드 활성화
        } else {
            userItem.style.transform = `translateX(0)`; // 슬라이드 초기화
            checkBtn.style.display = 'none'; // 버튼 숨김
            userItem.classList.remove('slide-active');
        }
    });

    // 체크 버튼 클릭 이벤트
    checkBtn.addEventListener('click', () => {
        selectedUser = user;
        confirmationModal.classList.remove('hidden'); // 모달 표시
    });
}

// 사용자 목록 렌더링
function renderUserList(users) {
    users.forEach(user => {
        // 컨테이너 생성
        const userContainer = document.createElement('div');
        userContainer.classList.add('user-item-container');

        // 리스트 아이템 생성
        const userItem = document.createElement('li');
        userItem.classList.add('user-item');

        // 상태 점 색상 결정
        const statusClass = user.is_payed ? 'payed-dot' : 'unpaid-dot';

        userItem.innerHTML = `
            <div class="user-info">
                <span class="status-dot ${statusClass}"></span>
                <span class="user-name">${user.name}</span>
            </div>
            <div class="user-id">${user.number}</div>
        `;

        // 체크 버튼 생성
        const checkBtn = document.createElement('img');
        checkBtn.classList.add('check-btn');
        checkBtn.src = '../../resource/icons/icons8-검사-48.png';
        checkBtn.alt = '체크';

        // 구조 구성
        userContainer.appendChild(userItem);
        userContainer.appendChild(checkBtn);

        // 슬라이드 및 클릭 이벤트 추가
        addSlideAndCheckEvent(userContainer, user);

        userListDiv.appendChild(userContainer);
    });
}


// 납부자 인증 API 요청
function updatePayedInfo(user) {
    const url = `${API_BASE_URL}/api/users/update-payed-info`;
    const payload = {
        name: user.name,
        number: user.number
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                alert('납부자 인증이 완료되었습니다.');
                // 해당 사용자 목록에서 제거
                userListDiv.innerHTML = ''; // 기존 목록 초기화
                fetchUserList(0, false); // 목록 갱신
            } else {
                alert('납부자 인증에 실패했습니다.');
            }
        })
        .catch(error => console.error('납부자 인증 요청 중 오류 발생:', error));
}

// 검색 필터링
function filterUserList() {
    const searchValue = document.getElementById('search-input').value.toLowerCase(); // 검색어 입력
    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchValue)
    ); // 이름으로 필터링

    userListDiv.innerHTML = ''; // 기존 목록 초기화
    renderUserList(filteredUsers); // 필터링된 사용자 목록 렌더링
}