document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('signupModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const linkResultInput = document.getElementById('linkResultText'); // input 요소 선택
    const copyLinkBtn = document.getElementById('copyLinkBtn');

    // 모달 열기 및 서버 요청
    openModalBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        linkResultInput.value = '요청 중...'; // 초기 상태 표시
        copyLinkBtn.style.display = 'none'; // 복사 버튼 숨기기

        // 서버에 GET 요청
        fetch('http://54.180.138.130:8080/api/univ/signup-link', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // 응답 데이터 확인
            if (data.data) {
                linkResultInput.value = data.data; // input 요소에 링크 삽입
                copyLinkBtn.style.display = 'inline-block'; // 복사 버튼 표시

                // 복사 버튼 클릭 이벤트
                copyLinkBtn.onclick = function() {
                    navigator.clipboard.writeText(data.data)
                        .then(() => {
                            alert('링크가 복사되었습니다.');
                        })
                        .catch(err => {
                            console.error('복사 중 오류 발생:', err);
                        });
                };
            } else {
                linkResultInput.value = '링크 생성에 실패했습니다.';
                copyLinkBtn.style.display = 'none'; // 실패 시 복사 버튼 숨기기
            }
        })
        .catch(error => {
            console.error('링크 생성 중 오류 발생:', error);
            linkResultInput.value = '링크 생성 중 오류가 발생했습니다.';
            copyLinkBtn.style.display = 'none'; // 오류 발생 시 복사 버튼 숨기기
        });
    });

    // 모달 닫기
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        linkResultInput.value = ''; // 모달 닫을 때 결과 초기화
        copyLinkBtn.style.display = 'none'; // 모달 닫을 때 복사 버튼 숨기기
    });
});
