// 🔽 수정: 캐시 이름 (버전)을 반드시 올려야 합니다.
const CACHE_NAME = 'budget-dashboard-v4'; 
const REPO_PATH = '/savings_app_v2'; // 저장소 경로 변수 선언

// 🔽 수정: 모든 로컬 파일 경로에 REPO_PATH 변수 적용
const urlsToCache = [
    `${REPO_PATH}/stable_version_5.html`,
    `${REPO_PATH}/manifest.json`,
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    `${REPO_PATH}/icons/icon-192x192.png`,
    `${REPO_PATH}/icons/icon-512x512.png`
];

// 설치 이벤트: 캐시 초기화 및 필수 파일 저장
self.addEventListener('install', event => {
    // Service Worker가 활성화될 때까지 기다립니다.
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and adding files...');
                return cache.addAll(urlsToCache).catch(error => {
                    console.error('Caching failed:', error);
                    // 캐싱 실패는 PWA 설치 실패로 이어지므로, 오류 확인이 중요합니다.
                });
            })
    );
    // 새로운 Service Worker가 즉시 활성화되도록 설정
    self.skipWaiting();
});

// fetch 이벤트: 네트워크 요청을 가로채 캐시된 리소스로 응답
self.addEventListener('fetch', event => {
    // 1. 캐시에서 요청을 찾습니다.
    // 2. 캐시에 없으면 네트워크로 가서 가져옵니다.
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 캐시에 응답이 있으면 캐시된 응답 반환
                if (response) {
                    return response;
                }
                // 캐시에 없으면 네트워크 요청
                return fetch(event.request);
            })
    );
});

// 활성화 이벤트: 오래된 캐시 정리
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Service Worker가 클라이언트를 제어하도록 설정
    self.clients.claim(); 

});

