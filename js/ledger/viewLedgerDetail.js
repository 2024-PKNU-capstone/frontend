// URL 파라미터로부터 문서 번호를 가져오는 함수
function getDocNumFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('docNum');  // URL에 있는 문서 번호(docNum)를 가져옴
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
              
              // 응답 헤더에서 Access-Token 및 Refresh-Token을 콘솔에 출력
              const newAccessToken = xhr.getResponseHeader("Access-Token");
              const refreshToken = xhr.getResponseHeader("Refresh-Token");
              console.log("New Access Token:", newAccessToken);
              console.log("Refresh Token:", refreshToken);
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
  detailContainer.html(`
      <h3>${data.title}</h3>
      <p>금액: ${data.amount}원</p>
      <p>문서 번호: ${data.docNum}</p>
      <p>내용: ${data.content}</p>
      <p>생성일: ${data.createdAt}</p>
      <p>상태: ${data.status}</p>
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
