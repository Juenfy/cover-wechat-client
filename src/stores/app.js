import { ref } from "vue";
import { defineStore } from "pinia";
import { Home } from "@/enums/app";
export const useAppStore = defineStore("app", () => {
  const showSearch = ref(true);
  const showNavbar = ref(true);
  const navTitle = ref("");
  const showCommonSearch = ref(false);
  const commonSearchAction = ref(Home);
  const commonSearchPlaceholder = ref("搜索");
  const unreadChat = ref(0);
  const unreadFriend = ref(0);
  const unreadDiscover = ref(0);

  const initCommonSearch = (search) => {
    commonSearchAction.value = search.action;
    commonSearchPlaceholder.value = search.placeholder;
  };
  const initHeader = (header) => {
    navTitle.value = header.title;
    showNavbar.value = header.navbar;
    showSearch.value = header.search;
  };
  const setShowCommonSearch = (show) => {
    showCommonSearch.value = show;
  };
  const unreadIncr = (unreadType = 1) => {
    switch (unreadType) {
      case 1:
        unreadChat.value++;
        break;
      case 2:
        unreadFriend.value++;
        break;
      default:
        unreadDiscover.value++;
        break;
    }
  };

  const unreadDecrBy = (unreadType = 1, decr = 1) => {
    switch (unreadType) {
      case 1:
        unreadChat.value -= decr;
        break;
      case 2:
        unreadFriend.value -= decr;
        break;
      default:
        unreadDiscover.value -= decr;
        break;
    }
  };

  return {
    showNavbar,
    showSearch,
    navTitle,
    showCommonSearch,
    commonSearchAction,
    commonSearchPlaceholder,
    unreadChat,
    unreadFriend,
    unreadDiscover,
    initHeader,
    setShowCommonSearch,
    initCommonSearch,
    unreadIncr,
    unreadDecrBy,
  };
});
