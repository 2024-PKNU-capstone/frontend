import { API_BASE_URL } from '../../config.js';

document.addEventListener("DOMContentLoaded", function () {
    // URL에서 transactionId 추출
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('id');

    if (!transactionId) {
        alert("잘못된 접근입니다. 거래 ID를 찾을 수 없습니다.");
        return;
    }

    // 문서번호 생성
    const documentNumber = generateDocumentNumber();

    // 문서번호를 HTML에 표시
    document.querySelector(".document-number").textContent = `문서번호 ${documentNumber}`;

    // 프로필 섹션 데이터가 로드될 때까지 기다리고 거래 상세 정보 불러오기
    waitForProfileSectionLoaded(() => loadTransactionDetail(transactionId));
});

// 프로필 섹션 데이터 로드 확인 함수
function waitForProfileSectionLoaded(callback) {
    const interval = setInterval(() => {
        const university = document.querySelector(".profile-section .university")?.textContent;
        const name = document.querySelector(".profile-section .name")?.textContent;
        const role = document.querySelector(".profile-section .role")?.textContent;
        const studentId = document.querySelector(".profile-section .id")?.textContent;

        // 모든 데이터가 로딩되었는지 확인
        if (university && name && role && studentId) {
            clearInterval(interval); // 반복 중단
            callback(); // 데이터 로딩 후 실행
        }
    }, 100); // 100ms 간격으로 확인
}

// 거래 상세 정보를 불러오는 함수
function loadTransactionDetail(transactionId) {
    const token = localStorage.getItem('accessToken');
    const accessToken = `Bearer ${token}`;

    $.ajax({
        url: `${API_BASE_URL}/api/transaction/detail`, // 상세보기 API 엔드포인트
        type: 'GET',
        headers: {
            "Authorization": accessToken
        },
        data: { transactionId },
        success: function (response) {
            if (response.code === 200) {
                populateTransactionDetails(response.data);
            } else {
                alert("거래 데이터를 불러오는데 실패했습니다.");
            }
        },
        error: function (xhr) {
            alert("거래 데이터를 불러오는데 실패했습니다: " + xhr.responseText);
        }
    });
}

// 데이터를 HTML에 채우는 함수
function populateTransactionDetails(data) {
    // university 클래스에서 부서 정보 추출
    const universityElement = document.querySelector(".university");
    const departmentInfo = universityElement ? universityElement.textContent : "부서 정보 없음";

    // 사용 내역 섹션
    document.querySelector(".department-info").textContent = departmentInfo;
    document.querySelector(".date").textContent = data.transactionInfo?.date || "날짜 정보 없음";

    document.getElementById("title").value = data.title || "사용목적을 입력하세요.";
    document.getElementById("amount").value = parseFloat(data.transactionInfo?.amount) || 0;
    document.getElementById("content").value = data.content || "상세 설명을 입력하세요.";

    // 영수증 사진 섹션
    if (data.receiptUrl) {
        const receiptDetail = document.querySelector(".receipt-detail");
        receiptDetail.innerHTML = `<img width="400px" src="${data.receiptUrl}" alt="영수증 이미지" class="receipt-image">`;
    }

    // 영수증 ID 저장
    const receiptId = data.receiptId || null;
    document.querySelector("#receipt-id").value = receiptId; // hidden 필드에 설정
}

// 문서번호 생성 함수
function generateDocumentNumber() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const randomDigits = Math.floor(100 + Math.random() * 900); // 100~999 범위의 난수
    return `${year}${month}${day}${randomDigits}`;
}

// 등록 버튼 클릭 이벤트
const saveButton = document.getElementById("save-btn");
saveButton.addEventListener("click", function () {
    // URL에서 transactionId 추출
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('id');
    const title = document.getElementById("title").value;
    const amount = parseFloat(document.getElementById("amount").value) || 0;
    const content = document.getElementById("content").value;
    const receiptId = document.querySelector("#receipt-id").value;
    const docNum = generateDocumentNumber();
    const createdAt = new Date().toISOString();

    const requestPayload = {
        receiptId,
        transactionId,
        docNum,
        createdAt,
        title,
        content,
        amount
    };

    registerAccountBook(requestPayload);
});

// 등록 API 요청 함수
function registerAccountBook(requestPayload) {
    const token = localStorage.getItem('accessToken');
    const accessToken = `Bearer ${token}`;

    fetch(`${API_BASE_URL}/api/account-books`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken
        },
        body: JSON.stringify(requestPayload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("장부 등록 요청에 실패했습니다.");
            }
            return response.json();
        })
        .then(() => {
            alert("장부 등록 성공!");
        })
        .catch(error => {
            alert("장부 등록 중 오류가 발생했습니다: " + error.message);
        });
}
