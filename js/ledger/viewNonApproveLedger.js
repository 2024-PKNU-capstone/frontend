$(document).ready(function () {
    const accessToken = `Bearer ${token}`;

    // 미등록 장부 리스트를 불러오는 함수
    function loadUnregisteredLedgers() {
        $.ajax({
            url: 'http://54.180.138.130:8080/api/account-books/approve',
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken
            },
            data: {
                size: 1000 // 필요한 만큼 충분히 큰 값을 설정하여 모든 데이터를 한 번에 가져옴
            },
            success: function (response) {
                if (response.code === 200) {
                    const transactions = response.data.transactions;
                    if (transactions.length > 0) {
                        displayTransactions(transactions); // 데이터를 화면에 표시
                    } else {
                        alert("불러올 미등록 장부가 없습니다.");
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

    // 초기 데이터 로드
    loadUnregisteredLedgers();
});
