// 브라우저가 'serviceWorker' API를 지원하는지 확인함.
if ('serviceWorker' in navigator) {
  // 페이지가 완전히 로드된 후 서비스 워커를 등록.
  window.addEventListener('load', () => {
    // 'service-worker.js' 파일을 사용해 서비스 워커를 등록.
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        // 서비스 워커 등록이 성공하면, 등록된 서비스 워커의 범위를 콘솔에 출력.
        console.log('Service Worker 등록 성공:', registration.scope);
      })
      .catch(error => {
        // 서비스 워커 등록이 실패하면, 오류 메시지를 콘솔에 출력.
        console.log('Service Worker 등록 실패:', error);
      });
  });
}

// DOMContentLoaded 이벤트는 HTML이 완전히 로드되고 파싱되었을 때 발생.
// 이 이벤트가 발생하면 페이지에 있는 모든 링크에 대한 클릭 이벤트 리스너를 설정.
document.addEventListener('DOMContentLoaded', () => {
  // 페이지 내 모든 'a' 태그를 선택.
  const links = document.querySelectorAll('a');
  
  // 각 링크에 대해 클릭 이벤트를 추가.
  links.forEach(link => {
    link.addEventListener('click', event => {
      // 링크가 클릭되었을 때 기본 동작(페이지 이동)을 막음.
      event.preventDefault();
      // 클릭된 링크의 'href' 속성 값을 가져옴.
      const target = event.target.getAttribute('href');
      // 해당 페이지를 비동기로 로드하는 함수를 호출.
      loadPage(target);
    });
  });
});

// 페이지를 비동기로 로드하는 함수. 이 함수는 'fetch' API를 사용해 요청된 HTML을 가져와 페이지에 삽입.
// 아마 비동기로 페이지 부분 교체 안할듯, 나중에 지우면 됨
function loadPage(url) {
  // 주어진 URL로 'fetch' 요청을 보냄.
  fetch(url)
    .then(response => response.text())  // 응답을 텍스트로 변환.
    .then(html => {
      // 'main' 태그의 내용을 요청한 HTML로 바꿈.
      document.querySelector('main').innerHTML = html;
    })
    .catch(error => console.log('페이지 로드 실패:', error));  // 에러가 발생하면 콘솔에 출력.
}
