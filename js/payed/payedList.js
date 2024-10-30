$(document).ready(function() { 
  // 문서가 완전히 로드된 후 실행할 함수를 정의합니다.
  // jQuery의 $(document).ready()는 문서가 준비되었을 때 자동으로 호출됩니다.
  
  // 서버에서 납부자 목록을 가져오는 함수 정의
  function loadPayerList() {
    // jQuery의 $.ajax() 함수를 사용해 비동기식으로 서버에 GET 요청을 보냅니다.
    $.ajax({
      url: '/api/users/payed',  // 실제 API 엔드포인트 URL을 설정합니다.
      type: 'GET', // HTTP GET 메서드를 사용해 데이터를 가져옵니다.
      headers: {
        "Authorization": "Bearer 본인 인증 JWT" // 요청 헤더에 JWT 토큰을 설정하여 사용자 인증을 수행합니다.
      },
      success: function(response, status, xhr) { 
        // 요청이 성공적으로 완료되었을 때 실행되는 콜백 함수입니다.
        if (response.code === 200) { 
          // 서버에서 받은 응답 코드가 200인 경우 (즉, 정상 응답일 때)
          displayPayers(response.body); // displayPayers 함수를 호출해 납부자 목록을 화면에 표시합니다.
        }
      },
      error: function(xhr, status, error) { 
        // 요청이 실패했을 때 실행되는 콜백 함수입니다.
        alert("납부자 목록 조회 실패: " + xhr.responseText); // 오류 메시지를 경고창으로 출력합니다.
      }
    });
  }

  // 납부자 목록을 화면에 표시하는 함수
  function displayPayers(payers) {
    const listContainer = $('#payer-list'); // 납부자 목록을 표시할 HTML 요소를 선택합니다.
    listContainer.empty(); // 기존에 표시된 목록이 있다면 초기화하여 중복 표시되지 않도록 합니다.
    
    // 서버에서 받은 각 납부자 데이터를 화면에 표시
    payers.forEach(payer => { 
      // payers 배열을 순회하며 각 납부자 데이터를 HTML 요소로 생성합니다.
      const item = `
        <div class="payer-item">
          <h2>${payer.contributorName}</h2> <!-- 납부자 이름 표시 -->
          <p>납부 금액: ${payer.amount}</p> <!-- 납부 금액 표시 -->
          <p>납부 날짜: ${payer.paymentDate}</p> <!-- 납부 날짜 표시 -->
        </div>
      `;
      listContainer.append(item); // 생성된 HTML을 납부자 목록 컨테이너에 추가합니다.
    });
  }

  loadPayerList(); // 페이지가 로드될 때 납부자 목록을 자동으로 조회하여 표시합니다.
});