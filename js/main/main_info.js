document.addEventListener('DOMContentLoaded', function() {
    fetchUserProfile();

    // 사용자 프로필 정보를 서버에서 가져오는 함수
    function fetchUserProfile() {
        fetch('http://localhost:8080/api/users', {
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

            // 프로필 정보를 DOM에 반영
            document.querySelector('.university').textContent = `${userInfo.data.parent} ${userInfo.data.dept}`;
            document.querySelector('.name').textContent = userInfo.data.name;
            document.querySelector('.role').textContent = translatedRole;
            document.querySelector('.id').textContent = userInfo.data.number;

            
        })
        .catch(error => {
            console.error('프로필 정보를 불러오는 중 오류 발생:', error);
        });
    }
});
