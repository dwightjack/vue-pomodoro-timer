import { useStorage } from '@vueuse/core';
import { ref } from 'vue';

export function useNotification() {
  const worker = ref<ServiceWorkerRegistration>();
  const notification = ref<Notification>();
  const permissions = useStorage<{ notification?: boolean }>('permissions', {});

  async function askPermission() {
    if (Notification.permission === 'default') {
      // ask for permission
      return Notification.requestPermission();
    }
    return Notification.permission;
  }

  async function checkNotifyPermission(
    confirm: () => Promise<boolean> | boolean,
  ) {
    if (permissions.value.notification !== undefined) {
      return;
    }
    const confirmed = await confirm();
    permissions.value.notification = confirmed;

    if (confirmed) {
      askPermission();
    }
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

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      worker.value = registration;
    });
  }

  return {
    notify,
    notification,
    checkNotifyPermission,
  };
}
