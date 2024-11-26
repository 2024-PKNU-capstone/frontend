import { API_BASE_URL } from '../../config.js';

const token = localStorage.getItem('accessToken');
const accessToken = `Bearer ${token}`;

// 공개 장부 최대 5개를 불러오는 함수
function loadTopPublicAccountBooks() {
    $.ajax({
        url: `${API_BASE_URL}/api/account-books`,
        type: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": accessToken
        },
        data: {
            status: 'PUBLIC', // 공개 상태의 장부
            page: 1,          // 첫 번째 페이지만 요청
            size: 5           // 최대 5개의 데이터 요청
        },
        success: function (response) {
            if (response.code === 200) {
                displayPublicLedgers(response.data.content);
            } else {
                $('#approval-list').html('<p>공개된 장부가 없습니다.</p>');
            }
        },
        error: function (xhr) {
            console.error("장부 데이터를 불러오는 중 오류 발생:", xhr.responseText);
            $('#approval-list').html('<p>장부 데이터를 불러오는 중 오류가 발생했습니다.</p>');
        }
    });
}

// 공개 장부를 화면에 표시하는 함수
function displayPublicLedgers(ledgers) {
    const approvalList = $('#approval-list');
    approvalList.empty(); // 기존 목록 초기화

    if (ledgers.length === 0) {
        approvalList.html('<p>공개된 장부가 없습니다.</p>');
        return;
    }

    ledgers.forEach(ledger => {
        const item = `
            <div class="account-book-item" onclick="navigateToDetail('${ledger.id}', 'PUBLIC')">
                <span class="dot"></span>
                <div class="account-book-info">
                    <p class="account-book-title">${ledger.title}</p>
                    <p class="account-book-doc-num">문서번호: ${ledger.docNum}</p>
                </div>
                <p class="account-book-amount">${ledger.amount.toLocaleString()}원</p>
            </div>
        `;
        approvalList.append(item);
    });
}

// 장부 상세보기 페이지로 이동하는 함수
function navigateToDetail(accountBookId, status) {
    const detailPage = status === 'PUBLIC' ? 'viewLedgerDetail.html' : 'viewLedgerDetail.html';
    window.location.href = `../../ledger/${detailPage}?id=${accountBookId}`;
}

// 페이지 로드 시 첫 번째 요청 실행
$(document).ready(function () {
    loadTopPublicAccountBooks();

    // See all 클릭 시 전체 목록 페이지로 이동
    $('.see-all').click(function () {
        window.location.href = '../ledger/role/normalLedgers.html';
    });
});

window.navigateToDetail = navigateToDetail;
