document.addEventListener('DOMContentLoaded', function() {
    fetchTransactions(); // 페이지 시작 시 거래내역 업데이트 요청 추가

    // 거래내역을 업데이트하는 함수
    function fetchTransactions() {
        const token = localStorage.getItem('accessToken');
        const accessToken = `Bearer ${token}`;

        fetch('http://localhost:8080/api/oauth/transactions', {
            method: 'GET',
            headers: {
                'Authorization': accessToken
            }
        })
        .then(response => {
            if (response.ok) {
                console.log("거래내역 업데이트 성공");
            } else {
                console.error('거래내역 업데이트 실패');
            }
        })
        .catch(error => {
            console.error('거래내역 요청 중 오류 발생:', error);
        });
    }

    // 기본 날짜 설정: 최근 3개월
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 3);

    // 날짜 포맷 변환 함수
    function formatDateInput(date) {
        return date.toISOString().split('T')[0];
    }

    // 날짜 입력 필드 초기화
    document.getElementById('fromDate').value = formatDateInput(fromDate);
    document.getElementById('toDate').value = formatDateInput(toDate);

    // 페이지가 로드되면 기본 날짜로 거래내역을 불러옴
    fetchTransactionList(0, formatDateInput(fromDate), formatDateInput(toDate));

    // 조회 버튼 클릭 이벤트 추가
    document.getElementById('searchBtn').addEventListener('click', function() {
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;
        fetchTransactionList(0, fromDate, toDate);
    });

    // 거래내역을 업데이트하는 함수
    function fetchTransactionList(page, fromDate, toDate) {
        const token = localStorage.getItem('accessToken');
        const accessToken = `Bearer ${token}`;

        const url = new URL(`http://localhost:8080/api/transaction/all/${page}`);
        url.searchParams.append('fromDate', fromDate);
        url.searchParams.append('toDate', toDate);

        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': accessToken
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // JSON 응답 받음
            } else {
                throw new Error('거래내역을 불러오는 중 오류 발생');
            }
        })
        .then(transactionData => {
            if (transactionData.data.transactions && transactionData.data.transactions.length > 0) {
                displayTransactionList(transactionData.data.transactions); // 거래 내역을 표시
                setupPagination(transactionData.data.totalPages, page, fromDate, toDate); // 페이지네이션 설정
            } else {
                console.log("거래 내역이 없습니다.");
                document.querySelector('.transaction-list').innerHTML = "<p>거래 내역이 없습니다.</p>";
            }
        })
        .catch(error => {
            console.error('거래내역 요청 중 오류 발생:', error);
        });
    }

    // 거래내역을 HTML에 표시하는 함수
    function displayTransactionList(transactions) {
        const transactionListDiv = document.getElementById('transaction-list');
        transactionListDiv.innerHTML = ''; // 기존 목록 초기화

        transactions.forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.classList.add('transaction-item');

            // 금액을 숫자로 변환
            const amount = parseFloat(transaction.amount);

            // amount에 따라 positive/negative 클래스를 설정
            const amountClass = amount >= 0 ? 'positive' : 'negative';

            transactionItem.innerHTML = `
                <div class="transaction-detail">
                    <p class="transaction-description"><strong>${transaction.description}</strong></p>
                    <p class="transaction-date">${formatDate(transaction.date)}</p>
                </div>
                <div class="transaction-amount">
                    <p class="${amountClass}">${formatAmount(amount)}원</p>
                </div>`;
            
            transactionListDiv.appendChild(transactionItem);
        });
    }

    // 페이지네이션 버튼을 생성하는 함수
    function setupPagination(totalPages, currentPage, fromDate, toDate) {
        const paginationDiv = document.getElementById('pagination');
        paginationDiv.innerHTML = ''; // 기존 페이지네이션 초기화

        for (let i = 0; i < totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i + 1;
            pageButton.classList.add('page-btn');
            if (i === currentPage) {
                pageButton.classList.add('active');
            }

            pageButton.addEventListener('click', function() {
                fetchTransactionList(i, fromDate, toDate); // 해당 페이지의 거래내역을 가져옴
            });

            paginationDiv.appendChild(pageButton);
        }
    }

    // 날짜 형식을 원하는 형태로 변환하는 함수
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', options);
    }

    // 금액 형식 지정 함수 (3자리 콤마 구분 추가)
    function formatAmount(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});

// 메인 화면으로 돌아가는 함수
function goToMain() {
    window.location.href = '../../main.html';
}

// "See all" 클릭 시 거래내역 페이지로 이동
document.getElementById('seeAll').addEventListener('click', function() {
    window.location.href = '../transaction/transaction.html'; // transaction.html로 이동
});