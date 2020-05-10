import { ref } from '@vue/composition-api';

export function useNotification() {
  const notification = ref<Notification>();

  function askPermission() {
    if (Notification.permission === 'default') {
      // ask for permission
      return Notification.requestPermission();
    }
    return Notification.permission;
  }

  async function notify(message: string, options: NotificationOptions = {}) {
    const permission = await askPermission();

    if (permission === 'denied') {
      return;
    }
    if (notification.value) {
      notification.value.close();
    }
    notification.value = new Notification(message, options);
  }

  return {
    notify,
    notification,
    askPermission,
  };
}
