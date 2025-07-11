import * as SecureStore from "expo-secure-store";
import LocalStorageKey from "./LocalStorageKey";

const SecureStoreWrapper = {
  ...SecureStore,

  async getItem(key: LocalStorageKey) {
    return await this.getItemAsync(key)
  },

  async setItem(key: LocalStorageKey, value: string) {
    return await this.setItemAsync(key, value);
  },

  async deleteItem(key: LocalStorageKey) {
    return await this.deleteItemAsync(key);
  }
};

export default SecureStoreWrapper;
