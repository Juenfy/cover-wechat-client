import { ref, watch } from "vue";
import { defineStore } from "pinia";
export const useChatStore = defineStore(
  "chat",
  () => {
    const list = ref([]);
    const messges = ref({});

    const pushListItem = (item) => {
      let key = getKey(item.form.id, item.to.id, item.is_group);
      let push = true;
      list.value.forEach((element) => {
        if (element.id == key) {
          push = false;
          return;
        }
      });
      item.id = key;
      if (push) list.value.push(item);
    };

    const pushMessges = (item) => {
      let chatType = item.is_group == 1 ? "group" : "private";
      let key = chatType + ":" + item.from.id + "_" + item.to.id;
      if (!messges.value.hasProperty(key)) messges.value[key] = [];
      messges.value[key].push(item);
    };

    const getMessgesByKey = (fromId, toId, isGroup) => {
      let key = getKey(fromId, toId, isGroup);
      if (!messges.value.hasProperty(key)) return [];
      return messges.value[key];
    };

    const getKey = (fromId, toId, isGroup) => {
      let chatType = isGroup == 1 ? "group" : "private";
      return chatType + ":" + fromId + "_" + toId;
    };

    return {
      list,
      messges,
      pushListItem,
      pushMessges,
      getMessgesByKey,
    };
  },
  { persist: true }
);
