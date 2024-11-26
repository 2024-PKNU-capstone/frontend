import { API_BASE_URL} from '../../config.js';

document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 0;
    let totalPages = Infinity; // 초기화 값으로 설정
    const transactionListDiv = document.getElementById('transaction-list'); // 거래내역을 표시할 DIV
    const token = localStorage.getItem('accessToken');
    const accessToken = `Bearer ${token}`;
    const API_URL = `${API_BASE_URL}/api/transaction/notWrited`; // 새로운 API URL

    // 무한 스크롤 트리거
    const loadMoreTrigger = document.createElement('div');
    loadMoreTrigger.id = 'loadMoreTrigger';
    transactionListDiv.after(loadMoreTrigger);

    let isLoading = false;
    // 초기 데이터 로드
    fetchTransactionList(currentPage);

    function fetchTransactionList(page) {
        if (isLoading || page >= totalPages) return; // 로딩 중이거나 마지막 페이지일 경우 중단
        isLoading = true;
        currentPage++; // 페이지를 즉시 증가

        fetch(`${API_URL}/${page}`, {
            method: 'GET',
            headers: {
                'Authorization': accessToken,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.ok ? response.json() : Promise.reject('데이터 로드 실패'))
            .then(data => {
                console.log(data)
                const { transactions, totalPages: total } = data.data;
                if (transactions && transactions.length > 0) {
                    displayTransactions(transactions);
                    totalPages = total; // 전체 페이지 수 업데이트
                } else if (page === 0) {
                    transactionListDiv.innerHTML = '<p>표시할 거래 내역이 없습니다.</p>';
                }
            })
            .catch(error => console.error('오류 발생:', error))
            .finally(() => isLoading = false); // 로딩 완료
    }


    function displayTransactions(transactions) {
        transactions.forEach(transaction => {
            const item = document.createElement('div');
            item.className = 'transaction-item';
            item.dataset.transactionId = transaction.Id; // 거래 ID를 데이터 속성에 저장

    
            // 금액에 따른 스타일 지정
            const amount = parseFloat(transaction.amount);
            const amountClass = amount >= 0 ? 'positive' : 'negative';
    
            item.innerHTML = `
                <div class="transaction-detail">
                    <p><strong>${transaction.description || '설명 없음'}</strong></p>
                    <p>${formatDate(transaction.date)}</p>
                </div>
                <div class="transaction-amount ${amountClass}">
                    ${formatAmount(amount)}원
                </div>
            `;
    
            // 클릭 이벤트 추가
            item.addEventListener('click', function () {
                const transactionId = this.dataset.transactionId; // 데이터 속성에서 ID 가져오기
                window.location.href = `/pages/ledger/writeLedger.html?id=${transactionId}`; // 파라미터로 ID 전달
            });
    
            transactionListDiv.appendChild(item);
        });
    }
    

    // 날짜 포맷 함수
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    }

    // 금액 포맷 함수
    function formatAmount(amount) {
        return amount.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
    }

    // Intersection Observer로 무한 스크롤 구현
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
            fetchTransactionList(currentPage);
        }
    });

    // 관찰 시작
    observer.observe(loadMoreTrigger);
});
