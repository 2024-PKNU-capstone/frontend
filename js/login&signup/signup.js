$(document).ready(function () {
    // URL에서 deptId와 role 추출
    const urlParams = new URLSearchParams(window.location.search);
    const departmentId = urlParams.get('deptId');
    const role = urlParams.get('role') || "AUDITOR"; // role이 없는 경우 AUDITOR로 기본값 설정
    let parentId = null;

    if (colleageId == null){
        console.log(departmentId,role);
        parentId = departmentId
    }
    else{
        console.log(colleageId)
        parentId = colleageId
    }

  // 회원가입 버튼 클릭 시 폼 검증 및 AJAX 요청 처리
  $(".signup-btn").on("click", function () {
      var password = $("#password").val();
      var confirmPassword = $("#confirm-password").val();
      var inviteCode = $("#inviteCode").val();

      // 필수 필드 체크
      var fields = ["school", "college", "department", "name", "studentId", "username", "password", "confirm-password", "inviteCode"];
      for (var i = 0; i < fields.length; i++) {
          var field = $("#" + fields[i]);
          if (!field.val()) {
              alert(field.prev().text() + "을(를) 입력해 주세요.");
              field.focus();
              return false;
          }
      }

      // 비밀번호 일치 여부 확인
      if (password !== confirmPassword) {
          alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
          $("#confirm-password").focus();
          return false;
      }

      // 입력된 값 가져오기
    const school = document.getElementById('school').value;
    const college = document.getElementById('college').value;
    const department = document.getElementById('department').value;
    const name = document.getElementById('name').value;
    const studentId = document.getElementById('studentId').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 서버에 보낼 요청 바디를 구성합니다.
    const requestBody = {
        univ: school,
        college: college,
        dept: department,
        name: name,
        number: studentId,
        loginId:username,
        password:password
    };

      // 회원가입 요청을 위한 AJAX
      $.ajax({
          type: 'POST',
          url: `/api/univ/register/${role}?parentId=${parentId ? parentId : ''}`, // 회원가입 요청을 보낼 URL
          headers: {
              "Content-Type": "application/json; charset=utf-8"
          },
          data: JSON.stringify({
              requestBody
          }),
          contentType: 'application/json',
          dataType: 'json',
          success: function (response) {
              if (response.code === 200) {
                  alert(response.message);  // "회원 가입 성공"
              }
          },
          error: function (xhr) {
              var response = JSON.parse(xhr.responseText);
              if (xhr.status === 400) {
                  // 명세서에 따른 에러 메시지 처리
                  switch (response.code) {
                      case 601:
                          alert(response.message);  // "아이디의 길이는 최소 5자 이상 최대 20자 이하여야 합니다."
                          break;
                      case 602:
                          alert(response.message);  // "비밀 번호의 길이는 최소 8자 이상 최대 20자 이하이고..."
                          break;
                      case 604:
                          alert(response.message);  // "이름은 한글 또는 영어 1자 이상 20자 미만으로 입력해야 합니다."
                          break;
                      case 607:
                          alert(response.message);  // "학번은 반드시 9자리 숫자여야 합니다."
                          break;
                      case 608:
                          alert(response.message);  // "초대 코드가 알맞지 않습니다."
                          break;
                      default:
                          alert("회원가입 중 오류가 발생했습니다.");
                          break;
                  }
              } else {
                  alert("회원가입 중 오류가 발생했습니다.");
              }
          }
      });
  });
});

