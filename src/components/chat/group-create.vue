<script setup>
import { ref } from "vue";

const props = defineProps({ showGroupCreate: Boolean });
//调用父组件关闭弹窗
defineEmits(["closeGroupCreate"]);

const onSearchFocus = () => {
  console.log("onSearchFocus");
};

const onSearchBlur = () => {
  console.log("onSearchBlur");
};

const indexList = ref(["A", "B"]);

const checked = ref(false);
const searchFocus = ref(false);
</script>
<template>
  <van-popup
    v-model:show="props.showGroupCreate"
    position="bottom"
    :style="{ height: '100%', width: '100%' }"
    duration="0.2"
  >
    <header>
      <van-nav-bar
        title="选择联系人"
        left-arrow
        @click-left="$emit('closeGroupCreate')"
        @click-right="$emit('closeGroupCreate')"
      >
        <template #right>
          <van-button type="success" size="small">完成</van-button>
        </template>
      </van-nav-bar>
    </header>
    <main class="friend-list">
      <van-search
        v-model="value"
        placeholder="搜索"
        @focus="searchFocus = true"
        @blur="searchFocus = false"
      />
      <van-index-bar v-if="!searchFocus">
        <van-cell title="选择一个群" size="large" is-link to="" />
        <van-cell title="新面对面群" size="large" is-link to="" />
        <van-index-anchor index="A" />
        <van-cell title="文本" size="large" :center="true">
          <template #icon>
            <van-checkbox
              v-model="checked"
              @change="(checked) => {}"
            ></van-checkbox>
            <van-image
              width="3rem"
              height="3rem"
              src="https://q4.itc.cn/q_70/images03/20240405/0fe4005840664f30b76f1a63909a5489.jpeg"
            />
          </template>
        </van-cell>

        <van-index-anchor index="B" />
        <van-cell title="文本" size="large" :center="true">
          <template #icon>
            <van-checkbox v-model="checked"></van-checkbox>
            <van-image
              width="3rem"
              height="3rem"
              src="https://q4.itc.cn/q_70/images03/20240405/0fe4005840664f30b76f1a63909a5489.jpeg"
            />
          </template>
        </van-cell>
      </van-index-bar>
      <div class="search-result" v-else>
        <van-nav-bar
          left-text="联系人"
          right-text="多选"
          left-disabled
          @click-right="$emit('closeGroupCreate')"
        />
        <van-cell-group title="联系人" :border="false">
          <van-cell title="文本" size="large" :center="true">
            <template #icon>
              <van-checkbox v-model="checked"></van-checkbox>
              <van-image
                width="3rem"
                height="3rem"
                src="https://q4.itc.cn/q_70/images03/20240405/0fe4005840664f30b76f1a63909a5489.jpeg"
              />
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </main>
  </van-popup>
</template>

<style scoped lang="less">
.friend-list {
  .van-checkbox,
  .van-image {
    margin-right: 1rem;
  }
}
</style>
