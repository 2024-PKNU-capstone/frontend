$(document).ready(function() {
  // 서버에서 납부자 목록 조회
  function loadPayerList() {
    $.ajax({
      url: '/api/users/payed',  // URL
      type: 'GET',
      headers: {
        "Authorization": "Bearer 본인 인증 JWT" // JWT 토큰 설정
      },
      success: function(response, status, xhr) {
        if (response.code === 200) {
          displayPayers(response.body); // 성공 시 납부자 목록 표시
        }
      },
      error: function(xhr, status, error) {
        alert("납부자 목록 조회 실패: " + xhr.responseText);
      }
    });
  }

  // 납부자 목록 화면에 표시
  function displayPayers(payers) {
    const listContainer = $('#payer-list');
    listContainer.empty(); // 기존 목록 초기화
    
    payers.forEach(payer => {
      const item = `
        <div class="payer-item">
          <h2>${payer.name}</h2>
          <p>학번: ${payer.number}</p>
          <p>납부 날짜: ${payer.payedDate}</p>
        </div>
      `;
      listContainer.append(item);
    });
  }

  loadPayerList(); // 페이지 로드 시 납부자 목록 조회
});
