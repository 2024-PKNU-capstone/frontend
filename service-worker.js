// 캐시에 저장할 파일들의 버전을 정의. 캐시 이름을 업데이트할 때 버전을 변경하여 새로운 캐시를 구분함.
const CACHE_NAME = 'my-pwa-cache-v1';

// PWA에서 캐싱할 리소스들을 배열로 정의. 오프라인 모드에서도 이 파일들이 캐시에서 제공됨.
const urlsToCache = [
  '/',                        // 메인 페이지
  '/index.html',               // 메인 HTML 파일
  '/app.js',                   // 메인 JavaScript 파일
];

// 'install' 이벤트는 서비스 워커가 처음 설치될 때 발생. 캐시를 열고, 지정된 파일들을 캐시에 저장함.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)  // 정의한 캐시 이름으로 캐시를 엶.
      .then(cache => {
        console.log('Opened cache');  // 캐시가 열렸음을 콘솔에 출력.
        return cache.addAll(urlsToCache);  // 캐시에 지정된 파일들을 추가함.
      })
  );
  // 서비스 워커가 설치되면 즉시 활성화되도록 'skipWaiting()'을 호출함.
  self.skipWaiting();
});

// 'fetch' 이벤트는 네트워크 요청이 발생할 때마다 호출됨. 요청이 캐시된 리소스라면 캐시에서 제공하고, 그렇지 않으면 네트워크에서 가져옴.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)  // 캐시에 요청된 리소스가 있는지 확인.
      .then(response => {
        // 캐시에 요청된 리소스가 있으면 그것을 반환, 없으면 네트워크에서 요청.
        return response || fetch(event.request);
      })
  );
});

// 'activate' 이벤트는 서비스 워커가 새로운 버전으로 업데이트될 때 발생함. 오래된 캐시를 삭제하여 최신 캐시를 유지함.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];  // 유지할 캐시 이름(현재 버전)을 정의함.
  event.waitUntil(
    caches.keys().then(cacheNames => {
      // 모든 캐시 이름을 순회하여 현재 버전의 캐시만 유지하고, 나머지는 삭제.
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 캐시 이름이 화이트리스트에 없으면 삭제.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
