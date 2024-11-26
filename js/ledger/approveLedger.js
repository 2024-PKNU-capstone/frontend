import { API_BASE_URL} from '../../config.js';

// URL에서 id 파라미터 가져오는 함수
function getAccountBookIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // 'id'라는 파라미터 값을 가져옴
  }
// 승인 및 반려 버튼 클릭 이벤트 설정
$(document).ready(function () {
    const accountBookId = getAccountBookIdFromUrl();
    
    // 승인 버튼 클릭
    $('.approve-btn').click(function () {
      sendApprovalRequest(accountBookId, true); // 승인 요청 (approval = true)
    });
  
    // 반려 버튼 클릭
    $('.reject-btn').click(function () {
      sendApprovalRequest(accountBookId, false); // 반려 요청 (approval = false)
    });
  });
  
// 승인 및 반려 요청 함수
function sendApprovalRequest(accountBookId, approval) {
    const token = localStorage.getItem('accessToken');
    const accessToken = `Bearer ${token}`;

    $.ajax({
      url: `${API_BASE_URL}/api/account-books/approve/${accountBookId}?approval=${approval}`, // approval을 URL 파라미터로 전달
      type: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": accessToken
      },
      success: function (response) {
        alert(response.message); // 성공 메시지 표시
        // 필요에 따라 승인/반려 후 동작 추가
      },
      error: function (xhr) {
        alert("승인/반려 요청에 실패했습니다: " + xhr.responseText);
      }
    });
  }
  
  