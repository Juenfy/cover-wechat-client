import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useAppStore = defineStore('app', () => {
  const showSearch = ref(true)
  const showNavbar = ref(true)
  const navTitle = ref('')
  
  function initHeader (header) {
    navTitle.value = header.title
    showNavbar.value = header.navbar
    showSearch.value = header.search
  }

  return { showNavbar, showSearch, navTitle, initHeader }
})
