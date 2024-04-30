<script setup>
import { ref, onBeforeMount } from "vue";
import { useAppStore } from "@/stores/home";
const homeStore = useAppStore();
onBeforeMount(() => {
  homeStore.initHeader({ title: "我", navbar: false, search: false });
});
</script>

<template>
  <div class="me">
    <h1>This is an me page</h1>
  </div>
</template>

<style></style>
