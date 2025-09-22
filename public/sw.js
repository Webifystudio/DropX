self.addEventListener('push', (event) => {
    if (!event.data) {
        console.error('Push event but no data');
        return;
    }

    const data = event.data.json();

    const title = data.title || 'New Notification';
    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png', // An icon for the notification
        badge: '/icons/badge-72x72.png', // An icon for the notification bar
        data: {
            url: data.url,
        },
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Close the notification

    const urlToOpen = event.notification.data.url;

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true,
        }).then((clientList) => {
            if (clientList.length > 0) {
                // If the app is already open, focus it and navigate
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                client.focus();
                return client.navigate(urlToOpen);
            }
            // If the app is not open, open a new window
            return clients.openWindow(urlToOpen);
        })
    );
});

// Basic service worker lifecycle events
self.addEventListener('install', (event) => {
  // Perform install steps
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  // Perform activate steps
  console.log('Service Worker activating.');
});
