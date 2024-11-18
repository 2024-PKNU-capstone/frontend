import { API_BASE_URL} from '../../config.js';

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            loginId: email,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`로그인 요청 실패, 상태 코드: ${response.status}`);
        }
        return response.json(); // 응답이 JSON일 때만 파싱
    })
    .then(data => {
        if (data.code === 200) {
            const accessToken = data.data.accessToken;
            localStorage.setItem('accessToken', accessToken);
            console.log(accessToken);
            alert('로그인 성공 ' + accessToken);

            // 메인 페이지 URL 요청
            return fetch(`${API_BASE_URL}/api/role/main`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // 인증 토큰을 헤더에 추가
                    'Content-Type': 'application/json'
                }
            });
        } else {
            alert('로그인 실패: ' + data.message);
            throw new Error('로그인 실패');
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`메인 페이지 요청 실패, 상태 코드: ${response.status}`);
        }
        return response.json(); // 응답이 JSON일 때만 파싱
    })
    .then(mainData => {
        if (mainData.code === 200) {
            // 서버에서 받은 메인 페이지 URL로 이동
            window.location.href = '../../pages/main/' + mainData.data;
        } else {
            alert('메인 페이지 이동 실패: ' + mainData.message);
        }
    })
    .catch(error => {
        console.error('오류 발생:', error);
        alert('오류가 발생했습니다. ' + error.message);
    });
}

// window 객체에 함수 등록
window.login = login;