
// DOM 요소 가져오기
const nameInput = document.getElementById('name'); // 이름
const studentIdInput = document.getElementById('student-id'); // 학번
const consentCheckbox = document.getElementById('consent'); // 동의합니다
const delegateButton = document.getElementById('delegate-btn'); // 위임 버튼
const roleRadioButtons = document.querySelectorAll('input[name="role"]');

// 동의 체크박스와 역할 선택이 모두 완료되면 버튼 활성화
function updateButtonState() {
    const isRoleSelected = Array.from(roleRadioButtons).some(radio => radio.checked);
    const isFormValid = nameInput.value && studentIdInput.value && consentCheckbox.checked && isRoleSelected;
    delegateButton.disabled = !isFormValid;
}

// 각 요소에 이벤트 리스너 추가
nameInput.addEventListener('input', updateButtonState);
studentIdInput.addEventListener('input', updateButtonState);
consentCheckbox.addEventListener('change', updateButtonState);
roleRadioButtons.forEach(radio => radio.addEventListener('change', updateButtonState));


$(document).ready(function() { // ready를 통해 DOM이 완전 준비되면 js실행하게!!
  // '위임하기' 버튼 클릭 시
  $('#delegate-btn').on('click', function() {
      // 입력된 데이터 가져오기
      const name = $('#name').val(); // 이름 가져옴
      const studentId = $('#student-id').val(); // 학번 가져옴
      const role = $('input[name="role"]:checked').val();

      // 동의 여부 확인
      const consent = $('#consent').is(':checked');
      if (!consent) {
          alert("동의해야 위임할 수 있습니다.");
          return;
      }

      // 입력 유효성 검사
      if (!name || !studentId || !role) {
          alert("모든 필드를 입력하세요.");
          return;
      }

      // AJAX 요청
      $.ajax({
          url: '/api/users/appoint',  // API 엔드포인트 URL? -> 맞는지 체크해야됨
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': '본인 인증 JWT'  // JWT 토큰 삽입
          },
          data: JSON.stringify({
              name: name,
              number: studentId,
              role: role
          }),
          success: function(response) {
              // 성공적으로 임명된 경우
              if (response.code === 200) {
                  alert(response.message);  // "부회장(총무) 임명하기 성공"
              }
          },
          error: function(xhr) {
              // 에러 응답 처리
              const errorResponse = xhr.responseJSON;
              if (xhr.status === 400) {
                  if (errorResponse.message.includes('이름')) {
                      alert("이름 입력값이 유효하지 않습니다.");
                  } else if (errorResponse.message.includes('학번')) {
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
