$(document).ready(function () {
  const jwtToken = "Bearer {JWT_TOKEN}"; // JWT 토큰
  const apiUrl = "/api/receipts"; // API 엔드포인트 URL

  // 영수증 조회 함수
  function loadReceipts(deptId, page = 1, fromDate = null, toDate = null) {
      const requestData = {
          dept_id: deptId,
          page: page
      };

      // 선택적으로 날짜 범위를 추가
      if (fromDate) {
          requestData.from_date = fromDate;
      }
      if (toDate) {
          requestData.to_date = toDate;
      }

      $.ajax({
          url: apiUrl,
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": jwtToken
          },
          data: JSON.stringify(requestData), // 요청 데이터
          success: function (response) {
              if (response.code === 200) {
                  // 영수증 조회 성공
                  const receipts = response.data.receipts;
                  displayReceipts(receipts); // 데이터를 화면에 표시하는 함수 displayReceipts
              }
          },
          error: function (xhr) {
              // 에러 응답 처리
              const errorResponse = xhr.responseJSON;
              if (xhr.status === 400) {
                  alert("영수증 조회 실패: " + errorResponse.error.reason);
              } else if (xhr.status === 401) {
                  alert("요청 권한이 없습니다.");
              } else {
                  alert("서버 오류가 발생했습니다. 다시 시도하세요.");
              }
          }
      });
  }

  // 영수증 데이터를 화면에 표시하는 함수
  function displayReceipts(receipts) {
      receipts.forEach(receipt => {
          $("#receipt-list").append(`
              <div class="receipt-item">
                  <p>상점명: ${receipt.store}</p>
                  <p>금액: ${receipt.amount}원</p>
                  <p>거래일자: ${receipt.trandate}</p>
              </div>
          `);
      });
  }

  // 조회 버튼 클릭 시 데이터 불러오기
  $("#search-button").on("click", function () {
      const deptId = $("#dept-id").val(); // 학과 아이디
      const page = $("#page").val() || 1; // 페이지 번호
      const fromDate = $("#from-date").val(); // 조회 시작 날짜
      const toDate = $("#to-date").val(); // 조회 종료 날짜

      if (!deptId) { // 학과 아이디가 없는 경우
          alert("학과 아이디를 입력하세요.");
          return;
      }

      // 영수증 조회 요청
      loadReceipts(deptId, page, fromDate, toDate);
  });
});