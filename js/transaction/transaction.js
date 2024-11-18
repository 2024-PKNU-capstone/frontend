import { API_BASE_URL} from '../../config.js';
document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 0;
    let totalPages = Infinity; // 초기에는 무한대로 설정
    const token = localStorage.getItem('accessToken');
    const accessToken = `Bearer ${token}`;
    const transactionListDiv = document.getElementById('transaction-list');

    // 무한 스크롤 트리거 요소 추가
    const loadMoreTrigger = document.createElement('div');
    loadMoreTrigger.id = 'loadMoreTrigger';
    transactionListDiv.after(loadMoreTrigger); // 거래내역 목록 아래에 트리거 추가

    fetchTransactions(); // 페이지 시작 시 거래내역 업데이트 요청 추가

    // 거래내역을 업데이트하는 함수
    function fetchTransactions() {
        fetch(`${API_BASE_URL}/api/oauth/transactions`, {
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
    fetchTransactionList(currentPage, formatDateInput(fromDate), formatDateInput(toDate));

    // 조회 버튼 클릭 이벤트 추가
    document.getElementById('searchBtn').addEventListener('click', function () {
        currentPage = 0; // 페이지 초기화
        transactionListDiv.innerHTML = ''; // 거래 목록 초기화
        fetchTransactionList(currentPage, document.getElementById('fromDate').value, document.getElementById('toDate').value);
    });

    // 거래내역을 업데이트하는 함수
    function fetchTransactionList(page, fromDate, toDate) {
        const url = new URL(`${API_BASE_URL}/api/transaction/all/${page}`);
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
                return response.json();
            } else {
                throw new Error('거래내역을 불러오는 중 오류 발생');
            }
        })
        .then(transactionData => {
            if (transactionData.data.transactions.length > 0) {
                displayTransactionList(transactionData.data.transactions);
                totalPages = transactionData.data.totalPages; // 전체 페이지 수 업데이트
                currentPage++; // 다음 페이지로 설정
            } else {
                console.log("거래 내역이 없습니다.");
                if (currentPage === 0) {
                    transactionListDiv.innerHTML = "<p>거래 내역이 없습니다.</p>";
                }
            }
        })
        .catch(error => {
            console.error('거래내역 요청 중 오류 발생:', error);
        });
    }

    // 거래내역을 HTML에 표시하는 함수
    function displayTransactionList(transactions) {
        transactions.forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.classList.add('transaction-item');

            // 금액을 숫자로 변환
            const amount = parseFloat(transaction.amount);
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

    // Intersection Observer를 사용하여 무한 스크롤 구현
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
            fetchTransactionList(currentPage, document.getElementById('fromDate').value, document.getElementById('toDate').value);
        }
    });

    // 트리거 요소 관찰 시작
    observer.observe(loadMoreTrigger);

    // "See all" 클릭 시 거래내역 페이지로 이동
    document.getElementById('seeAll').addEventListener('click', function () {
        window.location.href = '../transaction/transaction.html'; // transaction.html로 이동
    });
});
