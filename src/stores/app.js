import { ref } from "vue";
import { defineStore } from "pinia";
import { Home } from "@/enums/app";
import {
  UnreadDiscover,
  UnreadChat,
  UnreadFriend,
  UnreadApply,
} from "@/enums/app";
export const useAppStore = defineStore(
  "app",
  () => {
    const showSearch = ref(true);
    const showNavbar = ref(true);
    const navTitle = ref("");
    const showCommonSearch = ref(false);
    const commonSearchAction = ref(Home);
    const commonSearchPlaceholder = ref("搜索");
    const defaultUnread = {
      chat: 0,
      friend: 0,
      apply: 0,
      discover: 0,
    };
    const unread = ref(defaultUnread);

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

    const unreadIncrBy = (unreadType = 1, incr = 1) => {
      switch (unreadType) {
        case UnreadChat:
          unread.value.chat += incr;
          break;
        case UnreadFriend:
          unread.value.friend += incr;
          break;
        case UnreadDiscover:
          unread.value.discover += incr;
          break;
        case UnreadApply:
          unread.value.apply += incr;
          break;
      }
    };

    const unreadDecrBy = (unreadType, decr = 1) => {
      switch (unreadType) {
        case UnreadChat:
          unread.value.chat -= decr;
          if (unread.value.chat < 0) unread.value.chat = 0;
          break;
        case UnreadFriend:
          unread.value.friend -= decr;
          if (unread.value.friend < 0) unread.value.friend = 0;
          break;
        case UnreadDiscover:
          unread.value.discover -= decr;
          if (unread.value.discover < 0) unread.value.discover = 0;
          break;
        case UnreadApply:
          unread.value.apply -= decr;
          if (unread.value.apply < 0) unread.value.apply = 0;
          break;
      }
    };

    const setUnread = (data) => {
      unread.value = data;
    };

    const clear = () => {
      unread.value = defaultUnread;
      showNavbar.value = true;
      showSearch.value = true;
      navTitle.value = "";
      showCommonSearch.value = false;
      commonSearchAction.value = Home;
      commonSearchPlaceholder.value = "搜索";
    };

    return {
      showNavbar,
      showSearch,
      navTitle,
      showCommonSearch,
      commonSearchAction,
      commonSearchPlaceholder,
      unread,
      initHeader,
      setShowCommonSearch,
      initCommonSearch,
      unreadIncrBy,
      unreadDecrBy,
      setUnread,
      clear,
    };
  },
  { persist: true }
);
