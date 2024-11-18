 // 체크박스 상태에 따라 버튼 활성화/비활성화 설정
document.getElementById('consent').addEventListener('change', function() {
  const delegateBtn = document.getElementById('delegate-btn');
  delegateBtn.disabled = !this.checked;  // 체크되면 버튼 활성화, 아니면 비활성화
});

$(document).ready(function() {
  // '위임하기' 버튼 클릭 시
  $('#delegate-btn').on('click', function() {
      // 입력된 데이터 가져오기
      const name = $('#name').val();
      const studentId = $('#student-id').val();

      // 입력 유효성 검사
      if (!name || !studentId) {
          alert("모든 필드를 입력하세요.");
          return;
      }

      // AJAX 요청
      $.ajax({
          url: 'http://54.180.138.130:8080/api/users/delegate',  // API 엔드포인트 URL -> 나중에 확인해야함
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': '본인 인증 JWT'  // JWT 토큰 삽입
          },
          data: JSON.stringify({
              name: name,
              number: studentId
          }),
          success: function(response) {
              // 성공적으로 위임된 경우
              if (response.code === 200) {
                  alert(response.message);  // "위임하기 성공"
              }
          },
          error: function(xhr) {
              // 에러 응답 처리
              const errorResponse = xhr.responseJSON;
              if (xhr.status === 400) {
                  // 이름 입력 오류
                  if (errorResponse.message.includes('이름')) {
                      alert("이름 입력값이 유효하지 않습니다.");
                  }
                  // 학번 입력 오류
                  else if (errorResponse.message.includes('학번')) {
                      alert("학번 입력값이 유효하지 않습니다.");
                  } else {
                      alert("알 수 없는 오류가 발생했습니다.");
                  }
              } else {
                  alert("서버에 문제가 있습니다. 다시 시도하세요.");
              }
          }
      });
  });
});