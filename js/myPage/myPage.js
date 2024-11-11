$(document).ready(function() {
  loadUserProfile();
});

function loadUserProfile() {
  const token = localStorage.getItem('accessToken');
  const accessToken = `Bearer ${token}`;

  $.ajax({
      url: 'http://localhost:8080/api/users',
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
