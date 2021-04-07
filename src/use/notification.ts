import { ref } from 'vue';

export function useNotification() {
  const worker = ref<ServiceWorkerRegistration>();
  const notification = ref<Notification>();

  async function askPermission() {
    if (Notification.permission === 'default') {
      // ask for permission
      return Notification.requestPermission();
    }
    return Notification.permission;
  }

  async function notify(message: string, options: NotificationOptions = {}) {
    if (Notification.permission !== 'granted') {
      return;
    }
    if (notification.value) {
      notification.value.close();
    }
    if (!worker?.value) {
      // browser notification
      notification.value = new Notification(message, options);
      return;
    }
    // use service worker notifications (work on mobile too)
    worker.value.showNotification(message, options);
    notification.value = undefined;
  }

  navigator.serviceWorker.getRegistration().then((registration) => {
    worker.value = registration;
  });

  return {
    notify,
    notification,
    askPermission,
  };
}
