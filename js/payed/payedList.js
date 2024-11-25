import { API_BASE_URL } from '../../config.js';

let currentPage = 0; // 현재 페이지 번호
let totalPages = Infinity; // 초기값 무한대로 설정
let isLoading = false; // 로딩 중인지 확인
const userListDiv = document.getElementById('payed-user-list');
const token = localStorage.getItem('accessToken');
const accessToken = `Bearer ${token}`;

// 무한 스크롤 트리거 요소 추가
const loadMoreTrigger = document.createElement('div');
loadMoreTrigger.id = 'loadMoreTrigger';
userListDiv.after(loadMoreTrigger); // 유저 목록 아래에 트리거 요소 추가

document.addEventListener('DOMContentLoaded', () => {
    fetchUserList(currentPage); // 초기 데이터 로드

    // IntersectionObserver를 사용하여 스크롤 이벤트 처리
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && currentPage < totalPages && !isLoading) {
            fetchUserList(currentPage);
        }
    });

    observer.observe(loadMoreTrigger); // 트리거 요소 관찰 시작
});

// 유저 목록 요청 함수
function fetchUserList(page) {
    if (isLoading) return; // 이미 로딩 중이면 중복 요청 방지
    isLoading = true;

    const url = new URL(`${API_BASE_URL}/api/users/payed-users/${page}`);
    url.searchParams.append('isPayed', true); // isPayed 값 추가
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': accessToken
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('납부자 목록 요청 실패');
            }
        })
        .then(data => {
            const users = data.data.users;
            totalPages = data.data.totalPages; // 전체 페이지 수 업데이트
            if (users.length > 0) {
                renderUserList(users); // 유저 목록 렌더링
                currentPage++; // 다음 페이지로 설정
            } else if (currentPage === 0) {
                userListDiv.innerHTML = '<p>납부자 명단이 없습니다.</p>';
            }
        })
        .catch(error => {
            console.error('납부자 목록 요청 중 오류 발생:', error);
        })
        .finally(() => {
            isLoading = false; // 로딩 종료
        });
}

// 유저 목록 렌더링 함수
function renderUserList(users) {
    users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.classList.add('user-item');

        // 이름과 학번 표시
        userItem.innerHTML = `
            <div class="user-name">${user.name}</div>
            <div class="user-id">${user.number}</div>
        `;

        userListDiv.appendChild(userItem);
    });
}
