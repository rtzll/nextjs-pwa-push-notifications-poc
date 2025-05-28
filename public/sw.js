self.addEventListener('push', function (event) {
  if (event.data) {
    try {
      const data = event.data.json()
      
      // Validate required fields
      if (!data || typeof data.title !== 'string') {
        console.error('Invalid push notification data: missing title')
        return
      }
      
      // Sanitize and validate URL
      let url = '/'
      if (data.url && typeof data.url === 'string') {
        try {
          const urlObj = new URL(data.url, self.location.origin)
          // Only allow same-origin URLs
          if (urlObj.origin === self.location.origin) {
            url = urlObj.pathname + urlObj.search + urlObj.hash
          }
        } catch (e) {
          console.error('Invalid URL in notification data:', e)
        }
      }
      
      const options = {
        body: typeof data.body === 'string' ? data.body : '',
        icon: data.icon || '/apple-touch-icon.png',
        badge: '/apple-touch-icon.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: '2',
          url: url,
        },
      }
      event.waitUntil(self.registration.showNotification(data.title, options))
    } catch (error) {
      console.error('Error processing push notification:', error)
    }
  }
})
 
self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  
  try {
    const url = event.notification.data?.url || '/'
    
    // Validate URL before opening
    if (typeof url === 'string' && url.startsWith('/')) {
      event.waitUntil(clients.openWindow(url))
    } else {
      console.error('Invalid URL in notification data')
      event.waitUntil(clients.openWindow('/'))
    }
  } catch (error) {
    console.error('Error handling notification click:', error)
    event.waitUntil(clients.openWindow('/'))
  }
})
