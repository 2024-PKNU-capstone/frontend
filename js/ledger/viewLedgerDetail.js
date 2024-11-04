// URL 파라미터로부터 문서 번호를 가져오는 함수, 반환값 urlParams (문서번호를 담음)
function getDocNumFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams.get('id'))
  return urlParams.get('id');  // URL에 있는 문서 번호(docNum)를 가져옴
}

// 로컬 스토리지에서 Access Token을 가져옴
const token = localStorage.getItem('accessToken');
const accessToken = `Bearer ${token}`;

// 장부 상세 정보를 불러오는 함수
function loadAccountBookDetail(docNum) {
  $.ajax({
      url: `http://localhost:8080/api/account-books/${docNum}`,  // 상세보기 API 엔드포인트
      type: 'GET',
      headers: {
          "Authorization": accessToken
      },
      success: function(response, status, xhr) {
          if (response.code === 200) {
              displayAccountBookDetail(response.data);
          }
      },
      error: function(xhr) {
          alert("장부 데이터를 불러오는데 실패했습니다: " + xhr.responseText);
      }
  });
}

// 받은 데이터를 HTML에 표시하는 함수
function displayAccountBookDetail(data) {
  const detailContainer = $('#account-book-detail');
  
  // HTML 목업 구조에 맞춰 동적으로 데이터를 생성 및 삽입
  detailContainer.html(`
      <!-- 상단 정보 -->
      <header>
          <p class="department-info">부경대학교 컴퓨터공학부 장부</p>
          <div class="date-document">
              <h1 class="date">${data.createdAt}</h1>
              <p class="document-number">문서번호 ${data.docNum}</p>
          </div>
      </header>
      
      <!-- 사용 목적 -->
      <h3>사용목적</h3>
      <p class="usage-purpose">${data.purpose || 'N/A'}</p>

      <!-- 사용 금액 -->
      <h3>사용금액</h3>
      <p class="usage-amount">${data.amount}원</p>

      <!-- 상세 설명 -->
      <h3>상세설명</h3>
      <p class="usage-descript">${data.description || 'N/A'}</p>

      <!-- 영수증 상세 내역 -->
      <h3>영수증 상세 내역</h3>
      <div class="receipt-detail">
          영수증
      </div>
  `);
}

// 페이지 로드 시 문서 번호를 이용해 장부 상세 정보 불러오기
$(document).ready(function() {
  const docNum = getDocNumFromUrl();
  if (docNum) {
      loadAccountBookDetail(docNum);
  } else {
      alert("문서 번호가 지정되지 않았습니다.");
  }
});
