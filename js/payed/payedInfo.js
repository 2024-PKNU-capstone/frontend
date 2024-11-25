import { API_BASE_URL} from '../../config.js';

// 페이지 로딩 시 실행될 함수
document.addEventListener("DOMContentLoaded", () => {
    waitForProfileSectionLoaded(checkPaymentStatus);
});

function waitForProfileSectionLoaded(callback) {
    const interval = setInterval(() => {
        const university = document.querySelector(".profile-section .university").textContent;
        const name = document.querySelector(".profile-section .name").textContent;
        const role = document.querySelector(".profile-section .role").textContent;
        const studentId = document.querySelector(".profile-section .id").textContent;

        // 모든 데이터가 로딩되었는지 확인
        if (university && name && role && studentId) {
            clearInterval(interval); // 반복 중단
            callback(); // 데이터 로딩 후 실행
        }
    }, 100); // 100ms 간격으로 확인
}

function checkPaymentStatus() {
    // 서버로 GET 요청을 보냄
    fetch(`${API_BASE_URL}/api/users/get-is-payed`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // JWT 토큰 추가
            "Content-Type": "application/json"
        }
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        if (data && data.data=== true) {
            // 납부 상태가 true인 경우: payed-card를 업데이트
            const nameElement = document.querySelector('.profile-left .name');
            const name = nameElement ? nameElement.textContent.trim() : null;

            const university = document.querySelector(".profile-section .university").textContent;
            const studentId = document.querySelector(".profile-section .id").textContent;
            console.log(name);

            // payed-card에 데이터 적용
            document.getElementById("card-university").textContent = university;
            document.getElementById("card-student-id").textContent = studentId;
            document.getElementById("card-name").textContent = name;
            document.getElementById("certification-date").textContent = "2024-11-25 납부 인증완료";
            
            // payed-card를 표시
            document.querySelector(".payed-card").style.display = "block";
            // payed-card를 표시
            document.querySelector(".add-account-btn").style.display = "none";

        } else {
            // 납부 상태가 false인 경우: 기존 profile-section 유지

            // 버튼 표시
            document.getElementById("add-account-btn").style.display = "block";
            document.getElementById("certification-mark").style.display = "none";

            // 메시지 표시
            const payedMessage = document.getElementById("payed-message");
            payedMessage.classList.remove("hidden");
        }
    })
    .catch((error) => {
        console.error("오류 발생:", error);
    });
}


document.getElementById('add-account-btn').addEventListener('click', function () {
    // 이름을 가져옵니다.
    const nameElement = document.querySelector('.profile-left .name');
    const name = nameElement ? nameElement.textContent.trim() : null;
    console.log(name);
    if (!name) {
        alert('이름을 찾을 수 없습니다.');
        return;
    }

    // 요청을 보냅니다.
    fetch(`${API_BASE_URL}/api/transaction/payed?name=${encodeURIComponent(name)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // JWT 토큰 추가
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('서버 응답이 올바르지 않습니다.');
            }
            return response.json();
        })
        .then(data => {
            if (data.code === 200) {
                const transactions = data.data.transactions; // 받아온 거래내역 리스트
                console.log(transactions)
                renderPayedList(transactions);
                openModal(); // 모달창 열기
            } else {
                alert(data.message || '거래내역을 가져오는 데 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('오류 발생:', error);
            alert('거래내역을 가져오는 중 오류가 발생했습니다.');
        });
});

// 거래내역을 렌더링합니다.
function renderPayedList(payedList) {
    const payedListContainer = document.getElementById('payed-list');
    payedListContainer.innerHTML = ''; // 기존 리스트 초기화

    payedList.forEach((item, index) => {
        const listItem = document.createElement('div');
        listItem.className = 'payed-item';
        listItem.innerHTML = `
            <p>${item.description}</p>
            <p>${item.date} ${item.time}</p>
        `;
        listItem.dataset.index = index;
        listItem.addEventListener('click', () => selectPayedItem(index));
        payedListContainer.appendChild(listItem);
    });
}

// 선택한 항목 강조
let selectedPayedIndex = null;

function selectPayedItem(index) {
    const payedItems = document.querySelectorAll('.payed-item');
    payedItems.forEach((item, idx) => {
        if (idx === index) {
            item.classList.add('selected');
            selectedPayedIndex = index;
        } else {
            item.classList.remove('selected');
        }
    });
}

const modal = document.getElementById('payedModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// 모달창 열기
function openModal() {
    modal.style.display = 'block';
}

// 모달창 닫기
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};


function registerPayedInfo() {
    if (selectedPayedIndex === null) {
        alert('항목을 선택해주세요!');
        return;
    }

    fetch(`${API_BASE_URL}/api/users/update-payed-info`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
        .then(response => {
            if (response.ok) {
                alert('납부 정보가 성공적으로 등록되었습니다.');
                modal.style.display = 'none'; // 모달창 닫기
            } else {
                alert('등록 중 오류가 발생했습니다.');
            }
        })
        .catch(error => {
            console.error('등록 요청 중 오류:', error);
        });
}

window.registerPayedInfo=registerPayedInfo;
window.renderPayedList=renderPayedList;
