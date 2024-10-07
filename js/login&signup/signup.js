window.onload = function() {



};

document.getElementById('signup-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // 폼의 기본 제출 동작을 막습니다.

    const urlParams = new URLSearchParams(window.location.search);
    const departmentId = urlParams.get('deptId');
    const colleageId = urlParams.get('collegeId');
    let role = urlParams.get('role');
    let parentId = "";

    if(role == null){
        role = "AUDITOR"
    }

    if (colleageId == null){
        console.log(departmentId,role);
        parentId = departmentId
    }
    else{
        console.log(colleageId)
        parentId = colleageId
    }

    // parentId가 있으면 parentId 파라미터를 포함하고, 없으면 파라미터를 생략
    const parentIdQuery = parentId ? `${parentId}` : '';

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

    // 최종 URL 구성
    const url = `http://localhost:8080/api/univ/register/${role}?parentId=` + (parentIdQuery ? `${parentIdQuery}` : '');

    // 백엔드로 POST 요청을 보냅니다.
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        // 응답에 따라 성공 여부를 처리합니다.
        if (response.ok) {
            alert("가입이 완료되었습니다: " + result.message);
        } else {
            alert("가입에 실패하였습니다: " + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
});
