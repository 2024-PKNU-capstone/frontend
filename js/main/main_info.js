import { API_BASE_URL} from '../../config.js';

document.addEventListener('DOMContentLoaded', function() {
    fetchUserProfile();

    // 사용자 프로필 정보를 서버에서 가져오는 함수
    function fetchUserProfile() {
        fetch(`${API_BASE_URL}/api/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // 필요시 토큰 추가
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('프로필 정보를 불러오는 중 오류 발생');
            }
        })
        .then(userInfo => {
            console.log(userInfo.data)
             // Role 값을 해석하여 한글로 변환
             const roleMap = {
                'PRESIDENT': '회장',
                'VICE_PRESIDENT': '부회장',
                'MANAGER': '총무',
                'AUDITOR': '감사',
                'STUDENT': '학생'
            };

            const translatedRole = roleMap[userInfo.data.role] || '알 수 없음'; // 알 수 없는 경우 대비
            // parent가 null인 경우 공백 처리
            const parent = userInfo.data.parent || ''; 

            // 프로필 정보를 DOM에 반영
            document.querySelector('.university').textContent = `${parent} ${userInfo.data.dept}`;
            document.querySelector('.name').textContent = userInfo.data.name;
            document.querySelector('.role').textContent = translatedRole;
            document.querySelector('.id').textContent = userInfo.data.number;

            

            
        })
        .catch(error => {
            console.error('프로필 정보를 불러오는 중 오류 발생:', error);
        });
    }
});

// 납부자 버튼 클릭 시 payedInfo.html로 이동
document.getElementById('identifier-btn').addEventListener('click', function () {
    window.location.href = '/pages/payed/payedInfo.html'; // payedInfo.html 경로로 이동
});
// 납부자 버튼 클릭 시 payedInfo.html로 이동
document.getElementById('home-btn').addEventListener('click', function () {
    // 메인 페이지 URL 요청
    fetch(`${API_BASE_URL}/api/role/main`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // 인증 토큰을 헤더에 추가
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // JSON 응답을 반환
            } else {
                throw new Error('메인 페이지 URL 요청 실패');
            }
        })
        .then(data => {
            console.log(data)
            const mainPageUrl = data.data;
            if (mainPageUrl) {
                // 서버에서 받은 메인 페이지 URL로 이동
                window.location.href = '/pages/main/' + data.data;
            } else {

            }
        })
        .catch(error => {
            console.error('메인 페이지 요청 중 오류 발생:', error);
            // 오류 발생 시 기본 페이지로 이동
            window.location.href = '/.html';
        });
});

// 납부자 버튼 클릭 시 payedInfo.html로 이동
document.getElementById('ledger-btn').addEventListener('click', function () {
    window.location.href = '/pages/ledger/role/normalLedgers.html'; // payedInfo.html 경로로 이동
});
// 납부자 버튼 클릭 시 payedInfo.html로 이동
document.getElementById('mypage-btn').addEventListener('click', function () {
    window.location.href = '/pages/mypage/myPage.html'; // payedInfo.html 경로로 이동
});