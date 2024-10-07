function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            loginId: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            // 로그인 성공 시 accessToken 저장
            const accessToken = data.data.accessToken;
            localStorage.setItem('accessToken', accessToken);
            alert('로그인 성공');
        // 메인 페이지 URL 요청
        fetch('http://localhost:8080/api/role/main', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`, // 인증 토큰을 헤더에 추가
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(mainData => {
            if (mainData.code === 200) {
                // 서버에서 받은 메인 페이지 URL로 이동
                window.location.href = '../../pages/main/' + mainData.data;
            } else {
                alert('메인 페이지 이동 실패: ' + mainData.message);
            }
        })
        .catch(error => {
            console.error('메인 페이지 요청 중 오류 발생:', error);
            alert('메인 페이지 요청 중 오류가 발생했습니다.');
        });
    } else {
        alert('로그인 실패: ' + data.message);
    }
    })
    .catch(error => {
    console.error('로그인 중 오류 발생:', error);
    alert('로그인 중 오류가 발생했습니다.');
    });
}