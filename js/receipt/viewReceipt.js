$(document).ready(function() {
    loadReceipts();
});

function loadReceipts() {
    const token = localStorage.getItem('accessToken');
    const accessToken = `Bearer ${token}`;
    
    $.ajax({
        url: 'http://localhost:8080/api/receipts',  // 실제 영수증 API URL로 변경
        type: 'GET',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": accessToken
        },
        data: {
            page: 1,    // 기본 페이지??
            from_date: "2024-01-01",
            to_date: "2025-12-31"
        },
        success: function(response) {
            if (response.code === 200) {
                displayReceipts(response.data.receipts);
            }
        },
        error: function(xhr) {
            if (xhr.status === 401) {
                $('#error-message').text("요청 권한이 없습니다.");
            } else if (xhr.status === 400) {
                $('#error-message').text("영수증 조회 실패: " + xhr.responseJSON.error.reason);
            } else {
                $('#error-message').text("영수증 데이터를 불러오는데 실패했습니다.");
            }
        }
    });
}

function displayReceipts(receipts) {
    const listContainer = $('#receipt-list');
    listContainer.empty(); // 기존 화면 내용지움

    receipts.forEach(receipt => {
        const item = `
            <div class="receipt-item">
                <h3>가게: ${receipt.store}</h3>
                <p>금액: ${receipt.amount}원</p>
                <p>날짜: ${receipt.trandate}</p>
            </div>
        `;
        listContainer.append(item);
    });
}
