// 초기 페이지 번호 설정
let currentPage = 1;

// 장부 리스트를 서버에서 불러오는 함수
function loadAccountBooks() {
    $.ajax({
        url: '/api/pending-account-books',  // api명세서 url -> 나중에 확인해야함
        type: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer {JWT_TOKEN}"  // 실제 JWT 토큰을 설정해야함
        },
        data: JSON.stringify({
            status: "UNAUDITED", // 미감사 장부조회
            page: currentPage
        }),
        success: function(response) {
            if (response.code === 200) {
                displayAccountBooks(response.data.accountBooks);
                currentPage++;  // 다음 페이지 번호로 업데이트
            }
        },
        error: function(xhr) {
            alert("장부 데이터를 불러오는 데 실패했습니다: " + xhr.responseText);
        }
    });
}

// 장부 리스트를 화면에 표시하는 함수
function displayAccountBooks(accountBooks) {
    const listContainer = $('#account-book-list');
    
    // 각 장부 항목을 반복하며 화면에 추가
    accountBooks.forEach(book => {
        const item = `
            <div class="account-book-item">
                <h3>${book.title}</h3>
                <p>금액: ${book.amount}원</p>
                <p>문서 번호: ${book.docNum}</p>
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