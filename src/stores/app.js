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
  return {
    showNavbar,
    showSearch,
    navTitle,
    showCommonSearch,
    commonSearchAction,
    commonSearchPlaceholder,
    initHeader,
    setShowCommonSearch,
    initCommonSearch,
  };
});
