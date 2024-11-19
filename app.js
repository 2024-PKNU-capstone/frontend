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