import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour
const CACHE_PREFIX = 'chat_cache_';

export const cacheManager = {
  async set(key, data, expiryTime = CACHE_EXPIRY) {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        expiry: expiryTime,
      };
      await AsyncStorage.setItem(
        CACHE_PREFIX + key,
        JSON.stringify(item)
      );
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },

  async get(key) {
    try {
      const value = await AsyncStorage.getItem(CACHE_PREFIX + key);
      if (!value) return null;

      const item = JSON.parse(value);
      const now = Date.now();
      
      if (now - item.timestamp > item.expiry) {
        await this.remove(key);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  async remove(key) {
    try {
      await AsyncStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  },

  async clear() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}; 