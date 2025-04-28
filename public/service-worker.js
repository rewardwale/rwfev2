// public/service-worker.js
self.addEventListener('push', function (event) {
    const data = event.data?.json() || {};
  
    const options = {
      body: data.body || 'You have a new notification!',
      icon: '/icon.png',
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title || 'Notification', options)
    );
  });
  