$(document).ready(function () {
  let currentPage = 1; // 현재 페이지 번호
  const pageSize = 10; // 한 번에 가져올 데이터 수
  const jwtToken = "Bearer {JWT_TOKEN}"; // JWT 토큰
  const apiUrl = "/api/transaction/not-writed"; // API 엔드포인트 URL -> 나중에 다시 확인

  // 미등록 장부 리스트를 불러오는 함수
  function loadUnregisteredLedgers(page) {
      $.ajax({
          url: apiUrl,
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": jwtToken
          },
          data: {
              page: page,
              size: pageSize
          },
          success: function (response) {
              if (response.code === 200) {
                  // 영수증 조회 성공
                  const transactions = response.data.transactions;
                  if (transactions.length > 0) {
                      displayTransactions(transactions); // 데이터를 화면에 표시
                  }

                  // 페이지 갱신
                  currentPage = response.data.current_page;
                  if (currentPage >= response.data.total_pages) {
                      $("#load-more").hide(); // 더 불러오기 버튼 숨김
                  }
              }
          },
          error: function (xhr) {
              // 에러 응답 처리
              if (xhr.status === 400) {
                  alert("장부 조회 실패: " + xhr.responseJSON.error.reason);
              } else if (xhr.status === 401) {
                  alert("요청 권한이 없습니다.");
              } else {
                  alert("서버 오류가 발생했습니다. 다시 시도하세요.");
              }
          }
      });
  }

  // 데이터를 화면에 표시하는 함수
  function displayTransactions(transactions) {
      transactions.forEach(transaction => {
          $("#unregistered-ledger-list").append(`
              <div class="ledger-item">
                  <p>상점명: ${transaction.store}</p>
                  <p>금액: ${transaction.amount}원</p>
                  <p>거래일자: ${transaction.trandate}</p>
              </div>
          `);
      });
  }

  // 더 불러오기 버튼 클릭 시 다음 페이지 로드
  $("#load-more").on("click", function () {
      loadUnregisteredLedgers(currentPage + 1);
  });

  // 초기 데이터 로드
  loadUnregisteredLedgers(currentPage);
});
