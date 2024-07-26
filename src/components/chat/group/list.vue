<!--消息列表组件-->
<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import * as groupApi from "@/api/group";
import { SearchGroup } from "@/enums/app";
const props = defineProps({ show: Boolean });
//调用父组件关闭弹窗
const emit = defineEmits(["hide"]);
const router = useRouter();
const appStore = useAppStore();
const groupList = ref([]);

const onSearchFocus = () => {
  appStore.setShowCommonSearch(true);
  appStore.initCommonSearch({
    action: SearchGroup,
    placeholder: "搜索",
  });
};

const getGroupList = () => {
  groupApi.getList().then((res) => {
    groupList.value = res.data;
  });
};

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      getGroupList();
    }
  }
);
</script>

<template>
  <van-popup
    v-model:show="props.show"
    position="right"
    :style="{ height: '100%', width: '100%' }"
    duration="0.2"
  >
    <header>
      <van-nav-bar
        title="群聊"
        left-arrow
        @click-left="$emit('hide')"
        :border="false"
      />
    </header>
    <section>
      <div class="header"></div>
      <div class="container">
        <van-search
          placeholder="搜索"
          input-align="center"
          @focus="onSearchFocus"
        />
        <div class="common">
          <van-cell-group>
            <van-cell v-for="item in groupList" :key="item.id">
              <router-link
                :to="{
                  name: 'chat-message',
                  params: {
                    to_user: item.id,
                    is_group: item.is_group,
                  },
                }"
                class="to-group-list"
              >
                <div class="group-item-left">
                  <div class="avatar-box">
                    <img
                      alt="avatar"
                      v-for="avatar in item.to.avatars"
                      :key="avatar"
                      :src="avatar"
                    />
                  </div>
                </div>
                <div class="group-item-right">
                  {{ item.nickname }}
                </div>
              </router-link>
            </van-cell>
          </van-cell-group>
          <div class="group-item-bottom">{{ groupList.length }}个群聊</div>
        </div>
      </div>
    </section>
  </van-popup>
</template>
<style scope lang="less">
.van-cell__wrapper,
.to-group-list {
  display: flex;
  width: 100%;
  color: var(--theme-black-11);
}

.group-item-right,
.group-item-bottom {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center;
  height: inherit;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  font-size: 1rem;
  text-indent: 1rem;
  text-align: left;
}
.group-item-bottom {
  width: 100%;
  padding-top: 1rem;
  color: var(--theme-gray-70);
}
.group-item-left > .avatar-box {
  width: 3rem;
  height: 3rem;
  border-radius: 0.3rem;
  background-color: var(--theme-white-de);
  img {
    width: 1.15rem;
    height: 1.15rem;
    float: left;
    margin: 0.25rem 0 0 0.25rem;
    border-radius: 0.1rem;
  }
}
</style>
