import { API_BASE_URL } from '../../config.js';

let currentPage = 0; // 현재 페이지 번호
let totalPages = Infinity; // 초기값 무한대로 설정
let isLoading = false; // 로딩 중인지 확인
let isPayedFilter = true; // 기본값: 미납부자
const userListDiv = document.getElementById('user-list');
const token = localStorage.getItem('accessToken');
const accessToken = `Bearer ${token}`;

// 무한 스크롤 트리거 요소 추가
const loadMoreTrigger = document.createElement('div');
loadMoreTrigger.id = 'loadMoreTrigger';
userListDiv.after(loadMoreTrigger); // 유저 목록 아래에 트리거 요소 추가

document.addEventListener('DOMContentLoaded', () => {
    fetchUserList(currentPage, isPayedFilter); // 기본값: 미납부자

   // IntersectionObserver를 사용하여 무한 스크롤 구현
   const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && currentPage < totalPages && !isLoading) {
            fetchUserList(currentPage, isPayedFilter);
        }
    });

    observer.observe(loadMoreTrigger); // 트리거 요소 관찰 시작

    // 드롭다운 필터링 적용
    document.getElementById('filter-select').addEventListener('change', () => {
        currentPage = 0; // 페이지 번호 초기화
        totalPages = Infinity; // 전체 페이지 초기화
        userListDiv.innerHTML = ''; // 기존 목록 초기화

        const filterValue = document.getElementById('filter-select').value;
        isPayedFilter = filterValue === 'payed'; // true 또는 false 설정

        fetchUserList(currentPage, isPayedFilter); // 필터 조건에 맞는 데이터 요청
    });
});

function fetchUserList(page, isPayed) {
    if (isLoading || page >= totalPages) return; // 로딩 중이거나 마지막 페이지를 넘었을 경우 중단

    isLoading = true;

    const url = new URL(`${API_BASE_URL}/api/users/payed-users/${page}`);
    url.searchParams.append('isPayed', isPayed); // isPayed 값 추가

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
                renderUserList(users); // 사용자 목록 렌더링
                currentPage++; // 다음 페이지 설정
            } else if (currentPage === 0) {
                userListDiv.innerHTML = '<p>사용자가 없습니다.</p>';
            }
        })
        .catch(error => console.error('사용자 목록 요청 중 오류 발생:', error))
        .finally(() => (isLoading = false));
}

// 사용자 목록 렌더링
function renderUserList(users) {
    users.forEach(user => {
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

        userListDiv.appendChild(userItem);
    });
}



window.filterUsers=filterUsers;