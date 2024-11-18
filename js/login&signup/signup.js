document.addEventListener('DOMContentLoaded', function() {
    // URL에서 query parameters 추출
    const urlParams = new URLSearchParams(window.location.search);
    const collegeId = urlParams.get('collegeId');
    const deptId = urlParams.get('deptId');
    const role = urlParams.get('role');

    // parentId 설정: collegeId가 있으면 그것을 사용하고, 없으면 deptId를 사용
    const parentId = collegeId ? collegeId : deptId;

    // 회원가입 버튼 클릭 이벤트
    document.querySelector('.signup-btn').addEventListener('click', function(event) {
        event.preventDefault(); // 기본 제출 이벤트 방지

        // 폼 데이터 수집
        const univ = document.getElementById('school').value;
        const college = document.getElementById('college').value;
        const dept = document.getElementById('department').value;
        const name = document.getElementById('name').value;
        const number = document.getElementById('studentId').value;
        const loginId = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // 비밀번호 일치 여부 확인
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        // RegisterRequest 생성
        const requestData = {
            univ,
            college,
            dept,
            name,
            number,
            loginId,
            password
        };

        // 서버로 POST 요청
        fetch(`http://54.180.138.130:8080/api/univ/register/${role}?parentId=${parentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                alert(data.message); // 가입 완료 메시지
                window.location.href = '/login'; // 회원가입 후 로그인 페이지로 이동 (필요 시 URL 수정)
            } else {
                alert('가입 중 오류가 발생했습니다.');
            }
        })
        .catch(error => {
            console.error('회원가입 요청 중 오류 발생:', error);
            alert('회원가입 요청 중 오류가 발생했습니다.');
        });
    });
});
