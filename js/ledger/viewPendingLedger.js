// 로컬 스토리지에서 Access Token을 가져옴
const token = localStorage.getItem('accessToken');
const accessToken = `Bearer ${token}`;

// 초기 페이지 번호 설정
let currentPage = 1;

// 장부 리스트를 서버에서 불러오는 함수
function loadAccountBooks() {
    $.ajax({
        url: 'http://localhost:8080/api/?', // 나중에 수정
        type: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": accessToken
        },
        data: {
            status: "PUBLIC", // 미감사 장부 조회
            page: currentPage
        },
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
            <div class="transaction-item" onclick="location.href='./approveLedgerDetail.html?docNum=${book.docNum}'">
                <span class="dot"></span>
                <div class="transaction-info">
                    <p class="transaction-title">${book.title}</p>
                    <p class="transaction-date">${book.date}</p>
                </div>
                <p class="transaction-amount">${book.amount}원</p>
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
