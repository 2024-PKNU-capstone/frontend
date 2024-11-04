// 초기 페이지 번호 설정
let currentPage = 1;
const token = localStorage.getItem('accessToken'); // 필요한 경우 로컬스토리지에서 토큰을 불러옴
const accessToken = `Bearer ${token}`;

// 장부 리스트를 서버에서 불러오는 함수
function loadAccountBooks() {
    $.ajax({
        url: 'http://localhost:8080/api/account-books',  // api명세서 url
        type: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": accessToken
        },
        data: {
            status: "PUBLIC",
            toDate:"2025-09-15T10:30",
            fromDate:"2024-01-15T10:30",
             // 공개된 장부 조회
            page: currentPage
        },
        success: function(response) {
            if (response.code === 200) {
                console.log(response)
                displayAccountBooks(response.data.content);
                currentPage++;  // 다음 페이지 번호로 업데이트
            }
        },
        error: function(xhr) {
            alert("장부 데이터를 불러오는데 실패했습니다: " + xhr.responseText);
        }
    });
}

// 장부 리스트를 화면에 표시하는 함수
function displayAccountBooks(accountBooks) {
    const listContainer = $('#account-book-list');
    
    // 각 장부 항목을 반복하며 화면에 추가
    accountBooks.forEach(book => {
        console.log(book)
        const item = `
            <div class="account-book-item">
                <h3>${book.title}</h3>
                <p>금액: ${book.amount}원</p>
                <p>문서 번호: ${book.docNum}</p>
                <button class="detail-btn" onclick="window.location.href='../../pages/ledger/viiewLedgerDetail.html'" style="float: right;">
                    상세보기
                </button>
            </div>
            <hr>
        `;
        listContainer.append(item);
    });
}

// 페이지 로드 시 첫 번째 장부 리스트 로드
$(document).ready(function() {
    loadAccountBooks();

    // 더 불러오기 버튼 클릭 이벤트
    $('#load-more').click(function() {
        loadAccountBooks();
    });
});