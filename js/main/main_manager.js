document.addEventListener('DOMContentLoaded', function() {
    const checkAccountBtn = document.getElementById('check-account-btn');
    
    checkAccountBtn.addEventListener('click', function() {
        const token = localStorage.getItem('accessToken');
        console.log(token);

        if (!token) {
            alert('로그인이 필요합니다.');
            window.location.href = '../login/login.html'; // 로그인 페이지로 이동
            return;
        }

        const accessToken = `Bearer ${token}`;
        console.log("Authorization header:", accessToken);

        fetch('http://localhost:8080/api/oauth/open-bank', {
            method: 'GET',
            headers: {
                'Authorization': accessToken
            },
            redirect: 'manual' // 수동으로 리다이렉트 처리
        })
        .then(response => response.text())  // 서버에서 받은 문자열(URL)을 가져옴
        .then(url => {
            console.log("Redirecting to:", url);
            window.location.href = url;  // 받아온 URL로 리다이렉트
        })
        .catch(error => {
            console.error('OAuth 요청 중 오류 발생:', error);
        });
    });
});

function myPage() {
    alert('마이페이지를 클릭했습니다.');
}

function registerLedger() {
    alert('장부 등록하기를 클릭했습니다.');
}

function viewLedger() {
    window.location.href = '../ledger/viewLedger.html';
}

function registerReceipt() {
    window.location.href = '../receipt/uploadReceipt.html';
}

function viewNonApproveLedger() {
    window.location.href = '../ledger/viewNonApproveLedger.html';
}
