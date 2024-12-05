import { ref } from "vue";
import { defineStore } from "pinia";
import { Home } from "@/enums/app";
import { UnreadChat, UnreadApply, UnreadMoment, ThemeIcon } from "@/enums/app";
export const useAppStore = defineStore(
  "app",
  () => {
    const theme = ref("light");
    const icon = ref(ThemeIcon.light);
    const showSearch = ref(true);
    const showNavbar = ref(true);
    const navTitle = ref("");
    const showCommonSearch = ref(false);
    const commonSearchAction = ref(Home);
    const commonSearchPlaceholder = ref("搜索");
    const defaultUnread = {
      chat: 0,
      apply: 0,
      discover: 0,
      moment: {
        num: 0,
        from: {}
      },
      friend: 0
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

    const unreadIncrBy = (unreadType, incr = 1, from = {}) => {
      switch (unreadType) {
        case UnreadChat:
          unread.value.chat += incr;
          break;
        case UnreadMoment:
          unread.value.moment.num += incr;
          unread.value.moment.from = from;
          unread.value.discover += incr;
          break;
        case UnreadApply:
          unread.value.apply += incr;
          unread.value.friend += incr;
          break;

      }
    };

    const unreadDecrBy = (unreadType, decr = 1) => {
      switch (unreadType) {
        case UnreadChat:
          unread.value.chat -= decr;
          if (unread.value.chat < 0) unread.value.chat = 0;
          break;
        case UnreadApply:
          unread.value.apply -= decr;
          if (unread.value.apply < 0) unread.value.apply = 0;
          unread.value.friend -= decr;
          if (unread.value.friend < 0) unread.value.friend = 0;
          break;
      }
    };

    const clearMomentUnread = () => {
      unread.value.moment.num = 0;
      unread.value.moment.from = {};
      unread.value.discover = 0;
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

    const setTheme = (t) => {
      theme.value = t;
      icon.value = ThemeIcon[t];
    };
    return {
      showNavbar,
      showSearch,
      navTitle,
      showCommonSearch,
      commonSearchAction,
      commonSearchPlaceholder,
      unread,
      theme,
      icon,
      initHeader,
      setShowCommonSearch,
      initCommonSearch,
      unreadIncrBy,
      unreadDecrBy,
      clearMomentUnread,
      setUnread,
      clear,
      setTheme,
    };
  },
  { persist: true }
);
