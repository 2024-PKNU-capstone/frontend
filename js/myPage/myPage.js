import { API_BASE_URL} from '../../config.js';
$(document).ready(function() {
  loadUserProfile();
});

function loadUserProfile() {
  const token = localStorage.getItem('accessToken');
  const accessToken = `Bearer ${token}`;

  $.ajax({
      url: `${API_BASE_URL}/api/users`,
      type: 'GET',
      headers: {
          "Content-Type": "application/json",
          "Authorization": accessToken
      },
      success: function(response) {
          if (response.code === 200) {
              displayUserProfile(response.data);
          }
      },
      error: function(xhr) {
          if (xhr.status === 401) {
              alert("요청 권한이 없습니다.");
          } else {
              alert("유저 정보를 불러오는데 실패했습니다: " + xhr.responseText);
          }
      }
  });
}

function displayUserProfile(user) {
  $('#university-id').text(user["대학 id"]);
  $('#department-id').text(user["학과 id"]);
  $('#user-name').text(user["name"]);
  $('#login-id').text(user["login_id"]);
  $('#student-number').text(user["number"]);
  $('#roles').text(user["roles"]);
  $('#is-payed').text(user["isPayed"]);
}

function logout() {
    if (confirm('로그아웃 하시겠습니까?')) { // 확인 취소
        alert("로그아웃 되었습니다.");
        // ajax 로직 추가해야함
    } else {
        alert("로그아웃이 취소되었습니다.");
    }
}

function deleteID() {
    if (confirm('회원탈퇴 하시겠습니까?')) {
        alert("회원탈퇴가 완료되었습니다.");
    } else {
        alert("회원탈퇴가 취소되었습니다.");
    }
}
