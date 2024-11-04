document.addEventListener('DOMContentLoaded', function() {
    const checkAccountBtn = document.getElementById('add-account-btn');
    saveTokenToLocalStorage();
    fetchTransactions(); // 페이지 시작 시 거래내역 업데이트 요청 추가
    fetchIsVerified();

    let selectedFintechUseNum = null; // 선택한 계좌의 fintech_use_num을 저장하는 변수

    checkAccountBtn.addEventListener('click', function() {
        const token = localStorage.getItem('accessToken');
        console.log(token);

        if (!token) {
            alert('로그인이 필요합니다.');
            window.location.href = '../login/login.html'; // 로그인 페이지로 이동
            return;
        }

        const accessToken = `Bearer ${token}`;
        console.log("Authorization header:", accessToken);

        fetch('http://localhost:8080/api/oauth/open-bank', {
            method: 'GET',
            headers: {
                'Authorization': accessToken
            },
            redirect: 'manual' // 수동으로 리다이렉트 처리
        })
        .then(response => response.text())  // 서버에서 받은 문자열(URL)을 가져옴
        .then(url => {
            console.log("Redirecting to:", url);
            console.log(url);
            window.location.href = url;  // 받아온 URL로 리다이렉트
        })
        .catch(error => {
            console.error('OAuth 요청 중 오류 발생:', error);
        });
    });

    // Access Token 쿠키에서 값을 읽어 세션 스토리지에 저장하는 함수
    function saveTokenToLocalStorage() {
        const accessToken = getCookieValue('accessToken'); // 쿠키 이름을 'accessToken'으로 가정
        console.log(accessToken);
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken); 
            console.log('Access Token saved to local storage:', accessToken);
        }
    }

    // 특정 쿠키의 값을 얻는 함수
    function getCookieValue(name) {
        const cookies = document.cookie
        alert(document.cookie);
        console.log("All cookies:", cookies); // 현재 쿠키 전체를 확인
    
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            console.log(`Cookie: ${cookieName} = ${cookieValue}`); // 각 쿠키 이름과 값을 확인
    
            if (cookieName === name) {
                return decodeURIComponent(cookieValue); // URL 인코딩 된 값이 있을 수 있으므로 디코딩
            }
        }
        return null;
    }

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


    // is-verified 요청 함수
    function fetchIsVerified() {
        const token = localStorage.getItem('accessToken');
        const accessToken = `Bearer ${token}`;

        fetch('http://localhost:8080/api/oauth/is-verified', {
            method: 'GET',
            headers: {
                'Authorization': accessToken
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // 서버에서 JSON 응답 받음
            } else {
                throw new Error('검증 요청 중 오류 발생');
            }
        })
        .then(verificationResult => {
            if (verificationResult === true) {
                openModalWithAccountInfo(); // 검증된 경우 모달 창 열기
            } else {
                console.log('검증되지 않은 사용자');
            }
        })
        .catch(error => {
            console.error('검증 요청 중 오류 발생:', error);
        });
    }

    function openModalWithAccountInfo() {
        const modal = document.getElementById('accountModal');
        const closeModal = document.getElementsByClassName('close')[0];

        modal.style.display = 'block'; // 모달을 열기

        closeModal.onclick = function () {
            modal.style.display = 'none'; // 모달 닫기
        };

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };

        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            window.location.href = '../login/login.html'; // 로그인 페이지로 이동
            return;
        }

        const accessToken = `Bearer ${token}`;
        fetchAccountList(accessToken); // 계좌 정보를 가져오는 함수 호출

        const registerAccountBtn = document.getElementById('register-account-btn');
        registerAccountBtn.onclick = function() {
            if (selectedFintechUseNum) {
                registerAccount(selectedFintechUseNum); // 선택된 계좌를 등록
            } else {
                alert('계좌를 선택하세요.');
            }
        };
    }

    // 서버에 계좌 목록 요청을 보내는 함수
    function fetchAccountList(accessToken) {
        console.log(accessToken)
        fetch('http://localhost:8080/api/oauth/account-list', {
            method: 'GET',
            headers: {
                'Authorization': accessToken
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // 서버에서 JSON 응답 받음
            } else {
                throw new Error('계좌 목록을 불러오는 중 오류 발생');
            }
        })
        .then(accountData => {
            displayAccountList(accountData.data.res_list); // 계좌 목록을 표시
        })
        .catch(error => {
            console.error('계좌 목록 요청 중 오류 발생:', error);
        });
    }

    function displayAccountList(accountList) {
        const accountListDiv = document.getElementById('account-list');
        accountListDiv.innerHTML = ''; // 기존 목록 초기화

        accountList.forEach(account => {
            const accountItem = document.createElement('div');
            accountItem.classList.add('account-item');

            accountItem.innerHTML = `
                <p><strong>${account.account_holder_name}</strong></p>
                <p>${account.bank_name}</p>
                <p>${account.account_num_masked}</p>
                <p>${account.account_alias}</p>
            `;

            accountItem.onclick = function() {
                selectedFintechUseNum = account.fintech_use_num; // 선택한 계좌의 fintech_use_num 저장
                highlightSelectedAccount(accountItem); // 선택한 계좌 강조
            };

            accountListDiv.appendChild(accountItem);
        });
    }

    // 선택된 계좌 강조 표시
    function highlightSelectedAccount(selectedItem) {
        const accountItems = document.getElementsByClassName('account-item');
        for (let i = 0; i < accountItems.length; i++) {
            accountItems[i].classList.remove('selected'); // 기존 선택된 항목 초기화
        }
        selectedItem.classList.add('selected'); // 선택된 항목 강조
    }

    // 계좌 등록 요청 함수
    function registerAccount(fintechUseNum) {
        console.log(fintechUseNum)
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            window.location.href = '../login/login.html';
            return;
        }

        const accessToken = `Bearer ${token}`;
        fetch('http://localhost:8080/api/account/register?fintech_use_num='+fintechUseNum, {
            method: 'POST',
            headers: {
                'Authorization': accessToken,
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (response.ok) {
                alert('계좌가 등록되었습니다.');
                document.getElementById('accountModal').style.display = 'none'; // 등록 후 모달 닫기
            } else {
                throw new Error('계좌 등록 중 오류 발생');
            }
        })
        .catch(error => {
            console.error('계좌 등록 요청 중 오류 발생:', error);
        });
    }

    // localStorage의 변경을 감지하여 최신 토큰을 업데이트
    window.addEventListener('storage', function(event) {
        if (event.key === 'accessToken') {
            console.log('토큰이 업데이트되었습니다:', event.newValue);
            updateTokenFromLocalStorage(); // 새로운 토큰으로 갱신
        }
    });

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

    // "See all" 클릭 시 거래내역 페이지로 이동
    document.getElementById('seeAll').addEventListener('click', function() {
        window.location.href = '../../pages/transaction/transaction.html'; // transaction.html로 이동
    });
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


