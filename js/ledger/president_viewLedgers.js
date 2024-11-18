import { API_BASE_URL} from '../../config.js';
// 초기 페이지 번호 및 페이지 크기 설정
let currentPage = 1;
const token = localStorage.getItem('accessToken');
const accessToken = `Bearer ${token}`;

// 현재 날짜와 해당 연도의 1월 1일을 기본값으로 설정
function setDefaultDates() {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1); // 현재 연도의 1월 1일 설정

    // 날짜를 'YYYY-MM-DD' 형식으로 포맷
    const formattedToday = today.toISOString().split('T')[0];
    const formattedStartOfYear = startOfYear.toISOString().split('T')[0];

    // 각 날짜 필드에 값 설정
    document.querySelectorAll('.from-date').forEach(input => input.value = formattedStartOfYear);
    document.querySelectorAll('.to-date').forEach(input => input.value = formattedToday);
}

function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    const tabButtons = document.querySelectorAll('.tab');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// 조회 버튼 클릭 시 장부 리스트 로드
function handleSearch(tabName, status, fromDateId, toDateId, targetListId) {
    currentPage = 1; // 페이지 번호 초기화
    const fromDate = document.getElementById(fromDateId).value;
    const toDate = document.getElementById(toDateId).value;

    if (fromDate && toDate) {
        loadAccountBooks(status, targetListId, formatDateForRequest(fromDate), formatDateForRequest(toDate));
    } else {
        alert("조회 시작일과 종료일을 모두 선택하세요.");
    }
}

function formatDateForRequest(date) {
    if (!date) return null; // 날짜가 없으면 null 반환
    if (date.includes('T')) return date; // 이미 'T'가 포함되어 있으면 그대로 반환
    return `${date}T00:00:00`; // 'T00:00:00' 추가
}

// 각 탭에 대한 장부 리스트를 서버에서 불러오는 함수
function loadAccountBooks(status, targetListId, fromDate, toDate) {
    let url = `${API_BASE_URL}/api/account-books`;

    // pending 상태일 경우 요청 URL을 다르게 설정
    if (status === 'PENDING') {
        console.log('pending')
        url = `${API_BASE_URL}/api/account-books/approve`;
    }

    $.ajax({
        url: url,
        type: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": accessToken
        },
        data: {
            status: status,
            fromDate: formatDateForRequest(fromDate), // 형식을 맞춰서 전송
            toDate: formatDateForRequest(toDate),     // 형식을 맞춰서 전송
            page: currentPage,
        },
        success: function(response) {
            if (response.code === 200) {
                console.log(response.data)
                if(status ==='PENDING'){
                    displayAccountBooks(response.data, targetListId,status);
                }
                else{
                    displayAccountBooks(response.data.content, targetListId,status);
                }
                
                currentPage++; // 다음 페이지 번호로 업데이트
            }
        },
        error: function(xhr) {
            alert("장부 데이터를 불러오는데 실패했습니다: " + xhr.responseText);
        }
    });
}

// 장부 리스트를 화면에 표시하는 함수
function displayAccountBooks(accountBooks, targetListId,status) {
    const listContainer = $(`#${targetListId}`);
    listContainer.empty(); // 기존 리스트 초기화

    // 데이터가 없으면 "조회된 장부가 없습니다" 메시지 표시
    if (accountBooks.length === 0) {
        listContainer.append('<p>조회된 장부가 없습니다.</p>');
        return;
    }

    // 각 장부 항목을 반복하며 화면에 추가
    accountBooks.forEach(book => {
        console.log(book)
        const item = $(`
            <div class="account-book-item" onclick="navigateToDetail('${book.id}', '${status}')">
                <span class="dot"></span>
                <div class="account-book-info">
                    <p class="account-book-title">${book.title}</p>
                    <p class="account-book-doc-num">${book.docNum}</p>
                </div>    
                <p class="account-book-amount">${book.amount}원</p>
            </div>
        `);
        listContainer.append(item);
    });
}

// 장부 상세보기 페이지로 이동하는 함수
function navigateToDetail(accountBookId, status) {
    console.log(status)
    const detailPage = status === 'PENDING' ? 'approveLedgerDetail.html' : 'viewLedgerDetail.html';
    window.location.href = `../../ledger/${detailPage}?id=${accountBookId}`;
}


// 페이지 로드 시 첫 번째 요청 실행
$(document).ready(function() {
    // 초기 공개 장부 로드
    const fromDate = $('#unapproved-from-date').val();
    const toDate = $('#unapproved-to-date').val();
    loadAccountBooks('UNAPPROVED', 'unapproved-account-book-list', fromDate, toDate);

    // 탭 클릭 이벤트 설정
    $('.tab').click(function() {
        const tabName = $(this).data('tab');
        currentPage = 1; // 페이지 번호 초기화

        if (tabName === 'unapproved') {
            const fromDate = $('#unapproved-from-date').val();
            const toDate = $('#unapproved-to-date').val();
            loadAccountBooks('UNAPPROVED', 'unapproved-account-book-list', fromDate, toDate);
        } else if (tabName === 'pending') {
            const fromDate = $('#pending-from-date').val();
            const toDate = $('#pending-to-date').val();
            loadAccountBooks('PENDING', 'pending-account-book-list', fromDate, toDate);
        } else if (tabName === 'unaudited') {
            const fromDate = $('#unaudited-from-date').val();
            const toDate = $('#unaudited-to-date').val();
            loadAccountBooks('UNAUDITED', 'unaudited-account-book-list', fromDate, toDate);
        } else if (tabName === 'public') {
            const fromDate = $('#public-from-date').val();
            const toDate = $('#public-to-date').val();
            loadAccountBooks('PUBLIC', 'public-account-book-list', fromDate, toDate);
        }
    });
});

window.navigateToDetail=navigateToDetail;