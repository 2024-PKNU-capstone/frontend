import { API_BASE_URL} from '../../config.js';

const token = localStorage.getItem('accessToken');
const accessToken = `Bearer ${token}`;

// 상위 5개의 승인 대기 중 장부를 가져오는 함수
function loadTopPendingAccountBooks() {
    $.ajax({
        url: `${API_BASE_URL}/api/account-books`,
        type: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": accessToken
        },
        data: {
            status: 'UNAPPROVED', // 승인 대기 중 상태
            page: 1,             // 첫 번째 페이지만 요청
            size: 5              // 5개의 데이터만 요청
        },
        success: function (response) {
            if (response.code === 200) {
                displayApprovalList(response.data.content);
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

// 승인 대기 중 장부 목록을 화면에 표시하는 함수
function displayApprovalList(accountBooks) {
    const approvalList = $('#approval-list');
    approvalList.empty(); // 기존 목록 초기화

    if (accountBooks.length === 0) {
        approvalList.html('<p>승인 대기 중인 장부가 없습니다.</p>');
        return;
    }

    accountBooks.forEach(book => {
        const item = `
            <div class="account-book-item" onclick="navigateToDetail('${book.id}', 'UNAPPROVED')">
                <span class="dot"></span>
                <div class="account-book-info">
                    <p class="account-book-title">${book.title}</p>
                    <p class="account-book-doc-num">문서번호: ${book.docNum}</p>
                </div>
                <p class="account-book-amount">${book.amount}원</p>
            </div>
        `;
        approvalList.append(item);
    });
}

// 장부 상세보기 페이지로 이동하는 함수
function navigateToDetail(accountBookId, status) {
    const detailPage = status === 'UNAPPROVED' ? 'approveLedgerDetail.html' : 'viewLedgerDetail.html';
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

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('signupModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const linkResultInput = document.getElementById('linkResultText'); // input 요소 선택
    const copyLinkBtn = document.getElementById('copyLinkBtn');

    // 모달 열기 및 서버 요청
    openModalBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        linkResultInput.value = '요청 중...'; // 초기 상태 표시
        copyLinkBtn.style.display = 'none'; // 복사 버튼 숨기기

        // 서버에 GET 요청
        fetch(`${API_BASE_URL}/api/univ/signup-link`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // 응답 데이터 확인
            if (data.data) {
                linkResultInput.value = data.data; // input 요소에 링크 삽입
                copyLinkBtn.style.display = 'inline-block'; // 복사 버튼 표시

                // 복사 버튼 클릭 이벤트
                copyLinkBtn.onclick = function() {
                    navigator.clipboard.writeText(data.data)
                        .then(() => {
                            alert('링크가 복사되었습니다.');
                        })
                        .catch(err => {
                            console.error('복사 중 오류 발생:', err);
                        });
                };
            } else {
                linkResultInput.value = '링크 생성에 실패했습니다.';
                copyLinkBtn.style.display = 'none'; // 실패 시 복사 버튼 숨기기
            }
        })
        .catch(error => {
            console.error('링크 생성 중 오류 발생:', error);
            linkResultInput.value = '링크 생성 중 오류가 발생했습니다.';
            copyLinkBtn.style.display = 'none'; // 오류 발생 시 복사 버튼 숨기기
        });
    });

    // 모달 닫기
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        linkResultInput.value = ''; // 모달 닫을 때 결과 초기화
        copyLinkBtn.style.display = 'none'; // 모달 닫을 때 복사 버튼 숨기기
    });
});
