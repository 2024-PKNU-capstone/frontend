import { API_BASE_URL } from '../../config.js';

const token = localStorage.getItem('accessToken');
const accessToken = `Bearer ${token}`;

// 승인 대기 중 장부 목록을 가져오는 함수
function loadTopPendingAccountBooks() {
    const url = `${API_BASE_URL}/api/account-books/approve`;
    const fromDate = getStartOfYear(); // 올해 1월 1일
    const toDate = new Date(); // 오늘 날짜

    $.ajax({
        url: url,
        type: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": accessToken
        },
        data: {
            status: 'PENDING',
            fromDate: formatDateForRequest(fromDate),
            toDate: formatDateForRequest(toDate),
            page: 1, // 첫 번째 페이지 요청
        },
        success: function (response) {
            if (response.code === 200) {
                const accountBooks = response.data;
                displayAccountBooks(accountBooks, 'approval-list');
            } else {
                $('#approval-list').html('<p>승인 대기 중인 장부가 없습니다.</p>');
            }
        },
        error: function (xhr) {
            console.error("장부 데이터를 불러오는 중 오류 발생:", xhr.responseText);
            $('#approval-list').html('<p>장부 데이터를 불러오는 중 오류가 발생했습니다.</p>');
        }
    });
}

// 장부 목록을 화면에 표시하는 함수
function displayAccountBooks(accountBooks, targetListId) {
    const approvalList = $(`#${targetListId}`);
    approvalList.empty();

    if (accountBooks.length === 0) {
        approvalList.html('<p>승인 대기 중인 장부가 없습니다.</p>');
        return;
    }

    accountBooks.forEach(book => {
        fetchDeptName(book.deptId, function (deptName) {
            const item = `
                <div class="account-book-item" onclick="navigateToDetail('${book.id}', 'PENDING')">
                    <span class="dot"></span>
                    <div class="account-book-info">
                        <p class="account-book-title">${book.title} (${deptName || '학과정보 없음'})</p>
                        <p class="account-book-doc-num">문서번호: ${book.docNum}</p>
                    </div>
                    <p class="account-book-amount">${book.amount}원</p>
                </div>
            `;
            approvalList.append(item);
        });
    });
}

// deptId를 사용해 학과 이름 가져오기
function fetchDeptName(deptId, callback) {
    $.ajax({
        url: `${API_BASE_URL}/api/univ/`,
        type: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": accessToken
        },
        data: { deptId: deptId },
        success: function (response) {
            if (response.code === 200 && response.data) {
                callback(response.data.child); // 학과 이름
            } else {
                callback(null); // 실패 시 null 반환
            }
        },
        error: function (xhr) {
            console.error(`학과 정보를 불러오는 중 오류 발생: ${xhr.responseText}`);
            callback(null);
        }
    });
}

// 날짜 포맷 함수
function formatDateForRequest(date) {
    if (!date) return null;
    if (date instanceof Date) {
        return date.toISOString().split('T')[0] + 'T00:00:00';
    }
    return `${date}T00:00:00`;
}

// 올해 1월 1일을 반환하는 함수
function getStartOfYear() {
    const today = new Date();
    return new Date(today.getFullYear(), 0, 1);
}

// 장부 상세보기 페이지로 이동하는 함수
function navigateToDetail(accountBookId, status) {
    const detailPage = status === 'PENDING' ? 'approveLedgerDetail.html' : 'viewLedgerDetail.html';
    window.location.href = `../../ledger/${detailPage}?id=${accountBookId}`;
}

// 페이지 로드 시 첫 번째 요청 실행
$(document).ready(function () {
    loadTopPendingAccountBooks();

    $('.see-all').click(function () {
        window.location.href = '../ledger/role/auditorLedgers.html';
    });
});

window.navigateToDetail = navigateToDetail;
