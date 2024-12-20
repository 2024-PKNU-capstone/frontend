const token = localStorage.getItem('accessToken');
const accessToken = `Bearer ${token}`;

$(document).ready(function() { 
  function loadPayerList() {
    $.ajax({
      url: 'http://localhost:8080/api/users/payed',
      type: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": accessToken
      },
      success: function(response) { 
        if (response.code === 200) { 
          displayPayers(response.data); // data.content?
        }
      },
      error: function(xhr) { 
        alert("납부자 목록 조회 실패: " + xhr.responseText);
      }
    });
  }

  function displayPayers(payers) {
    const listContainer = $('#payer-list');
    listContainer.empty(); 
    
    payers.forEach(payer => { 
      const item = `
        <div class="payer-item">
          <h2>${payer.contributorName}</h2>
          <p>납부 금액: ${payer.amount}</p>
          <p>납부 날짜: ${payer.paymentDate}</p>
        </div>
      `;
      listContainer.append(item);
    });
  }

  loadPayerList();
});
