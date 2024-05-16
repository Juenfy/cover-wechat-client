<script setup>
import { reactive } from "vue";

const formData = reactive({});
</script>
<template>
  <header>
    <van-nav-bar
      title="申请添加朋友"
      left-arrow
      @click-left="router.go(-1)"
      :border="false"
    />
  </header>
  <main class="main">
    <van-form @submit="onSubmit">
      <van-cell-group title="发送添加好友申请">
        <van-field
          v-model="formData.remark"
          name="备注名"
          placeholder="添加备注名"
        />
      </van-cell-group>
      <!-- <van-cell-group title="标签">
          <van-field
            v-model="username"
            is-link
            readonly
            name="标签"
            placeholder="添加标签"
            @click="showPicker = true"
          />
        </van-cell-group> -->
      <van-cell-group title="描述">
        <van-field v-model="formData.desc" name="描述" placeholder="添加文字" />
      </van-cell-group>
    </van-form>
  </main>
</template>
<style scoped lang="less">
.main {
  background: var(--vant-white);
}
</style>
