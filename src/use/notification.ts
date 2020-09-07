import { ref } from 'vue';

export function useNotification() {
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
    notification.value = new Notification(message, options);
  }

  return {
    notify,
    notification,
    askPermission,
  };
}
