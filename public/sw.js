self.addEventListener("install", (event) => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Ensure the new service worker takes control of all pages immediately
  event.waitUntil(clients.claim());
});

self.addEventListener("push", function (event) {
  let payload = { title: "New Notification", body: "" };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      // Fallback for plain text notifications
      payload = { title: "Notification", body: event.data.text() };
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon || "/favicon.ico",
    badge: "/favicon.ico",
    data: payload.data || {},
    vibrate: [200, 100, 200, 100, 200, 100, 400],
    tag: "raisevoice-issue-update",
    renotify: true,
    silent: false,
    sound: "/notification/notification.mp3", // Note: limited browser support
    actions: [
      { action: "view", title: "View Details" },
      { action: "close", title: "Close" },
    ],
  };

  event.waitUntil(
    self.registration
      .showNotification(payload.title || "RaiseVoice Update", options)
      .then(() => {
        // Post-message to all open tabs to play sound if the app is visible
        self.clients
          .matchAll({ type: "window", includeUncontrolled: true })
          .then((clients) => {
            clients.forEach((client) => {
              client.postMessage({ type: "PLAY_NOTIFICATION_SOUND" });
            });
          });
      }),
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "close") return;

  const urlToOpen = event.notification.data.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
