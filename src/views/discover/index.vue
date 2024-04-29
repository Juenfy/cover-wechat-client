<script setup>
import { onBeforeMount, watch } from "vue";
import { useAppStore } from "@/stores/app";
import { useRoute } from "vue-router";
const appStore = useAppStore();
const route = useRoute();
onBeforeMount(() => {
  appStore.initHeader({ title: "发现", navbar: true, search: false });
  console.log(route.query);
});

watch(
  () => route.params,
  (newVal, oldVal) => {
    console.log(newVal);
  }
);
</script>
<template>
  <div class="discover">
    <h1>This is an discover page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
