export function useStorage<T>(key: string, defaultValue: T) {
  async function load() {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
      return defaultValue;
    } catch (e) {
      throw new Error(
        `Unable to parse key ${key} from localStorage: ${e.message}`,
      );
    }
  }

  async function save(newValue: T) {
    localStorage.setItem(key, JSON.stringify(newValue));
  }

  async function remove() {
    localStorage.removeItem(key);
  }

  return { remove, load, save };
}
