document.addEventListener('DOMContentLoaded', function() {
     // 서버에서 거래내역 데이터를 받아오는 함수
    function fetchTransactionList() {
        const token = localStorage.getItem('accessToken'); // 필요한 경우 로컬스토리지에서 토큰을 불러옴
        const accessToken = `Bearer ${token}`;

        fetch('http://localhost:8080/api/transaction/latest', {
            method: 'GET',
            headers: {
                'Authorization': accessToken
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // 서버에서 JSON 응답 받음
            } else {
                throw new Error('거래내역을 불러오는 중 오류 발생');
            }
        })
        .then(transactionData => {
            if (transactionData.data.transactions && transactionData.data.transactions.length > 0) {
                displayTransactionList(transactionData.data.transactions); // 거래 내역을 표시
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

    // 페이지가 로드되면 거래내역을 불러옴
    fetchTransactionList();
    fetchAccountBalance()
});

function fetchAccountBalance() {
    const token = localStorage.getItem('accessToken'); // 로컬스토리지에서 토큰을 불러옴
    const accessToken = `Bearer ${token}`;

    fetch('http://localhost:8080/api/transaction/balance', {
        method: 'GET',
        headers: {
            'Authorization': accessToken
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // 서버에서 JSON 응답 받음
        } else {
            throw new Error('잔액 정보를 불러오는 중 오류 발생');
        }
    })
    .then(balanceData => {
        if (balanceData.data) {
            displayAccountBalance(balanceData.data); // 잔액을 표시
        } else {
            displayNoAccountInfo(); // 계좌 정보가 없을 때의 처리
        }
    })
    .catch(error => {
        console.error('잔액 조회 요청 중 오류 발생:', error);
        displayNoAccountInfo(); // 오류 발생 시에도 계좌 정보 없음을 처리
    });
}

// 계좌 정보가 없을 때 처리하는 함수
function displayNoAccountInfo() {
    const accountInfoDiv = document.querySelector('.account-info');
    accountInfoDiv.innerHTML = `
        <p>계좌 정보가 없습니다.</p>
        <p>버튼을 눌러 정보를 추가해 주세요.</p>
    `;
    document.querySelector('.add-account-btn').style.display = 'block'; // 등록 버튼 표시
}

// 잔액을 표시하는 함수
function displayAccountBalance(balance) {
    // 소수점 아래가 .0이면 정수로 변환
    const formattedBalance = balance % 1 === 0 ? parseInt(balance) : balance;

    const accountInfoDiv = document.querySelector('.account-info');
    accountInfoDiv.innerHTML = `
        <span style="font-size: 40px; font-weight: bold; color: #343a40;">${formatAmount(formattedBalance)}</span>
        <span style="font-size:24px;">원</span>
    `;
    document.querySelector('.add-account-btn').style.display = 'none'; // 등록 버튼 숨기기

    // 새로고침 버튼 추가
    const refreshBtn = document.createElement('button');
    refreshBtn.classList.add('refresh-btn');
    refreshBtn.innerHTML = '<img style src="../../resource/icons/icons8-새롭게-하다-32.png">';
    accountInfoDiv.appendChild(refreshBtn); // 새로고침 버튼을 추가

    // 새로고침 버튼 클릭 이벤트
    refreshBtn.addEventListener('click', function() {
        location.reload(); // 페이지 새로고침
    });
}

// 금액 형식 지정 함수 (3자리 콤마 구분 추가)
function formatAmount(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function myPage() {
    alert('마이페이지를 클릭했습니다.');
}

function registerLedger() {
    alert('장부 등록하기를 클릭했습니다.');
}

function viewLedger() {
    window.location.href = '../ledger/viewLedger.html';
}

function registerReceipt() {
    window.location.href = '../receipt/uploadReceipt.html';
}

function viewNonApproveLedger() {
    window.location.href = '../ledger/viewNonApproveLedger.html';
}
