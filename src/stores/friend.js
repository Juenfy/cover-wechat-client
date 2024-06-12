import { ref } from "vue";
import { defineStore } from "pinia";
export const useFriendStore = defineStore(
  "friend",
  () => {
    const info = ref({});

    const setInfo = (data) => {
      info.value = data;
    };
    return {
      info,
      setInfo,
    };
  },
  { persist: true }
);
