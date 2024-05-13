import { ref } from "vue";
import { defineStore } from "pinia";
export const useFriendStore = defineStore("friend", () => {
  const list = ref([]);
  const setList = (data) => {
    list.value = data;
  };
  return { list, setList };
});
